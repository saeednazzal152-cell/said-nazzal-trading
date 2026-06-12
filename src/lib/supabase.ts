import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  _client = createClient(url, key);
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as never)[prop];
  },
});

export type Section = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  order: number;
};

export type Product = {
  id: string;
  section_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  package_price: number | null;
  package_size: number | null;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  sections?: Section;
};
