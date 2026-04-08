<script>
  import { onMount } from "svelte";
  import DonutChart from "../components/components/donutChart.svelte";
  import EditExpensePopup from "../components/popup/editExpenses.svelte";
  import NewExpensesPopup from "../components/popup/nexExpensesPopup.svelte";
  import Toast from "../components/popup/warningPopup.svelte";

  import { auth } from "../services/auth.service";
  import { categories as categoriesApi } from "../services/category.service";
  import { expenses as expensesApi } from "../services/expense.service";

  let loading = true;
  let error = "";
  let expensesList = [];
  let categoriesList = [];
  let categoriesById = new Map();
  let notifications = [];

  let open = false;
  export let currentPage;

  // recherche + filtres
  let search = "";
  let showFilters = false;
  let categoryId = "";
  let dateFrom = "";
  let dateTo = "";
  // import { auth } from "../services/auth.service";
  let userName = "";
  let userId = null;

  let listCategories = [];
  let totalAmount = 0;

  // On garde le calcul du total pour l'affichage en haut à gauche
  $: totalAmount = expensesList.reduce((sum, e) => sum + e.amount, 0);

  $: labels = categoriesList.map((cat) => cat.name);
  $: values = categoriesList.map((cat) => {
    const catExpenses = expensesList.filter(
      (e) => String(e.category_id) === String(cat.id),
    );
    const totalSpent = catExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    return totalSpent;
  });
  $: colors = categoriesList.map((cat) => cat.color);

  $: sortState = 0;

  let defaultGraphColor = colors == undefined ? "#559CD2" : colors[0];

  let openEdit = false;
  let editingExpense = null;

  function applyFilters() {}

  // supression d'une dépense
  async function handleDeleteExpense(id) {
    if (!confirm("Supprimer cette dépense ?")) return;

    try {
      error = "";
      await expensesApi.remove(id);
      await loadData();
    } catch (e) {
      error = e.message ?? "Erreur lors de la suppression";
    }

    async function loadCategories() {
      try {
        // On demande à l'API de nous donner la liste
        listCategories = await categoriesApi.list();
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    }
  }

  async function loadData() {
    try {
      loading = true;
      error = "";

      const [exp, cats] = await Promise.all([
        expensesApi.list(),
        categoriesApi.list(),
      ]);

      expensesList = (exp ?? []).map((e) => ({
        ...e,
        title: String(e.title ?? ""),
        amount: Number(String(e.amount).replace(",", ".")),
        date: String(e.date ?? "").slice(0, 10),
      }));

      categoriesList = cats ?? [];

      defaultGraphColor =
        categoriesList[0] != undefined ? categoriesList[0].color : "#559CD2";

      categoriesById = new Map(categoriesList.map((c) => [String(c.id), c]));
    } catch (e) {
      error = e.message ?? "Erreur API";
    } finally {
      loading = false;
    }
  }

  loadData();

  function formatDay(yyyyMmDd) {
    const d = new Date(yyyyMmDd);
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function expenseSort() {
    if (sortState === 1) {
      sortedExpenses = [...sortedExpenses].sort((a, b) => b.amount - a.amount);
    }

    if (sortState === 2) {
      sortedExpenses = [...sortedExpenses].sort((a, b) => a.amount - b.amount);
    }

    if (sortState === 0) {
      sortedExpenses = [...sortedExpenses].sort((a, b) =>
        String(b.date).localeCompare(String(a.date)),
      );
    }

    console.log(sortedExpenses);
  }

  function handleSort() {
    if (sortState < 2) {
      sortState++;
    } else {
      sortState = 0;
    }

    expenseSort(); // expenseSort is outside to be used by itself
  }

  // Filtrage
  $: filteredExpenses = expensesList.filter((e) => {
    const q = search.trim().toLowerCase();

    const matchSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      String(e.amount).includes(q.replace(",", "."));

    const matchCategory =
      !categoryId || String(e.category_id) === String(categoryId);

    const matchFrom = !dateFrom || e.date >= dateFrom;
    const matchTo = !dateTo || e.date <= dateTo;

    return matchSearch && matchCategory && matchFrom && matchTo;
  });

  function resetFilters() {
    search = "";
    categoryId = "";
    dateFrom = "";
    dateTo = "";
  }

  // tri du plus récent au plus ancien
  $: sortedExpenses = [...filteredExpenses].sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );

  // groupement par jour SANS limite
  $: groupedByDay = sortedExpenses.reduce((acc, e) => {
    const key = String(e.date).slice(0, 10);
    (acc[key] ||= []).push(e);
    return acc;
  }, {});

  // limite de 6 categorie sur le dashboard

  const MAX_CATEGORIES = 6;

  $: categoryTotals = categoriesList.map((cat) => {
    const totalSpent = expensesList
      .filter((e) => String(e.category_id) === String(cat.id))
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      ...cat,
      total_spent: totalSpent,
    };
  });

  $: topCategories = categoryTotals
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, MAX_CATEGORIES);

  // editExpense

  function openEditExpense(expense) {
    editingExpense = expense;
    openEdit = true;
  }
  // Fonction pour ajouter une notification sans doublon
  function addNotification(cat) {
    const id = cat.id;
    // On vérifie si une notification pour cette catégorie existe déjà
    if (!notifications.find((n) => n.id === id)) {
      const isOver = cat.total_spent >= cat.max_budget;

      notifications = [
        ...notifications,
        {
          id,
          category: cat.name,
          message: isOver ? "Budget dépassé !" : "Limite bientôt atteinte !",
          type: isOver ? "danger" : "warning",
          color: cat.color,
        },
      ];
    }
  }

  // Surveillance des catégories
  $: {
    categoryTotals.forEach((cat) => {
      if (
        Number(cat.max_budget) > 0 &&
        cat.total_spent >= Number(cat.max_budget) * 0.9
      ) {
        addNotification(cat);
      }
    });
  }

  function removeNotification(id) {
    notifications = notifications.filter((n) => n.id !== id);
  }

  async function handleExpenseSaved() {
    openEdit = false;
    editingExpense = null;
    await loadData();
  }

  // Fonction pour récupérer les infos de l'utilisateur connecté

  async function checkMe() {
    try {
      const me = await auth.me();

      // Stocker les infos de l'utilisateur
      userName = me.name || me.user?.name || "Utilisateur";
      userId = me.id || me.user?.id;
    } catch (err) {
      localStorage.removeItem("token");
      currentPage = "login";
    }
  }

  onMount(() => {
    checkMe();
  });
</script>

{#if open}
  <NewExpensesPopup
    {currentPage}
    onClose={() => (open = false)}
    on:saved={async () => {
      open = false;
      await loadData();
    }}
  />
{/if}

{#if openEdit}
  <EditExpensePopup
    expense={editingExpense}
    onClose={() => {
      openEdit = false;
      editingExpense = null;
    }}
    onSaved={handleExpenseSaved}
  />
{/if}

<main class="main">
  <!-- Left -->
  <section class="leftBlock">
    <h1>Tableau de bord</h1>

    <!-- Afficher le nom de l'utilisateur si disponible -->

    <section class="expensesTotalLeft">
      <p class="expenseTitle">Dépenses totales mensuelles</p>
      <span class="expense">
        <p><strong>{totalAmount.toFixed(2).replace(".", ",")} €</strong></p>
      </span>
    </section>

    <section class="search">
      <div class="searchBar">
        <button
          class="searchBtn"
          on:click={() => (showFilters = !showFilters)}
          aria-expanded={showFilters}
        >
          <i class="fa-solid fa-sliders"></i>
        </button>

        <div class="searchBarMiddle">
          <label for="searchBar" class="srOnly">Recherche</label>
          <input
            type="text"
            id="searchBar"
            placeholder="Rechercher ..."
            bind:value={search}
            on:keydown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        {#if sortState === 0}
          <button aria-label="sort" class="searchBtn" on:click={handleSort}>
            <i class="fa-solid fa-filter"></i>
          </button>
        {:else if sortState === 1}
          <button aria-label="sort" class="searchBtn" on:click={handleSort}>
            <i class="fa-solid fa-arrow-down-wide-short"></i>
          </button>
        {:else if sortState === 2}
          <button aria-label="sort" class="searchBtn" on:click={handleSort}>
            <i class="fa-solid fa-arrow-down-short-wide"></i>
          </button>
        {/if}
      </div>

      <div class="addExpense">
        <button
          class="btn"
          on:click={() => {
            if (categoriesList.length !== 0) {
              open = !open;
            } else {
              alert(
                "Veuillez créer au moins une dépense/catégorie pour afficher le graphique !",
              );
            }
          }}
          aria-label="Ajouter une dépense"
        >
          <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
        </button>
      </div>

      <!--  panneau qui apparaît sous la barre -->
      {#if showFilters}
        <div class="filtersPanel" on:click|stopPropagation>
          <div class="filtersRow">
            <div class="field">
              <label for="cat">Catégorie</label>
              <select id="cat" bind:value={categoryId}>
                <option value="">Toutes</option>
                {#each categoriesList as c (c.id)}
                  <option value={c.id}>{c.name}</option>
                {/each}
              </select>
            </div>

            <div class="field">
              <label for="from">Du</label>
              <input id="from" type="date" bind:value={dateFrom} />
            </div>

            <div class="field">
              <label for="to">Au</label>
              <input id="to" type="date" bind:value={dateTo} />
            </div>
          </div>

          <div class="filtersActions">
            <button type="button" class="btnSecondary" on:click={resetFilters}
              >Réinitialiser</button
            >
          </div>
        </div>
      {/if}
      {#if search.trim() || categoryId || dateFrom || dateTo}{/if}
    </section>

    <section class="expensesDetailed">
      {#if sortState !== 0}
        {#each sortedExpenses as e}
          {@const cat = categoriesById.get(String(e.category_id))}

          <div
            class="resultRow expenseRow"
            style="--cat-color: {cat?.color || '#555'}"
          >
            <div class="resultLeft">
              {#if cat}
                <img
                  class="miniIcon"
                  src={cat.icon}
                  alt={cat.name}
                  width="34"
                  height="34"
                />
              {/if}

              <span class="resultTitle">{e.title}</span>
            </div>
            <div class="amountDashboard">
              <span class="resultAmount">{Number(e.amount).toFixed(2)} €</span>
            </div>

            <div class="btnEdit">
              <button
                class="editBtn"
                title="Modifier"
                on:click={() => openEditExpense(e)}
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>

              <button
                class="deleteBtn"
                title="Supprimer"
                on:click={() => handleDeleteExpense(e.id)}
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        {/each}
      {:else}
        {#each Object.entries(groupedByDay) as [day, items]}
          <p class="date">{formatDay(day)}</p>

          {#each items as e (e.id)}
            {@const cat = categoriesById.get(String(e.category_id))}

            <div
              class="resultRow expenseRow"
              style="--cat-color: {cat?.color || '#555'}"
            >
              <div class="resultLeft">
                {#if cat}
                  <img
                    class="miniIcon"
                    src={cat.icon}
                    alt={cat.name}
                    width="34"
                    height="34"
                  />
                {/if}

                <span class="resultTitle">{e.title}</span>
              </div>
              <div class="amountDashboard">
                <span class="resultAmount">{Number(e.amount).toFixed(2)} €</span
                >
              </div>

              <div class="btnEdit">
                <button
                  class="editBtn"
                  title="Modifier"
                  on:click={() => openEditExpense(e)}
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button
                  class="deleteBtn"
                  title="Supprimer"
                  on:click={() => handleDeleteExpense(e.id)}
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          {/each}
        {/each}
      {/if}
    </section>
  </section>

  <div class="toast-container">
    {#each notifications as n (n.id)}
      <Toast
        category={n.category}
        message={n.message}
        type={n.type}
        color={n.color}
        onRemove={() => removeNotification(n.id)}
      />
    {/each}
  </div>

  <!-- Expenses -->
  <!-- Right -->
  <section class="rightBlock">
    <section class="expensesTotalRight">
      <p class="expenseTitle">Dépenses totales mensuelles</p>
      <span class="expense">
        <p><strong>{totalAmount.toFixed(2).replace(".", ",")} €</strong></p>
      </span>
    </section>

    <!-- Diagrame -->
    <section class="diagrame">
      {#if expensesList.length > 0}
        {#key labels}
          <DonutChart {labels} {values} {colors} />
        {/key}
      {:else}
        <p class="graphe-warning">
          Veuillez ajouter au moins une catégorie et une dépense pour afficher
          le graphique !
          <DonutChart
            labels={[labels[0]]}
            values={[0.1]}
            colors={[defaultGraphColor]}
          />
        </p>
      {/if}
    </section>

    <!-- -- -->
    <section class="categoryDetailed">
      {#each topCategories as cat (cat.id)}
        <div class="categoryDescription" style="--bg-color: {cat.color};">
          <span>
            <img src={cat.icon} alt="" width="32" height="32" />
          </span>

          <p class="nameCategory"><strong>{cat.name}</strong></p>

          <p class="sum">
            <span class="resultAmount">
              {Number(cat.total_spent).toFixed(2)} €
            </span>
          </p>

          <p class="sum">
            <span class="total">
              / {Number(cat.max_budget).toFixed(2)} €
            </span>
          </p>
        </div>
      {/each}
    </section>
  </section>
</main>
