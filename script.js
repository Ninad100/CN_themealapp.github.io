
const test1 = document.getElementById('next-btn-cara');

//Following timer is used for the Carasoul. I used the fixed carasoul. By clicking on it it should change.
//But to make it automatic I added click event. Now at every 2 seconds the slide changes.
const timer1 = setInterval(()=>{
    test1.click();
},2000);


let favoriteSecFlag = false;

// These are the different div elements extracted from the HTML to use dom manipulations
const searchInput = document.getElementById('Search-bar-input');
const searchBarDiv = document.getElementById('search-bar');
const card = document.createElement('div');

const topSection = document.getElementById('top-section');
const mainContent = document.getElementById('main-content');
const mainPageFavBtn = document.getElementById('fav');
const searchResultDiv = document.getElementById('search-container');
const favContainer = document.getElementById('fav-container');
const homeBtn = document.getElementById('home');
const searchBtnTop = document.getElementById('Search-button-top');
const criteriaDiv = document.getElementById('Criteria');
const contactSecDiv = document.getElementById('contact-section');


//This set is used to store the Favorite items. Set is used to avoid duplicacy.
const favorites = new Set();

//This function will fetch the JSON details on which our website is built.
async function getDetails(){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s');
    const dataSet = await response.json();
    console.log(dataSet);

    searchInput.addEventListener('input',()=>{
        dataSet.meals.forEach((ele) => {
            favoriteSecFlag = false;
            if(searchInput.value == ''){
                card.textContent = '';
                card.style.backgroundColor = 'unset';
                card.style = 'unset';
            }
            else if (searchInput.value.toLowerCase() == ele.strMeal.toLowerCase()){
                //console.log('success');
                //Function utilized to display the suggestions.
                displaySuggestion(ele);
            }
            
            
            
        });
    });
//Event listner for search the item.
    searchBtnTop.addEventListener('click',()=>{
        dataSet.meals.forEach((ele) => {
            favoriteSecFlag = false;

            if(searchInput.value == ''){
                card.textContent = '';
                card.style.backgroundColor = 'unset';
                card.style = 'unset';
            }
            else if (searchInput.value == ele.strMeal){
                //console.log('success');
                //The function used for the display when the item is searched.
                displayFromSearch(ele);
            }
            
            
            
        });
    });
}

getDetails();

//Function to display the suggestions while searching.
function displaySuggestion(ele){


    card.textContent = ele.strMeal;
    card.style.padding = '5px';
    card.style.border = 'outset';
    card.style.borderBottomLeftRadius = '10%';
    card.style.backgroundColor = 'lightgrey';
    card.style.borderBlockColor = 'blue';
    card.style.borderColor = 'black';
    card.style.width = '74%';
    card.style.marginTop = '-3%';
    searchBarDiv.appendChild(card);

    card.addEventListener('click',()=>{
       // favoriteSecFlag = false;
        favContainer.style.display = 'none';
        //Function to display if we click on suggestion
        displayFromSearch(ele);
    })



}


//Function to display the item which is searched. Bootstrap Modal is used.
//Use of Bootstrap is allowed as per question details.
function displayFromSearch(ele){
    //favoriteSecFlag = false;
    card.textContent = '';
    card.style.backgroundColor = 'unset';
    card.style = 'unset';
    const foodCard = `
    <h3 id='Searched-Result-Note'>Searched Results </h3>
    <div id="food-card">
                        <div id="Food-item">
                            <div>
                                <img src=${ele.strMealThumb} id="food-thumnail">
                            </div>
                            <div>
                                <h3>${ele.strMeal}</h3>
                                <div>
                                    <button id="add-fav-btn">Add to Favorites</button>
                                </div>
                            </div>
                        </div>  
                        <div id="more-details">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        More Details
                      </button>
                      
                      <!-- Modal -->
                      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable modal-lg">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <h4> Meal Name: ${ele.strMeal} </h4>
                              <h4> Instructions: </h4> <p> ${ele.strInstructions} </p>
                              <h4> Source:</h4> <p>  ${ele.strSource} </p>
                              <h4> Youtube Link:</h4> <p>  ${ele.strYoutube} </p>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                        </div>

                    </div>`
    
   // mainContent.textContent = '';
    //mainContent.appendChild(searchedNote);
    mainContent.style.display = 'none';

    criteriaDiv.style.display = 'none';

    contactSecDiv.style.display = 'none';
    
    searchResultDiv.style.display ='block';
    
    searchResultDiv.innerHTML = foodCard;

    const addFavBtn = document.getElementById('add-fav-btn');

    //Event listner for adding item to favorites list
    addFavBtn.addEventListener('click',()=>{
        //favoriteSecFlag = false;
        favorites.add(ele);
        //To retain the data local storage is used.
        localStorage.setItem(ele.strMeal,ele.strMeal);
        console.log(favorites);
    })

    
}

//Event listener to display the section of favorite items.
mainPageFavBtn.addEventListener('click',async ()=>{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s');
    const fixedData = await response.json();
    //mainContent.textContent = '';
    //mainContent.appendChild(searchedNote);
    searchResultDiv.style.display = 'none';
    mainContent.style.display = 'none';
    criteriaDiv.style.display = 'none';
    contactSecDiv.style.display = 'none';
    //console.log('fixedData');
    //console.log(fixedData);
    favContainer.innerHTML = '';
    let i =0
    fixedData.meals.forEach((item)=>{
        let tempData = localStorage.getItem(item.strMeal);
        if (tempData){
            //Each favorite is displayed here and event listener is added separately below.
            displayFavorites(item,tempData,i);
            i++
            
        }
        
    });
    //Event listeners are added below. LightBox Animation is used.
    fixedData.meals.forEach((item)=>{
        let tempData = localStorage.getItem(item.strMeal);
        if (tempData){
            let mealNameid = `meal-name-${tempData}`;
            let animBox = `lightbox${tempData}`;
            let animBoxObj = document.getElementById(animBox);
            let anchorloc = `light${tempData}`
            console.log(tempData)
            console.log(`meal-name-${tempData}`)
            let closecross = `lightcross${tempData}`
            const closecrossObj = document.getElementById(closecross);
            let mealobj = document.getElementById(mealNameid);
            const anchor1 = document.getElementById(anchorloc);
            /*animBoxObj.target.style.height = '30%';
            animBoxObj.target.style.width = '30%';
            animBoxObj.target.style.top = '25%';
            animBoxObj.target.style.right = '25%';
            animBox.target.style.backgroundColor = 'lightgrey';*/

            const temoMealName = document.createElement('h4');
            temoMealName.textContent = tempData;
            mealobj.append(temoMealName);
            const horizontalLine = document.createElement('hr');
            horizontalLine.style.marginRight = '20px';
            mealobj.appendChild(horizontalLine);
            const instructionsDiv = document.createElement('div');
            const instructionsDetails = document.createElement('div');
            const instructionTitle = document.createElement('h4');
            instructionsDetails.textContent = item.strInstructions;
            instructionTitle.textContent = 'Instructions';
            instructionsDiv.appendChild(instructionTitle);
            //instructionsDiv.style.fontWeight = '900';
            instructionsDiv.style.fontWeight = '300';
            instructionsDiv.appendChild(instructionsDetails)
            const horizontalLine2 = document.createElement('hr');
            mealobj.appendChild(instructionsDiv);
            mealobj.appendChild(horizontalLine2);

            const YoutubeLink = document.createElement('div');
            const linktitle = document.createElement('span');
            linktitle.textContent = 'Youtube Link: ';
            linktitle.style.fontWeight = '900';
            YoutubeLink.appendChild(linktitle);
            const linkurl = document.createElement('a');
            linkurl.textContent = item.strYoutube;
            YoutubeLink.appendChild(linkurl);
            mealobj.appendChild(YoutubeLink);

            //Light Box Animation is used.
            anchor1.addEventListener('click',()=>{
            animBoxObj.style.height = '60%';
            animBoxObj.style.width = '80%';
            animBoxObj.style.top = '25%';
            animBoxObj.style.right = '15%';
            animBoxObj.style.backgroundColor = 'lightgrey';
            animBoxObj.style.boxShadow = '0px 0px 6px 6px rgb(82, 1, 1)';
            });

            closecrossObj.addEventListener('click',()=>{
            animBoxObj.style.height = '0';
            animBoxObj.style.width = '0';
            animBoxObj.style.top = '0';
            animBoxObj.style.left = '0';
            animBoxObj.style.position = 'fixed';
            animBoxObj.style.transition = 'all 0.05s ease-in-out';
            animBoxObj.style.overflow = 'scroll';
            })
        }
        
    });    

});

//Event listener for home button
homeBtn.addEventListener('click',()=>{
    //favoriteSecFlag = true;
    searchResultDiv.style.display = 'none';
    favContainer.style.display = 'none';
    mainContent.style.display = 'block';
    criteriaDiv.style.display = 'block';
    contactSecDiv.style.display = 'block';
});


//Function to display the Favorite section
async function displayFavorites(item,tempData,i){
    
    let meal = item.strMeal;
    let meal1 = encodeURIComponent(meal);
    console.log(item)
    let href1 = `#${item.strMeal}`;
    console.log(href1)
    let id1 = `${item.strMeal}`
    console.log(id1);
    if (tempData == item.strMeal){
    const favSectionCard = `<div id="food-card">
        <div id="Food-item">
            <div>
                <img src=${item.strMealThumb} id="food-thumnail">
            </div>
            <div>
                <h3 id='meal-name-id'>${item.strMeal}</h3>
                <div>
                    <button id="remove-fav-btn" style='width=10px;' onclick= removeFav('${meal1}')>Remove from Favorites</button>
                </div>
            </div>
        </div>  
        <div id="more-details">
        <div>
        <a href="#lightbox${item.strMeal}" id='light${item.strMeal}'> More Details </a>
    </div>

    <div id="lightbox${item.strMeal}"  style='height:0; width:0; position:fixed;top:0;left:5%;overflow:scroll;transition:all 0.05s ease-in-out;'>

        <a href="#" id='lightcross${item.strMeal}'> <i class="fa-regular fa-rectangle-xmark fa-xl"></i> </a>
        <ul class="horizontal-list text-center nav-menu">
        <div id='meal-name-${item.strMeal}'>
        </div>

    </div>
        </div>
    <hr>
    `;
    //Remove from Fav code

    

    
    
    favContainer.style.display = 'block';
    //const elementFav = document.getElementById('food-card');
    favContainer.innerHTML += favSectionCard;
    const removeFav = document.getElementById('remove-fav-btn');
    
    }

}

//Function to remove the item from Favorite section.
function removeFav(str1){
    let str2 = decodeURIComponent(str1)
    //console.log('inside')
    let tempfav = localStorage.getItem(str2);
    if (tempfav != undefined){
       // console.log('inside if')
        localStorage.removeItem(str2);
    }
}


