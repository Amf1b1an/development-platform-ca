import { supabase } from "./supabase.js";
import { displayMessage } from "./ui.js";

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      displayMessage("#message-container", "error", error.message);
      return;
    }

    if (data.user) {
      console.log("user", data.user);
      console.log("session", data.session);
      location.href = "/";
    }
  } catch (error) {
    displayMessage("#message-container", "error", error.toString());
  }
});
