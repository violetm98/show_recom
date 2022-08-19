const wrapElement = document.querySelector('#card_wrap');
const dislikeElement = document.querySelector(".dislike");
const likeElement = document.querySelector(".like");


const API_KEY = "98325a9d3ed3ec225e41ccc4d360c817";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
//discover all shows on netflix
const discoverURL = "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&with_networks=213&api_key=" + API_KEY;
let IMDB_id = "";
let totalPages = 0;
let genreString = "";
let first_air_date = "";
let renderedList = [];
var likedTVList = JSON.parse(localStorage.getItem("likedTVList"))? JSON.parse(localStorage.getItem("likedTVList")):[];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function trimString(word) {

    const maxLength = 300 // maximum number of characters to extract
    let trimmedString = word.substring(0, maxLength)
    if (word.length > trimmedString.length) {

        //re-trim if we are in the middle of a word and 
        trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    }
    return trimmedString + "...";
}

function getGenreName(genres) {

    if (genres != null && genres.length != 0) {
        genreString = genres[0].name;
    }

    return genreString;
}

async function renderCard() {
    const tv = await getRandomTV();
    if (tv.poster_path === null) {
        return renderCard();
    }
    
    const tvElement = document.createElement('div');
    tvElement.setAttribute('class', 'main_card');
    genreString = tv.genres ? getGenreName(tv.genres) : "";
    first_air_date = tv.first_air_date? tv.first_air_date : "";
    
    IMDB_id = await getIMDbID(tv.id);
    console.log(IMDB_id)
    const cardTemplate = `
        
            <div class="card_left">
                <div class="card_datails">
                    <h1>${tv.name}</h1>
                    <div class="card_cat">
                        <p class="score">${tv.vote_average.toFixed(1)}</p>
                        <p class="date">${first_air_date}</p>
                        <p class="genre">${genreString}</p>
                        <p class="time">${tv.number_of_seasons} season(s)</p>
                    </div>
                    <p class="disc">${trimString(tv.overview)}</p>
                    <a href='https://www.imdb.com/title/${IMDB_id}/' target="_blank">Read More</a>
                    <div class="social-btn">
                        <a href=${tv.homepage}><button>WATCH IT!</button></a>  
        
                    </div>
                </div>
            </div>
            <div class="card_right">
                <div class="img_container">
                    <img src=${IMAGE_URL + tv.poster_path} alt="" />
                </div>
            </div>
        
        
    `
    tvElement.innerHTML = cardTemplate;
    wrapElement.appendChild(tvElement);
    renderedList.push(tv);
    return tv;

}

function generateURL(path) {
    const url = `https://api.themoviedb.org/3${path}?api_key=${API_KEY}&language=en-US`;
    return url;
}

async function getTotalPages() {
   return fetch(discoverURL)
        .then(res => res.json())
        .then(data => {

            return totalPages = data.total_pages;

        })
        .catch(err => console.log(err));
    
}

async function getRandomTV() {
    totalPages = await getTotalPages();

    const randomPage = getRandomInt(totalPages) + 1;
    const reqURL = discoverURL + "&page=" + randomPage;
    await fetch(reqURL)
        .then(res => res.json())
        .then(data => {
            const resultsLength = data.results.length;
            const randomResult = getRandomInt(resultsLength);
            randomTV = data.results[randomResult];
            tvID = randomTV.id;
        })
        .catch(err => console.log(err));

    const path = `/tv/${tvID}`;
    const newURL = generateURL(path);
    await fetch(newURL)
        .then(res => res.json())
        .then(data => {
            randomTV = data;
        })
        .catch(err => console.log(err));
    return randomTV;
}



dislikeElement.onclick = function (event) {
    hideIcon();
    wrapElement.innerHTML = "";
    event.preventDefault();
    main();
}


likeElement.onclick = function (event) {
    likedTVList.push(renderedList[renderedList.length - 1]);
    hideIcon();
    wrapElement.innerHTML = "";
    event.preventDefault();
    main();
    //store the liked TV in local storage so we can render them in the favorite page.
    localStorage.setItem("likedTVList", JSON.stringify(likedTVList))
    
    
    
}


async function getIMDbID(tvID) {
    const path = `/tv/${tvID}/external_ids`;
    const idURL = generateURL(path);

    return fetch(idURL)
    .then(res=> res.json())
    .then(data=> {
        return IMDB = data.imdb_id;
        
    })
    .catch(err=> console.log(err));
    

}






async function main() {
    await renderCard();
    appearIcon();
    
};

function appearIcon() {
    likeElement.classList.remove("hidden");
    dislikeElement.classList.remove("hidden");
}
function hideIcon() {
    likeElement.classList.add("hidden");
    dislikeElement.classList.add("hidden");
}

main();

