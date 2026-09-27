# Diagnóstico de formación — Academia Referente

Landing page de captación de leads para Academia Referente: un formulario de 6 pantallas que genera automáticamente
un informe PDF con recomendaciones y una ruta de formación sugerida, disponible para descarga inmediata. Las
respuestas y el correo del lead quedan guardados en Supabase para seguimiento comercial.

Ver `specs/academia-referentes-landing/spec.md` y `plan.md` para el detalle funcional y técnico.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — proyecto de Supabase con la tabla `leads` (ver
  `supabase/migrations/0001_create_leads.sql`).

## Pruebas

```bash
npm run test    # Vitest: motor de reglas y validación de respuestas
npm run lint
npm run build
```

## Toppix Donas (`/toppix`)

Sitio de la tienda de donas Toppix con un configurador interactivo "Crea tu dona" (`components/toppix/`,
`lib/toppix/`). Los datos de contacto (WhatsApp, Instagram, dirección, horario) se editan en
`lib/toppix/contact.ts` y los precios/opciones en `lib/toppix/options.ts`.
