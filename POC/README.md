# POC · Luna

Construcción de Luna según los requisitos (hoy: v2.0 en revisión en `aquaia-inc/lead-customers-agent`,
PR #1). **Se construye aquí y se migra a `POC/` del repo de la organización por pull request**
cuando la app de Claude tenga acceso.

Todo lo de aquí cita el id del requisito que cumple.

## Qué hay

| Ruta | Qué | Requisitos | Estado |
|---|---|---|---|
| `db/schema.sql` | Tablas, configuración inicial y vistas del tablero | D, B, S-11, H-03, C-04, C-07, Configuración | Cargado en el Supabase de AquaIA |
| `lib/clasificacion.js` | Clase A/B/C, si se puede agendar sin calificar, lead caliente | Q-04, Q-05, Q-06, H-01 | Con pruebas |
| `lib/avisos.js` | A qué canal de Discord va cada aviso; escalar no calla a Luna | N-01, «escalar a un humano» | Con pruebas |
| `workflows/` | Los workflows de n8n (`AquaIA · Luna · …`) exportados | — | Vacío todavía |
| `CLAUDE.md` | Reglas para las sesiones de Claude Code que trabajan en el POC | — | — |
| `docs/aprendizajes-dcb.md` | Lo que costó caro en la máquina de DCB y la regla para Luna | — | — |
| `docs/decisiones/` | El porqué de las decisiones de agendamiento y calificación | — | — |
| `docs/vision-aquaia-*.md` | Visión interna (no va al prompt de Luna) | — | — |

`lib/` son funciones puras, sin dependencias, para copiarlas a los nodos Code de n8n. Así la lógica
que decide se prueba aquí y no dentro de n8n.

## Correr las pruebas

```
node --test pruebas/*.test.js
```

## Decisiones de la revisión con Roberto (14/10/2026) que ya están aquí

- **Escalar a un humano = avisar en Discord, sin poner `bot_off` / `humano`.** Luna sigue disponible y
  solo se calla si una persona escribe (C-08).
- **Leads solo en Postgres**, con un tablero de solo lectura para los socios (Vercel o similar)
  sobre las vistas `v_leads` y `v_agenda`. Sin hoja de Drive.

## Lo que falta para conectar

- Credencial `AquaIA · Supabase` en n8n (el esquema ya está cargado en el proyecto de AquaIA,
  `ffpctflishiuxmdybzzf`).
- Servidor de Discord de AquaIA con `#lead-caliente`, `#agenda`, `#otros-mensajes`, `#fallos`, `#reporte`
  y el webhook de cada uno (en la tabla `discord_canales`, nunca en el repo).
- Cuenta de Chatwoot de AquaIA.
- Cuenta de Google de AquaIA (calendario y Meet).
