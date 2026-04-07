<script>
  import logo from "../../../assets/logo/La_pince.png";
  import HomeSidebar from "../../components/sideBar/homeSidebar.svelte";
  import { auth } from "../../services/auth.service";
  import { onMount } from "svelte";

  export let currentPage;
  export let isLoggedIn;

  let open = false;
  let userName = "";

  // THEME
  let theme = "dark";

  function applyTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = t; // html[data-theme="..."]
    localStorage.setItem("theme", t);
  }

  function toggleTheme() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  async function loadUserName() {
    if (!isLoggedIn) return;

    try {
      const me = await auth.me();
      userName = me.name || me.user?.name || "Utilisateur";
    } catch (err) {
      console.error("Erreur récupération nom:", err);
    }
  }

  onMount(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      theme = saved;
    } else {
      const prefersLight = window.matchMedia(
        "(prefers-color-scheme: light)",
      ).matches;
      theme = prefersLight ? "light" : "dark";
    }
    document.documentElement.dataset.theme = theme;

    loadUserName();
  });

  $: if (isLoggedIn) {
    loadUserName();
  } else {
    userName = "";
  }

  async function handleLogout() {
    try {
      await auth.logout();
      localStorage.removeItem("token");
      isLoggedIn = false;
      currentPage = "home";
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
      localStorage.removeItem("token");
      isLoggedIn = false;
      currentPage = "home";
    }
  }
</script>

<header>
  <section class="head">
    <button
      style="background: none; border: none; padding: 0; cursor: pointer;"
      on:click={() => (currentPage = "home")}
    >
      <img src={logo} alt="Logo" />
    </button>

    <!--affichage du nom du user quand il est connecté -->

    {#if isLoggedIn && userName}
      <p class="textwelcome">
        Bienvenue {userName.charAt(0).toUpperCase() + userName.slice(1)}
      </p>
    {/if}

    <section class="deskstop">
      <!-- Si l'utilisateur n'est PAS connecté (page home, login, register) -->
      {#if !isLoggedIn}
        <button class="btn" on:click={() => (currentPage = "register")}>
          Inscription
        </button>
        <button class="btn" on:click={() => (currentPage = "login")}>
          Connexion
        </button>

        <!-- Si l'utilisateur EST connecté (dashboard, category) -->
      {:else}
        <!-- Afficher "Tableau de bord" seulement si on n'est pas déjà dessus -->
        {#if currentPage !== "dashboard"}
          <button class="btn" on:click={() => (currentPage = "dashboard")}>
            Tableau de bord
          </button>
        {/if}

        <!-- Afficher "Catégorie" seulement si on n'est pas déjà dessus -->
        {#if currentPage !== "category"}
          <button class="btn" on:click={() => (currentPage = "category")}>
            Catégorie
          </button>
        {/if}

        <!-- Bouton de déconnexion -->
        <button class="btn" on:click={handleLogout}> Se déconnecter </button>
      {/if}
      <button
        class="theme-switch"
        on:click={toggleTheme}
        aria-label="Changer le thème"
      >
        <span class:active={theme === "dark"} class="thumb">
          {theme === "light" ? "☀️" : "🌙"}
        </span>
      </button>
    </section>
    <button id="sidebar" on:click={() => (open = !open)}>☰</button>
  </section>
</header>

<!-- Burger -->
{#if open}
  <HomeSidebar bind:currentPage bind:open bind:isLoggedIn />
{/if}

<!-- style -->
<style>
  @import "../../css/settings.css";
  .head {
    background-color: var(--backgroundHeaderFooter);
    border-bottom: solid 2px var(--bouttonPrincipal);
    box-shadow: 1px 2px 11px var(--bouttonPrincipal);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10vh;
  }
  img {
    height: 100px;
  }
  .deskstop {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .deskstop i {
    font-size: 25px;
  }
  .btn {
    margin-right: 1em;
    color: var(--textBtn);
    padding: 0.5em 2em;
  }
  .btn:hover {
    background: var(--boutonPrinciaplHover);
  }
  #sidebar {
    margin-right: 0.5em;
    padding: 0.5em;
    background: none;
    color: var(--textPrincipal);
    cursor: pointer;
    font-size: 2em;
    border: none;
  }
  .iconUser {
    color: white;
  }
  @media (min-width: 800px) {
    #sidebar {
      display: none;
    }
  }
  @media (max-width: 800px) {
    .deskstop {
      display: none;
    }
  }

  .themeBtn {
    border: 1px solid var(--bordure);
    background: var(--backgroundCarte);
    color: var(--textPrincipal);
    padding: 0.4rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
  }
  .themeBtn:hover {
    filter: brightness(1.1);
  }
</style>
