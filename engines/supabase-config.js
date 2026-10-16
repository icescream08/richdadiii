// RichDNA™ Supabase connection. The publishable key is safe in the browser:
// row-level security only lets visitors INSERT and only the owner SELECT.

export const SUPABASE_URL = 'https://dgxmjbsofetwpcthiddf.supabase.co';
export const SUPABASE_KEY = 'sb_publishable__nrvO5EKbJdfsFY_c_oFdg_KEVmAjVc';
export const ADMIN_EMAIL = 'emmanuel.bautistaiii@gmail.com';

const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/+esm';

let lib = null;
// Returns supabase-js's createClient, loading the library once.
export async function loadCreateClient() {
  if (!lib) lib = import(SUPABASE_JS);
  return (await lib).createClient;
}
