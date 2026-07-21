# Plan de implementación: Landing de diagnóstico de formación — Academia Referente

Basado en: `spec.md` (confirmado el 2026-07-21)

## Enfoque técnico

- **Framework**: Next.js 14+ (App Router, TypeScript). Encaja de forma nativa con Vercel (deploy, funciones serverless para el backend del formulario) y permite compartir componentes React entre la UI y el template del PDF.
- **Estilos**: Tailwind CSS con un tema custom (`tailwind.config.ts`) que fija los design tokens ya acordados (colores, radios "pill" para botones, tipografía) para no reinventar valores en cada componente.
- **Tipografía**: `Inter` vía `next/font/google` (autohosteada por Next, sin llamada externa en runtime).
- **Logo**: componente SVG propio (`components/logo.tsx`) recreando el ícono (círculo verde menta con muesca) + wordmark "Referente ACADEMIA", recortado sin padding extra. Se muestra al usuario en el primer preview para aprobación visual antes de publicar (riesgo ya documentado en el spec).
- **Formulario multi-pantalla**: componente cliente (`components/diagnostic-form/`) con estado local (un objeto de respuestas + índice de paso), sin necesidad de una librería de forms externa dado que son 6 campos simples. Barra de progreso + botones atrás/siguiente. Validación por paso antes de avanzar (RF-3).
- **Motor de reglas**: función pura (`lib/recommendation-engine.ts`) que recibe las respuestas y devuelve `{ ruta, cursosRecomendados, notaModalidad }`. Es la pieza más fácil de testear de forma aislada — se cubre con pruebas unitarias.
- **Catálogo de cursos**: constante tipada (`lib/course-catalog.ts`) con las 6 rutas y 12 cursos acordados (nombre, duración, modalidad).
- **Generación de PDF**: `@react-pdf/renderer`. Se eligió sobre Puppeteer/Playwright porque no depende de un binario de Chromium (no viable en funciones serverless de Vercel sin paquetes adicionales pesados), renderiza con componentes React declarativos (reutilizable el mismo lenguaje que el resto del proyecto) y soporta SVG/fuentes custom para respetar el design system.
- **Envío de correo**: `nodemailer` con transporte SMTP de Gmail, autenticado con `GMAIL_USER` + `GMAIL_APP_PASSWORD` (contraseña de aplicación, no la contraseña de la cuenta).
- **Orquestación**: una única API route (`app/api/submit-lead/route.ts`) hace: validar payload → correr motor de reglas → insertar en Supabase (con `service role key`, server-only) → generar PDF en memoria → enviar correo con el PDF adjunto → responder al cliente. El insert en Supabase ocurre **antes** del intento de envío de correo, para cumplir RF-7/RNF-3 (el lead no se pierde si el correo falla).
- **Manejo de fallas de email**: la respuesta de la API distingue `{ saved: true, emailSent: true }` de `{ saved: true, emailSent: false }`; el frontend muestra el mensaje correspondiente (RF-7).

## Infraestructura

- **Control de versiones**: GitHub (default) — repo `davicho21/landing`, rama de trabajo `claude/academia-referentes-landing-xlns7d` (ya usada para el spec).
- **Base de datos**: Supabase (default). Se revisaron los proyectos existentes del usuario (`directorio-empresas-tech-co`, activo, de otro producto; `davicho21's Project`, inactivo) — ninguno corresponde a esta landing, así que se creará un **proyecto Supabase nuevo y dedicado** (ej. `academia-referentes-landing`) en la fase de publicación, con confirmación explícita antes de crearlo.
  - Tabla `leads`: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `necesidad text`, `necesidad_otro text null`, `motivo text`, `num_personas text`, `tiempo_disponible text`, `objetivo text`, `email text not null`, `ruta_recomendada text`, `cursos_recomendados jsonb`, `email_sent boolean default false`.
  - RLS habilitado, **sin políticas públicas** (RNF-5): todo el acceso de escritura pasa por la API route con `service role key`; el admin consulta directo desde el dashboard de Supabase (con su login de organización), no desde la app.
- **Despliegue**: Vercel (default) — proyecto nuevo bajo el team `dvv821`, importado desde el repo de GitHub para que cada push a la rama genere un preview deployment. Variables de entorno a configurar: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`.
- **Sin desviación del stack por defecto.**

## Tareas

- [ ] Scaffold del proyecto Next.js (TypeScript, App Router, Tailwind, ESLint) — raíz del repo.
- [ ] Tema Tailwind con tokens de marca (colores, radios, tipografía Inter) — `tailwind.config.ts`, `app/globals.css`.
- [ ] Componente `Logo` (ícono SVG + wordmark) — `components/logo.tsx`.
- [ ] Primitivas de UI: `Button` (pill, variantes outline/filled), `Card`, `ProgressBar`, `Badge` — `components/ui/`.
- [ ] Catálogo de cursos — `lib/course-catalog.ts`.
- [ ] Motor de reglas + pruebas unitarias — `lib/recommendation-engine.ts`, `lib/recommendation-engine.test.ts`.
- [ ] Formulario multi-pantalla (6 pasos + validación + navegación) — `components/diagnostic-form/`, `app/page.tsx`.
- [ ] Pantalla de confirmación (éxito / éxito-parcial si falla el email) — `components/diagnostic-form/confirmation.tsx`.
- [ ] Cliente de Supabase server-only — `lib/supabase/server.ts`.
- [ ] Migración SQL de la tabla `leads` con RLS — `supabase/migrations/0001_create_leads.sql`.
- [ ] Template del PDF (6 páginas, design system de marca) — `lib/pdf/diagnostic-report.tsx`.
- [ ] Envío de correo con adjunto — `lib/email/send-report.ts`.
- [ ] API route de orquestación — `app/api/submit-lead/route.ts`.
- [ ] Conectar el submit del formulario a la API route (estados: cargando, éxito, éxito-parcial, error) — `components/diagnostic-form/index.tsx`.
- [ ] `.env.example` documentando las variables requeridas.
- [ ] Verificación responsive (mobile/desktop) del formulario y la landing.
- [ ] Pruebas unitarias del motor de reglas y de la validación de payload de la API route.
- [ ] Verificación manual end-to-end (formulario completo → email real recibido con PDF de 6 páginas) antes de publicar.

## Estrategia de pruebas

- **Framework**: Vitest (estándar liviano para proyectos Next.js/TypeScript, sin dependencias pesadas).
- **Cobertura automática**:
  - `recommendation-engine.test.ts`: distintas combinaciones de necesidad/tiempo/nº de personas → ruta y cursos esperados (cubre el criterio de aceptación de "Liderazgo + poco tiempo → cursos cortos").
  - Validación de payload de `submit-lead` (campos obligatorios, formato de email) como función pura testeable, separada del handler de la route.
- **Verificación manual** (no automatizable sin credenciales reales):
  - Flujo completo del formulario en navegador (Playwright vía skill `run`) hasta la pantalla de confirmación.
  - Envío real de un correo de prueba con `GMAIL_APP_PASSWORD` real, confirmando que el PDF adjunto tiene 6 páginas, logo y colores correctos.
  - Simulación de fallo de envío (credenciales inválidas) para confirmar que el lead igual queda en Supabase y el usuario ve el mensaje de error correcto (RF-7).
- **Mapeo a criterios de aceptación del spec**: cada criterio listado en `spec.md` se verifica o con una prueba automática (motor de reglas, validación) o con el checklist de verificación manual de esta sección.

## Riesgos y supuestos abiertos

- El logo recreado en SVG requiere aprobación visual explícita del usuario antes de publicar (heredado del spec).
- Gmail SMTP: límite de envío diario y entregabilidad menor que un proveedor transaccional — aceptado conscientemente para esta iteración (heredado del spec).
- La contraseña de aplicación de Gmail debe ser generada y provista por el usuario en la fase de publicación (no se pide en el chat, se configura como variable de entorno en Vercel).
- Creación de un proyecto Supabase nuevo y un proyecto Vercel nuevo son acciones que se confirman explícitamente en la fase de publicación, no ahora.

## Publicación

Al llegar a la Fase 5: commit + push de la implementación a la rama `claude/academia-referentes-landing-xlns7d` → confirmación explícita del usuario para (a) crear el proyecto Supabase y aplicar la migración, (b) crear el proyecto Vercel y hacer el primer deploy, (c) configurar las variables de entorno (incluida la app password de Gmail que debe proveer el usuario). Se verifica el preview deployment contra los criterios de aceptación críticos antes de considerar el trabajo terminado.
