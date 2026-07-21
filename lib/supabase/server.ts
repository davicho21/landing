import "server-only";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export type LeadRow = {
  necesidad: string;
  necesidad_otro: string | null;
  motivo: string;
  num_personas: string;
  tiempo_disponible: string;
  objetivo: string;
  email: string;
  ruta_recomendada: string;
  cursos_recomendados: unknown;
};
