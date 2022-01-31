const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.getElementById('meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

//event listener
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
  mealDetailsContent.parentElement.classList.remove('showRecipe');
});

//get meal list that matches with the ingredients
function getMealList(){
  let searchInputTxt = document.getElementById('search-input').value.trim();
  console.log(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data =>{
      let html = "";
      if(data.meals){
        data.meals.forEach(meal => {
          html += `<div class="meal-item" data-id="${meal.idMeal}">
                      <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                      </div>
                      <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                      </div>
                    </div>`;
        });
        mealList.classList.remove('notFound');
      }
      else {
        html = "Sorry, there's no meal matching your ingredients!";
        mealList.classList.add('notFound');
      }

      mealList.innerHTML = html;
    });
}

// Get the recipe details of the meal
function getMealRecipe(e){
  e.preventDefault();
  if(e.target.classList.contains('recipe-btn')){
    let mealItem = e.target.parentElement.parentElement;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data => mealRecipeModal(data.meals));
  }
}

//create a modal
function mealRecipeModal(meal){
  meal = meal[0];
  var ingredients = [];
  for (var i = 1; i <= 20; i++) {
    console.log(eval(`meal.strIngredient${i}`));
    if(eval(`meal.strIngredient${i}`)){
      ingredients.push(eval(`meal.strIngredient${i}`) + " " + eval(`meal.strMeasure${i}`))
    }
  }
  var li = "";
  for (i = 0; i < ingredients.length; i++) {
    li += `<li>${ingredients[i]}</li>`;
  }
  let html = `<h2  class="recipe-title">${meal.strMeal}</h2>
              <p class="recipe-category">${meal.strCategory}</p>
              <div class="recipe-ingredients">
                <h3>Ingredients</h3>
                <ul>`
                +li
                +`</ul>
                </div>
              <div class="recipe-instructions">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
                </div>
              <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="food">
              </div>
              <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Full Recipe</a>
              </div>`;


    html = html.replace(/(\r\n)/g, '<br>');
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
