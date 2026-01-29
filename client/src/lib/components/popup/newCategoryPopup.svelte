<script>
  import { auth } from "../../services/auth.service";
  import { categories } from "../../services/category.service.js";
  import { createEventDispatcher } from "svelte";

  export let currentPage;
  export let onClose = () => {};
  export let onCreated = () => {};

  let name = "";
  let max_budget = "";
  let color = "";
  let icon = "";

  let loading = false;
  let error = "";

  const dispatch = createEventDispatcher();

  const colors = [
    "#dd515a",
    "#ed7b2e",
    "#ffd037",
    "#91c13f",
    "#3d7fc0",
    "#7b59a0",
    "#eb4890",
    "#5d8fff",
    "#30c49e",
    "#ff6b3b",
    "#9e65e3",
    "#ffacae",
  ];

  const icons = [
    { url: "/assets/categoryIcons/bank.PNG" },
    { url: "/assets/categoryIcons/bolt.PNG" },
    { url: "/assets/categoryIcons/car.PNG" },
    { url: "/assets/categoryIcons/cart-plus.PNG" },
    { url: "/assets/categoryIcons/hospital.PNG" },
    { url: "/assets/categoryIcons/faucet-drip.PNG" },
    { url: "/assets/categoryIcons/gamepad.PNG" },
    { url: "/assets/categoryIcons/gas-pump.PNG" },
    { url: "/assets/categoryIcons/house.PNG" },
    { url: "/assets/categoryIcons/plane.PNG" },
    { url: "/assets/categoryIcons/pot-food.PNG" },
    { url: "/assets/categoryIcons/screwdriver-wrench.PNG" },
  ];

  function selectColor(hex) {
    color = hex;
  }

  function selectIcon(url) {
    icon = url;
  }

  async function submit() {
    try {
      error = "";

      const trimmed = name.trim();
      if (!trimmed) throw new Error("Le nom est obligatoire.");

      // accepte "60", "60.5", "60,5"
      const budget = Number(
        String(max_budget).replace(",", ".").replace("€", "").trim(),
      );
      if (!Number.isFinite(budget) || budget <= 0) {
        throw new Error("Le montant doit être un nombre > 0 (ex: 60.00).");
      }

      if (!color) throw new Error("Choisis une couleur.");
      if (!icon) throw new Error("Choisis une icône.");

      loading = true;

      // user_id obligatoire sur POST
      const me = await auth.me();

      await categories.create({
        name: trimmed,
        color,
        icon,
        max_budget: budget,
        user_id: 1,
      });

      dispatch("created");
      onClose?.();
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

    <h1>Création catégorie</h1>

    <form class="formNewCategory" on:submit|preventDefault={submit}>
      <div class="formGroup">
        <input
          type="text"
          id="libelle"
          placeholder="Nom de la dépense"
          bind:value={name}
        />
      </div>

      <div class="formGroup">
        <input
          type="text"
          id="montant"
          placeholder="Budget max (€)"
          bind:value={max_budget}
          inputmode="decimal"
        />
      </div>

      <div class="formGroup">
        <ul class="formGroupColor">
          {#each colors as c}
            <li
              style="background-color:{c}"
              class:selected={color === c}
              on:click={() => selectColor(c)}
              role="button"
              tabindex="0"
            />
          {/each}
        </ul>
      </div>

      <div class="formGroup">
        <ul class="formGroupIcon">
          {#each icons as it}
            <li
              class:selected={icon === it.url}
              on:click={() => selectIcon(it.url)}
              role="button"
              tabindex="0"
            >
              <img class="category_icon" src={it.url} alt="" />
            </li>
          {/each}
        </ul>
      </div>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <button type="submit" class="btn-ajouter" disabled={loading}>
        {loading ? "Ajout..." : "Ajouter"}
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
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
    margin-top: 30px;
  }

  .formNewCategory {
    display: flex;
    flex-direction: column;
    gap: 1em;
    flex: 1;
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

  .formGroup input {
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

  .formGroupColor {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    gap: 15px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .formGroupColor li {
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 6px;
  }

  .formGroupColor li.selected {
    outline: 2px solid var(--bouttonPrincipal);
    transform: scale(1.1);
  }

  .formGroupIcon {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .formGroupIcon li {
    background-color: var(--backgroundCarte);
    border: 2px solid var(--bordure);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 1em 0;
  }

  .category_icon {
    width: 70%;
    filter: brightness(2);
  }

  .formGroupIcon li.selected {
    border-color: var(--bouttonPrincipal);
  }

  .formGroupIcon i {
    font-size: 30px;
    color: var(--textPrincipal);
  }

  .btn-ajouter {
    cursor: pointer;
    background-color: var(--bouttonPrincipal);
    border: none;
    padding: 0.8em;
    color: var(--textBtn);
    border-radius: 5px;
    font-family: bouton, sans-serif;
    font-weight: bold;
    margin-top: 2em;
    width: 60%;
    align-self: center;
  }

  .btn-ajouter:hover {
    filter: brightness(0.9);
    background: var(--boutonPrinciaplHover);
  }

  .error {
    color: var(--red);
    text-align: center;
    margin-top: 0.25rem;
    font-family: text, sans-serif;
  }

  @media (max-width: 550px) {
    .formGroupIcon {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
