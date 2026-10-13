const API = "https://hp-api.onrender.com/api/characters";

const conteneurPersonnages = document.querySelector(".characters");

// on garde les personnages de cote dans un let pour pouvoir les filtrer ensuite
let tousLesPersonnages = [];

function afficherPersonnages(personnages) {
  conteneurPersonnages.innerHTML = personnages
    .map((personnage) => {
      // il est possible qu'un personnage n'ai pas de maison
      const maison = personnage.house ? personnage.house.toLowerCase() : "";

      // il est possbile qu'un personnage n'ai pas de photo, dans ce cas on met le logo.
      const image = personnage.image ? personnage.image : "./images/tk78.webp";

      const nom = personnage.name ? personnage.name : "Nom inconu";

      return `
        <div class="${maison}">
          <a href="details.html?id=${personnage.id}">
            <img src="${image}" alt="${nom}" />
            <p>${nom}</p>
          </a>
        </div>
      `;
    })
    .join("");
}

async function chargerPersonnages() {
  const reponse = await fetch(API);
  const donnees = await reponse.json();

  // on affiche tous les personnages de l'API
  tousLesPersonnages = donnees;
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

// page de detail 

const titrePersonnage = document.querySelector(".page_perso h3");
const fichePersonnage = document.querySelector(".perso");
const blasonMaison = document.querySelector(".house__perso");

function ligne(libelle, valeur) {
  return `
    <div>
      <p>${libelle}</p>
      <p class="attr">${valeur ? valeur : "-"}</p>
    </div>
  `;
}

function afficherFiche(personnage) {
  const image = personnage.image ? personnage.image : "./images/tk78.webp";
  const mort = personnage.alive ? "" : "mort";
  const surnoms = personnage.alternate_names.join(", ");

  titrePersonnage.textContent = personnage.name;

  fichePersonnage.innerHTML = `
    <figure class="perso__left">
      <img class="${mort}" src="${image}" alt="${personnage.name}" />
      <figcaption>${personnage.actor ? personnage.actor : "Acteur inconnu"}</figcaption>
    </figure>
    <div class="perso__right">
      ${ligne("Gender", personnage.gender)}
      ${ligne("Eye", personnage.eyeColour)}
      ${ligne("Hair", personnage.hairColour)}
      ${ligne("Date of birth", personnage.dateOfBirth)}
      ${ligne("Patronus", personnage.patronus)}
      ${ligne("Nicknames", surnoms)}
    </div>
  `;

  // affiche blason que si on connait la maison du personnage
  if (personnage.house) {
    blasonMaison.innerHTML = `<img src="./images/logo/${personnage.house}.png" alt="Blason de ${personnage.house}" />`;
  }
}

async function chargerFiche() {
  const parametres = new URLSearchParams(window.location.search);
  const id = parametres.get("id");

  const reponse = await fetch(API);
  const donnees = await reponse.json();

  const personnage = donnees.find((p) => p.id === id);

  if (personnage) {
    afficherFiche(personnage);
  } else {
    titrePersonnage.textContent = "Personnage introuvable";
  }
}

if (fichePersonnage) {
  chargerFiche();
}
