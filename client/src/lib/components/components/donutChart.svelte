<script>
  import { onMount, onDestroy } from "svelte";
  // On utilise "auto" pour éviter les erreurs d'enregistrement de contrôleurs
  import Chart from "chart.js/auto";

  export let labels = [];
  export let values = [];
  export let colors = [];

  let canvas;
  let chart;

  // Fonction pour mettre à jour le graphique sans le recréer entièrement
  function updateChart() {
    if (!chart) return;

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;

    // Si on a des couleurs, on les met, sinon on met du gris par sécurité
    if (colors && colors.length > 0) {
      chart.data.datasets[0].backgroundColor = colors;
    } else {
      chart.data.datasets[0].backgroundColor = ["#cccccc"];
    }

    chart.update();
  }

  onMount(() => {
    // Sécurité : si le canvas n'existe pas, on arrête tout
    if (!canvas) return;

    chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            borderWidth: 0,
            // Couleur par défaut au chargement pour éviter le crash
            backgroundColor: colors && colors.length > 0 ? colors : ["#e5e7eb"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }, // Réactivé pour voir les montants au survol
        },
      },
    });
  });

  // Réactivité : dès que labels, values ou colors changent, on met à jour
  $: if (chart && labels.length > 0) updateChart();

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="chartBox">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chartBox {
    height: 300px;
    margin: 3em 0;
  }
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
