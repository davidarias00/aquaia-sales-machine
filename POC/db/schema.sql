-- Esquema de Postgres de Luna (POC).
-- Fuente de verdad de los leads (D-07). Cada tabla dice qué requisitos sirve.
-- Va en el proyecto de Supabase de AquaIA. NUNCA en un proyecto de Dreams Can Bloom.

begin;

-- Configuración: valores que cambian sin tocar la lógica (sección «Configuración»).
create table if not exists config (
  clave       text primary key,
  valor       jsonb not null,
  actualizado timestamptz not null default now()
);

insert into config (clave, valor) values
  ('valor_diagnostico',      '1000000'),
  ('diagnostico_gratis',     'true'),
  ('corte_a_ventas',         '{"COP": 1000000000, "USD": 250000}'),
  ('corte_a_personas',       '20'),
  ('corte_c_ventas',         '{"COP": 500000000, "USD": 125000}'),
  ('corte_c_personas',       '5'),
  ('duracion_reunion_min',   '45'),
  ('margen_entre_reuniones_min', '15'),
  ('anticipacion_minima_h',  '2'),
  ('horizonte_maximo_dias',  '7'),
  ('opciones_de_horario',    '3'),
  ('max_reprogramaciones',   '2'),
  ('invitar_roberto',        'false'),
  ('idiomas_reunion',        '["es", "en"]'),
  ('espera_rafaga_s',        '5'),
  ('seguimiento_1_h',        '4'),
  ('seguimiento_2_h',        '24'),
  ('aviso_previo_min',       '90'),
  ('espera_no_llego_min',    '10'),
  ('vigencia_datos_dias',    '90'),
  ('plazo_diagnostico',      '"3 días hábiles"'),
  ('hora_reporte',           '"08:00"'),
  ('hora_prebriefing',       '"07:30"'),
  ('zona_horaria',           '"America/Bogota"'),
  ('video_confirmacion',     'null'),
  ('video_aviso_previo',     'null')
on conflict (clave) do nothing;

-- Leads (D-01, D-02, D-03, E-01, E-06, Q-01, B-01).
create table if not exists leads (
  id                 bigint generated always as identity primary key,
  telefono           text not null unique,            -- D-03: se reconoce por el número
  nombre             text,
  empresa            text,
  nit                text,
  constituida        boolean,                         -- Q-04: no constituida → C
  ciudad             text,
  pais               text,
  correo             text,
  idioma             text not null default 'es',      -- C-02, C-03
  -- Origen (E-01, E-06)
  origen             text not null default 'directo', -- W1, formulario, anuncio, linkedin, qr…, directo
  meta_ad_id         text,
  ctwa_clid          text,
  -- Calificación (Q-01)
  area               text,
  dolor              text,
  por_que_ahora      text,
  para_cuando        text check (para_cuando in ('lo_antes_posible', 'tres_meses', 'explorando')),
  personas_rango     text check (personas_rango in ('1-5', '6-20', '21-50', '50+')),
  ventas_moneda      text check (ventas_moneda in ('COP', 'USD')),
  ventas_min         numeric,                         -- límites del rango elegido;
  ventas_max         numeric,                         -- null en max = «más de»
  ventas_no_dice     boolean not null default false,  -- «prefiero no decir»
  decide             text check (decide in ('decide', 'participa', 'no_decide')),
  herramientas       text,
  clase              char(1) check (clase in ('A', 'B', 'C')),   -- la calcula el código (Q-04)
  -- Estado (D-02)
  estado             text not null default 'nuevo' check (estado in (
                       'nuevo', 'calificando', 'agendando', 'agendado', 'confirmado',
                       'asistio', 'no_asistio', 'cancelado', 'sin_respuesta',
                       'descartado_c', 'no_es_lead', 'con_humano')),
  estado_previo      text,                            -- para volver de con_humano
  no_escribir        boolean not null default false,  -- B-01: marca aparte del estado
  reprogramaciones   int not null default 0,          -- A-15, A-16
  chatwoot_conversation_id bigint,
  ultimo_mensaje_cliente_at timestamptz,              -- C-10, C-11, D-06
  creado             timestamptz not null default now(),
  actualizado        timestamptz not null default now()
);

-- Historial de estados: el tablero y el reporte semanal (N-02) salen de aquí.
create table if not exists lead_estados (
  id       bigint generated always as identity primary key,
  lead_id  bigint not null references leads(id),
  de       text,
  a        text not null,
  motivo   text,
  at       timestamptz not null default now()
);

-- Reuniones (A, S).
create table if not exists reuniones (
  id               bigint generated always as identity primary key,
  lead_id          bigint not null references leads(id),
  inicio           timestamptz not null,
  fin              timestamptz not null,
  idioma           text not null default 'es',
  google_event_id  text unique,                       -- A-09: existe solo si se verificó
  meet_link        text,
  estado           text not null default 'agendada' check (estado in (
                     'agendada', 'confirmada', 'reprogramada', 'cancelada',
                     'realizada', 'no_asistio')),
  confirmo         boolean not null default false,    -- S-03, S-06
  creada           timestamptz not null default now(),
  actualizada      timestamptz not null default now()
);

-- Mensajes salientes programados o únicos (S-11: anotar ANTES de mandar, nunca dos veces).
-- clave = qué mensaje es para quién, p. ej. 'recordatorio_24h:reunion:17' o 'seguimiento_1:lead:42'.
create table if not exists envios (
  id         bigint generated always as identity primary key,
  clave      text not null unique,
  lead_id    bigint not null references leads(id),
  reunion_id bigint references reuniones(id),
  tipo       text not null,
  estado     text not null default 'anotado' check (estado in ('anotado', 'enviado', 'fallido', 'cancelado')),
  detalle    text,
  creado     timestamptz not null default now(),
  enviado    timestamptz
);

-- Avisos de una sola vez por lead (H-03): el unique impide el segundo.
create table if not exists avisos_unicos (
  lead_id bigint not null references leads(id),
  tipo    text not null,
  at      timestamptz not null default now(),
  primary key (lead_id, tipo)
);

-- Ráfagas (C-04): el último mensaje visto por conversación. Aprendizaje de DCB.
create table if not exists ultimo_mensaje (
  conversation_id bigint primary key,
  message_id      bigint not null,
  actualizado     timestamptz not null default now()
);

-- Preguntas que Luna no supo contestar (C-07).
create table if not exists preguntas_sin_respuesta (
  id       bigint generated always as identity primary key,
  lead_id  bigint references leads(id),
  pregunta text not null,
  at       timestamptz not null default now()
);

-- Webhooks de Discord por canal (N-01). Son secretos: se cargan a mano en el editor SQL de
-- Supabase, nunca en el repo.
create table if not exists discord_canales (
  canal       text primary key check (canal in ('lead-caliente', 'agenda', 'otros-mensajes', 'fallos', 'reporte')),
  webhook_url text not null
);

-- Nadie entra por la API pública de Supabase: RLS activo y sin políticas. n8n se conecta
-- directo a Postgres y el tablero usará su propio rol de solo lectura.
alter table config                  enable row level security;
alter table leads                   enable row level security;
alter table lead_estados            enable row level security;
alter table reuniones               enable row level security;
alter table envios                  enable row level security;
alter table avisos_unicos           enable row level security;
alter table ultimo_mensaje          enable row level security;
alter table preguntas_sin_respuesta enable row level security;
alter table discord_canales         enable row level security;

-- Vistas para el tablero de los socios (D-08). Solo lectura.
create or replace view v_leads with (security_invoker = true) as
select l.id, l.creado::date as primer_contacto, l.nombre, l.empresa, l.ciudad, l.pais,
       l.origen, l.clase, l.estado, l.personas_rango,
       case when l.ventas_no_dice then 'prefiere no decir'
            when l.ventas_min is null and l.ventas_max is null then null
            else concat(l.ventas_moneda, ' ', coalesce(l.ventas_min::text, '0'), '–', coalesce(l.ventas_max::text, 'más'))
       end as ventas,
       l.dolor, l.por_que_ahora, l.para_cuando, l.decide,
       r.inicio as reunion, r.idioma, r.confirmo, l.chatwoot_conversation_id
from leads l
left join lateral (
  select * from reuniones r
  where r.lead_id = l.id and r.estado in ('agendada', 'confirmada')
  order by r.inicio limit 1
) r on true;

create or replace view v_agenda with (security_invoker = true) as
select r.inicio, r.fin, r.idioma, r.confirmo, r.meet_link,
       l.nombre, l.empresa, l.clase, l.dolor, l.decide, l.chatwoot_conversation_id
from reuniones r join leads l on l.id = r.lead_id
where r.estado in ('agendada', 'confirmada') and r.inicio >= now()
order by r.inicio;

commit;
