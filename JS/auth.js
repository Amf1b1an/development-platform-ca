//This controls the authorization, and locks certain pages if no user is detected
//Logout function deletes token and redirects to home screen.
import { supabase } from "./supabase.js";

export async function checkAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
  }

  console.log("user", user);
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error loggin out:", error);
  }

  window.location.href = "index.html";
}
