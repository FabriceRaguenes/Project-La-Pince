<script>
  import { auth } from "../../services/auth.service";
  // ← importer auth pour logout
  export let currentPage;
  let open = false;
  let close = true;

  // Fonction de déconnexion
  async function handleLogout() {
    try {
      await auth.logout(); // Appel backend pour logout
      localStorage.removeItem("token"); // Supprime le token
      currentPage = "login"; // Redirige vers login
      open = false;
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  }
</script>

<header>
  <a class="close" href="" aria-label="Fermer le menu">
    <i class="fa-solid fa-xmark"></i>
  </a>
  <section class="header">
    <nav class="menu">
      <button
        class="btnMenu"
        on:click={() => {
          currentPage = "Dashboard";
          open = false;
        }}>Tableau de bord</button
      >
      <button
        class="btnMenu"
        on:click={() => {
          currentPage = "Category";
          open = false;
        }}>Catégories</button
      >
      <button
        class="btnMenu"
        on:click={() => {
          currentPage = "Home";
          open = false;
        }}>Acceuil</button
      >
      <button
        class="btnMenu"
        on:click={() => {
          currentPage = "register";
          open = false;
        }}>Déconnexion</button
      >
    </nav>
  </section>
</header>

<style>
  .header {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: flex-end;
  }

  .menu {
    display: flex;
    flex-direction: column;
    padding: 1em;
    gap: 2em;
    min-width: 200px;
    box-shadow: 0 4px 6px var(--bordure);
    background-color: var(--backgroundCarte);
  }

  .btnMenu {
    width: 100%;
    display: flex;
    margin-bottom: 5rem;
    justify-content: center;
    padding: 1.2em 7em;
    min-width: 200px;
    font-size: 1.2rem;
    transform: translateY(0);
    transition:
      transform 0.08s ease,
      box-shadow 0.08s ease;
  }

  /* Croix de fermeture */
  .close {
    text-decoration: none;
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }

  .close i {
    color: var(--textSecondairePlaceholder);
    font-size: 28px;
  }

  .close:hover i {
    filter: brightness(0.9);
  }
</style>
