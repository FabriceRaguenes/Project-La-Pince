<script>
  import { auth } from "../services/auth.service";

  let pseudo = "";
  let email = "";
  let password = "";
  let mentions = false;
  let error = "";
  let loading = false;

  export let currentPage;
  export let isLoggedIn;

  async function handleSubmit(event) {
    event.preventDefault(); // bloque le submit HTML

    // vérif de base
    if (!mentions) {
      error = "Veuillez accepter les mentions légales";
      return;
    }
    if (!pseudo || !email || !password) {
      error = "Veuillez remplir tous les champs";
      return;
    }

    try {
      loading = true;
      error = "";

      // appel l'api pour créer le compte
      const response = await auth.register({
        name: pseudo,
        email,
        password,
      });

      // Mettre à jour l'état de connexion
      isLoggedIn = true;

      // Rediriger vers le dashboard
      currentPage = "dashboard";
    } catch (err) {
      if (err.message == "Failed to fetch"){
        error = err.message;
        return error;
      }
      error = JSON.parse(err.message).message || "Erreur lors de la connexion";
      if(error.startsWith("ValidationError: \"name\"")){
        error = "Username must contains at least 3 characters";
        return error;
      }
      if(error.startsWith("ValidationError: \"email\"")){
        error = "Invalid email format";
        return error;
      }
      if(error.startsWith("ValidationError: \"password\"")){
        error = "Password must contains at least one lowercase, one uppercase, one number and one special (! @ # $ & * _ -)";
        return error;
      }
      return error;
    } finally {
      loading = false;
    }
  }
  
</script>

<main>
  <h1>Inscription</h1>

  <!-- le on:submit doit être sur le <form> -->
  <form class="form" on:submit={handleSubmit}>
    <div class="formGroup">
      <label for="pseudo">Nom / Pseudo</label>
      <input id="pseudo" type="text" bind:value={pseudo} />
    </div>

    <div class="formGroup">
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} />
    </div>

    <div class="formGroup">
      <label for="password">Mot de passe</label>
      <input id="password" type="password" bind:value={password} />
    </div>

    <div class="checkBoxGroup">
      <input id="mentions" type="checkbox" bind:checked={mentions} />
      <label for="mentions">J'ai lu et j'accepte les mentions légales</label>
    </div>

    <button type="submit" class="submitBtn">S'inscrire</button>
  </form>

  {#if error}
    <p style="color:red">{error}</p>
  {/if}
</main>
