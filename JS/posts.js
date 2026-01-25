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
  const createBtn = document.querySelector("#create-btn");
  const logoutBtn = document.querySelector("#logout-btn");

  const postForm = document.querySelector("form");
  const newPostSection = document.querySelector("#new-post-section");
  const authButtons = document.querySelector("#auth-buttons");
  if (session) {
    // When the user is logged in, it is added a create and logout button by removing "hidden".
    loginBtn.classList.add("hidden");
    registerBtn.classList.add("hidden");
    createBtn.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.reload();
    });

    postForm?.addEventListener("submit", handlePostSubmit);
    newPostSection?.classList.remove("hidden");
  } else {
    // And the other way around when the user is logged out.
    loginBtn.classList.remove("hidden");
    registerBtn.classList.remove("hidden");
    createBtn.classList.add("hidden");
    logoutBtn.classList.add("hidden");

    newPostSection?.classList.remove("hidden");
  }
}

async function loadPosts() {
  const postsContainer = document.querySelector("#posts-list");
  postsContainer.innerHTML = "";

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
    *,
    profiles:submitted_by (
      email
    )
  `,
      )
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
  const wrapper = document.createElement("div");
  wrapper.className = "post bg-stone-700 text-orange-200 p-4 rounded-md shadow"; // Add any Tailwind or custom class here

  const heading = document.createElement("h3");
  heading.textContent = post.title;
  heading.className = "text-xl font-semibold mb-2";

  const body = document.createElement("p");
  body.textContent = post.content;
  body.className = "text-sm";

  const category = document.createElement("p");
  category.textContent = `Category: ${post.category}`;
  category.className = "text-xs italic text-orange-300";

  const createdAt = document.createElement("p");
  const date = new Date(post.created_at);
  createdAt.textContent = `Posted on: ${date.toLocaleString()}`;
  createdAt.className = "text-xs text-orange-400";

  const submitter = document.createElement("p");
  submitter.textContent = `By: ${post.profiles?.email || "Unknown"}`;
  submitter.className = "text-xs text-orange-400";

  wrapper.appendChild(submitter);
  wrapper.appendChild(heading);
  wrapper.appendChild(body);
  wrapper.appendChild(category);
  wrapper.appendChild(createdAt);

  console.log("Post data:", post);

  return wrapper;
}
