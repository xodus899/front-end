const modalDiv = document.querySelector(".modal");
let allRecipes;

const getResponse = (response) => {
  if (!response.ok) {
    throw new Error('Network response was not valid');
  }
  return response.json();
}

const getRecipeData = (data) => {
  allRecipes = data.recipes;
  showOnHomePage(allRecipes);
  return fetch('http://localhost:3001/specials');

}

const getSpecialsData = (data) => {
  const specials = data.specials;
  showFullRecipe(specials);
};

const showOnHomePage = (eachRecipe) => {
  const allRecipeDiv = document.querySelector(".all-recipes");
  const eachRecipeDiv = document.querySelector(".rp-title");
  eachRecipe.forEach((recipe) => {

    const eachRecipeDiv = document.createElement("div");
    eachRecipeDiv.classList.add("each-recipe");
    eachRecipeDiv.insertAdjacentHTML("afterbegin", `
    <h1 class="rp-title">${recipe.title}</h1>
    <img src=public${recipe.images.medium} alt="${recipe.title}">
    <p>${recipe.description}</p>
    <a class="read-more" href="#">Let's Cook...</a>`);

    allRecipeDiv.append(eachRecipeDiv);
  });
}

const showFullRecipe = (specials) => {
  const modalInnerDiv = document.querySelector(".modal-inner");

  specials.forEach((specialId) => {
    allRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (specialId.ingredientId === ingredient.uuid) {

          const letsCook = document.querySelectorAll("a.read-more");
          letsCook.forEach((recipeButton) => {
            recipeButton.addEventListener("click", (event) => {
              event.preventDefault();
              if (event.currentTarget.closest("div").querySelector(".rp-title").outerText === recipe.title) {
                modalInnerDiv.innerHTML = `<h2 class="inner-modal-title">${recipe.title}</h2> <span class="close"> X </span>
                      <img src=public${recipe.images.full} alt="${recipe.title}">
                      <p class="inner-description">${recipe.description}</p>
                      <p>Prep Time: ${recipe.prepTime}</p>
                      <p>Cook Time: ${recipe.cookTime}</p>
                      <p>Servings: ${recipe.servings}</p>
                      <ul>${recipe.ingredients.map((eachIngredient) => {return (`<li>${!eachIngredient.amount? "":eachIngredient.amount} ${eachIngredient.measurement} ${eachIngredient.name}</li>`)}).join(" ") }</ul>
                      <hr>
                      <ol>${recipe.directions.map((eachDirection) => {return ( `<li>${eachDirection.instructions}</li>`)}).join("") }</ol>
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
}

const returnError = (error) => {
  throw new Error(error);
}

const getAllRecipes = () => {
  fetch('http://localhost:3001/recipes')
    .then((getResponse))
    .then(getRecipeData)

    .then((getResponse))
    .then((getSpecialsData))
    .catch((returnError))
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

getAllRecipes();

modalDiv.addEventListener("click", closeModal);
