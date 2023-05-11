const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imgContainer = document.querySelector('.images-container')
const saveConfirm = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')

//NASA API
const count = 10;
const apiKey = '2eP7XfvWUS5KZfShZzwfa1aUrx4fVOCdd4YMexx4';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let imagesArray = []
let favouriteObj = {}

function showContent(page){
    window.scrollTo({top: 0, behaviour: 'instant'})
    if (page === 'results') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')
    } else {
        resultsNav.classList.add('hidden')
        favoritesNav.classList.remove('hidden')
    }
   loader.classList.add('hidden')
}

function createDOMNodes(page){
    const currentArray = page === 'results' ? imagesArray : Object.values(favouriteObj);
    currentArray.forEach((result) =>{
        //Creating The Card Div
       const card = document.createElement('div')
       card.classList.add('card')
       //Creating The Link
       const a = document.createElement('a')
       a.href = result.hdurl
       a.title = 'View Full Image'
       //Creating The Img
       const img = document.createElement('img')
       img.src = result.url
       img.alt = 'Image'
       img.classList.add('card-img-top')
       
       //Creating The Card Body
       const cardBody = document.createElement('div')
       cardBody.classList.add('card-body')
       //Name For The Picture
       const heading = document.createElement('h5')
       heading.classList.add('card-title')
       heading.textContent = result.title
       // For Add To Favourite
       const favourite = document.createElement('p')
       favourite.classList.add('clickable')
       if (page === 'results'){
        favourite.textContent = 'Add To Favourites'
        favourite.setAttribute('onclick', `addToFavourite('${result.url}')`)
       } else {
        favourite.textContent = 'Remove Favourite'
        favourite.setAttribute('onclick', `removeFavourite('${result.url}')`)
       }

       //For card text
       const cardText = document.createElement('p')
       cardText.classList.add('card-text')
       cardText.textContent = result.explanation
       //For footer
       const footer = document.createElement('small')
       footer.classList.add('text-muted')
       //For Date
       const date = document.createElement('strong')
       date.textContent = result.date
       //For Copyright info
       const copyrightInfo = document.createElement('span')
       if (result.copyright){
           copyrightInfo.textContent = `  ${result.copyright}`
       } else {
           copyrightInfo.textContent = ''
       }
   
       footer.append(date, copyrightInfo)
       a.append(img)
       cardBody.append(heading, favourite, cardText, footer)
       card.append(a,cardBody)
       imgContainer.appendChild(card)
   })
}

function updateDOM(page){
    imgContainer.textContent = ''
    if (localStorage.getItem('nasaFavourites')){
        favouriteObj = JSON.parse(localStorage.getItem('nasaFavourites'))
        console.log('FROM LOCAL STORAGE ', favouriteObj)
    }
   createDOMNodes(page)
   showContent(page)
   
}

//Fetching 10 Images From The Api
async function getPhotos(){
    loader.classList.remove('hidden')

    try{
        const response = await fetch(apiUrl);
        imagesArray = await response.json();
        console.log(imagesArray);
        updateDOM('results')
    } catch (error){
        console.log(error);
    }
}

//Add To Favourites
function addToFavourite(itemUrl){
    imagesArray.forEach((image) => {
        if (image.url.includes(itemUrl) && !favouriteObj[itemUrl]){
            favouriteObj[itemUrl] = image
            saveConfirm.hidden = false
            //The save Confirmed To POP Up
            setTimeout(function(){
                saveConfirm.hidden = true
            }, 2000)
        }
    })
    localStorage.setItem('nasaFavourites', JSON.stringify(favouriteObj))
}

function removeFavourite(itemUrl){
    if (favouriteObj[itemUrl]){
        delete favouriteObj[itemUrl]
        //Updating The Local Storage
        localStorage.setItem('nasaFavourites', json.stringify(favouriteObj))
        updateDOM('favourites')
        console.log(favouriteObj)
    }
}

//Onload
getPhotos();