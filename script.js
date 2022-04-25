const mealsEl=document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

//Search Term Ids
const searchTerm= document.getElementById('search-term');
const searchBtn= document.getElementById('search');


//Random Meal Calling Logic
getRandomMeal();
//Favourite Meal Calling
fetchFavMeals();

//Random Meal Function
async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();  //Forgot to add - Mistake took
    const randomMeal = respData.meals[0];
    // console.log(randomMeal);
    addMeal(randomMeal, true); //Call this is from another function
};

//Get Meal By ID Function
async function getMealById(id) {
    
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
    
    const respData = await resp.json();  // .then((resp) => resp.json());
    const meal = respData.meals[0];

    return meal;
};

//Get Meals By Search
async function getMealsBySearch(term) {
    
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
     
    const respData = await resp.json();
    const meals = respData.meals;
    // console.log(meals);
    return meals;
};

//// Add Meal Logic
function addMeal(mealData, random = false) {
    console.log(mealData); //To see the data in console

    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
        <div class="meal-header">
            ${
                random
                    ? `
            <span class="random"> Random Recipe </span>`
                    : ""
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
        // //Clean the container
        // favoriteContainer.innerHTML = "";
        fetchFavMeals()
    });

    meal.addEventListener("click", () => {  //Remove
        showMealInfo(mealData);             //Remove
    });                                     //Remove

     mealsEl.appendChild(meal);
};

//Adding Meal to Local Storage Function
function addMealLS(mealId) {
    const mealIds = getMealsLS();
    if(mealIds.length) {
    localStorage.setItem('mealIds', JSON.stringify([...mealIds,mealId]));           //Just use this remoce if and else stament code
    } else {
        localStorage.setItem('mealIds', JSON.stringify([mealId]));
    }   
};

//Removing Meal from Local Storage
function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id!== mealId)));
};

//Get Meal from Local Storage
function getMealsLS() {
      const mealIds = JSON.parse(localStorage.getItem('mealIds'));
      
      return mealIds === null ? [] : mealIds;
};

//Favourite Meal Logic
async function fetchFavMeals() {
     //Clean the container
    //  favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();
    
    for(let i=0; i < mealIds.length; i++){
        const mealId = mealIds[i];
        
        meal = await getMealById(mealId);
        addMealFav(meal);
    }
    // console.log(meals);

    //add them to the screen   
}


//Add Random Meal to Favourites Logic
function addMealFav(mealData) {

    // console.log(mealData);

    const favMeal = document.createElement('li');
    

    favMeal.innerHTML = ` 
    <img 
        src="${mealData.strMealThumb}" 
        alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear">  </button>  

    `;
//Forgot to give the class='clear' so that 
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click',()=>{
        removeMealLS(mealData.idMeal);

        fetchFavMeals();

    });

    favMeal.addEventListener("click", () => {
        showMealInfo(mealData);
    });
     
    favoriteContainer.appendChild(favMeal);   //Forgot to call this one
};

//Meal InFo Logic
function showMealInfo(mealData) {
// clean it up
mealInfoEl.innerHTML = "";

// update the Meal info
const mealEl = document.createElement("div");

const ingredients = [];

// get ingredients and measures
for (let i = 1; i <= 20; i++) {
     if (mealData["strIngredient" + i]) {
        ingredients.push(`${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`
            );
        } else {
            break;
        }
    }

mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
                .map(
                    (ing) => `
            <li>${ing}</li>
            `
                )
                .join("")}
        </ul>
    `;

    mealInfoEl.appendChild(mealEl);


// show the popup
    mealPopup.classList.remove("hidden");
}


//Search Button
searchBtn.addEventListener('click', async ()=>{
    //Clean Container
    mealsEl.innerHTML = "";

    const search = searchTerm.value;
    
    const meals = await getMealsBySearch(search);

    if(meals){
        meals.forEach((meal)=>{
            addMeal(meal);
        })
    }
});

//Pop-Up Logic
popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Mistakes Took
//1.Forgot to give the class="clear" in addMealFav() button 149 line so that thr error is --- Uncaught (in promise) TypeError: Cannot read properties of null (reading 'addEventListener')
    // at addMealFav (script.js:155:9)
    // at fetchFavMeals (script.js:128:9) 
