import { supabase } from "./supabase.js";
import { displayMessage } from "./ui.js";
import { checkAuth, logout } from "./auth.js";

loadPosts();
setupAuth();

async function setupAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const logoutBtn = document.querySelector("#logout-btn");
  const postForm = document.querySelector("form");
  const newPostSection = document.querySelector("#new-post-section");
  const authButtons = document.querySelector("#auth-buttons");

  if (session) {
    // Show post section and logout
    newPostSection?.classList.remove("hidden");
    logoutBtn?.classList.remove("hidden");
    authButtons?.classList.add("hidden");

    logoutBtn?.addEventListener("click", logout);
    postForm?.addEventListener("submit", handlePostSubmit);
  } else {
    // Hide post section and logout
    newPostSection?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");
    authButtons?.classList.remove("hidden");
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

function createPostElement(post) {
  const heading = document.createElement("h3");
  heading.textContent = post.title;
  return heading;
}
