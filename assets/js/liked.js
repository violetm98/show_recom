
const likedTVList = JSON.parse(localStorage.getItem("likedTVList"))
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const galleryElement = document.querySelector(".liked-gallery-container");
const clearElement = document.querySelector(".clear-content")

function createSection(tv){
    const cardElement = document.createElement("div");
    cardElement.setAttribute('class', 'card_item');
    console.log(tv.id);
    const template = `
    <a href=${tv.homepage}><img src=${IMAGE_URL + tv.poster_path} alt="" /></a>
    
    `
    console.log(IMAGE_URL)
    cardElement.innerHTML = template;
    galleryElement.appendChild(cardElement) ;

}




console.log((likedTVList))
likedTVList.forEach(likedTV => createSection(likedTV))

clearElement.onclick = function(event){
    
    localStorage.removeItem("likedTVList");
}