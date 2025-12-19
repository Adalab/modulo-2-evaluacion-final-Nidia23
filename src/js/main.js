'use strict';

// 1. ESTRUCTURA BÁSICA – CONSTANTES DEL DOM

// Campo de texto donde la usuaria escribe el anime
const searchSearch = document.querySelector('.search-input');
// Botón para lanzar la búsqueda
const searchButton = document.querySelector('.search-btn');
// Botón para resetear la búsqueda
const resetButton = document.querySelector('.reset-btn');
// Contenedor donde se mostrarán los resultados
const containerResults = document.querySelector('.container-results');
// Contenedor donde se mostrarán los favoritos
const containerFavorite = document.querySelector('.favoritos-li');
// Botón para borrar todos los favoritos
const cleanButton = document.querySelector('.clear-favorites-btn');


// 2. BÚSQUEDA – API
async function searchAnime(title) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${title}`);
  const data = await response.json();
  return data.data;
}//async=asincrona permite utilizar await mientras se espera respuesta de la API sin romperse
//fecth hace la solicitud, la respuesta es en json para hacerla un objeto, resultados de los datos de la data


// 3. PINTAR RESULTADOS
function searchResults(animeList) {
  containerResults.innerHTML = '';//limpia lo que se haya escrito en el contenedor para una nueva busqueda
//si no coincide con ninguna de la anime list entonces muestra este parrafo y termina la funcion
  if (animeList.length === 0) {
    containerResults.innerHTML = '<p>No se encuentra lo que buscas</p>';
    return;
  }
//recorre cada anime de la lista y crea una div para mostrarla
  for (let anime of animeList) {
    const cardAnime = document.createElement('div');
    cardAnime.classList.add('anime-card');
    cardAnime.dataset.id = anime.mal_id;//guarda el mal_id en esta caja
    //sino encuentra la imagen entonces utiliza la otra
    const imageUrl = anime.images?.jpg?.image_url || './13434972.png';
    cardAnime.innerHTML = `<img src="${imageUrl}"><h2>${anime.title}</h2>`;

    // Click para añadir a favoritos
    cardAnime.addEventListener('click', () => addFavorite(anime));

    containerResults.appendChild(cardAnime);
  }//inserta la nueva tarjeta en containerResults
}

// 4. EVENTO BÚSQUEDA
searchButton.addEventListener('click', async () => {
  const title = searchSearch.value.trim();
  if (!title) return; // Evitar búsqueda vacía
  const results = await searchAnime(title);
  searchResults(results);
});

// 5. RESET pagina completa
resetButton.addEventListener('click', () => {
  searchSearch.value = '';
  containerResults.innerHTML = '';
});

// 6. FAVORITOS – ARRAY Y FUNCIONES
let arrayFavorites = [];

// Añadir favorito
function addFavorite(anime) {//añade un anime a favoritos si no esta ya guardado
  if (arrayFavorites.some(fav => fav.mal_id === anime.mal_id)) return;//some=verifica si ya esta en favoritos
  arrayFavorites.push(anime);
  localStorage.setItem('favorites', JSON.stringify(arrayFavorites));//se guarda en la memoria local aunque se recargue la pagina
  resultFavorites();//actualiza la lista de favorites
}

// Pintar favoritos
function resultFavorites() {
  containerFavorite.innerHTML = '';
  for (let anime of arrayFavorites) {
    const li = document.createElement('li');
    const imgen = document.createElement('img');
    imgen.src = anime.images.jpg.image_url;
    li.appendChild(imgen);
    const name = document.createElement('name');
    name.textContent = anime.title;
    li.appendChild(name)

    const deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click', () => {
      removeFavorite(anime.mal_id);
    });
    
    li.addEventListener('click', () => removeFavorite(anime.mal_id));
    containerFavorite.appendChild(li);
  }
}

// Borrar favorito individual
function removeFavorite(id) {
  arrayFavorites = arrayFavorites.filter(anime => anime.mal_id !== id);
  localStorage.setItem('favorites', JSON.stringify(arrayFavorites));
  resultFavorites();
}

// Borrar todos los favoritos
cleanButton.addEventListener('click', () => {
  arrayFavorites = [];
  localStorage.removeItem('favorites');
  resultFavorites();
});

// 7. CARGAR FAVORITOS DESDE LOCAL STORAGE
const savedFavorites = localStorage.getItem('favorites');
if (savedFavorites) {
  arrayFavorites = JSON.parse(savedFavorites);
  resultFavorites();
}//mira si hay favoritos guardados en el localStorage, si los hay
//los convierte de json a array y los recorre mostrandolos en la pantalla