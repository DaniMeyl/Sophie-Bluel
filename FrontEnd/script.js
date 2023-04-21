/* récuperation des données et insertion des projets sur la page */

const gallery = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
  .then(function (response) {
    return response.json();
  })
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

/******   filtres   ******/

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
