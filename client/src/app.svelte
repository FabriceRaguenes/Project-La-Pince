<script>
  import {onMount} from "svelte";
  import {request} from "./lib/services/api"  

  // ===============================
  // IMPORT DES COMPOSANTS
  // ===============================

  import HeaderMobile from "./lib/components/components/headerMobile.svelte";
  import Footer from "./lib/components/components/footer.svelte";

  import Home from "./lib/pages/home.svelte";
  import Login from "./lib/pages/login.svelte";
  import Dashboard from "./lib/pages/dashboard.svelte";
  import Category from "./lib/pages/category.svelte";
  import Register from "./lib/pages/register.svelte";

  import WarningPopup from "./lib/components/popup/warningPopup.svelte";
  import NewExpensesPopup from "./lib/components/popup/nexExpensesPopup.svelte";
  import NewCategoryPopup from "./lib/components/popup/newCategoryPopup.svelte";
  import HomeSidebar from "./lib/components/sideBar/homeSidebar.svelte";
  import MenuSidebar from "./lib/components/sideBar/menuSidebar.svelte";
  import EditCategorie from "./lib/components/popup/editCategorie.svelte";
  import FilterCategorie from "./lib/components/popup/filterCategorie.svelte";
  import EditExpenses from "./lib/components/popup/editExpenses.svelte";

  // ===============================
  // ÉTAT GLOBAL DE L'APPLICATION
  // ===============================
  let currentPage = "home";   // Variable pour gérer la page courante
  let isLoggedIn = false;   // Variable pour gérer l'état de connexion de l'utilisateur

  // =====================================================
  // AU CHARGEMENT DE L’APPLICATION :
  // - On vérifie si un token existe
  // - On demande au backend s’il est encore valide
  // =====================================================
  onMount(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      isLoggedIn = false;
      return;
    }
    try {
      await request("/auth/me", { method: "GET" });
      isLoggedIn = true;
    } catch (error) {
      localStorage.removeItem("token");
      isLoggedIn = false;
      currentPage = "home";
    }
  });

  // =====================================================
  // Permet de masquer le header/footer
  // pour certaines pages ou popups
  // =====================================================
  $: showLayout = ![
    "homeSidebar",
    "menuSidebar",
    "newCategoryPopup",
    "newExpensesPopup",
    "warningPopup",
    "editCategorie",
    "editExpenses",
  ].includes(currentPage);
</script>

<!-- ===============================
    HEADER
=============================== -->
{#if showLayout}
  <!-- Passer isLoggedIn au header pour gérer l'affichage des boutons -->
  <HeaderMobile bind:currentPage bind:isLoggedIn />
{/if}

<!-- ===============================
    ROUTING MANUEL
=============================== -->
{#if currentPage === "home"}
  <Home />

{:else if currentPage === "login"}
  <!-- Passer isLoggedIn au login pour le mettre à jour après connexion -->
  <Login bind:currentPage bind:isLoggedIn />

{:else if currentPage === "dashboard"}
  <!-- Vérifier si l'utilisateur est connecté avant d'afficher le dashboard -->
  {#if isLoggedIn}
    <Dashboard bind:currentPage />
  {:else}
    <!-- Si pas connecté, rediriger vers login -->
    {(currentPage = "login")}
  {/if}

{:else if currentPage === "register"}
  <Register bind:currentPage bind:isLoggedIn />

{:else if currentPage === "category"}
  <!-- Vérifier si l'utilisateur est connecté avant d'afficher les catégories -->
  {#if isLoggedIn}
    <Category />
  {:else}
    {(currentPage = "login")}
  {/if}

{:else if currentPage === "homeSidebar"}
  <HomeSidebar />

{:else if currentPage === "warningPopup"}
  <WarningPopup />

{:else if currentPage === "newExpensesPopup"}
  <NewExpensesPopup onClose={() => (currentPage = "dashboard")} />

{:else if currentPage === "newCategoryPopup"}
  <NewCategoryPopup />


{:else if currentPage === "menuSidebar"}
  <MenuSidebar />

{:else if currentPage === "editCategorie"}
  <EditCategorie bind:currentPage />

{:else if currentPage === "filterCategorie"}
  <FilterCategorie bind:currentPage />
  
{:else if currentPage === "editExpenses"}
  <EditExpenses bind:currentPage />
{/if}

<!-- ===============================
    FOOTER
=============================== -->
{#if showLayout}
  <Footer />
{/if}
