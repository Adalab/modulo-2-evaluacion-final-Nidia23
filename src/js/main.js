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

// ==========================
// 2. BÚSQUEDA – API
// ==========================
async function searchAnime(title) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${title}`);
  const data = await response.json();
  return data.data;
}

// ==========================
// 3. PINTAR RESULTADOS
// ==========================
function searchResults(animeList) {
  containerResults.innerHTML = '';

  if (animeList.length === 0) {
    containerResults.innerHTML = '<p>No se encuentra lo que buscas</p>';
    return;
  }

  for (let anime of animeList) {
    const cardAnime = document.createElement('div');
    cardAnime.classList.add('anime-card');
    cardAnime.dataset.id = anime.mal_id;

    const imageUrl = anime.images?.jpg?.image_url || './13434972.png';
    cardAnime.innerHTML = `<img src="${imageUrl}"><h2>${anime.title}</h2>`;

    // Click para añadir a favoritos
    cardAnime.addEventListener('click', () => addFavorite(anime));

    containerResults.appendChild(cardAnime);
  }
}

// ==========================
// 4. EVENTO BÚSQUEDA
// ==========================
searchButton.addEventListener('click', async () => {
  const title = searchSearch.value.trim();
  if (!title) return; // Evitar búsqueda vacía
  const results = await searchAnime(title);
  searchResults(results);
});

// ==========================
// 5. RESET
// ==========================
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  containerResults.innerHTML = '';
});

// ==========================
// 6. FAVORITOS – ARRAY Y FUNCIONES
// ==========================
let arrayFavorites = [];

// Añadir favorito
function addFavorite(anime) {
  if (arrayFavorites.some(fav => fav.mal_id === anime.mal_id)) return;
  arrayFavorites.push(anime);
  localStorage.setItem('favorites', JSON.stringify(arrayFavorites));
  resultFavorites();
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
    

    // Opción de borrar individual
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

// ==========================
// 7. CARGAR FAVORITOS DESDE LOCAL STORAGE
// ==========================
const savedFavorites = localStorage.getItem('favorites');
if (savedFavorites) {
  arrayFavorites = JSON.parse(savedFavorites);
  resultFavorites();
}