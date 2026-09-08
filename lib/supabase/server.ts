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
  nombres: string;
  apellidos: string;
  email: string;
  cargo: string;
  area_desempeno: string;
  empresa: string;
  sitio_web: string;
  pais: string;
  ciudad: string;
  industria: string;
  num_colaboradores: string;
  desafio_principal: string;
  respuestas: Record<string, number>;
  puntajes_areas: unknown;
  areas_criticas: unknown;
};
