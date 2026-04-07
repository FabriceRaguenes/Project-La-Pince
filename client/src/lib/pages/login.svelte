<script>
  import { auth } from "../services/auth.service";
  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  // Pour la redirection après login
  export let currentPage;
  export let isLoggedIn;

  async function handleLogin(event) {
    event.preventDefault();
    error = "";

    if (!email || !password) {
      error = "Veuillez remplir tous les champs";
      return;
    }

    try {
      loading = true;

      const response = await auth.login({ email, password });

      isLoggedIn = true;
      currentPage = "dashboard";
    } catch (err) {
      if (err.message == "Failed to fetch") {
        error = err.message;
        return error;
      }
      error = JSON.parse(err.message).message || "Erreur lors de la connexion";
      console.log(error);
    } finally {
      loading = false;
    }
  }
</script>

<main class="mainLogin">
  <h1>Connexion</h1>

  <form class="form" on:submit={handleLogin}>
    <div class="formGroup">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} />
    </div>

    <div class="formGroup">
      <label for="password">Mot de passe</label>
      <input type="password" id="password" bind:value={password} />
    </div>

    {#if error}
      <p style="color:red;">{error}</p>
    {/if}

    <button type="submit" class="btnConnect" disabled={loading}>
      {#if loading}Connexion...{:else}Se connecter{/if}
    </button>
  </form>
</main>
