# Toppix Donas

Sitio de la tienda de donas Toppix con un configurador interactivo "Crea tu dona". Es un proyecto Next.js
independiente que vive en la carpeta `toppix/` de este repositorio, separado de la landing de Academia Referente
(raíz del repo).

## Desarrollo

```bash
cd toppix
npm install
npm run dev
```

## Contenido editable

- `lib/contact.ts`: WhatsApp, Instagram, dirección y horario. Si `WHATSAPP_NUMBER` está vacío, el botón "Pedir"
  solo muestra una confirmación en pantalla.
- `lib/options.ts`: bases, glaseados, hilos, toppings, precios y donas favoritas.

## Despliegue en Vercel

Crear un proyecto nuevo importando este mismo repositorio y configurar **Root Directory = `toppix`**.
El proyecto de Academia Referente no se ve afectado.
