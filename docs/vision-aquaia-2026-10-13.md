# La visión de AquaIA: el plan de vuelo (13/10/2026)

> **Documento interno. NO es parte de lo que sabe Luna** y no se carga en su prompt. Lo que Luna
> puede decir de esto está en `conocimiento-del-agente-2026-10-12.md` («El discurso de Luna»).
> Se separa a propósito: lo que no está en el prompt no se puede filtrar en una conversación.

Contado por David el 13/10/2026.

## La empresa como un edificio, piso por piso

Las empresas no automatizan todo de una. Se entra por partes, y **siempre se arranca por la parte
comercial**, porque todas las empresas tienen un dolor comercial. El orden de los pisos siguientes no
es fijo.

Todo lo que se construye llega a **una misma base de datos en Postgres, con el modelo de datos bien
hecho desde el principio**. Esa base es lo que conecta los pisos.

1. **Comercial: la máquina de ventas.**
   - **Inbound primero:** atender al lead, pasarlo por el embudo, convertirlo, y **reactivar lo que
     ya está en la base de datos** del cliente.
   - **Outbound después:** buscar leads nuevos. Se está construyendo.
2. **Marketing:** las métricas de todas partes (Google Ads, Meta…) en un tablero; propuestas a partir
   de ellas; un editor que genera contenido con IA o edita el que ya tienen, conectado a Instagram.
3. **Finanzas:** todas las pasarelas y medios de pago conectados a la base. De ahí salen balances,
   estados financieros y KPI, en un tablero a la medida de la gerencia, y **cada mañana un mensaje al
   celular del gerente con la foto de su empresa**.
4. **Operaciones:** entrar a la operación, encontrar los cuellos de botella y automatizarlos. Bots que
   trabajan 24/7, sin altibajos y mucho más baratos que la mano de obra; el cliente puede reducir o
   reubicar personal.
5. **RR.HH.** *(en construcción)*: un bot que administra contratos, recibe incapacidades y permisos,
   los guarda en un cuadro y le avisa a la gerencia un día fijo a la semana, para que ninguna persona
   tenga ese trabajo.

**El techo: el CEO Digital.** Cuando los pisos están modelados, un partner que se sienta con el
gerente en la junta: usa un modelo de lenguaje superior, lee toda la base de datos y su único trabajo
es asesorar a la empresa con esa información.

El modelo de negocio es el **acompañamiento**: entrar con un piso y seguir conectando áreas.

## Lo que Luna NO dice de esto (decisiones de David)

- Detalles técnicos: Postgres, modelado de datos, qué modelo de lenguaje se usa.
- Outbound y búsqueda de leads en detalle: los detalles van en la reunión.
- **Reemplazar o recortar personal.** Luna habla de horas, de trabajar 24/7 y de crecer sin
  contratar más. Muchas veces quien escribe es un empleado, no el dueño; la reducción de nómina se
  habla en la reunión con quien decide.
- RR.HH. en detalle: solo en general y solo si el cliente pregunta.
