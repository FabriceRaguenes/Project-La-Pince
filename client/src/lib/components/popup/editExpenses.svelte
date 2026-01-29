<script>
  import { expenses as expensesApi } from "../../services/expense.service";
  import { categories as categoriesApi } from "../../services/category.service";

  export let onClose = () => {};
  export let onSaved = () => {};
  export let expense = null;

  let title = "";
  let amount = "";
  let category_id = 0;
  let categoriesList = [];
  let loading = false;
  let error = "";

  // Charger les catégories au montage
  async function loadCategories() {
    try {
      categoriesList = await categoriesApi.list();
    } catch (e) {
      console.error("Erreur chargement catégories :", e);
    }
  }

  loadCategories();

  // Pré-remplissage quand la dépense arrive
  $: if (expense) {
    title = expense.title ?? "";
    amount = String(expense.amount ?? "");
    category_id = expense.category_id;
  }

  async function submit() {
    try {
      error = "";
      if (!expense?.id) {
        throw new Error("Dépense introuvable.");
      }
      const trimmed = title.trim();
      if (!trimmed) {
        throw new Error("Le libellé est obligatoire.");
      }
      const parsedAmount = Number(
        String(amount).replace(",", ".").replace("€", "").trim(),
      );
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Le montant doit être un nombre > 0 (ex: 60.00).");
      }
      if (!category_id) {
        throw new Error("La catégorie est obligatoire.");
      }

      loading = true;
      await expensesApi.update(expense.id, {
        title: trimmed,
        amount: parsedAmount,
        category_id: category_id,
      });

      onSaved();
      onClose();
    } catch (e) {
      error = e.message ?? "Erreur inconnue";
    } finally {
      loading = false;
    }
  }
</script>

<div class="overlay" on:click={onClose} role="button" tabindex="0"></div>

<aside class="sidebar">
  <main class="sidebarCategory" on:click|stopPropagation>
    <a class="close" href="/" on:click|preventDefault={onClose}>
      <i class="fa-solid fa-xmark"></i>
    </a>

    <h1>Édition de dépense</h1>

    <form class="formNewCategory" on:submit|preventDefault={submit}>
      <div class="formGroup">
        <label for="title">Libellé</label>
        <input
          id="title"
          type="text"
          placeholder="Facture EDF"
          bind:value={title}
        />
      </div>

      <div class="formGroup">
        <label for="amount">Montant</label>
        <input
          id="amount"
          type="text"
          placeholder="60.00"
          bind:value={amount}
          inputmode="decimal"
        />
      </div>

      <div class="formGroup">
        <label for="category">Catégorie</label>
        <select id="category" bind:value={category_id} required>
          {#each categoriesList as cat (cat.id)}
              <option value={cat.id}>{cat.name}</option>
          {/each}
        </select>
      </div>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <button type="submit" class="btn-ajouter" disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  </main>
</aside>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay);
    z-index: 998;
  }

  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 85%;
    max-width: 350px;
    height: 100vh;
    background-color: var(--backgroundHeaderFooter);
    z-index: 999;
    box-shadow: -4px 0 15px #00000080;
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

  main.sidebarCategory {
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .close {
    position: absolute;
    top: 20px;
    right: 10px;
    cursor: pointer;
    text-decoration: none;
  }

  .close i {
    color: var(--textSecondairePlaceholder);
    font-size: 24px;
  }

  h1 {
    color: var(--textPrincipal);
    font-family: title, sans-serif;
    text-align: center;
    padding: 1em 0 0.5em 0;
    font-size: 1.5em;
    margin: 30px 0 40px 0;
  }

  .formNewCategory {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .formGroup {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .formGroup label {
    font-size: 0.9rem;
    color: var(--textPrincipal);
    font-family: text, sans-serif;
    padding-left: 0.3em;
  }

  .formGroup input,
  #category {
    width: 100%;
    padding: 0.8em;
    background-color: var(--backgroundListe);
    border: 1px solid var(--bordure);
    color: var(--textSecondairePlaceholder);
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .formGroup input:hover,
  .formGroup input:focus {
    border-color: var(--bouttonPrincipal);
    outline: none;
  }

  .btn-ajouter {
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

  .btn-ajouter:hover {
    filter: brightness(0.9);
  }

  .error {
    color: var(--red);
    text-align: center;
    margin-top: 0.25rem;
    font-family: text, sans-serif;
  }
</style>
