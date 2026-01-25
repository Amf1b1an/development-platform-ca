import { supabase } from "./supabase.js";
import { displayMessage } from "./ui.js";
import { checkAuth, logout } from "./auth.js";

setupAuth();

async function setupAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const loginBtn = document.querySelector("#login-btn");
  const registerBtn = document.querySelector("#register-btn");
  const homeBtn = document.querySelector("#home-btn");
  const logoutBtn = document.querySelector("#logout-btn");

  const postForm = document.querySelector("form");
  const newPostSection = document.querySelector("#new-post-section");
  const authButtons = document.querySelector("#auth-buttons");
  if (session) {
    // When the user is logged in, it is added a create and logout button by removing "hidden".
    loginBtn.classList.add("hidden");
    registerBtn.classList.add("hidden");
    homeBtn.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.href = "/index.html";
    });

    postForm?.addEventListener("submit", handlePostSubmit);
    newPostSection?.classList.remove("hidden");
  } else {
    // And the other way around when the user is logged out.
    loginBtn.classList.remove("hidden");
    registerBtn.classList.remove("hidden");
    homeBtn.classList.add("hidden");
    logoutBtn.classList.add("hidden");

    newPostSection?.classList.add("hidden");
  }
}

async function handlePostSubmit(e) {
  e.preventDefault();
  //necessary for the function to wait for the response from the database, instead of executing the default behaviour

  const form = e.target;
  const title = form.title.value.trim();
  const content = form.content.value.trim();
  const category = form.category.value.trim();
  const fieldset = form.querySelector("fieldset");
  //data that we want to collect

  if (!category) {
    displayMessage("#message-container", "error", "Please select a category.");
    return;
  }

  try {
    fieldset.disabled = true;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    //user identification
    const { error } = await supabase
      .from("posts")
      .insert([{ title, content, category, submitted_by: user.id }]);
    //we want supabase to insert this data in the posts table
    if (error) {
      displayMessage("#message-container", "error", error.message);
      return;
    }
    //display error
    displayMessage(
      "#message-container",
      "success",
      "Post created successfully",
    );
    //display success

    form.reset();
    //empties the form
  } catch (error) {
    console.log(error);
    displayMessage("#message-container", "error", error.toString());
  } finally {
    fieldset.disabled = false;
  }
  //detects error and resets the form
}
