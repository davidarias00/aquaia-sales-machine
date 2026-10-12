# AquaIA Sales Machine — empieza aquí

Agente de WhatsApp del botón de aquaia.app: atiende empresas (pymes, Colombia y Latinoamérica),
las califica y agenda una reunión de diagnóstico con David. n8n + Chatwoot + Supabase + Claude.

## Lee primero

1. **`REQUISITOS.md`** — lo que el agente tiene que hacer. **Es la fuente de verdad.**
2. `docs/agendamiento-y-reuniones-2026-10-12.md` y `docs/conocimiento-del-agente-2026-10-12.md` —
   el porqué de cada decisión.

## Reglas

- **Requisitos primero.** No se construye nada que no esté en `REQUISITOS.md`. Si un arreglo no
  corresponde a ningún requisito, falta un requisito: se propone a David, se escribe y después se
  construye. Cada cambio de workflow y cada prueba citan el id del requisito (`A-06`, `Q-04`…).
- **El modelo conversa y extrae; el código decide** (clase, lead caliente, horarios, eventos,
  confirmaciones). No metas reglas de negocio en el prompt.
- **Nunca confirmes al cliente algo que no se hizo**: «agendado» solo después de que el evento
  existe y se verificó (A-06).
- **n8n es compartido con Dreams Can Bloom.** Por ahora se usa la misma llave de API.
  - Todo workflow de AquaIA se llama `AquaIA · …` y lleva la etiqueta `aquaia`.
  - **Nunca leas para modificar, actualices, desactives ni borres un workflow que no empiece por
    `AquaIA · `.** Antes de cada `PUT`, comprueba el nombre del workflow en vivo.
  - Cuenta los workflows al empezar y al terminar; los de DCB no pueden cambiar.
  - Desplegar es `PUT` → desactivar → activar, y después comparar repo contra vivo (aprendizaje de
    DCB).
- **Chatwoot de AquaIA es una cuenta aparte** en el mismo servidor. Nunca uses la cuenta 2 (DCB).
- **Base de datos: el proyecto de Supabase de AquaIA**, no el de DCB.
- Referencia: el repo `davidarias00/sales-machine-dcb` (solo lectura) tiene la experiencia de la
  máquina de DCB. Es otro negocio: aprendizaje, no reglas.
- Nunca pegues secretos en el chat ni en el repo. Nunca crees un pull request si David no lo pide.

## Idioma

Docs y mensajes en español de Colombia.
