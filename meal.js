const submit= document.getElementById('submit');
const search= document.getElementById('search');
const resultHeading= document.getElementsByClassName('result-heading');
const mealEl= document.getElementById('meals');
const random= document.getElementById('random');
const single_mealEl= document.getElementById('single-meal');


//search meal

function searchMeal(e){
    e.preventDefault();

// clear singal meal

single_mealEl.innerHTML="";

//get search meal
const term = search.value;

// check for empty
if(term.trim()){
    fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    )
    .then((res) => res.json())
    .then((data) => {

        resultHeading.innerHTML = `<h2> Search Result for ${term}`;

        if(data.meals === null){
            resultHeading.innerHTML =`<h2> there is no result for  ${term}`;
        }else{
            mealEl.innerHTML= data.meals.map(
                (meal) => `
                <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3> ${meal.strMeal}</h3>
                </div>
                
                `
            )
            .join("");
        }
    });
  }else{
    alert("please insert a value in search");
  }
}


// random meal

function randomMeal(){
    mealEl.innerHTML="";
    resultHeading.innerHTML="";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`) 
    .then((res) => res.json())
    .then((data) =>{ 
    const meal= data.meals[0];
    addMealToDom(meal);
});
}

// get fetch meal by id


function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`

    )
    .then((res) => res.json())
    .then((data) =>{
        console.log(data);
        const meal=data.meals[0];
        addMealToDom(meal);
    });
}

// function add meal to dom

function addMealToDom(meal){
    const ingredients= [];
     for(let i=0;i<20;i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(
                `${meal[`strInstruction${i}`]} - ${
                meal[`strMeasure${i}`]
            }`);
        }else{
            break;
        }
     }

     single_mealEl.innerHTML=`
     <div class="single-meal">
     <h1> ${meal.strMeal}</h1>
     <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
     <div class="single-meal-info">
     ${meal.strCategory ? `<p>${meal.strCategory}</p>` :''}
     ${meal.strArea ? `<p>${meal.strArea}</p>` :''}
     </div>
     <div class="main">
     <p> ${meal.strInstructions}</p>
     <h2> Ingredients </h2> 
     <ul>
     ${ingredients.map( ing => `<li>${ing}</li>`).join('')}
     </div>
     `

}

// add event listener
random.addEventListener('click', randomMeal);
submit.addEventListener('submit', searchMeal);
mealEl.addEventListener('click', e=> {
    const mealInfo=e.path.find(item =>{
        if(item.classList){
            return item.classList.contains("meal-info")
        }else{
            return false;
        }
    });
    if(mealInfo){
        const mealID = mealInfo.getAttribute("data-mealid");
        getMealById(mealID);
    }
    
});
