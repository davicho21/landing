# Diagnóstico de formación — Academia Referente

Landing page de captación de leads para Academia Referente: un formulario de 6 pantallas que genera automáticamente
un informe PDF con recomendaciones y una ruta de formación sugerida, enviado por correo al lead. Las respuestas
quedan guardadas en Supabase para seguimiento comercial.

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
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — cuenta de Gmail y contraseña de aplicación usada para enviar el PDF.

## Pruebas

```bash
npm run test    # Vitest: motor de reglas y validación de respuestas
npm run lint
npm run build
```
