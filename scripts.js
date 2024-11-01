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

    var childs = `
        <a id="item-title" class="nav-link" onclick="getDefaultCards()">
            <span class="icon">
                <i class="bi bi-grid"></i>
            </span>
            <span class="description">${translations[language].genre_title}</span>
        </a>
        <hr>
        <a id="item-home" class="nav-link active" aria-current="page" onclick="getDefaultCards()">
            <span class="icon">
                <i class="fa-solid fa-house"></i>
            </span>
            <span class="description">Home</span>
        </a>
    `;

    response.genres.forEach(genre => childs += `
        
        <a id="item-${genre.name}" class="nav-link" aria-current="page" onclick="getCards('${genre.id}', '${genre.name}')">
            <span class="icon">
                ${getIcon(genre.id)}
            </span>
            <span class="description">${genre.name}</span>
        </a>
        
    `);

    const ulGenre = document.getElementById('ulGenre');

    ulGenre.innerHTML = childs;

    getDefaultCards();
}

async function getCards(idCategoria, genre) {

    const language = localStorage.getItem('language') || navigator.language;

    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${idCategoria}&api_key=a8fe6d7128055d4d27a7f2fcf680bc6f&language=${language}`;

    const response = await fetch(url).then(r => r.json()).catch(() => console.log('Error when acquiring gender!'));

    var childs = '';

    response.results.forEach(movie => {

        const card = `
            <div class="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-2 col-xxl-1">
                <div class="card" onclick="moreInfo(${movie.id})">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="Poster filme">
                </div>    
            </div>
        `;

        childs += card;
    })

    const dCards = document.getElementById('dCards');

    Array.from(document.getElementsByClassName('nav-link active')).forEach(item => item.setAttribute('class', 'nav-link text-white'));
    
    const aSelectedItem = document.getElementById(`item-${genre}`);
    aSelectedItem.setAttribute('class', 'nav-link active');

    dCards.innerHTML = childs;
}

async function getDefaultCards() {

    const language = localStorage.getItem('language') || navigator.language;

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=a8fe6d7128055d4d27a7f2fcf680bc6f&language=${language}`;

    const response = await fetch(url).then(r => r.json()).catch(() => console.log('Error when acquiring gender!'));

    var childs = '';

    response.results.forEach(movie => {

        const card = `
            <div class="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-2 col-xxl-1">
                <div class="card" onclick="moreInfo(${movie.id})">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="Poster filme">
                </div>    
            </div>
        `;

        childs += card;
    })

    const dCards = document.getElementById('dCards');

    Array.from(document.getElementsByClassName('nav-link active')).forEach(item => item.setAttribute('class', 'nav-link text-white'));
    
    const aSelectedItem = document.getElementById(`item-home`);
    aSelectedItem.setAttribute('class', 'nav-link active');

    dCards.innerHTML = childs;

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

function getIcon(genreId) {

    switch (genreId) {
        case 28:
            return '<i class="fa-solid fa-burst"></i>';
        case 12:
            return '<i class="fas fa-map"></i>';
        case 16:
            return '<i class="bi bi-palette"></i>';
        case 35:
            return '<i class="bi bi-emoji-laughing"></i>';
        case 80:
            return '<i class="bi bi-shield-shaded"></i>';
        case 99:
            return '<i class="bi bi-journal-text"></i>';
        case 18:
            return '<i class="bi bi-people"></i>';
        case 10751:
            return '<i class="bi bi-house-heart-fill"></i>';
        case 14:
            return '<i class="bi bi-moon-stars"></i>';
        case 36:
            return '<i class="bi bi-book-half"></i>';
        case 27:
            return '<i class="bi bi-emoji-dizzy"></i>';
        case 10402:
            return '<i class="bi bi-music-note-beamed"></i>';
        case 9648:
            return '<i class="bi bi-question-circle"></i>';
        case 10749:
            return '<i class="bi bi-heart-fill"></i>';
        case 878:
            return '<i class="bi bi-robot"></i>';
        case 10770:
            return '<i class="bi bi-tv-fill"></i>';
        case 53:
            return '<i class="bi bi-mask"></i>';
        case 10752:
            return '<i class="bi bi-shield-fill"></i>';
        case 37:
            return '<i class="fas fa-gun"></i>';
    }
}