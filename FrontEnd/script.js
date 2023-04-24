/* récuperation des données et insertion des projets sur la page */

const gallery = document.querySelector(".gallery");
//on demande a l'API les données works
fetch("http://localhost:5678/api/works")
// on recupere les donnée en format.json
  .then(function (response) {
    return response.json();
  })
  // on traite les données
  .then(function (dataJson) {
    const projets = dataJson;
    projets.forEach((item) => {
      const projet = importProjet(
        item.imageUrl,
        item.title,
        item.category.name
      );
      gallery.appendChild(projet);
    });
  });

function importProjet(src, alt, categoryProjet) {

  const figures = document.createElement("figure");
  const image = document.createElement("img");
  const figCaption = document.createElement("figcaption");

  image.src = src;
  image.alt = alt;
  figCaption.textContent = alt;

  //figure.append(image,figCaption);
  figures.appendChild(image);
  figures.appendChild(figCaption);

  if (categoryProjet === "Objets") { figures.classList.add("objects");};
  if (categoryProjet === "Appartements") {figures.classList.add("appartments");};
  if (categoryProjet === "Hotels & restaurants") {figures.classList.add("hotels-restaurants");};
  figures.classList.add("all");

  return figures;
};

/**************   filtres   ******/

const allButton = document.querySelectorAll(".filters button");
allButton[0].classList.add("button-active");

allButton.forEach((button) => {
  button.addEventListener("click", () => {
    const className = button.classList[0];
    const allProjet = gallery.querySelectorAll(".all");

    //Parcourt chaque projet de la galerie
    allProjet.forEach((projet) => {
      if (projet.classList.contains(className)) {
        projet.style.display = "block";
      } else {
        projet.style.display = "none";
      }
    });

    allButton.forEach((b) => b.classList.remove("button-active"));
    button.classList.add("button-active");
/*  allButton.forEach((b) => b.classList.toggle("button-active" , b === button));  */

  });
});

//**********  arrivé sur le page une fois connecté *********/

const dataStorage = localStorage.getItem("token");
const logOut = document.querySelector(".logout");
const divModifier = document.querySelectorAll("a.modifier");
const divEdition = document.querySelector(".editionMode");
console.log ( divEdition);

if (dataStorage) { 
  //login devient logout
  logOut.textContent = "logout";
  //les filtres disparaissent
  allButton.forEach ( (button)=> {button.style.display = "none";});
  //la div edition mode en haut apparait
  divEdition.style.display ="flex";
  //les div modifier apparaissent
  divModifier.forEach ((div) => { 
  div.style.display ="flex";});

  //si on clik sur logout, localStorage efface le jeton,
  // et on renvoie sur la page index.html classique
  logOut.addEventListener("click", ()=>
    {
    localStorage.removeItem("token");
    logOut.href = "index.html" 
    })

}

