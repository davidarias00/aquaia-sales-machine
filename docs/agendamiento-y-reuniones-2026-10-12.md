# Agente del botón de WhatsApp: agendar reuniones que sí se hagan (12/10/2026)

**Estado: decidido, no construido.** Decisiones de David en la sesión del 12/10/2026.

## Qué es este flujo

El botón de WhatsApp de la página web de AquaIA lo atiende un agente de IA. Los clientes son
pymes de Colombia. El agente conoce lo que AquaIA hace y lo que no hace, y **su objetivo es agendar
una reunión**. El problema que se quiere resolver no es que la gente no agende, es que **agenda y
después no llega**.

## Decisiones

### 1. Se agenda dentro del chat, no con un link

- **No Calendly.** Cuesta (unos USD 10–12 por usuario al mes; el plan gratis no manda recordatorios)
  y no manda nada por WhatsApp: los recordatorios habría que construirlos en n8n de todas formas.
- El agente lee la disponibilidad de Google Calendar y **ofrece 2 o 3 horarios concretos, los más
  cercanos posibles** («hoy 4:00 p. m. o mañana 9:00 a. m.»). No pregunta «¿qué hora tienes?» ni
  manda un link.
- Por qué cercanos: en los datos de Reply.io (~2.900 reuniones) la inasistencia es 6,9 % el mismo
  día, 9,6 % al día siguiente y 23 % a 8 días o más.
- El agente pide el correo de la empresa, crea el evento con link de **Google Meet** y manda la
  invitación.

### 2. Calendario: un Gmail dedicado, no Workspace (por ahora)

- AquaIA no tiene Google Workspace. Se usa **un Gmail dedicado con nombre de marca**, no uno
  personal ni el Workspace de otra empresa (las invitaciones saldrían a nombre de otro negocio).
- Meet gratis corta a los **60 minutos** las reuniones de 3 o más personas; las de uno a uno no.
  Las reuniones de 45 minutos caben.
- **Error que más cuesta:** la app de Google Cloud con la que n8n entra al calendario tiene que estar
  **«In production»**. En modo *Testing* el acceso se vence a los 7 días y el agente deja de agendar
  sin avisar.
- Cuando haya Workspace propio, el cambio es reconectar la credencial en n8n.

### 3. Lead caliente: aviso por Discord, sin parar al bot

- No es un handoff. El agente **levanta la mano** en un canal de Discord que solo recibe eso
  (`#lead-caliente`): «🔥 Empresa X, quiere automatizar facturación y pregunta precio. ¿Alguien lo
  toma?», con el link a la conversación.
- **El bot no espera.** Si David lo toma (se asigna la conversación o le pone la etiqueta `humano` en
  Chatwoot), el bot se calla. Si nadie toca nada, el bot sigue y agenda.
- Criterios de «caliente» (propuesta inicial, se ajustan con conversaciones reales): pide precio o
  propuesta · quiere empezar ya · quien escribe es quien decide · pide hablar con una persona.

### 4. El gancho: el diagnóstico inicial, con su valor dicho

- Lo que el cliente se lleva es lo que AquaIA ya hace: la reunión se graba, se transcribe y con eso
  se arma una propuesta que incluye **el diagnóstico de automatización**. Se descartó preparar algo
  con la web del cliente antes de la reunión: con información de afuera el trabajo sale mal y es
  reproceso.
- Se promete **como un documento**: «después te mandamos por escrito tu diagnóstico: qué se puede
  automatizar, cuánto tiempo te ahorra y por dónde empezar. Es tuyo aunque decidas no trabajar con
  nosotros».
- **Escasez real, sin fechas falsas:** «como estamos arrancando, por ahora es gratis; más adelante va
  a tener un valor de $1.000.000, y si nos contratan se descuenta del primer pago». Nunca «solo esta
  semana» si no es cierto. La otra escasez que sí es real es la agenda («esta semana me quedan estos
  3 espacios»).
- Nombre: **diagnóstico inicial** (el que sale de una reunión). Queda el espacio para un
  **diagnóstico completo** pago más adelante.
- **El valor y si es gratis o pago viven en un solo lugar de configuración**, no escritos en el
  prompt. El día que se empiece a cobrar se cambia ese valor.
- Antes de la reunión se hace **una sola pregunta**: «¿cuál es el proceso que más tiempo les quita
  hoy?». No es para preparar nada; compromete al cliente y personaliza los recordatorios. El agente
  también invita a que venga quien maneja ese proceso.
- La reunión se graba: se avisa en la invitación y se pide el sí al empezar (Ley 1581 de 2012).

### 5. Secuencia por WhatsApp hasta la reunión

| Cuándo | Mensaje |
|---|---|
| Al agendar | Confirmación + video corto de David + la pregunta del proceso |
| Día anterior | «Mañana a las 4:00 p. m. revisamos lo de [proceso]. ¿Seguimos en pie?» con botones **Confirmo** / **Necesito cambiar**. Si cambia, el agente reprograma en el chat |
| 1–2 h antes | Segundo video («te esperamos») + link de Meet |
| +10 min sin conectarse | «¿Se te complicó? Te propongo estos dos horarios» |

Para empezar bastan 2 videos grabados una vez.

- Los mensajes que caen fuera de la ventana de 24 h de WhatsApp necesitan **plantillas aprobadas**,
  categoría **utility** (recordatorio de cita). **Sin nada promocional**: en DCB, Meta reclasificó como
  marketing las plantillas que sonaban a promoción y las cobró más caro. El «gratis por ahora» va en
  la conversación, no en las plantillas. Una plantilla puede llevar video en el encabezado.

## Reglas que vienen de la máquina de DCB

- **Nunca decir «agendado» antes de que el evento exista.** Primero se crea el evento en el
  calendario y se verifica; solo entonces se confirma. En DCB el bot dijo «está anotado» y la hora
  nunca llegó a la hoja (`sales-machine-dcb/docs/hora-que-pidio-el-cliente-2026-10-05.md`), igual que
  la regla de no confirmar un pago sin verificarlo.
- **Volver a consultar la disponibilidad justo antes de crear el evento**, para que dos leads no
  tomen el mismo horario.
- **Esperar unos segundos de silencio antes de responder** cuando llegan varios mensajes seguidos
  (`sales-machine-dcb/docs/seller-concurrency-debounce.md`).
- **Un canal de Discord por tipo de aviso.** En DCB el handoff se perdía entre resúmenes y errores
  hasta que se separó (`sales-machine-dcb/docs/canales-de-discord-2026-09-03.md`).

## Pendiente

- Qué sabe el agente de AquaIA: qué hacen, qué no hacen, casos. Falta el material (portafolio,
  propuesta de ejemplo, transcripción de una reunión).
- Nombre del Gmail dedicado.
- Grabar los 2 videos.
