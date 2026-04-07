<script>
  import { onMount } from "svelte";

  import NewCategoryPopup from "../components/popup/newCategoryPopup.svelte";
  import EditCategoryPopup from "../components/popup/editCategorie.svelte";

  import { categories as categoriesApi } from "../services/category.service";
  import { expenses as expensesApi } from "../services/expense.service";

  let openEdit = false;
  let editingCategory = null;
  let open = false;
  let currentPage = "category";

  let expensesList = [];
  let categories = [];
  let loading = true;
  let error = "";

  function openEditPopup(cat) {
    open = false;
    editingCategory = cat;
    openEdit = true;
  }

  async function loadData() {
    try {
      loading = true;
      error = "";

      const [cats, exps] = await Promise.all([
        categoriesApi.list(),
        expensesApi.list(),
      ]);

      categories = cats ?? [];
      expensesList = (exps ?? []).map((e) => ({
        ...e,
        amount: Number(String(e.amount).replace(",", ".")),
      }));
    } catch (e) {
      error = e.message ?? "Erreur API";
    } finally {
      loading = false;
    }
  }

  onMount(loadData);

  // total dépensé par catégorie
  $: categoriesWithTotals = categories.map((c) => {
    const totalSpent = expensesList
      .filter((e) => String(e.category_id) === String(c.id))
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return { ...c, total_spent: totalSpent };
  });

  // tri décroissant (plus dépensé en premier)
  $: sortedCategories = [...categoriesWithTotals].sort(
    (a, b) => b.total_spent - a.total_spent,
  );

  async function handleSaved() {
    openEdit = false;
    editingCategory = null;
    await loadData();
  }

  async function handleCreated() {
    open = false;
    await loadData();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await categoriesApi.remove(id);
      await loadData();
    } catch (e) {
      error = e.message ?? "Erreur suppression";
    }
  }
</script>

{#if open}
  <NewCategoryPopup
    {currentPage}
    onClose={() => (open = false)}
    on:created={handleCreated}
  />
{/if}

{#if openEdit}
  <EditCategoryPopup
    category={editingCategory}
    onClose={() => {
      openEdit = false;
      editingCategory = null;
    }}
    onSaved={handleSaved}
  />
{/if}

<main>
  <h1>Catégorie</h1>

  <div class="nav">
    <button class="addBtn" on:click={() => (open = true)}>Ajouter</button>
  </div>

  {#if loading}
    <p>Chargement...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <section class="categoryDetail">
      {#each sortedCategories as c (c.id)}
        <section class="categoryCard">
          <div class="categoryDescription" style="background-color: {c.color}">
            <span class="icon">
              <img src={c.icon} alt="" width="32" height="32" />
            </span>

            <span class="name">
              <p class="nameCategory"><strong>{c.name}</strong></p>
            </span>

            <span class="budget">
              <p class="sum">
                <strong>
                  {c.total_spent.toFixed(2).replace(".", ",")} € /
                  <span class="total">
                    {Number(c.max_budget).toFixed(2).replace(".", ",")} €
                  </span>
                </strong>
              </p>
            </span>

            <div class="edit">
              <button
                class="editBtn"
                title="Modifier"
                on:click={() => openEditPopup(c)}
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>

              <button
                class="deleteBtn"
                title="Supprimer"
                on:click={() => handleDelete(c.id)}
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </section>
      {/each}
    </section>
  {/if}
</main>

<!-- coe -->
