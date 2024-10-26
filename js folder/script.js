// its make a favourites meal array if its not exist in local storage
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

async function refreshfav()
{
    document.getElementById("fav-list").style.display="block";
    document.getElementById("search").style.display="none";
    document.getElementById("display").innerHTML="";
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    for(let i in arr)
    {
        let meal=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${arr[i]}`).then(res=>res.json());
        let meals=meal.meals;
        showfav(meal);

    }

}
// fetching search bar
let search=document.getElementById('search');

// adding event listner for every input in search bar
search.addEventListener('input', async function(e){
    await clearDisplay();
    let x=search.value;
    if(x){
        let result=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${x}`)
        .then((res)=>res.json())
        .catch(function(err){
            console.log(err);
        })
    showMeal(result);

    }
    
})
// it shows all favourites meal
function showfav(result){
    let mealList=result.meals;
    if(mealList==null)
    {
        createDomNULL();
    }
    for ( meal of mealList ){
        createfav(meal);
    }
}
// creating dom for favourites meal
function createfav(meal){
    console.log(meal);
    let div=document.createElement("div")
    div.innerHTML=`<div><img src="${meal.strMealThumb}"></div>`
    div.classList.add("eachMeal");
    let details=document.createElement("div");
    details.innerHTML=`
    <h3>${meal.strMeal}</h3>
    <input type="button" value="View Recipe" onclick="showMealDetails(${meal.idMeal})">
    <input type="button" value="Remove Favourite" id="fav-${meal.idMeal}" onclick="addRemoveToFavList(${meal.idMeal});refreshfav()">
    `;
    details.classList.add('meal-details')
    div.append(details)
    document.getElementById("display").append(div)
}

// its show's all meals card in main acording to search input value
function showMeal(result){
    let mealList=result.meals;
    if(mealList==null)
    {
        createDomNULL();
    }
    for ( meal of mealList ){
        createDom(meal);
    }
}

// creating dom for all the meals fethced from api
function createDom(meal){
    console.log(meal);
    let div=document.createElement("div")
    div.innerHTML=`<div><img src="${meal.strMealThumb}"></div>`
    div.classList.add("eachMeal");
    let details=document.createElement("div");
    details.innerHTML=`
    <h3>${meal.strMeal}</h3>
    <input type="button" value="View Recipe" onclick="showMealDetails(${meal.idMeal})">
    <input type="button" value="Add Favourites" id="fav-${meal.idMeal}" onclick="addRemoveToFavList(${meal.idMeal})">
    `;
    details.classList.add('meal-details')
    div.append(details)
    document.getElementById("display").append(div)
}
// dom for no meal found
function createDomNULL(){
    let div=document.createElement('div');
    div.classList.add("found-none");
    div.innerHTML=`<h1>ERROR 404 : NO SUCH MEAL FOUND</h1>`;
    document.getElementById("display").append(div);

}
// clearing the display
function clearDisplay(){
    document.getElementById("display").innerHTML="";
}

// this takes id as input and show the meal
async function showMealDetails(idMeal){
    let container=document.getElementById("container");
    let meal=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`).then(res=>res.json());
    let meals=meal.meals;
    console.log(meals);

    container.innerHTML="";
    let html=`<div id="recipe-container">
    <div class="image-container">
    <img src="${meals[0].strMealThumb}" class="meal-image">
    <div>
    <h1>${meals[0].strMeal}</h1>
    <h3>Category:${meals[0].strCategory}</h3>
    <h3>Area:${meals[0].strArea}</h3>
    </div>
    </div>
    <h2>Instruction:</h2>
    <p>${meals[0].strInstructions}</p>

    <a href="${meals[0].strYoutube}" target="_blank">Watch Video</a>
        
    </div>`

    container.innerHTML=html;
}
// for the button add/remove favourites
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let a=`fav-${id}`;
        let b=document.getElementById(a);
        b.value="Add Favourites";
        b.style.backgroundColor="#404041";
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        let a=`fav-${id}`;
        let b=document.getElementById(a);
        b.value="Remove Favourite";
        b.style.backgroundColor="orangered";
        arr.push(id);
        alert("your meal add your favourites list");
        
    }
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    
}
