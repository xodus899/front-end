const modalDiv = document.querySelector(".modal");
const modalInnerDiv = document.querySelector(".modal-inner");
const allRecipiesDiv = document.querySelector(".all-recipies");
const eachRecipieDiv = document.querySelector(".rp-title");


const getAllRecipies = () => {
  let allRecipies;
  let specials;
  fetch('http://localhost:3001/recipes')
      .then((response) => {
          if (!response.ok) {
              throw new Error('Network response was not valid');
          }
          return response.json();
      })
      .then((data) => {

          // Cache the data to a variable /recipies
          allrecipies = data;
          // Make another API call and pass it into the stream

          return fetch('http://localhost:3001/specials');
      }).then((response) => {
          if (!response.ok) {
              throw new Error('Network response was not valid');
          }
          return response.json();
      }).then((data) => {

          // Cache the data to a variable specials call
          specials = data;

          allrecipies.forEach((recipie) => {

              const eachRecipieDiv = document.createElement("div");
              eachRecipieDiv.classList.add("each-recipie");
              eachRecipieDiv.insertAdjacentHTML("afterbegin", `
              <h1 class="rp-title">${recipie.title}</h1>
              <img src=public${recipie.images.medium} alt="${recipie.title}">
              <p>${recipie.description}</p>
              <a class="read-more" href="#">Let's Cook...</a>`);

              allRecipiesDiv.append(eachRecipieDiv);
              specials.forEach((specialId) => {
                  recipie.ingredients.forEach((ingredient) => {
                      if (specialId.ingredientId === ingredient.uuid) {

                          const letsCook = document.querySelectorAll("a.read-more");
                          letsCook.forEach((recipieButton) => {
                              recipieButton.addEventListener("click", (event) => {
                                  event.preventDefault();
                                  if (event.currentTarget.closest("div").querySelector(".rp-title").outerText === recipie.title) {
                                      modalInnerDiv.innerHTML = `<h2 class="inner-modal-title">${recipie.title}</h2> <span class="close"> X </span>
                                      <img src=public${recipie.images.full} alt="${recipie.title}">
                                      <p class="inner-description">${recipie.description}</p>
                                      <p>Prep Time: ${recipie.prepTime}</p>
                                      <p>Cook Time: ${recipie.cookTime}</p>
                                      <p>Servings: ${recipie.servings}</p>
                                      <ul>${recipie.ingredients.map((eachIngredient) => {return (`<li>${eachIngredient.amount} ${eachIngredient.measurement} ${eachIngredient.name}</li>`)}).join(" ") }</ul>
                                      <hr>
                                      <ol>${recipie.directions.map((eachDirection) => {return ( `<li>${eachDirection.instructions}</li>`)}).join("") }</ol>
                                      <div class="coupon">
                                        <p>Special ${specialId.type} Deal: ${specialId.title}</p>
                                        <p>${specialId.text}</p>
                                      </div>
                                      `;
                                      modalDiv.classList.add("open");
                                      document.body.classList.add("fixed");
                                  };
                              });
                          });
                      };
                  });
              });
          });

      }).catch((error) => {
          console.error('An error has occured', error);
      });
}

const closeModal = (event) => {
  const isOutSide = event.target.closest(".modal-inner");
  const x = event.target.tagName.toLowerCase() === 'span'
  if (!isOutSide || x) {
      modalDiv.classList.remove("open");
      document.body.classList.remove("fixed");
  }
};

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
      modalDiv.classList.remove("open");
      document.body.classList.remove("fixed");
  }
});

getAllRecipies();

modalDiv.addEventListener("click", closeModal);