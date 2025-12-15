'use strict';

const buttonSearch = document.querySelector(`.button-search`);
buttonSearch.addEventListener(`click`,(buscaAnime));
    function buscaAnime(){
        let formularioInput = document.getElementById(`search`);
        let resultadoInput = formularioInput.value;

        let enlaceApi = `https://api.jikan.moe/v4/anime?q=${resultadoInput}`;// quiero que me busques de la api este resultado
            fetch(enlaceApi)//hace una peticion al http del enlace de la url
            .then(function (response) {
                return response.json()
            })//me respondas con todo transformado en json(array, string)
            .then(function(data) {//todos los datos que tiene json, nos importa los datos de los datos
                    const resultados = document.getElementById(`results`)
                    resultados.innerHTML = `` //dejamos un hueco para que se pinte con lo que devuelva la data

                data.data.forEach(anime => {
                    let cardAnime = document.createElement(`div`)
                    cardAnime.classList.add(`card-anime`)
                    cardAnime.innerHTML = `<h3>${anime.title}</h3>
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">`;

                    resultados.appendChild(cardAnime);
                });
        });
    }

