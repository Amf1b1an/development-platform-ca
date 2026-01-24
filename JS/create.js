import { supabase } from "./supabase.js";
import { displayMessage } from "./ui.js";
import { checkAuth, logout } from "./auth.js";

loadPosts();
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

  const form = e.target;
  const title = form.title.value.trim();
  const content = form.content.value.trim();
  const fieldset = form.querySelector("fieldset");

  try {
    fieldset.disabled = true;

    const { error } = await supabase.from("posts").insert([{ title, content }]);

    if (error) {
      displayMessage("#message-container", "error", error.message);
      return;
    }

    displayMessage(
      "#message-container",
      "success",
      "Post created successfully",
    );
    loadPosts();
    form.reset();
  } catch (error) {
    console.log(error);
    displayMessage("#message-container", "error", error.toString());
  } finally {
    fieldset.disabled = false;
  }
}

async function loadPosts() {
  const postsContainer = document.querySelector("#posts-list");
  postsContainer.innerHTML = "";

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      displayMessage("#message-container", "error", error.message);
      return;
    }

    if (!posts || posts.length === 0) {
      displayMessage(
        "#message-container",
        "info",
        "No posts available as of now, create your first post",
      );
      return;
    }

    posts.forEach((post) => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.log(error);
    displayMessage(
      "#message-container",
      "error",
      "An unexpected error occurred while loading your posts",
    );
  }
}
