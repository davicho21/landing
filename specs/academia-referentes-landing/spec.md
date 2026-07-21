# Spec: Landing de diagnóstico de formación — Academia Referente

## Resumen
Landing page tipo "diagnóstico" para Academia Referente: un formulario de varias pantallas (una pregunta por vez) que captura la necesidad de formación de un lead corporativo y, al terminar, genera automáticamente un informe PDF de 6 páginas con recomendaciones y una ruta de cursos sugerida, con el design system de la marca. El PDF se envía por correo al lead, y sus respuestas quedan almacenadas para que el equipo de Academia Referente las consulte.

## Validación de la idea (fase de brainstorming)
- **Problema validado**: no es una intuición sin fundamento — el propio sitio real de Academia Referente ya usa "Agenda diagnóstico" como su CTA principal, así que un diagnóstico auto-servido que entrega valor inmediato (el PDF) antes de un contacto humano es una extensión natural de su estrategia de captación existente, no una idea nueva sin precedente.
- **Alternativas más simples consideradas**: un formulario de contacto simple (nombre + email + mensaje) sería más barato de construir, pero no entrega valor inmediato al lead ni califica el lead con la misma profundidad; se descartó porque el objetivo explícito del negocio es generar leads calificados con contexto de necesidad, no solo capturar contacto.
- **Objeciones señaladas y su resolución**:
  - *Generación del contenido del PDF*: se evaluó IA generativa vs. motor de reglas. Se optó por **motor de reglas** (tabla de mapeo respuestas → recomendaciones) por ser gratuito, instantáneo, predecible y no depender de una API externa con costo variable.
  - *Design system*: no fue posible acceder a `academiareferentes.com` por política de red del entorno de ejecución (bloqueo 403 a nivel de proxy, confirmado también para Google Drive). El design system se reconstruyó a partir de capturas de pantalla compartidas por el usuario.
  - *Logo*: no fue posible descargar el archivo original (mismo bloqueo de red). Se recreará como SVG a partir de las capturas, sujeto a aprobación visual del usuario antes de publicar.
  - *Envío de email*: se evaluó Resend vs. Gmail SMTP. Se optó por **Gmail SMTP** con la cuenta `lab.marketing.digital.co@gmail.com` (más simple de configurar, sin verificación de dominio), aceptando conscientemente límites de envío más bajos y peor entregabilidad que un proveedor transaccional dedicado — riesgo aceptado para esta iteración.
  - *Acceso admin a leads*: se evaluó dashboard de Supabase vs. panel `/admin` propio. Se optó por **dashboard de Supabase** directamente — sin desarrollo adicional en esta iteración.

## Problema / motivación
Empresas (PYMES) interesadas en capacitar a sus equipos no tienen un punto de entrada de bajo compromiso para explorar qué necesitan antes de hablar con un vendedor. Academia Referente necesita capturar estos leads con contexto suficiente (qué necesitan, para cuántas personas, con qué urgencia, qué esperan lograr) para poder priorizar el seguimiento comercial, mientras el lead recibe algo de valor inmediato (un informe con recomendaciones) a cambio de sus datos.

## Usuarios y casos de uso
- **Lead (visitante de la landing)**: llega desde marketing/redes, completa el formulario de 6 pantallas, deja su correo y recibe un PDF de recomendaciones personalizado según sus respuestas.
- **Admin de Academia Referente**: consulta periódicamente la tabla de leads en el dashboard de Supabase para hacer seguimiento comercial, viendo respuestas completas + email + fecha.

## Alcance

### Incluye
- Landing page con el design system de Academia Referente (colores, tipografía, logo, estilo de botones/tarjetas extraídos de las capturas compartidas).
- Formulario multi-pantalla (una pregunta visible a la vez, con navegación adelante/atrás y barra de progreso) con las siguientes 6 pantallas:
  1. ¿Cuál es la necesidad de formación actual? (selección entre las 6 rutas de cursos, o "otro" con texto libre)
  2. ¿Por qué considera necesaria esta formación ahora? (texto libre corto)
  3. ¿Cuántas personas participarán? (rango numérico)
  4. ¿Cuánto tiempo tienen disponible para la capacitación? (rango: ej. horas/semanas)
  5. ¿Qué espera lograr con esta formación? (texto libre corto u opciones predefinidas)
  6. Correo electrónico (para recibir el informe)
- Motor de reglas que, con las respuestas de las pantallas 1-5, selecciona una ruta de formación (de las 6 definidas) y hasta 3 cursos recomendados dentro de ella, ajustando énfasis según tiempo disponible y número de participantes.
- Generación de un PDF de 6 páginas con el design system de la marca:
  1. Portada (logo, título del informe, nombre/fecha)
  2. Resumen de las respuestas del lead
  3. Diagnóstico / interpretación genérica de la necesidad
  4. Ruta de formación recomendada (curso principal + complementarios)
  5. Cursos recomendados con detalle (duración, modalidad, a quién beneficia)
  6. Próximos pasos + CTA de contacto con Academia Referente
- Envío automático del PDF al correo del lead vía Gmail SMTP.
- Persistencia en Supabase: una tabla `leads` con las respuestas de las 5 preguntas, el email, timestamp, y referencia a la ruta/cursos recomendados.
- Confirmación visual al lead tras enviar el formulario (pantalla de "revisa tu correo").

### No incluye (fuera de alcance de esta iteración)
- Autenticación de usuarios o panel `/admin` propio (se usa el dashboard de Supabase).
- Pagos, checkout o inscripción a cursos.
- Personalización del PDF vía IA generativa (queda para una iteración futura si se decide cambiar el motor de reglas).
- Multi-idioma (solo español).
- Analítica avanzada de marketing (pixeles, UTM tracking detallado) más allá de lo que Vercel Analytics ofrezca por defecto.
- Verificación de dominio de email propio (`@academiareferentes.com`); se usa la cuenta Gmail indicada.
- Reproducción pixel-perfect del logo original (se recrea en SVG por no poder descargar el archivo; sujeta a aprobación).

## Requisitos funcionales
- RF-1: El sistema debe mostrar las 6 preguntas en pantallas separadas, una a la vez, con posibilidad de retroceder a una pregunta anterior sin perder las respuestas ya dadas.
- RF-2: El sistema debe mostrar una barra/indicador de progreso (ej. "Pregunta 3 de 6").
- RF-3: El sistema debe validar que las respuestas obligatorias estén completas antes de avanzar a la siguiente pantalla (todas las preguntas son obligatorias, incluyendo el email con formato válido).
- RF-4: Al completar la pregunta 6 (email), el sistema debe: (a) guardar el lead completo en Supabase, (b) generar el PDF de 6 páginas con las recomendaciones correspondientes, (c) enviar el PDF por correo al email capturado, (d) mostrar una pantalla de confirmación al usuario.
- RF-5: El motor de reglas debe mapear la respuesta de "necesidad de formación" a una de las 6 rutas definidas, y seleccionar cursos dentro de ella considerando el tiempo disponible declarado (cursos más cortos si el tiempo es limitado) y el número de participantes (nota sobre modalidad grupal si el número es alto).
- RF-6: El PDF debe incluir el logo de Academia Referente, la paleta de colores de marca, y estar compuesto por exactamente 6 páginas con el contenido descrito en "Alcance".
- RF-7: Si el envío de correo falla, el lead debe quedar igualmente guardado en Supabase (no se pierde el registro aunque falle el email), y el usuario debe ver un mensaje indicando que hubo un problema con el envío.
- RF-8: El admin debe poder ver, desde el dashboard de Supabase, cada lead con sus 5 respuestas, su email y la fecha de captura, sin pasos adicionales de configuración.

## Requisitos no funcionales
- RNF-1: La landing debe ser responsive (funcional en mobile y desktop), dado que el tráfico de una landing de captación suele venir mayormente de mobile/redes sociales.
- RNF-2: La generación del PDF y el envío del correo no deben bloquear la percepción de éxito del usuario por más de ~5 segundos; si toma más, debe mostrarse un estado de carga claro.
- RNF-3: Los datos del lead (respuestas + email) deben quedar persistidos en Supabase antes de intentar el envío de correo, para no perder el lead si el envío falla (ver RF-7).
- RNF-4: Las credenciales de Gmail SMTP (usuario + app password) deben manejarse como variables de entorno, nunca hardcodeadas ni expuestas al cliente.
- RNF-5: La tabla de leads en Supabase debe tener Row Level Security habilitado, sin acceso de lectura/escritura público — solo desde el backend (service role) y desde el dashboard de Supabase para el admin.

## Criterios de aceptación
- [ ] Dado un visitante que entra a la landing, cuando completa las 6 pantallas con datos válidos, entonces recibe un correo con un PDF adjunto de 6 páginas dentro de un tiempo razonable (<1 min).
- [ ] Dado un visitante en la pantalla 3 de 6, cuando presiona "atrás", entonces vuelve a la pantalla 2 con su respuesta previa intacta.
- [ ] Dado un visitante que intenta avanzar sin responder la pregunta actual, entonces el sistema le impide continuar y le indica que el campo es obligatorio.
- [ ] Dado un visitante que ingresa un email con formato inválido, entonces el sistema no permite enviar el formulario hasta corregirlo.
- [ ] Dado un lead que respondió "necesidad = Liderazgo" con poco tiempo disponible, cuando se genera el PDF, entonces la ruta recomendada corresponde a "Liderazgo y Gestión de Equipos" priorizando los cursos más cortos de esa ruta.
- [ ] Dado que el envío de correo falla (ej. credenciales inválidas), cuando el lead completa el formulario, entonces el registro igual queda guardado en Supabase y el usuario ve un mensaje de error apropiado (no un falso éxito).
- [ ] Dado el admin, cuando entra al dashboard de Supabase y abre la tabla de leads, entonces puede ver todas las respuestas y el email de cada lead sin configuración adicional.
- [ ] Dado el PDF generado, cuando se abre, entonces tiene exactamente 6 páginas, incluye el logo y los colores de marca, y el contenido de cada página corresponde a lo definido en el alcance.

## Supuestos y riesgos
- **Supuesto**: el catálogo de 6 rutas / cursos generado en esta sesión (ver conversación) es aceptado como catálogo real de Academia Referente para esta iteración; si el catálogo real difiere, se actualiza después sin cambiar la arquitectura.
- **Supuesto**: los valores de color extraídos visualmente de las capturas (`#070B14`, `#111A30`, `#6FFFB0`, `#8B9CFF`, `#F5F7FA`, `#A8B3C7`) son una aproximación suficientemente fiel; no se tienen los valores exactos del CSS original.
- **Supuesto**: la tipografía real del sitio no se pudo identificar con certeza; se usa **Inter** (Google Fonts, gratuita) como aproximación a la sans-serif geométrica observada.
- **Riesgo aceptado**: Gmail SMTP tiene límites de envío diario (~500/día en cuentas normales) y peor entregabilidad/reputación que un proveedor transaccional — aceptable mientras el volumen de leads sea bajo/medio; si crece, se debería migrar a un proveedor dedicado.
- **Riesgo**: el logo recreado en SVG podría no calzar exactamente con el original (en especial el detalle de la muesca del ícono que se funde con la "R") — se muestra al usuario para aprobación antes de publicar.
- **Riesgo**: no se pudo verificar en vivo el sitio real, por lo que otros elementos del design system no capturados en las screenshots compartidas (ej. página de cursos, footer completo) no están reflejados aquí.

## Dependencias
- **Supabase**: proyecto nuevo (o existente, a confirmar en fase de planificación) para la tabla `leads`.
- **Gmail SMTP**: cuenta `lab.marketing.digital.co@gmail.com` con contraseña de aplicación (App Password) generada por el usuario y provista como variable de entorno en el momento de publicar.
- **Vercel**: despliegue del proyecto (frontend + funciones serverless para generación de PDF y envío de correo).
- **Librería de generación de PDF**: a definir en fase de planificación (ej. `@react-pdf/renderer`, `pdf-lib`, o similar compatible con serverless de Vercel).
- **Google Fonts (Inter)**: para la tipografía.
