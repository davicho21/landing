# Plan de implementación: Landing de diagnóstico de formación — Academia Referente

Basado en: `spec.md` (confirmado el 2026-07-21)

> **Enmienda post-implementación (2026-07-21):** se quitó el envío del PDF por correo (Gmail SMTP). Ahora el PDF se genera igual, pero se devuelve al navegador como base64 en la misma respuesta de `submit-lead` y se ofrece como descarga directa en la pantalla de confirmación. El email se sigue guardando como dato del lead. Ver la enmienda equivalente en `spec.md`.

## Enfoque técnico

- **Framework**: Next.js 14+ (App Router, TypeScript). Encaja de forma nativa con Vercel (deploy, funciones serverless para el backend del formulario) y permite compartir componentes React entre la UI y el template del PDF.
- **Estilos**: Tailwind CSS con un tema custom (`tailwind.config.ts`) que fija los design tokens ya acordados (colores, radios "pill" para botones, tipografía) para no reinventar valores en cada componente.
- **Tipografía**: `Inter` vía `next/font/google` (autohosteada por Next, sin llamada externa en runtime).
- **Logo**: `components/logo.tsx` usa los PNG reales de Academia Referente (subidos por el usuario al repo, recortados sin espacios en blanco) en `public/brand/` — no una recreación en SVG. Se generó además una variante recoloreada en blanco (`logo-lockup-light.png`) para fondos oscuros (navbar, portada del PDF), derivada por script a partir del archivo original preservando su forma exacta.
- **Formulario multi-pantalla**: componente cliente (`components/diagnostic-form/`) con estado local (un objeto de respuestas + índice de paso), sin necesidad de una librería de forms externa dado que son 6 campos simples. Barra de progreso + botones atrás/siguiente. Validación por paso antes de avanzar (RF-3).
- **Motor de reglas**: función pura (`lib/recommendation-engine.ts`) que recibe las respuestas y devuelve `{ ruta, cursosRecomendados, notaModalidad }`. Es la pieza más fácil de testear de forma aislada — se cubre con pruebas unitarias.
- **Catálogo de cursos**: constante tipada (`lib/course-catalog.ts`) con las 6 rutas y 12 cursos acordados (nombre, duración, modalidad).
- **Generación de PDF**: `@react-pdf/renderer`. Se eligió sobre Puppeteer/Playwright porque no depende de un binario de Chromium (no viable en funciones serverless de Vercel sin paquetes adicionales pesados), renderiza con componentes React declarativos (reutilizable el mismo lenguaje que el resto del proyecto) y soporta imágenes/fuentes custom para respetar el design system. Se deshabilitó la hyphenation automática de la librería (`Font.registerHyphenationCallback`) porque partía palabras largas con un guion a mitad al ajustar el ancho del texto.
- **Entrega del PDF**: ya no hay envío por correo. La API route genera el PDF en memoria y lo devuelve codificado en base64 dentro de la respuesta JSON; el cliente lo decodifica a un `Blob`, crea un object URL y lo ofrece como descarga (`<a download>`) en la pantalla de confirmación.
- **Orquestación**: una única API route (`app/api/submit-lead/route.tsx`) hace: validar payload → correr motor de reglas → insertar en Supabase (con `service role key`, server-only) → generar PDF en memoria → responder al cliente con el PDF en base64. El insert en Supabase ocurre **antes** de generar el PDF, para cumplir RF-7/RNF-3 (el lead no se pierde si la generación del PDF falla).
- **Manejo de fallas de generación de PDF**: la respuesta de la API distingue `{ saved: true, pdfGenerated: true, pdfBase64, fileName }` de `{ saved: true, pdfGenerated: false }`; el frontend muestra el mensaje correspondiente (RF-7).

## Infraestructura

- **Control de versiones**: GitHub (default) — repo `davicho21/landing`, rama de trabajo `claude/academia-referentes-landing-xlns7d` (ya usada para el spec).
- **Base de datos**: Supabase (default). Se revisaron los proyectos existentes del usuario (`directorio-empresas-tech-co`, activo, de otro producto; `davicho21's Project`, inactivo) — ninguno corresponde a esta landing, así que se creará un **proyecto Supabase nuevo y dedicado** (ej. `academia-referentes-landing`) en la fase de publicación, con confirmación explícita antes de crearlo.
  - Tabla `leads`: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `necesidad text`, `necesidad_otro text null`, `motivo text`, `num_personas text`, `tiempo_disponible text`, `objetivo text`, `email text not null`, `ruta_recomendada text`, `cursos_recomendados jsonb`.
  - RLS habilitado, **sin políticas públicas** (RNF-5): todo el acceso de escritura pasa por la API route con `service role key`; el admin consulta directo desde el dashboard de Supabase (con su login de organización), no desde la app.
- **Despliegue**: Vercel (default) — proyecto nuevo bajo el team `dvv821`, importado desde el repo de GitHub para que cada push a la rama genere un preview deployment. Variables de entorno a configurar: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Sin desviación del stack por defecto.**

## Tareas

- [x] Scaffold del proyecto Next.js (TypeScript, App Router, Tailwind, ESLint) — raíz del repo.
- [x] Tema Tailwind con tokens de marca (colores, radios, tipografía Inter) — implementado vía `@theme` de Tailwind v4 en `app/globals.css` (el scaffold de Next 16 usa Tailwind v4 CSS-first, sin `tailwind.config.ts`).
- [x] Componente `Logo` (PNG real de marca + variante clara/oscura) — `components/logo.tsx`, `public/brand/`.
- [x] Primitivas de UI: `Button` (pill, variantes outline/filled), `Card`, `ProgressBar`, `Badge` — `components/ui/`.
- [x] Catálogo de cursos — `lib/course-catalog.ts`.
- [x] Motor de reglas + pruebas unitarias — `lib/recommendation-engine.ts`, `lib/recommendation-engine.test.ts`.
- [x] Formulario multi-pantalla (6 pasos + validación + navegación) — `components/diagnostic-form/`, `app/page.tsx`.
- [x] Pantalla de confirmación con botón de descarga del PDF (o mensaje de error si falla la generación) — `components/diagnostic-form/confirmation.tsx`.
- [x] Cliente de Supabase server-only — `lib/supabase/server.ts`.
- [x] Migración SQL de la tabla `leads` con RLS — `supabase/migrations/0001_create_leads.sql`.
- [x] Template del PDF (6 páginas, design system de marca, con logo real y elementos visuales tipo dashboard) — `lib/pdf/diagnostic-report.tsx`.
- [x] ~~Envío de correo con adjunto~~ — descartado por la enmienda; el PDF se entrega como descarga en el navegador (ver `handleChange`/`submit` en `components/diagnostic-form/index.tsx`, que decodifica el base64 recibido).
- [x] API route de orquestación — `app/api/submit-lead/route.tsx` (extensión `.tsx` en vez de `.ts` porque construye JSX del documento PDF). Devuelve el PDF en base64 en la misma respuesta.
- [x] Conectar el submit del formulario a la API route (estados: cargando, listo-para-descargar, error) — `components/diagnostic-form/index.tsx`.
- [x] `.env.example` documentando las variables requeridas (solo Supabase).
- [x] Verificación responsive (mobile/desktop) del formulario y la landing — probado en navegador con Playwright a 1280px y 390px.
- [x] Pruebas unitarias del motor de reglas y de la validación de payload de la API route.
- [x] Verificación del flujo de descarga en navegador (mock de la respuesta de la API con Playwright, ya que aún no hay proyecto Supabase real): se completó el formulario, se confirmó que aparece el botón "Descargar informe (PDF)" y que el archivo descargado es byte-idéntico al PDF generado.
- [ ] Verificación manual end-to-end con credenciales reales de Supabase (formulario completo contra la base de datos real → fila visible en el dashboard) — pendiente hasta la fase de publicación.

## Estrategia de pruebas

- **Framework**: Vitest (estándar liviano para proyectos Next.js/TypeScript, sin dependencias pesadas).
- **Cobertura automática**:
  - `recommendation-engine.test.ts`: distintas combinaciones de necesidad/tiempo/nº de personas → ruta y cursos esperados (cubre el criterio de aceptación de "Liderazgo + poco tiempo → cursos cortos").
  - Validación de payload de `submit-lead` (campos obligatorios, formato de email) como función pura testeable, separada del handler de la route.
- **Verificación manual** (no automatizable sin credenciales reales):
  - Flujo completo del formulario en navegador (Playwright) hasta la pantalla de confirmación, incluido el botón de descarga (verificado con la API mockeada, y confirmado que el archivo descargado es byte-idéntico al PDF generado).
  - Generación real del PDF fuera del navegador (`renderToFile`) confirmando 6 páginas, logo real y colores correctos.
  - Pendiente para la fase de publicación: correr el flujo completo contra un proyecto Supabase real y confirmar que la fila aparece en el dashboard (RF-8), y forzar un fallo de `getSupabaseServerClient()`/insert para confirmar el mensaje de error correcto (RF-7) — ya verificado informalmente porque en este sandbox no hay credenciales configuradas y el error se muestra correctamente.
- **Mapeo a criterios de aceptación del spec**: cada criterio listado en `spec.md` se verifica o con una prueba automática (motor de reglas, validación) o con el checklist de verificación manual de esta sección.

## Riesgos y supuestos abiertos

- El PDF solo existe en la sesión del navegador que completó el formulario (no se envía ni se guarda de forma persistente) — riesgo aceptado conscientemente en la enmienda; el lead igual queda en Supabase para seguimiento comercial.
- Creación de un proyecto Supabase nuevo y un proyecto Vercel nuevo son acciones que se confirman explícitamente en la fase de publicación, no ahora.

## Publicación

Al llegar a la Fase 5: commit + push de la implementación a la rama `claude/academia-referentes-landing-xlns7d` → confirmación explícita del usuario para (a) crear el proyecto Supabase y aplicar la migración, (b) crear el proyecto Vercel y hacer el primer deploy, (c) configurar las variables de entorno (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). Se verifica el preview deployment contra los criterios de aceptación críticos antes de considerar el trabajo terminado.

### Estado real de la publicación (2026-07-21)

- [x] Proyecto Supabase creado (`academia-referentes-landing`, `lqczngevkckjjypjciwy`, `sa-east-1`, plan free $0/mes) y migración `0001_create_leads.sql` aplicada. RLS habilitado sin políticas públicas (confirmado con `get_advisors`, único aviso es el esperado `rls_enabled_no_policy`).
- [x] Rama `main` creada en GitHub (el repo solo tenía la rama de feature) apuntando al código implementado.
- [x] Proyecto Vercel creado (`academia-referentes-landing`, team `dvv821`) y desplegado.
- **Desviación del plan**: el MCP de Vercel conectado a esta sesión no tiene una herramienta para importar un repo de GitHub con integración continua ni para configurar variables de entorno — solo `deploy_to_vercel` (subida directa de archivos). El usuario, informado de esta limitación, eligió explícitamente el deploy rápido sin git en vez de hacer la conexión manual por dashboard. Por lo tanto:
  - El deploy actual **no** está conectado a GitHub — un push futuro a `main` no dispara un deploy automático.
  - Las variables de entorno (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) **no están configuradas** — el formulario guarda... en realidad falla en el paso de Supabase con un error genérico honesto (RF-7 funcionando como debe), pero no puede completarse hasta que se configuren.
- **Pendiente (acción del usuario, fuera del alcance de las herramientas disponibles)**:
  1. En vercel.com → proyecto `academia-referentes-landing` → Settings → Environment Variables: agregar `SUPABASE_URL=https://lqczngevkckjjypjciwy.supabase.co` y `SUPABASE_SERVICE_ROLE_KEY` (copiado desde Supabase → Project Settings → API → `service_role` secret).
  2. Opcional pero recomendado para que seguir editando el sitio sea sostenible: conectar el proyecto de Vercel al repo de GitHub (`davicho21/landing`, rama `main`) desde el dashboard, para recuperar el auto-deploy en cada push.
  3. Revisar Deployment Protection en Vercel si se quiere que el link sea público sin login (por defecto los proyectos de equipo quedan protegidos).
