# Aprendizajes de la máquina de ventas de Dreams Can Bloom

> Lo que costó caro en producción en `davidarias00/sales-machine-dcb` (julio–octubre 2026) y la regla
> que sale de cada cosa para Luna. DCB es otro negocio (flores, venta a consumidor): esto es
> aprendizaje, no reglas. Cada punto dice dónde está el detalle en ese repo (solo lectura).
>
> **El repo de DCB no se copia:** tiene datos de clientes reales.

## 1. Lo que más dolió

### Mandar dos veces lo mismo
El 01/09/2026 unas 1.600 personas recibieron la misma difusión dos días seguidos. Las bajas pasaron
de 37 en toda la historia a 55 en un solo día.
**Regla para Luna:** todo mensaje programado o único (recordatorios, seguimientos, plantillas) se
**anota en la base antes de mandarlo**; si el envío falla, se desanota para reintentar. Si algo se
interrumpe, la persona se queda sin mensaje, nunca con dos (S-11). La exclusión va dentro de la
consulta que saca a quién mandarle, no en un paso aparte que se pueda saltar. No se prueba con
números que estén en una lista real.
*Detalle:* `CLAUDE.md` (primera regla), `tests/nunca-dos-veces.js`.

### Confirmar algo que no pasó
El bot nunca puede decir que un pago entró: solo lo confirma un workflow después de verificar con la
API de la pasarela, nunca con el aviso del webhook. Y el 03/10 el bot le dijo a un cliente «está
anotado» sobre una hora de entrega que nunca llegó a la hoja de rutas.
**Regla para Luna:** «agendado» solo después de que el evento existe en el calendario y se verificó
(A-09). El prompt no puede confirmar nada: lo confirma el código después de hacerlo.
*Detalle:* `docs/never-self-confirm-payment.md`, `docs/confirmacion-de-pago-2026-09-29.md`,
`docs/hora-que-pidio-el-cliente-2026-10-05.md`.

### El workflow que creció a punta de parches
El `seller` llegó a 160 nodos y unos 240.000 caracteres de código. Cada requisito nuevo entró como
un parche y nadie lo entiende entero.
**Regla para Luna:** requisitos escritos primero (EARS), workflows pequeños por responsabilidad, la
lógica que decide en funciones probadas, y lo que no tiene requisito no se construye.

### Producción y repo separados
Una vez el `seller` en vivo tenía 96 nodos y el repo 92: otra sesión había editado producción
directo. Un despliegue desde el repo viejo habría borrado cuatro nodos que funcionaban.
**Regla para Luna:** se despliega desde el repo y después se compara repo contra vivo. Si difieren,
primero se averigua cuál es más nuevo.
*Detalle:* `docs/handoff-2026-07-31.md`.

## 2. n8n

- **Un `PUT` no despliega.** Después del `PUT` hay que desactivar y activar; si no, los triggers no
  se registran. Arreglos «hechos» estuvieron días sin funcionar por esto.
- **El `PUT` solo acepta** `name`, `nodes`, `connections` y `settings: {"executionOrder":"v1"}`. Lo
  demás da 400.
- **Workflows temporales** para consultar algo: son webhooks públicos hacia la base de producción.
  Ruta aleatoria y se borran siempre. Un workflow inactivo recién creado puede ser trabajo de otra
  sesión: no se borra lo que no es propio.
- **Un sub-workflow sin publicar impide activar al que lo llama.** El orden para encender es: hojas
  primero, los que llaman al final.
- **Varias ramas que llegan al mismo nodo necesitan un Merge** explícito; si no, ejecuciones
  partidas o duplicadas.
- **`retryOnFail` reintenta aunque la acción sí haya pasado** y solo se perdió la respuesta. Lo que
  debe pasar una sola vez se hace con un «reclamo» atómico:
  `UPDATE … SET x = now() WHERE id = $1 AND x IS NULL RETURNING id` → si se reclamó, se actúa.
- **Renombrar un nodo deja conexiones huérfanas.** Validar que toda conexión apunta a un nodo real
  antes de desplegar.
- **En un nodo IF, `leftValue` ya trae su `=`.** Agregarle otro produce el texto `"=false"` y un
  error que no dice la causa.
- **Una API que responde 200 cuando falla** (pasó con el ERP Begranda) hace que n8n no vea el error:
  hay que revisar el cuerpo de la respuesta, no solo el código.
- **Un cron que llama a un modelo pagado** necesita una guarda de «ya procesé esto», o gasta tokens
  sobre lo mismo cientos de veces al día.
- **Las credenciales de n8n no se pueden leer por la API.** Solo quien tiene la llave puede crear la
  credencial.
*Detalle:* `docs/infra-operating-manual.md` (secciones 3 a 5).

## 3. Chatwoot y WhatsApp

- **Chatwoot manda todos los mensajes de todas las bandejas de una cuenta a cada workflow conectado.**
  Por eso Luna va en una cuenta de Chatwoot aparte: así no recibe los mensajes de otro negocio ni
  tiene que adivinar cuáles son suyos.
- **Ráfagas:** cada mensaje dispara su propia ejecución. Sin control, el bot contesta dos veces. Se
  guarda el último mensaje visto por conversación, se esperan unos segundos y solo responde la
  ejecución del último (C-04). Cuesta unos segundos de espera en cada respuesta.
- **Saber quién escribió:** el bot marca sus mensajes (`content_attributes.origen = 'bot'`). Lo que
  sale sin marca lo escribió una persona y calla al bot. El id del agente no sirve si personas y bot
  comparten cuenta.
- **Los atributos de conversación se reemplazan, no se mezclan:** escribir una clave borra las demás.
  Siempre escribir `{...actuales, ...nuevas}`. Las etiquetas también reemplazan el conjunto: leer,
  unir, escribir.
- **Chatwoot no guarda el referral de los anuncios de clic a WhatsApp** (id del anuncio, `ctwa_clid`).
  Si se necesita el origen, hay que llevarlo en el texto del primer mensaje o leerlo del mensaje,
  no de la conversación.
- **Los adjuntos llegan con URLs `http://0.0.0.0:3000/…`** por una configuración del servidor: hay que
  manejarlo para descargar audios (notas de voz, C-05).
*Detalle:* `docs/traspaso-agente-empresas-318-2026-10-08.md`, `docs/seller-concurrency-debounce.md`,
`docs/multi-agent-routing.md`, `docs/infra-operating-manual.md` (G8, G9, G10).

## 4. Plantillas de WhatsApp

- **Utility** solo si no tiene nada promocional y cumple algo que la persona pidió (un recordatorio
  de cita). Si suena a promoción, Meta la aprueba como **marketing** y la cobra más cara.
- Las utility suelen aprobarse en minutos u horas; las de marketing pueden tardar.
- **Nunca uses el contador de Meta para saber a quién le llegó:** reporta con horas de retraso. Sirve
  para costos, no para el registro.
**Regla para Luna:** las plantillas de recordatorio no llevan «gratis» ni valores (S-12).

## 5. Avisos

- En DCB todo llegaba al mismo canal de Discord y el handoff, el único aviso que exige contestarle a
  un cliente, se perdía entre resúmenes y errores.
- **Regla:** un aviso solo se manda si nadie se enteraría por otro lado y alguien tiene que hacer algo
  pronto. Un canal por tipo de aviso (N-01).
*Detalle:* `docs/canales-de-discord-2026-09-03.md`.

## 6. Cómo se trabajó (y qué conviene repetir)

- **Una prueba por regla importante**, con nombre que dice la regla (`nunca-dos-veces.js`,
  `quien-callo-al-bot.js`). Si falla, no se despliega.
- **Un documento por arreglo o decisión, con fecha.** Y un changelog por sesión, para que el otro
  socio sepa qué cambió sin leer los workflows.
- **Investigar las ejecuciones reales antes de proponer una causa.** Varias veces la primera
  explicación era falsa.
- **Google:** una app de Google Cloud en modo *Testing* vence el acceso a los 7 días. Tiene que estar
  *In production*.
