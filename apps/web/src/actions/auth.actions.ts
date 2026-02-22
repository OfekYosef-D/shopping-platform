"use server";

// Auth actions — placeholder for Supabase Auth integration
// TODO: Implement with @supabase/supabase-js when Auth is set up

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // TODO: Implement Supabase Auth login
  throw new Error("Not implemented");
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // TODO: Implement Supabase Auth registration
  throw new Error("Not implemented");
}

export async function logout() {
  // TODO: Implement Supabase Auth logout
  throw new Error("Not implemented");
}
