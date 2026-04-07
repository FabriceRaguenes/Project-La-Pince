<script>
  import { onMount } from "svelte";
  import DangerIcon from "../../../assets/icon/attentionSmall.png";

  export let message = "";
  export let category = "";
  //export let type = "warning"; // 'warning' ou 'danger'
  export let onRemove; // Fonction pour s'auto-supprimer
  export let color = "#555";

  onMount(() => {
    // La notification disparaît toute seule après 5 secondes
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  });
</script>

<div class="toast" on:click={onRemove}>
  <div class="text">
    <strong style="color: {color};">{category}</strong>
    <p>{message}</p>
  </div>
</div>

<style>
  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: var(--backgroundWarning);
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 10px;
    cursor: pointer;
    border-left: 6px solid;
    border-left-color: transparent;
    animation: slideIn 0.5s ease-out;
  }

  .text strong {
    display: block;
    font-size: 1.5rem;
    text-align: center;
  }
  .text p {
    margin: 0;
    font-size: 1rem;
    color: var(--textWarning);
    text-align: center;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
