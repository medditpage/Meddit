"use client";

import { createClient } from "@/utils/supabase/client";

export async function getDoctors() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "doctor");

  if (error) throw error;
  return data;
}
export async function createPost(
  title: string,
  content: string,
  category: string,
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("community_posts")
    .insert([{ title, content, category, author_id: user.id }])
    .select();

  if (error) throw error;
  return data;
}