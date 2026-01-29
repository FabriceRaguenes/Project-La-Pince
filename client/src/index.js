import { mount } from "svelte";
import App from "./app.svelte";

// ===============================
// MONTE L'APPLICATION SVELTE
// ===============================
mount(App, {
  target: document.getElementById("app"),
});

// ===============================
// SIDEBAR / BURGER MENU
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("side-bar");
  const content = document.querySelector(".content");
  const btn = document.getElementById("btn");

  // Bouton pour ouvrir / fermer la sidebar
  if (btn) {
    btn.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("active");
    });
  }

  // Clic sur le contenu pour fermer la sidebar
  if (content) {
    content.addEventListener("click", () => {
      if (sidebar) sidebar.classList.remove("active");
    });
  }
});
