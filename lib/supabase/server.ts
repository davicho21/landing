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
  empresa: string;
  email: string;
  sector: string;
  respuestas: Record<string, number>;
  puntajes_aspectos: unknown;
  areas_criticas: unknown;
};
