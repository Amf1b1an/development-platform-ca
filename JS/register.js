import { supabase } from "./supabase.js";

import { displayMessage } from "./ui.js";

const registerForm = document.querySelector("form");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const fieldset = form.querySelector("fieldset");

  try {
    fieldset.disabled = true;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log("login error:", error);
      displayMessage("#message-container", "error", error.message);
      return;
    }

    if (data.user) {
      displayMessage(
        "#message-container",
        "success",
        "Registration successful! Please check your email to verify your account.",
      );
      form.reset();
    }
  } catch (error) {
    console.log(error);
    displayMessage("#message-container", "error", error.toString());
  } finally {
    fieldset.disabled = false;
  }
});
