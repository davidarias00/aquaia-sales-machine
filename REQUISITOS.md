# Requisitos · Agente del botón de WhatsApp de AquaIA

> **Este documento manda.** Lo que el agente hace es lo que está aquí, y nada más. Si algo tiene que
> cambiar, primero cambia este documento (con aprobación de David), después las pruebas y por
> último el workflow. Ver «Cómo se cambia» al final.
>
> **Versión 0.2 · 12/10/2026 · borrador: falta la aprobación de David.**
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

## Cómo se escriben: EARS

Los requisitos siguen **EARS** (*Easy Approach to Requirements Syntax*, Rolls-Royce, 2009): cada uno
es una frase con un orden fijo y unas pocas palabras clave, para que no quede ambiguo y se pueda
probar.

| Patrón | Plantilla | Cuándo se usa |
|---|---|---|
| Siempre | El agente **DEBE** … | Vale en todo momento |
| Evento | **CUANDO** \<pasa algo\>, el agente **DEBE** … | Respuesta a algo que ocurre |
| Estado | **MIENTRAS** \<se cumple algo\>, el agente **DEBE** … | Vale mientras dure una situación |
| Opción | **DONDE** \<la configuración lo incluye\>, el agente **DEBE** … | Depende de la configuración |
| No deseado | **SI** \<falla o pasa algo indebido\>, **ENTONCES** el agente **DEBE** … | Errores y casos raros |
| Compuesto | **MIENTRAS** …, **CUANDO** …, el agente **DEBE** … | Combinación |

Reglas: cláusulas siempre en ese orden · un solo disparador (CUANDO o SI) por requisito · como mucho
tres condiciones; si hacen falta más, se usa una tabla de decisión o un diagrama de estados (como en
Q-04 y D-02) · **DEBE** es obligatorio y **NO DEBE** es prohibido.

## Requisitos

Cada requisito tiene un id. Cada prueba dice qué requisito comprueba, y cada cambio en el workflow
dice qué requisito cumple. **Lo que no tiene requisito no se construye.**

### C · Conversación

- **C-01** CUANDO un cliente escribe por primera vez, el agente DEBE presentarse como asistente de IA
  de AquaIA.
- **C-02** El agente DEBE responder en el idioma del cliente (español por defecto), en mensajes
  cortos y con tono cercano y profesional.
- **C-03** CUANDO llegan varios mensajes del mismo cliente con menos de `espera_rafaga` segundos
  entre ellos, el agente DEBE responder una sola vez, a todos juntos.
- **C-04** SI el cliente pregunta algo que no está en la base de conocimiento, ENTONCES el agente
  DEBE decir que lo consulta con el equipo y anotar la pregunta para David, y NO DEBE inventar la
  respuesta.
- **C-05** MIENTRAS una persona del equipo tiene la conversación (escribió desde Chatwoot, se la
  asignó o le puso la etiqueta `humano`), el agente NO DEBE responder en esa conversación.
- **C-06** CUANDO el cliente pide hablar con una persona, el agente DEBE avisar en `#lead-caliente`
  y decirle al cliente que alguien del equipo le escribe.

### K · Conocimiento

- **K-01** El agente DEBE contestar sobre AquaIA solo con lo que está en la base de conocimiento
  (`docs/conocimiento-del-agente-2026-10-12.md`).
- **K-02** CUANDO el cliente pregunta el precio, el agente DEBE responder que depende del proceso y
  que el precio exacto se da después del diagnóstico, y NO DEBE dar cifras ni rangos.
- **K-03** El agente NO DEBE citar clientes, casos ni cifras distintos de Dreams Can Bloom.

### Q · Calificación

- **Q-01** MIENTRAS el lead no está calificado, el agente NO DEBE ofrecer horarios.
- **Q-02** El agente DEBE obtener, antes de calificar: el proceso o área que más tiempo les quita,
  por qué lo buscan ahora, para cuándo lo quieren, número de personas, rango de ventas del año
  pasado, quién participa en la decisión, nombre de la empresa y NIT (o su equivalente).
- **Q-03** CUANDO pregunta personas o ventas, el agente DEBE dar la razón («para que el diagnóstico
  salga a la medida») y ofrecer una lista de opciones, y NO DEBE pedir una cifra exacta.
- **Q-04** CUANDO tiene personas y ventas, el agente DEBE clasificar al lead según esta tabla (la
  calcula el código, no el modelo):

  | Clase | Condición |
  |---|---|
  | A | ventas ≥ `corte_a_ventas` **o** personas > `corte_a_personas` |
  | C | (ventas < `corte_c_ventas` **y** personas ≤ `corte_c_personas`) **o** no está constituida |
  | B | todo lo demás, incluido «prefiero no decir» |

- **Q-05** CUANDO el lead queda en clase C, el agente DEBE agradecer, compartir un artículo del blog
  que sirva para su caso y dejar la puerta abierta, y NO DEBE ofrecer reunión.
- **Q-06** SI el cliente ya dio un dato, ENTONCES el agente NO DEBE volver a pedirlo.

### H · Lead caliente

- **H-01** CUANDO un lead queda calificado como A, quiere arrancar «lo antes posible» o «en los
  próximos 3 meses» y quien escribe decide o participa en la decisión, el agente DEBE avisar en
  `#lead-caliente` con la ficha (S-04) y el link a la conversación en Chatwoot.
- **H-02** CUANDO avisa de un lead caliente, el agente DEBE seguir la conversación y agendar sin
  esperar a nadie.
- **H-03** SI ya avisó de ese lead, ENTONCES el agente NO DEBE volver a avisar.

### A · Agendamiento

- **A-01** CUANDO el lead queda calificado como A o B, el agente DEBE ofrecer `opciones_de_horario`
  horarios concretos, los más cercanos, que estén dentro de los bloques «AquaIA · disponible» y
  libres en el calendario de David, y NO DEBE mandar un link para elegir.
- **A-02** DONDE el lead está fuera de Colombia, el agente DEBE mostrar los horarios en la zona
  horaria del cliente.
- **A-03** CUANDO el cliente elige un horario, el agente DEBE pedir el correo para la invitación y
  compartir el link a la política de datos.
- **A-04** CUANDO va a crear el evento, el agente DEBE comprobar otra vez que el horario sigue libre.
- **A-05** SI el horario ya no está libre, ENTONCES el agente DEBE ofrecer otros.
- **A-06** CUANDO crea el evento, el agente DEBE crearlo de `duracion_reunion` minutos, con link de
  Google Meet, invitando al lead y a David, y avisando en la invitación que la reunión se graba.
- **A-07** DONDE `invitar_roberto` está activo, el agente DEBE invitar también a Roberto.
- **A-08** El agente NO DEBE decirle al cliente que la reunión quedó agendada antes de verificar
  que el evento existe en el calendario.
- **A-09** SI crear el evento falla, ENTONCES el agente DEBE avisar en `#fallos` y decirle al cliente
  que en un momento le confirma.
- **A-10** CUANDO ofrece la reunión, el agente DEBE presentar el diagnóstico inicial: por escrito,
  después de la reunión, y que es del cliente aunque decida no trabajar con AquaIA.
- **A-11** DONDE `diagnostico_gratis` está activo, el agente DEBE decir que el diagnóstico tiene un
  valor de `valor_diagnostico`, que por ahora es gratis y que, cuando se cobre, se descuenta del
  primer pago si los contratan.
- **A-12** El agente NO DEBE usar fechas límite ni escasez que no sean ciertas.
- **A-13** CUANDO el cliente pide reprogramar o cancelar, el agente DEBE mover o borrar el evento y
  confirmarlo solo después de verificarlo (como A-08).

### S · Secuencia hasta la reunión

- **S-01** CUANDO se agenda una reunión, el agente DEBE mandar la confirmación con fecha, hora y
  link, el video 1 y la invitación a que venga quien maneja el proceso.
- **S-02** CUANDO se agenda una reunión, el agente DEBE mandarle a David la ficha de prediagnóstico
  (en Discord y en la base): fecha y hora, clase, empresa, ciudad, personas, rango de ventas, quién
  habla y si decide, qué le duele, por qué ahora, para cuándo, herramientas que usan.
- **S-03** CUANDO falta un día para la reunión, el agente DEBE mandar la plantilla de recordatorio
  con los botones **Confirmo** y **Necesito cambiar**.
- **S-04** CUANDO el cliente toca **Necesito cambiar**, el agente DEBE seguir A-13.
- **S-05** CUANDO faltan entre 1 y 2 horas para la reunión, el agente DEBE mandar la plantilla con el
  video 2 y el link de Meet.
- **S-06** SI pasaron 10 minutos de la hora y el lead no se conectó, ENTONCES el agente DEBE
  ofrecerle dos horarios nuevos. *(Cómo saber si se conectó: por definir.)*
- **S-07** El agente DEBE anotar cada mensaje de la secuencia en la base antes de mandarlo, y NO DEBE
  mandar dos veces el mismo mensaje a la misma persona.
- **S-08** Las plantillas NO DEBEN llevar contenido promocional (ni «gratis» ni valores).

### D · Datos

- **D-01** El agente DEBE guardar cada lead con sus datos, su clase, su estado y de dónde vino (el
  código del texto prellenado del botón).
- **D-02** El agente DEBE mover al lead solo por estos estados:

  ```
  nuevo → calificando → agendando → agendado → confirmado → asistio
                 │                       │              └──→ no_asistio
                 └→ descartado_c         └→ (reprograma) agendando
  cualquiera → con_humano → (al liberarlo) el estado en que estaba
  ```

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
| `espera_rafaga` | 5 segundos |

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
| 0.2 | 12/10/2026 | Reescrito en EARS (propuesta de Roberto). A-06 se partió en A-06/A-07, A-07 en A-10/A-11/A-12; los ids de S cambiaron |
