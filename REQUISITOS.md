# Requisitos · Agente del botón de WhatsApp de AquaIA

> **Este documento manda.** Lo que el agente hace es lo que está aquí, y nada más. Si algo tiene que
> cambiar, primero cambia este documento (con aprobación de David), después las pruebas y por
> último el workflow. Ver «Cómo se cambia» al final.
>
> **Versión 0.1 · 12/10/2026 · borrador: falta la aprobación de David.**
> El porqué de cada decisión está en `docs/agendamiento-y-reuniones-2026-10-12.md` y
> `docs/conocimiento-del-agente-2026-10-12.md`.

## Objetivo

Que las empresas que escriben por el botón de WhatsApp de aquaia.app **agenden una reunión de
diagnóstico con David y lleguen a ella**.

Cómo se mide (cada semana):

| Métrica | Qué cuenta |
|---|---|
| Agendamiento | Leads A y B que agendaron ÷ leads A y B que escribieron |
| Asistencia | Reuniones a las que el lead llegó ÷ reuniones agendadas |
| Primera respuesta | Tiempo entre el primer mensaje y la primera respuesta |
| Leads calientes | Avisos en Discord y cuántos tomó David |

## Fuera de alcance

El agente **no**:

- da precios ni rangos de precio de proyectos;
- negocia, ofrece descuentos ni condiciones especiales;
- cita clientes, casos o cifras distintos de los de este documento;
- hace el diagnóstico ni recomienda soluciones concretas para la empresa del cliente;
- atiende otros asuntos que no sean un lead (proveedores, empleo, soporte): los pasa a una persona;
- atiende por canales distintos del WhatsApp del botón de la web.

## Requisitos

Cada requisito tiene un id. Cada prueba dice qué requisito comprueba, y cada cambio en el workflow
dice qué requisito cumple. **Lo que no tiene requisito no se construye.**

### C · Conversación

- **C-01** Dice en su primer mensaje que es una asistente de IA de AquaIA.
- **C-02** Responde en el idioma del cliente (español por defecto), con tono cercano y profesional,
  en mensajes cortos.
- **C-03** Si llegan varios mensajes seguidos, responde una sola vez, a todos juntos.
- **C-04** Si no sabe algo, no lo inventa: dice que lo consulta con el equipo y lo anota para David.
- **C-05** Si una persona escribió desde Chatwoot en la conversación, el agente se calla en esa
  conversación hasta que la persona la libere.
- **C-06** Si el cliente pide hablar con una persona, avisa en Discord (como H-01) y le dice que
  alguien del equipo le escribe; mientras tanto puede seguir agendando si el cliente quiere.

### K · Conocimiento

- **K-01** Contesta sobre AquaIA solo con lo que está en la base de conocimiento
  (`docs/conocimiento-del-agente-2026-10-12.md`, sección por sección).
- **K-02** A «¿cuánto cuesta?» responde que depende del proceso y que el precio exacto se da
  después del diagnóstico, antes de empezar. Nunca da cifras.
- **K-03** El único caso que puede contar es Dreams Can Bloom.

### Q · Calificación

- **Q-01** Antes de ofrecer horarios, obtiene: el proceso o área que más tiempo les quita, por qué
  lo buscan ahora, para cuándo lo quieren, número de personas, rango de ventas del año pasado,
  quién participa en la decisión, nombre de la empresa y NIT (o su equivalente fuera de Colombia).
- **Q-02** Pregunta el dolor primero. Personas y ventas se preguntan con una razón («para que el
  diagnóstico salga a la medida») y **con listas de opciones**, no pidiendo cifras exactas.
- **Q-03** No hace las preguntas en fila: las intercala con lo que el cliente cuenta. Si el cliente ya
  dio un dato, no lo vuelve a pedir.
- **Q-04** Clasifica al lead con los cortes de configuración:
  - **A**: ventas ≥ `corte_a_ventas` o personas > `corte_a_personas`;
  - **C**: ventas < `corte_c_ventas` y personas ≤ `corte_c_personas`, o no está constituida;
  - **B**: todo lo demás, incluido «prefiero no decir».
- **Q-05** A un lead C no le ofrece reunión: le agradece, le comparte un artículo del blog que
  sirva para su caso y le deja la puerta abierta.
- **Q-06** La clase la calcula el código con los datos extraídos, no el modelo de lenguaje.

### H · Lead caliente

- **H-01** Avisa en el canal de Discord `#lead-caliente` cuando el lead es A **y** quiere arrancar
  «lo antes posible» o «en los próximos 3 meses» **y** quien escribe decide o participa en la
  decisión. El aviso trae la ficha (S-04) y el link a la conversación en Chatwoot.
- **H-02** El aviso **no detiene al agente**: sigue y agenda.
- **H-03** Si David se asigna la conversación o le pone la etiqueta `humano`, el agente se calla
  (como C-05).
- **H-04** Avisa una sola vez por lead.

### A · Agendamiento

- **A-01** Ofrece 2 o 3 horarios concretos, los más cercanos posibles, que estén **dentro de los
  bloques «AquaIA · disponible»** del calendario y **libres** en el calendario de David. Nunca
  manda un link para que el cliente elija.
- **A-02** Para leads fuera de Colombia, muestra los horarios en la zona horaria del cliente.
- **A-03** Pide el correo para enviar la invitación.
- **A-04** Justo antes de crear el evento, vuelve a comprobar que el horario sigue libre. Si ya no
  lo está, ofrece otros.
- **A-05** Crea el evento de 45 minutos con link de Google Meet, invitando al lead, a David y,
  según configuración, a Roberto. La invitación avisa que la reunión se graba.
- **A-06** **Solo dice «agendado» después de que el evento existe y se verificó.** Si crear el evento
  falla, no confirma nada: avisa en `#fallos` y le dice al cliente que en un momento le confirma.
- **A-07** Al ofrecer la reunión, presenta el diagnóstico inicial: por escrito, después de la
  reunión, «es tuyo aunque decidas no trabajar con nosotros»; con valor de `valor_diagnostico`,
  gratis mientras `diagnostico_gratis` esté activo, y que se descuenta del primer pago si los
  contratan. Nunca usa fechas límite falsas.
- **A-08** El cliente puede reprogramar o cancelar desde el chat; el agente mueve o borra el evento
  y lo confirma solo después de hacerlo (como A-06).

### S · Secuencia hasta la reunión

- **S-01** Al agendar: confirmación con fecha, hora y link, video 1, y la invitación a que venga quien
  maneja el proceso.
- **S-02** El día anterior: plantilla de recordatorio con los botones **Confirmo** / **Necesito
  cambiar**. «Necesito cambiar» lleva a A-08.
- **S-03** Entre 1 y 2 horas antes: plantilla con video 2 y el link de Meet.
- **S-04** Al agendar, David recibe la ficha de prediagnóstico (en Discord y en la base de datos):
  fecha y hora, clase, empresa, ciudad, personas, rango de ventas, quién habla y si decide, qué le
  duele, por qué ahora, para cuándo, herramientas que usan.
- **S-05** Si a los 10 minutos de la hora el lead no se conectó, le escribe ofreciendo dos horarios
  nuevos. *(Cómo saber si se conectó está por definir.)*
- **S-06** Ningún mensaje de la secuencia se manda dos veces: se anota en la base **antes** de
  enviarlo.
- **S-07** Las plantillas no llevan contenido promocional (ni «gratis», ni valores), para que Meta
  las mantenga como utility.

### D · Datos

- **D-01** Cada lead queda en la base con sus datos, su clase, su estado y de dónde vino (código del
  texto prellenado del botón).
- **D-02** Estados del lead: `nuevo` → `calificando` → `agendando` → `agendado` → `confirmado` →
  `asistio` / `no_asistio`; o `descartado_c`, `con_humano`.
- **D-03** Cuando pide el correo, comparte el link a la política de datos de aquaia.app.

## Configuración

Valores que cambian **sin tocar la lógica** (una tabla en la base):

| Clave | Valor inicial |
|---|---|
| `valor_diagnostico` | $1.000.000 |
| `diagnostico_gratis` | sí |
| `corte_a_ventas` | $1.000M (USD 250.000 fuera de Colombia) |
| `corte_a_personas` | 20 |
| `corte_c_ventas` | $500M |
| `corte_c_personas` | 5 |
| `duracion_reunion` | 45 min |
| `invitar_roberto` | no |
| `opciones_de_horario` | 3 |

## Cómo está construido (para que no se vuelva un parche)

El `seller` de DCB empezó chico y hoy tiene **160 nodos y unos 240.000 caracteres de código**, a punta
de parches. Lo que se hace distinto aquí:

1. **El modelo conversa y extrae; el código decide.** El modelo devuelve siempre un JSON con la
   respuesta y los datos que entendió. La clasificación, el aviso de lead caliente, la
   disponibilidad, la creación del evento y la confirmación los decide código simple y probado,
   nunca el prompt.
2. **Un workflow por responsabilidad**, cada uno ligado a una sección de este documento: entrada
   (C-03, C-05), conversación (C, K, Q), agendamiento (A), secuencia (S), avisos (H). Ninguno crece
   sin límite: si uno pasa de ~30 nodos, se parte.
3. **El repo es la verdad.** El prompt, la base de conocimiento y los workflows viven en git y se
   despliegan desde aquí. En DCB producción y repo se separaron (96 nodos en vivo contra 92 en el
   repo); antes de desplegar siempre se compara.
4. **Pruebas por requisito.** Cada requisito tiene al menos una conversación de prueba que dice qué
   debe pasar. Si falla una prueba, no se despliega.

## Cómo se cambia

1. El cambio se escribe aquí primero: requisito nuevo, modificado o eliminado, con su id. **Si un
   arreglo no corresponde a ningún requisito, falta un requisito**: se escribe antes de arreglar.
2. David lo aprueba.
3. Se escribe o ajusta la prueba.
4. Se cambia el workflow.
5. Se sube la versión de este documento y se anota en el historial.

## Historial

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 12/10/2026 | Primer borrador con las decisiones de David del 12/10 |
