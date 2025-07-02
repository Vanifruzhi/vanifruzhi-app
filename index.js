// --- GUARDIÁN DE AUTENTICACIÓN ---
// Esto se ejecuta ANTES de que se cargue el resto de la página.
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    // Si no hay token, redirigimos al login.
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA PARA CERRAR SESIÓN ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            alert('Has cerrado sesión.');
            window.location.href = 'login.html';
        });
    }

    // ...
    // ... TU CÓDIGO EXISTENTE DE index.js VA AQUÍ ...
    // ... (Lógica de carruseles, sidebar, popups, búsqueda, etc.)
    // ...
    let favorites = JSON.parse(localStorage.getItem('favoriteAnimeIds') || '[]');
    const mainCarouselSlides = document.getElementById('mainCarouselSlides');
    const carouselPrevBtn = document.getElementById('carouselPrevBtn');
    const carouselNextBtn = document.getElementById('carouselNextBtn');
    const carouselDots = document.getElementById('carouselDots');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sideNav = document.getElementById('sideNav');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const optionsPopup = document.getElementById('optionsPopup');
    const popupAddToFav = document.getElementById('popupAddToFav');
    const popupViewNow = document.getElementById('popupViewNow');
    const popupShare = document.getElementById('popupShare');
    const popularAnimeList = document.getElementById('popularAnimeList');
    const suggestionsList = document.getElementById('suggestionsList');
    const trendingList = document.getElementById('trendingList');
    const newReleasesList = document.getElementById('newReleasesList');
    const myWatchlistList = document.getElementById('myWatchlistList');
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');
    let currentAnimeIdForPopup = null;
    const carouselAnimes = [
        { ...animeData["bite me! chameleon"], firstEpisodeLink: "animes/chameleon-bite-me/chameleon01.html" },
        { ...animeData["megami paradise"], firstEpisodeLink: "animes/megami-paradise/megami-paradise01.html" },
        { ...animeData["nozomi witches"], firstEpisodeLink: "animes/nozomi-witches/nozomi-witches01.html" },
        { ...animeData["mellow"], firstEpisodeLink: "animes/mellow/mellow01.html" },
        { ...animeData["kyukyoku chojin r"], firstEpisodeLink: "animes/chojin-r/chojin-r01.html" }
    ];
    const popularAnimes = [
      { ...animeData["bite me! chameleon"] }, 
      { ...animeData["megami paradise"] },
      { ...animeData["nozomi witches"] }, 
      { ...animeData["mikeneko holmes"] }
    ];
    const suggestionsAnimes = [
      { ...animeData["kyou-kara-ore-wa"] },
      { ...animeData["mellow"] }, 
      { ...animeData["gokusen"] },
      { ...animeData["ike ina-chuu takkyuu-bu"] },
      { ...animeData["kuragehime"] }
    ];
    const trendingAnimes = [
        { ...animeData["bite me! chameleon"] }, 
        { ...animeData["nana"] }, 
        { ...animeData["beck"] }, 
        { ...animeData["hareluya ii boy"] },
        { ...animeData["shouwa genroku rakugo shinjuu"] }, 
        { ...animeData["shoubushi densetsu tetsuya"] },
        { ...animeData["sakamichi no apollon"] }, 
        { ...animeData["pluto"] }
    ];
    const newReleasesAnimes = [
        { id: 401, title: "Estreno Anime X", portada: "https://via.placeholder.com/120x180?text=EstrenoX", mainHtmlLink: "#", audioStatus: "Subtitulado" }, { ...animeData["megami paradise"] },
        { id: 402, title: "Estreno Anime Y", portada: "https://via.placeholder.com/120x180?text=EstrenoY", mainHtmlLink: "#", audioStatus: "Dob" },
        { id: 403, title: "Estreno Anime Z", portada: "https://via.placeholder.com/120x180?text=EstrenoZ", mainHtmlLink: "#", audioStatus: "Subtitulado" }
    ];
    const myWatchlistAnimes = [
        { ...animeData["bite me! chameleon"] }, 
        { ...animeData["madonna"] },
        { ...animeData["1 pound no fukuin"] },
        { ...animeData["nozomi witches"] },
        { ...animeData["burning blood"] }
    ];
    let currentSlide = 0;
    function renderMainCarousel() {
        mainCarouselSlides.innerHTML = '';
        carouselDots.innerHTML = '';
        carouselAnimes.forEach((anime, index) => {
            const slide = document.createElement('div');
            slide.className = 'main-carousel-slide';
            const img = document.createElement('img');
            img.src = anime.portada;
            img.alt = anime.title;
            const overlay = document.createElement('div');
            overlay.className = 'main-carousel-overlay';
            const caption = document.createElement('div');
            caption.className = 'main-carousel-caption';
            caption.textContent = anime.title;
            const genresDiv = document.createElement('div');
            genresDiv.className = 'main-carousel-genres';
            genresDiv.textContent = anime.genres ? anime.genres.join(', ') : '';
            const iconGroup = document.createElement('div');
            iconGroup.className = 'carousel-icon-group';
            const playBtn = document.createElement('button');
            playBtn.className = 'carousel-icon-btn play';
            playBtn.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/ffffff/play--v1.png" alt="Play">';
            playBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                if (anime.firstEpisodeLink) {
                    window.open(anime.firstEpisodeLink, '_blank');
                } else {
                    alert('Primer episodio no definido para este anime.');
                }
            });
            const infoBtn = document.createElement('button');
            infoBtn.className = 'carousel-icon-btn';
            infoBtn.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/ffffff/info.png" alt="Info">';
            infoBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                window.open(anime.mainHtmlLink, '_blank');
            });
            const favIconSrc = favorites.includes(anime.id.toString()) ? 'https://img.icons8.com/ios-filled/50/ffffff/like--v1.png' : 'https://img.icons8.com/fluency-systems-regular/48/ffffff/like.png';
            const favBtn = document.createElement('button');
            favBtn.className = 'carousel-icon-btn fav';
            favBtn.innerHTML = `<img src="${favIconSrc}" alt="Favorito">`;
            favBtn.dataset.id = anime.id.toString();
            favBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const id = event.currentTarget.dataset.id;
                const data = JSON.parse(localStorage.getItem('userData') || '{"nombre":"","foto":"","favoritos":[],"vistos":[]}');
                let currentFavs = JSON.parse(localStorage.getItem('favoriteAnimeIds') || '[]');
                const animeInfoArray = Object.values(animeData);
                const anime = animeInfoArray.find(a => a.id.toString() === id);
                const animeTitle = anime ? anime.title : '';
                if (currentFavs.includes(id)) {
                    currentFavs = currentFavs.filter(favId => favId !== id);
                    data.favoritos = data.favoritos.filter(name => name !== animeTitle);
                    event.currentTarget.querySelector('img').src = 'https://img.icons8.com/fluency-systems-regular/48/ffffff/like.png';
                } else {
                    currentFavs.push(id);
                    if (animeTitle && !data.favoritos.includes(animeTitle)) {
                        data.favoritos.push(animeTitle);
                    }
                    event.currentTarget.querySelector('img').src = 'https://img.icons8.com/ios-filled/50/ffffff/like--v1.png';
                }
                localStorage.setItem('favoriteAnimeIds', JSON.stringify(currentFavs));
                localStorage.setItem('userData', JSON.stringify(data));
                favorites = currentFavs;
            });
            iconGroup.appendChild(playBtn);
            iconGroup.appendChild(infoBtn);
            iconGroup.appendChild(favBtn);
            overlay.appendChild(caption);
            overlay.appendChild(genresDiv);
            overlay.appendChild(iconGroup);
            slide.appendChild(img);
            slide.appendChild(overlay);
            mainCarouselSlides.appendChild(slide);
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === currentSlide) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateMainCarousel();
            });
            carouselDots.appendChild(dot);
        });
        updateMainCarousel();
    }
    function updateMainCarousel() {
        mainCarouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    carouselPrevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide === 0) ? carouselAnimes.length - 1 : currentSlide - 1;
        updateMainCarousel();
    });
    carouselNextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide === carouselAnimes.length - 1) ? 0 : currentSlide + 1;
        updateMainCarousel();
    });
    let autoSlideInterval;
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide === carouselAnimes.length - 1) ? 0 : currentSlide + 1;
            updateMainCarousel();
        }, 5000);
    }
    mainCarouselSlides.addEventListener('mouseover', () => clearInterval(autoSlideInterval));
    mainCarouselSlides.addEventListener('mouseleave', startAutoSlide);
    sidebarToggle.addEventListener('click', () => {
        sideNav.classList.add('open');
        sidebarOverlay.classList.add('active');
    });
    closeSidebarBtn.addEventListener('click', () => {
        sideNav.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });
    sidebarOverlay.addEventListener('click', () => {
        sideNav.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });
    function hideOptionsPopup() {
        optionsPopup.classList.remove('active');
        currentAnimeIdForPopup = null;
    }
    popupAddToFav.addEventListener('click', (event) => {
        if (currentAnimeIdForPopup) {
            const id = currentAnimeIdForPopup;
            const data = JSON.parse(localStorage.getItem('userData') || '{"nombre":"","foto":"","favoritos":[],"vistos":[]}');
            let currentFavs = JSON.parse(localStorage.getItem('favoriteAnimeIds') || '[]');
            const animeInfoArray = Object.values(animeData);
            const anime = animeInfoArray.find(a => a.id.toString() === id);
            const animeTitle = anime ? anime.title : '';
            if (currentFavs.includes(id)) {
                currentFavs = currentFavs.filter(favId => favId !== id);
                data.favoritos = data.favoritos.filter(name => name !== animeTitle);
                alert(`${animeTitle} eliminado de favoritos.`);
            } else {
                currentFavs.push(id);
                if (animeTitle && !data.favoritos.includes(animeTitle)) {
                    data.favoritos.push(animeTitle);
                }
                alert(`${animeTitle} añadido a favoritos.`);
            }
            localStorage.setItem('favoriteAnimeIds', JSON.stringify(currentFavs));
            localStorage.setItem('userData', JSON.stringify(data));
            favorites = currentFavs;
            hideOptionsPopup();
            renderMainCarousel();
        }
    });
    popupViewNow.addEventListener('click', (event) => {
        if (currentAnimeIdForPopup) {
            const id = currentAnimeIdForPopup;
            const animeInfoArray = Object.values(animeData);
            const anime = animeInfoArray.find(a => a.id.toString() === id);
            if (anime && anime.firstEpisodeLink) {
                window.open(anime.firstEpisodeLink, '_blank');
            } else {
                alert('Primer episodio no definido para este anime.');
            }
            hideOptionsPopup();
        }
    });
    popupShare.addEventListener('click', (event) => {
        if (currentAnimeIdForPopup && navigator.share) {
            const id = currentAnimeIdForPopup;
            const animeInfoArray = Object.values(animeData);
            const anime = animeInfoArray.find(a => a.id.toString() === id);
            if (anime) {
                navigator.share({
                    title: anime.title,
                    text: `¡Mira este anime: ${anime.title}!`,
                    url: anime.mainHtmlLink || window.location.href
                }).catch(err => console.error('Error al compartir:', err));
            }
            hideOptionsPopup();
        } else {
            alert("Tu navegador no soporta la función de compartir.");
            hideOptionsPopup();
        }
    });
    function renderAnimeList(container, list) {
        container.innerHTML = '';
        list.forEach(anime => {
            const div = document.createElement('div');
            div.className = 'anime-card';
            const link = document.createElement('a');
            link.href = anime.mainHtmlLink || anime.link || '#';
            link.style.display = 'block';
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            const img = document.createElement('img');
            img.src = anime.portada || anime.img;
            img.alt = anime.title;
            link.appendChild(img);
            const infoDiv = document.createElement('div');
            infoDiv.className = 'anime-card-info';
            const textContainer = document.createElement('div');
            textContainer.className = 'anime-card-text';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'anime-card-title';
            titleSpan.textContent = anime.title;
            textContainer.appendChild(titleSpan);
            if (anime.audioStatus) {
                const subtitleSpan = document.createElement('span');
                subtitleSpan.className = 'anime-card-subtitle';
                subtitleSpan.textContent = anime.audioStatus;
                textContainer.appendChild(subtitleSpan);
            }
            infoDiv.appendChild(textContainer);
            const optionsBtn = document.createElement('button');
            optionsBtn.className = 'anime-card-options-btn';
            optionsBtn.innerHTML = '⋮';
            optionsBtn.dataset.animeId = anime.id.toString();
            optionsBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                const clickedAnimeId = event.currentTarget.dataset.animeId;
                currentAnimeIdForPopup = clickedAnimeId;
                const buttonRect = event.currentTarget.getBoundingClientRect();
                optionsPopup.style.left = `${buttonRect.left - 150}px`;
                optionsPopup.style.top = `${buttonRect.top + 25}px`;
                if (optionsPopup.offsetLeft < 0) optionsPopup.style.left = '5px';
                if (optionsPopup.offsetLeft + optionsPopup.offsetWidth > window.innerWidth) {
                    optionsPopup.style.left = `${window.innerWidth - optionsPopup.offsetWidth - 5}px`;
                }
                optionsPopup.classList.add('active');
            });
            infoDiv.appendChild(optionsBtn);
            div.appendChild(link);
            div.appendChild(infoDiv);
            container.appendChild(div);
        });
    }
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query.trim() === '') {
            searchResultsContainer.style.display = 'none';
            return;
        }
        const normalizedQuery = normalizarNombre(query);
        const results = Object.values(animeData).filter(anime => {
            const normalizedTitle = normalizarNombre(anime.title);
            return normalizedTitle.includes(normalizedQuery);
        });
        searchResultsContainer.innerHTML = '';
        if (results.length > 0) {
            results.forEach(anime => {
                const link = document.createElement('a');
                link.href = anime.mainHtmlLink;
                link.className = 'search-result-item';
                const img = document.createElement('img');
                img.src = anime.portada;
                img.alt = anime.title;
                const titleSpan = document.createElement('span');
                titleSpan.textContent = anime.title;
                link.appendChild(img);
                link.appendChild(titleSpan);
                searchResultsContainer.appendChild(link);
            });
        } else {
            searchResultsContainer.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
        }
        searchResultsContainer.style.display = 'block';
    });
    document.addEventListener('click', (event) => {
        if (!optionsPopup.contains(event.target) && !event.target.classList.contains('anime-card-options-btn')) {
            hideOptionsPopup();
        }
        if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
    renderMainCarousel();
    startAutoSlide();
    renderAnimeList(popularAnimeList, popularAnimes);
    renderAnimeList(suggestionsList, suggestionsAnimes);
    renderAnimeList(trendingList, trendingAnimes);
    renderAnimeList(newReleasesList, newReleasesAnimes);
    renderAnimeList(myWatchlistList, myWatchlistAnimes);
});
