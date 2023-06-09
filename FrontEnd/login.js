// si jeton d'acces , pas possible d'aller sur la page login
const token= localStorage.getItem("token");
if (token ){window.location.href = "index.html";}


const formLogin = document.querySelector("#formLogin");

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = formLogin.email.value;
  const password = formLogin.password.value;
  //Envoie une requête POST à l'API pour se connecter, avec l'URL de l'API
  //et les options de la requête définies comme arguments.
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //Convertit l'e-mail et le mot de passe en objet JSON et les inclut dans le corps de la requête.
    body: JSON.stringify({ email, password }),
  })
    //Convertit la réponse HTTP en objet JSON pour être manipulée plus facilement.
    .then((response) => response.json())
    .then((data) => {
      //Vérifie si la réponse de l'API contient un jeton d'accès.
      if (data.token) {
        //Enregistre le jeton d'accès dans le stockage local du navigateur.
        localStorage.setItem("token", data.token);
        //Redirige l'utilisateur vers la page d'accueil.
        window.location.href = "index.html";
      } else {
        alert( "Erreur dans l’identifiant ou le mot de passe");
      }
    });
});