"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Saves a note for the logged-in user. Supabase fills in user_id from the
// session, and Row Level Security rejects anything that isn't theirs.
export async function addNote(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const supabase = await createClient();
  await supabase.from("notes").insert({ body });
  revalidatePath("/protected");
}

export async function deleteNote(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("notes").delete().eq("id", id);
  revalidatePath("/protected");
}
