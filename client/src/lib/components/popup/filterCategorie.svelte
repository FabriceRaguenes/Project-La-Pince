<script>
  import { categories as categoriesApi } from "../../services/category.service";
  import { expenses } from "../../services/expense.service";
  export let onClose; // Fonction pour fermer le popup

  // Variables du formulaire
  let title = "";
  let amount = 0;
  let date = new Date().toISOString().split("T")[0];
  let category_id = "";
  let categories = [];
  let error = null;
  let success = false;
  let loading = false;

  // Charger les catégories au montage
  async function loadCategories() {
    try {
      categories = await categoriesApi.list();
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    }
  }

  loadCategories();

  // Soumettre le formulaire
  async function handleSubmit() {
    error = null;
    success = false;
    loading = true;

    try {
      // Récupérer l'ID de l'utilisateur (à adapter selon votre système d'authentification)
      const user_id = 1; // Remplacez par la logique pour récupérer l'ID de l'utilisateur connecté

      // Appel à l'API pour ajouter la dépense
      await expenses.create({ title, user_id, category_id, amount, date });
      success = true;

      // Réinitialiser et fermer après 2 secondes
      setTimeout(() => {
        title = "";
        amount = 0;
        category_id = "";
        date = new Date().toISOString().split("T")[0];
        onClose(); // Ferme le popup
      }, 2000);
    } catch (err) {
      error = err.message;
      console.error("Erreur :", err);
    } finally {
      loading = false;
    }
  }
  // ----------Categorie affichage----------------
  let selectedCategory = null;

  $: selectedCategory =
    categories.find((c) => String(c.id) === String(category_id)) ?? null;
</script>

<!-- ---------------------- -->

<a class="close" href="/" on:click|preventDefault={onClose}>X</a>

<div
  class="overlay"
  on:click={() => (open = false)}
  role="button"
  tabindex="0"
></div>

<a class="close" on:click|preventDefault={onClose}
  ><i class="fa-solid fa-xmark"></i></a
>

<aside class="formPopupNewExpense">
  <main>
    <h1 class="titleSearch">Recherche</h1>
    <form class="formSearch" on:submit|preventDefault={handleSubmit}>
      <!-- Libellé -->
      <div class="formSearch">
        <label for="title">Libellé</label>
        <input
          type="text"
          id="title"
          bind:value={title}
          placeholder="Facture EDF"
          required
        />
      </div>

      <!-- Montant -->
      <div class="formSearch">
        <label for="amount">Montant (€)</label>
        <input
          type="number"
          id="amount"
          bind:value={amount}
          placeholder="60.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <!-- Catégorie -->
      <div class="formSearch">
        <label for="formSearch">Catégorie</label>
        <select id="formSearch" bind:value={category_id} required>
          <option value="" disabled selected>Sélectionnez une catégorie</option>
          {#each categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>

      <!-- Date -->
      <div class="formSearch test">
        <label for="date">Date</label>
        <input type="date" id="date" bind:value={date} required />
      </div>

      <!-- Bouton Ajouter -->
      <button class="btn" type="submit" disabled={loading}>
        {#if loading}Envoi...{:else}Rechercher{/if}
      </button>

      <div class="affichage">
        {#if selectedCategory}
          <span class="selectedCategory">
            <span
              class="color"
              style="background-color: {selectedCategory.color}"
            ></span>

            <img src={selectedCategory.icon} alt="" width="24" height="24" />

            <strong>{selectedCategory.name}</strong>

            <em>{Number(selectedCategory.max_budget).toFixed(2)} €</em>
          </span>
        {:else}
          <span class="empty">Aucune catégorie sélectionnée</span>
        {/if}
      </div>

      <!-- Messages d'erreur/succès -->
      {#if error}
        <p class="error">{error}</p>
      {/if}
      {#if success}
        <p class="success">Dépense ajoutée avec succès !</p>
      {/if}
    </form>
  </main>
</aside>

<style>
  main {
    display: flex;
    flex-direction: column;
  }

  /* Conteneur du formulaire */
  .formPopupNewExpense {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  #formSearch {
    width: 100%;
    padding: 0.8em;
    background-color: var(--backgroundListe);
    border: 1px solid var(--bordure);
    color: var(--textSecondairePlaceholder);
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: text, sans-serif;
  }

  #date {
    color: var(--textSecondairePlaceholder);
  }

  input {
    color-scheme: dark;
  }

  /* Groupe de champs */
  .formSearch {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 5px;
  }

  /* Inputs */
  .formSearch input {
    width: 100%;
    padding: 0.8em;
    background-color: var(--backgroundListe);
    border: 1px solid var(--bordure);
    color: var(--textSecondairePlaceholder);
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: text, sans-serif;
  }

  /* Labels */
  .formSearch label {
    font-size: 0.95rem;
    color: var(--textPrincipal);
    font-family: text, sans-serif;
    padding-left: 0.3em;
  }

  /* Focus */
  .formSearch input:hover {
    border-color: var(--bouttonPrincipal);
  }

  .titleSearch {
    color: var(--textPrincipal);
    font-family: title, sans-serif;
    text-align: center;
    padding: 1em 0 0 0;
  }

  /* Bouton */
  .btn {
    cursor: pointer;
    background-color: var(--bouttonPrincipal);
    border: none;
    padding: 0.8em;
    color: var(--textSecondairePlaceholder);
    border-radius: 5px;
    font-family: bouton, sans-serif;
    font-weight: bold;
    margin-top: 1em;
    width: 60%;
    align-self: center;
  }

  .btn:hover {
    filter: brightness(0.9);
  }

  /* Croix de fermeture */
  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    text-decoration: none;
  }

  .close i {
    color: var(--textSecondairePlaceholder);
    font-size: 28px;
  }

  .close:hover i {
    filter: brightness(0.9);
  }

  /* Desktop */
  @media screen and (min-width: 1024px) {
    main {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: 3rem;
    }
  }

  /* Sidebar */
  .formPopupNewExpense {
    position: fixed;
    top: 0;
    right: 0;
    width: 85%;
    max-width: 350px;
    height: 100vh;
    background-color: var(--backgroundHeaderFooter);
    z-index: 999;
    box-shadow: -4px 0 15px var(--overlay);
    animation: slideIn 0.3s ease;
    overflow-y: auto;
    border-left: 2px solid var(--bouttonPrincipal);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .close i {
    font-size: 32px;
  }

  /* Contenu de la sidebar */
  .content {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 2em 1em;
  }

  /* Menu de navigation */
  .menu {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    width: 100%;
    max-width: 280px;
  }

  /* Boutons du menu */
  .btnhome {
    width: 100%;
    padding: 1em 1.5em;
    font-size: 1.1rem;
    background-color: var(--backgroundCarte);
    color: var(--textPrincipal);
    border: 2px solid var(--bordure);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }
</style>
