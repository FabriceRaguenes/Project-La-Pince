<script>
  import student from "../../assets/logo/etudiant.png";
  import family from "../../assets/logo/famille.png";
  import independant from "../../assets/logo/independant.png";
</script>

<main class="homeMain">
  <h1 class="headline">Reprenez le contrôle de votre budget !</h1>
  <p class="textHeadline">Que vous soyez étudiant, en famille ou indépendant, notre application vous accompagne pour un meilleur contrôle de vos finances et une tranquillité d’esprit retrouvée.</p>

  <section class="targets">
    <div class="target">
      <img src={student} alt="Etudiant" />
    </div>

    <div class="target">
      <img src={family} alt="Avatar d'une famille" />
    </div>

    <div class="target">
      <img src={independant} alt="Avatar d'un independant" />
    </div>
  </section>

  <section class="services">
    <div class="serviceDesc">
      <h2 class="titleHome">Suivez vos dépenses</h2>
      <p class="serviceCard">Visualisez vos dépenses en un seul coup d'oeil. Catégorisez vos achats, repérez vos habitudes de consommation et détectez rapidement les postes où vous pouvez économiser. Notre tableau de bord intuitif vous permet de filtrer par date, catégorie ou montant afin de prendre des décisions éclairées sur votre budget</p>
    </div>

    <div class="serviceDesc">
      <h2 class="titleHome">Gérez vos budgets</h2>
      <p class="serviceCard"> Fixez des limites pour chaque catégorie de dépenses et recevez des alertes si vous dépassez votre budget. Planifiez vos dépenses mensuelles et atteignez vos objectifs financiers sans stress. Notre système flexible vous permet de modifier vos budgets à tout moment et de suivre l’évolution de vos économies en temps réel.
      </p>
    </div>

    <div class="serviceDesc">
      <h2 class="titleHome">Recevez des alertes</h2>
      <p class="serviceCard"> Ne ratez plus aucune échéance grâce à nos notifications automatiques. Soyez informé dès que vous approchez de vos limites. Ces alertes vous aident à garder le contrôle, à éviter les découverts et à mieux planifier vos finances.</p>
    </div>
  </section>
</main>
