/********* récuperation des données et insertion des projets sur la page ********************/


//on pointe la gallerie pour y ajouter les projets ensuite
const gallery = document.querySelector(".gallery");

const getWorks = (id) => {console.log(id);
//on demande a l'API les données works
fetch("http://localhost:5678/api/works")
// on recupere les donnée en format.json
  .then(function (response) {
    return response.json();
  })
  // on traite les données
  .then(function (dataJson) {  console.log(dataJson);
    
    let dataForGallery = [];
    if (id === 0){dataForGallery = dataJson}
    else { //console.log("je suis dans le else", dataJson.length)
      for (let i=0 ; i<dataJson.length ; i++){
        //console.log(dataJson[i].categoryId);
        if ( id === dataJson[i].categoryId){ 
          dataForGallery.push(dataJson[i])
        }
      }
    } 
    //on ajoute les projets dans la gallerie
    //console.log(dataForGallery);
    addWorksGallery(dataForGallery);

    const buttons = document.getElementsByClassName("btn");
    for ( let i = 0 ; i<buttons.length ; i++) {
      if( parseInt(buttons[i].id )=== id) {
        buttons[i].classList.add("button-active")
      }
      else {
        buttons[i].classList.remove("button-active")
        }
    }
    //on ajoute tous les projets dans la modal edition
    AddWorksGalleryModale(dataJson);   
    })
    .catch (()=>{console.log("Une erreur s'est produite lors de la recuperation des données")});
  }
 getWorks(0);


function addWorksGallery (data) {
 
//Pour supprimer ce qu'il y avait avant
  let child = gallery.lastElementChild;
  while (child) {
    gallery.removeChild(child);
    child = gallery.lastElementChild;
  }
  data.forEach(element => {
    // console.log(element.imageUrl, element.title);
    const figure = `<figure id=${element.id}Gallery>
    <img src=${element.imageUrl} alt=${element.title}>
    <figcaption>${element.title}</figcaption>
  </figure>`
    gallery.innerHTML += figure
    // gallery.innerHTML = figure + gallery.innerHTML
    console.log(gallery.innerHTML);
});

}

/***********  creation bouton ****************************************************************/

const allButton = document.querySelector(".filters");
//on demande a l'API les données de categorie
const getCategories = () => {
  fetch("http://localhost:5678/api/categories")
  .then(function (response) {
    return response.json();
  })
  .then(function (dataCategories) {
    // on crée les bouttons
    addButton(dataCategories)
  })
  .catch(()=>{console.log("erreur lors de la recuperation des categories ")});

function addButton(categories) {
  categories.push({id:0 , name: "Tous"});
  categories.sort((a,b) => a.id - b.id); // b - a for reverse sort
  
    categories.forEach((categorie) => {
      const button = document.createElement("button");
     
      if ( categorie.id === 0) {
        button.className = "button-active btn";
       }
       else {
        button.className = "btn";
       }
      button.id=categorie.id;
      button.innerHTML = categorie.name
    
      button.addEventListener( "click" , () =>filtres(categorie.id))
      allButton.appendChild(button);
  
    });
  }
}
  
getCategories();


function filtres (id){
  getWorks(id)
}

//**********  arrivé sur la page une fois connecté *********/

const dataStorage = localStorage.getItem("token");
const logOut = document.querySelector(".logout");
const buttonFiltres = document.querySelector(".filters")
const divModifier = document.querySelectorAll("button.modifier");
const divEdition = document.querySelector(".editionMode");
const modal = document.querySelector("#modal");
modal.style.display ="none"

if (dataStorage) { 
  //login devient logout
  logOut.textContent = "logout";
  //les filtres disparaissent
  buttonFiltres.style.display = "none";
  //la gallery descend de 90px car coller au titre projet maintenant
  gallery.style = "margin-top: 90px;"
  //la div mode edition  apparait en haut
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
/********************** ouverture/fermeture Modal 1 et 2  *********************************/

//clik sur modifier => ouvre la modal
const buttonModifier = document.querySelector("#button-modifier");
buttonModifier.addEventListener("click", () => { modal.style.display = "block"; 
modal2.style.display="none";} );

//clik sur les croix => ferme la modal
const closeModal = document.querySelectorAll(".close-modal");
closeModal.forEach((divmodal)=>{
  divmodal.addEventListener("click", ()=>{
     modal.style.display ="none"});})

//clik en dehors de la modal, ferme les modal

modal.addEventListener('click', (event) => {
  if (event.target.id === "modal" ) {
      modal.style.display="none";
  }
});
//clik pr ouverture modal2, fermeture modal1
const modal1 = document.querySelector("#divModal");
const modal2 = document.querySelector(".divModal2");
const openModal2 = document.querySelector(".button-addpicture");

openModal2.addEventListener("click", () =>{
  modal1.style.display = "none";
  modal2.style.display = "flex";
});

//clik sur arrowback pr revenir à la modal 1
const arrowBack = document.querySelector(".arrowback");
arrowBack.addEventListener("click", () => {
  modal1.style.display = "flex";
  modal2.style.display = "none";
})



/******************* ajout/suppression dans la modal 1 ****************/

// Injecter les projets dans la modal 1
const modalGallery = document.querySelector(".modal-gallery");

function AddWorksGalleryModale(data) {
  var child = modalGallery.lastElementChild;
  while (child) {
    modalGallery.removeChild(child);
    child = modalGallery.lastElementChild;
  }
        //console.log(modalGallery);
        

    data.forEach(element => {
        // console.log(element.imageUrl, element.title);
        const figure = `<figure id="${element.id}Modal" class="figure-modal">
                
        <img class="trash-icon" id="${element.id}" src="./assets/icons/trash-icon.svg" alt="">
				<img class="img-modal" src=${element.imageUrl} alt=${element.title}>
				<figcaption class="figcaption-modal">éditer</figcaption>
			</figure>` ;
        modalGallery.innerHTML += figure;
        
    }); 

    

   //Suppression projet

    const trashWork= document.querySelectorAll(".trash-icon");
    const token = localStorage.token;
    
    trashWork.forEach(element => {
          element.addEventListener("click", () => {
          /* Suppression projet de l'API )*/
            fetch(`http://localhost:5678/api/works/${element.id}`, {
              method: "DELETE",
              headers: {
                  accept: "*/*",
                  Authorization: `Bearer ${token}`
              }
           })
           .then (()=> { getWorks(0);})
           .catch (()=>{console.log("une erreur s'est produite")});

          });      
    });  
}


//********    modal 2: ajouter des projets ***********/

const addPicModal = document.querySelector(".input-addpic")
const previewImg = document.querySelector(".import-pictures")
const addTitle = document.querySelector(".title")
const addCategory = document.querySelector(".category")
const Submit = document.querySelector(".valider")
const msgError = document.querySelector(".msg-error")
const form = document.querySelector(".formmodal2")
console.log(form)


function addWork() {
    // Ajout images
    addPicModal.addEventListener("input", (e) => {
        console.log(addPicModal.files[0]);
        imgPreview = e.target.files[0];
        const img = URL.createObjectURL(addPicModal.files[0]);
        //console.log(img)
        previewImg.src = img;
        previewImg.style.setProperty("visibility", "visible");
    });

    //Titre
    addTitle.addEventListener("input", (e) => {
        inputTitle = e.target.value;
        //console.log(inputTitle)

    });
    //Catégories
    addCategory.addEventListener("input", (e) => {
        inputCategory = e.target.selectedIndex;
        //console.log(inputCategory)
    });

    // Si tout les elements sont remplies alors changements couleurs boutons 
    form.addEventListener("change", () => {
        if (imgPreview !== "" && inputTitle !== "" && inputCategory !== "") {
            Submit.style.background = "#1D6154";
            Submit.style.cursor = "pointer";
        }
        else {
            Submit.style.backgroundColor = ''; // Réinitialise la couleur par défaut du bouton
        }
    });


    //Submit
    Submit.addEventListener("click", (e) => {
        e.preventDefault();console.log(addTitle.value.type);
        if (imgPreview.type == "image/png" && inputTitle && inputCategory) {
            const formData = new FormData();
            console.log(imgPreview, inputTitle, inputCategory);
            formData.append("image", imgPreview);
            formData.append("title", inputTitle);
            formData.append("category", inputCategory);
            console.log(formData);

            fetchDataSubmit()
           function fetchDataSubmit() {
                
                    // Fetch ajout des travaux
                    
                  fetch("http://localhost:5678/api/works", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.token}`,
                        },
                        body: formData,
                    })
                  .then( ()=>  {
                    msgError.style.color = "#1D6154";
                    Submit.style.background = "#1D6154"

                    //Clear les galleries
                    gallery.innerHTML = "";
                    //puis remettre la gallerie uploader
                    getWorks(0);
                    
                    previewImg.style.setProperty("visibility", "hidden");
                    inputTilte = "";
                    inputCategory = "";
                    //modalGallery.style.setProperty("display", "grid");
                    setTimeout(() => {
                        msgError.innerText = "";
                    }, 4000);
                  })
                .catch ((error)=> {
                    console.log("Il y a eu une erreur sur le Fetch: " + error)
                });
            }
            modal1.style.display = "flex";
            modal2.style.display = "none";
            addTitle.value = "";
            addCategory.value = 0 ;

        } else {
            msgError.innerText = "Veuillez remplir tous les champs et/ou respectez le format image jpg ou png";
            msgError.style.color = "red";
            msgError.style.marginBottom = "30px";
            console.log(previewImg);
            if (previewImg !== ""){previewImg.style.setProperty("visibility", "hidden");}
            setTimeout(() => {
                msgError.innerText = "";
            }, 4000);
            console.log("Tous les champs ne sont pas remplis !");
        }
        
    });
}



addWork();



