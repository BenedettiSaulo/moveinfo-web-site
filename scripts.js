async function setLanguage(lang) {

    localStorage.setItem('language', lang);

    getGenres();
}

function startWebsite() {

    getGenres();
}

async function getGenres() {

    const language = localStorage.getItem('language') || navigator.language;

    const translations = await fetch('./translations/translations.json').then(r => r.json()).catch(() => console.log('Error acquiring translations.'));

    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=a8fe6d7128055d4d27a7f2fcf680bc6f&language=${language}`;

    const response = await fetch(url).then(r => r.json()).catch(() => console.log('Error when acquiring genres.'));

    var childs = '';

    response.genres.forEach(genre => childs += `<button type="button" class="list-group-item list-group-item-action" onclick="getCards('${genre.id}', '${genre.name}')">${genre.name}</button>`);

    const divGenre = document.getElementById('divGenre');

    const hGenTitle = document.getElementById('hGenTitle');

    hGenTitle.innerHTML = translations[language].genre_title;

    divGenre.innerHTML = childs;

    getDefaultCards(response.genres[0].name);
}

async function getCards(idCategoria, genre) {

    const language = localStorage.getItem('language') || navigator.language;

    const translations = await fetch('./translations/translations.json').then(r => r.json()).catch(() => console.log('Error acquiring translations.'));

    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${idCategoria}&api_key=a8fe6d7128055d4d27a7f2fcf680bc6f&language=${language}`;

    const response = await fetch(url).then(r => r.json()).catch(() => console.log('Error when acquiring gender!'));

    var childs = '';

    response.results.forEach(movie => {

        const card = `
            <div class="col-4">
                <div class="card">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="Poster filme">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <ul class="informations">
                            <li class="information"><p class="pInformation"><b class="bInformation">${translations[language].genre}:</b> ${genre}</p></li>
                            <li class="information"><p class="pInformation"><b class="bInformation">${translations[language].release_date}:</b> ${movie.release_date}</p></li>
                            <li class="information"><p class="pInformation"><b class="bInformation">${translations[language].popularity}:</b> ${movie.popularity}</p></li>
                            <li class="information"><p class="pInformation"><b class="bInformation">${translations[language].vote_average}:</b> ${movie.vote_average}</p></li>
                            <li class="information"><p class="pInformation"><b class="bInformation">${translations[language].vote_count}:</b> ${movie.vote_count}</p></li>
                            <li class="information"><p class="pInformation"><b class="bInformation">${translations[language].overview}:</b> ${movie.overview}</p></li>
                        </ul>
                        <div class="card-buttons">
                            <button type="button" class="btn btn-danger" onclick="findById(${movie.id})">${translations[language].find}</button>
                            <button type="button" class="btn btn-danger" onclick="moreInfo(${movie.id})">${translations[language].more_info}</button>
                        </div>
                    </div>
                </div>    
            </div>
        `;

        childs += card;
    })

    const dCards = document.getElementById('dCards');

    dCards.innerHTML = childs;
}

function getDefaultCards(genre) {

    getCards(28, genre);
}

async function findById(movieId) {

    console.log(movieId);


    const language = localStorage.getItem('language') || navigator.language;

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=a8fe6d7128055d4d27a7f2fcf680bc6f&language=${language}`;

    const response = await fetch(url).then(r => r.json()).catch(() => console.log('Error acquiring film detail!'));

    window.open(response.homepage, '_blank');
}

async function moreInfo(movieId) {

    const existingModal = document.getElementById('dynamicMovieModal');

    if (existingModal) {

        existingModal.remove();
    }

    const language = localStorage.getItem('language') || navigator.language;

    const translations = await fetch('./translations/translations.json').then(r => r.json()).catch(() => console.log('Error acquiring translations.'));

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=a8fe6d7128055d4d27a7f2fcf680bc6f&language=${language}`;

    const response = await fetch(url).then(r => r.json()).catch(() => console.log('Error acquiring film detail!'));

    const modal = `
        <div class="modal fade" id="dynamicMovieModal" tabindex="-1" aria-labelledby="dynamicMovieModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <h5 class="modal-title">${response.title}</h5>
                        <h7 class="modal-title">${response.tagline}</h7>
                    </div>
                    <div class="modal-body">
                        <p class="pInformation"><b class="bInformation">${translations[language].genres}:</b> ${textFormater(response.genres)}</p>
                        <p class="pInformation"><b class="bInformation">${translations[language].original_title}:</b> ${response.original_title}</p>
                        <p class="pInformation"><b class="bInformation">${translations[language].original_language}:</b> ${response.original_language}</p>
                        <p class="pInformation"><b class="bInformation">Status:</b> ${response.status}</p>
                        <p class="pInformation"><b class="bInformation">${translations[language].revenue}:</b> $${new Intl.NumberFormat(language).format(response.revenue)}</p>
                        <p class="pInformation"><b class="bInformation">${translations[language].runtime}:</b> ${response.runtime} min</p>
                        <p class="pInformation"><b class="bInformation">${translations[language].production_countries}:</b> ${textFormater(response.production_countries)}</p>
                        <p class="pInformation"><b class="bInformation">${translations[language].production_companies}:</b> ${textFormater(response.production_companies)}</p>

                        <p class="pInformation"><b class="bInformation">${translations[language].overview}:</b> ${response.overview}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="find('${response.homepage}')">${translations[language].find}</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${translations[language].close}</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);

    new bootstrap.Modal(document.getElementById('dynamicMovieModal')).show();
}

window.onload = function () {
    var language = localStorage.getItem('language') || 'en-US';
    setLanguage(language);
}

function textFormater(textList) {

    var formaterText = '';

    for (let index = 0; index < textList.length; index++) {

        if (index === (textList.length - 1)) {

            formaterText += textList[index].name;

            continue;
        }

        formaterText += `${textList[index].name}, `
    }

    return formaterText;
}

function find(homepage) {

    window.open(homepage, '_blank');
}