const API = "https://hp-api.onrender.com/api/characters";

const conteneurPersonnages = document.querySelector(".characters");

// on garde les 20 personnages de cote dans un let pour pouvoir les filtrer ensuite
let tousLesPersonnages = [];

function afficherPersonnages(personnages) {
  conteneurPersonnages.innerHTML = personnages
    .map((personnage) => {
      // il est possible qu'un personnage n'ai pas de maison
      const maison = personnage.house ? personnage.house.toLowerCase() : "";

      // il est possbile qu'un personnage n'ai pas de photo, dans ce cas on met le logo.
      const image = personnage.image ? personnage.image : "./images/logo/logo.png";

      const nom = personnage.name ? personnage.name : "Nom inconu";

      return `
        <div class="${maison}">
          <img src="${image}" alt="${nom}" />
          <p>${nom}</p>
        </div>
      `;
    })
    .join("");
}

async function chargerPersonnages() {
  const reponse = await fetch(API);
  const donnees = await reponse.json();

  // 20 premiers personnags (de 0 a 20) 
  tousLesPersonnages = donnees.slice(0, 20);
  afficherPersonnages(tousLesPersonnages);
}

if (conteneurPersonnages) {
  chargerPersonnages();
}

function filtrerParMaison(maison) {
  const personnagesDeLaMaison = tousLesPersonnages
    .filter((personnage) => personnage.house === maison)
    .sort((a, b) => a.name.localeCompare(b.name));

  afficherPersonnages(personnagesDeLaMaison);
}

const maisons = document.querySelectorAll(".houses > div");

maisons.forEach((maison) => {
  maison.addEventListener("click", () => {
    filtrerParMaison(maison.dataset.house);
  });
});

const boutonMenu = document.querySelector(".header__left img");
const menu = document.querySelector(".header__left ul");

boutonMenu.addEventListener("click", () => {
  menu.classList.toggle("menu-ouvert");
});
