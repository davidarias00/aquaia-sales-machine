# POC · Luna — empieza aquí

Prueba de concepto de **Luna**, la agente del botón de WhatsApp de aquaia.app: atiende empresas,
las califica y agenda la reunión de diagnóstico con David. n8n + Chatwoot + Postgres (Supabase) +
Claude + Discord.

**Todo el trabajo del POC va dentro de esta carpeta.** Fuera de ella solo se lee.

## Lee primero

1. `../AGENTS.md` — reglas del repo (cómo se trabaja, cómo se revisa).
2. `../docs/requirements.md` — **lo que Luna tiene que hacer. Es la fuente de verdad.**
3. `../docs/knowledge-base/` — lo que Luna sabe de AquaIA (`aquaia.md`) y cómo lo dice (`luna.md`).
4. `docs/aprendizajes-dcb.md` — los errores que costaron caro en la máquina de ventas de Dreams Can
   Bloom y la regla que salió de cada uno. **Léelo antes de construir cualquier workflow.**
5. `docs/decisiones/` — el porqué de las decisiones. `docs/vision-aquaia-*.md` es contexto interno.

## Reglas

- **Requisitos primero.** No se construye nada que no esté en `../docs/requirements.md`. Si un
  arreglo no corresponde a ningún requisito, falta un requisito: se propone a David, se aprueba por
  pull request y después se construye. Cada workflow, función y prueba cita el id del requisito
  (`A-09`, `Q-04`…).
- **El modelo conversa y extrae; el código decide** (clase, lead caliente, horarios, eventos,
  confirmaciones). Las reglas de negocio no van en el prompt: van en `lib/` y tienen pruebas.
- **Nunca confirmes al cliente algo que no se hizo:** «agendado» solo después de que el evento
  existe en el calendario y se verificó (A-09).
- **Escalar a un humano = avisar en Discord.** Nunca pone `bot_off` ni `humano`: Luna sigue
  disponible y solo se calla cuando una persona escribe en la conversación (C-08).
- **Anota antes de mandar.** Todo mensaje programado o único se registra en `envios` antes de
  enviarse; nunca sale dos veces (S-11).
- **Configuración en la tabla `config`**, nunca escrita a mano en un workflow o en el prompt.
- **Workflows pequeños, uno por responsabilidad.** Si uno pasa de ~30 nodos, se parte. La lógica que
  decide vive en `lib/` (funciones puras, se copian a nodos Code) y se prueba con
  `node --test pruebas/*.test.js`. Si una prueba falla, no se despliega.
- **El repo es la verdad.** Cada workflow se exporta a `workflows/` y se despliega desde aquí.
  Después de desplegar se compara repo contra vivo.

## n8n (compartido con Dreams Can Bloom)

- Servidor: `n8n-lab.exaproductlabs.com`, misma llave de API que DCB por ahora.
- **Los workflows de Luna se llaman `AquaIA · Luna · …`** y llevan la etiqueta `aquaia`. Hay otros
  `AquaIA · …` (video, web, observatorio de Instagram) que **no son de Luna: no se tocan**.
- **Nunca modifiques, desactives ni borres un workflow que no empiece por `AquaIA · Luna · `.**
  Antes de cada cambio, comprueba el nombre del workflow en vivo. Cuenta los workflows al empezar y
  al terminar.
- Desplegar: `PUT` (solo `name`, `nodes`, `connections` y `settings: {"executionOrder":"v1"}`) →
  desactivar → activar → comparar repo contra vivo. Un `PUT` solo no despliega.
- Workflows temporales para consultar algo: ruta aleatoria y **se borran siempre** al terminar.

## Datos y servicios

- **Base de datos:** el proyecto de Supabase **de AquaIA** (`ffpctflishiuxmdybzzf`). **Nunca** un
  proyecto de Dreams Can Bloom (`dcb-marketing-intel` y otros). Esquema en `db/schema.sql`, ya
  cargado. RLS activo en todas las tablas; n8n entra directo a Postgres con la credencial
  `AquaIA · Supabase`.
- **Chatwoot:** cuenta propia de AquaIA en el mismo servidor. **Nunca la cuenta 2 (DCB).**
- **Discord:** servidor de AquaIA, canales `#lead-caliente`, `#agenda`, `#otros-mensajes`, `#fallos`,
  `#reporte`. Los webhooks viven en la tabla `discord_canales`, nunca en el repo.
- **Claude:** credencial `AquaIA · Anthropic`, con la llave de AquaIA, no la de DCB.
- Nunca pegues secretos en el chat ni en el repo.

## Referencia

`davidarias00/sales-machine-dcb` (solo lectura): la máquina de ventas de DCB en producción. Es otro
negocio (flores, venta a consumidor): aprendizaje, no reglas. Lo que aplica está resumido en
`docs/aprendizajes-dcb.md`.

## Idioma

Docs y mensajes en español de Colombia.
