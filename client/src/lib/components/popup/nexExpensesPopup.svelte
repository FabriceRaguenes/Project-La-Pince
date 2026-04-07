<script>
  import { categories as categoriesApi } from "../../services/category.service";
  import { expenses } from "../../services/expense.service";
  import { createEventDispatcher, onMount } from "svelte";

  export let onClose;

  const dispatch = createEventDispatcher();

  let title = "";
  let amount = 0;
  let date = new Date().toISOString().split("T")[0];
  let category_id = "";
  let categories = [];
  let error = null;
  let success = false;
  let loading = false;

  async function loadCategories() {
    try {
      categories = await categoriesApi.list();
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    }
  }

  onMount(loadCategories);

  async function handleSubmit() {
    error = null;
    success = false;
    loading = true;

    try {
      const user_id = 1;
      await expenses.create({ title, user_id, category_id, amount, date });
      success = true;
      dispatch("saved");
      onClose?.();

      title = "";
      amount = 0;
      category_id = "";
      date = new Date().toISOString().split("T")[0];
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<a class="close" href="/" on:click|preventDefault={onClose}>X</a>

<div class="overlay" on:click={onClose} role="button" tabindex="0"></div>

<aside class="formPopupNewExpense">
  <a class="close" on:click|preventDefault={onClose}
    ><i class="fa-solid fa-xmark"></i></a
  >
  <main class="mainNewExpense">
    <h1>Nouvelle dépense</h1>
    <form class="formExpense" on:submit|preventDefault={handleSubmit}>
      <!-- Libellé -->
      <div class="formExpense">
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
      <div class="formExpense">
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
      <div class="formExpense">
        <label for="category">Catégorie</label>
        <select id="category" bind:value={category_id} required>
          <option value="" disabled selected>Sélectionnez une catégorie</option>
          {#each categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>

      <!-- Date -->
      <div class="formExpense">
        <label for="date">Date</label>
        <input type="date" id="date" bind:value={date} required />
      </div>

      <!-- Bouton Ajouter -->
      <button class="btn" type="submit" disabled={loading}>
        {#if loading}Envoi...{:else}Ajouter{/if}
      </button>

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
    display: grid;
    width: 90%;
    margin: 0% auto;
    height: 82vh;
  }

  input {
    color-scheme: dark;
  }

  /*Conteneur du formulaire*/
  .formPopupNewExpense {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  #category {
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

  /*Groupe de champs*/
  .formExpense {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 5px;
  }

  /* Inputs */
  .formExpense input {
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

  /*Labels*/
  .formExpense label {
    font-size: 0.95rem;
    color: var(--textPrincipal);
    font-family: text, sans-serif;
    padding-left: 0.3em;
  }

  /* Focus */
  .formExpense input:hover {
    border-color: var(--bouttonPrincipal);
  }

  .mainNewExpense h1 {
    color: var(--textPrincipal);
    font-family: title, sans-serif;
    text-align: center;
    padding: 2.5em 0 0em 0;
    font-size: 1.5em;
  }

  /* Bouton Ajouter */
  .btn {
    cursor: pointer;
    background-color: var(--bouttonPrincipal);
    border: none;
    padding: 0.8em;
    color: var(--textBtn);
    border-radius: 5px;
    font-family: bouton, sans-serif;
    font-weight: bold;
    margin-top: 1em;
    width: 60%;
    align-self: center;
  }

  /* Hover (sans nouvelle variable, on fait simple) */
  .btn:hover {
    filter: brightness(0.9);
    background-color: var(--boutonPrinciaplHover);
  }

  /*croix de fermeture */
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
  }

  /* sidebar */
  .formPopupNewExpense {
    position: fixed;
    top: 0;
    right: 0;
    width: 85%;
    max-width: 350px;
    height: 100vh;
    background-color: var(--backgroundHeaderFooter);
    z-index: 999;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
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
    color: var(--textSecondairePlaceholder);
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
