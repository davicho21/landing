import "server-only";
import nodemailer from "nodemailer";

export async function sendDiagnosticReport({
  to,
  pdfBuffer,
}: {
  to: string;
  pdfBuffer: Buffer;
}): Promise<void> {
  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!user || !appPassword) {
    throw new Error("Faltan las variables de entorno GMAIL_USER o GMAIL_APP_PASSWORD.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: appPassword },
  });

  await transporter.sendMail({
    from: `"Academia Referente" <${user}>`,
    to,
    subject: "Tu informe de diagnóstico de formación — Academia Referente",
    text: "Adjuntamos tu informe con recomendaciones y una ruta de formación sugerida para tu equipo.",
    html: `
      <p>Hola,</p>
      <p>Gracias por completar el diagnóstico de formación de <strong>Academia Referente</strong>.</p>
      <p>Adjuntamos tu informe con recomendaciones y una ruta de formación sugerida para tu equipo.</p>
      <p>Si quieres profundizar en estos resultados, escríbenos y coordinamos una llamada.</p>
      <p>— Equipo de Academia Referente</p>
    `,
    attachments: [
      {
        filename: "informe-diagnostico-academia-referente.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
