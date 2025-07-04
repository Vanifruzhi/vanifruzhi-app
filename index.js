document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN DE AUTENTICACIÓN ---
    const authLink = document.getElementById('authLink');
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // Usuario ha iniciado sesión
        authLink.textContent = 'Cerrar Sesión';
        authLink.href = '#'; // El href no es necesario, se maneja con el evento
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                alert('Has cerrado sesión.');
                window.location.reload(); // Recargamos la página para que se actualice
            }
        });
    } else {
        // Usuario no ha iniciado sesión
        authLink.textContent = 'Iniciar Sesión';
        authLink.href = 'login.html';
    }

    // --- GUARDIÁN DE CONTENIDO INTELIGENTE ---
    document.body.addEventListener('click', (event) => {
        // Busca si el clic (o su elemento padre) es un enlace protegido
        const link = event.target.closest('a.protected-link');

        if (link) {
            event.preventDefault(); // Detiene la navegación normal del enlace
            if (authToken) {
                // Si el usuario está logueado, permite la navegación
                window.location.href = link.href;
            } else {
                // Si no, lo redirige al login
                alert('Debes iniciar sesión para acceder a esta sección.');
                window.location.href = 'login.html';
            }
        }
    });


    // --- EL RESTO DE TU CÓDIGO DE INDEX.JS ---
    
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

    const popularAnimes = [ { ...animeData["bite me! chameleon"] },
                            { ...animeData["megami paradise"] }, 
                            { ...animeData["nozomi witches"] }, 
                            { ...animeData["mikeneko holmes"] } 

];

    const suggestionsAnimes = [ { ...animeData["kyou-kara-ore-wa"] }, 
                                { ...animeData["mellow"] }, 
                                { ...animeData["gokusen"] }, 
                                { ...animeData["ike ina-chuu takkyuu-bu"] }, 
                                { ...animeData["kuragehime"] } 
];

    const trendingAnimes = [ { ...animeData["bite me! chameleon"] }, 
                             { ...animeData["nana"] }, 
                             { ...animeData["beck"] },
                             { ...animeData["hareluya ii boy"] }, 
                             { ...animeData["shouwa genroku rakugo shinjuu"] },
                             { ...animeData["shoubushi densetsu tetsuya"] }, 
                             { ...animeData["sakamichi no apollon"] }, 
                             { ...animeData["pluto"] } 

];
    
    // ===== LÍNEA CORREGIDA =====
    const newReleasesAnimes = [ { ...animeData["megami paradise"] }, 
                                { ...animeData["sukeban deka"] }, 
                                { ...animeData["riding bean"] }, 
                                { ...animeData["ore no sora"] }, 
                                { ...animeData["koiko no mainichi"] } 

];
    
    const myWatchlistAnimes = [ { ...animeData["madonna"] }, 
                                { ...animeData["1 pound no fukuin"] }, 
                                { ...animeData["burning blood"] } 

];

    let currentSlide = 0;
    function renderMainCarousel() {
        mainCarouselSlides.innerHTML = '';
        carouselDots.innerHTML = '';
        carouselAnimes.forEach((anime, index) => {
            const slide = document.createElement('a'); // Cambiado a 'a' para el guardián
            slide.className = 'main-carousel-slide protected-link';
            slide.href = anime.mainHtmlLink;

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
                event.preventDefault();
                 if (authToken) {
                    window.open(anime.firstEpisodeLink, '_blank');
                } else {
                    alert('Debes iniciar sesión para ver el episodio.');
                    window.location.href = 'login.html';
                }
            });
            const infoBtn = document.createElement('button');
            infoBtn.className = 'carousel-icon-btn';
            infoBtn.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/ffffff/info.png" alt="Info">';
            infoBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (authToken) {
                    window.open(anime.mainHtmlLink, '_blank');
                } else {
                    alert('Debes iniciar sesión para ver más información.');
                    window.location.href = 'login.html';
                }
            });
            const favIconSrc = favorites.includes(anime.id.toString()) ? 'https://img.icons8.com/ios-filled/50/ffffff/like--v1.png' : 'https://img.icons8.com/fluency-systems-regular/48/ffffff/like.png';
            const favBtn = document.createElement('button');
            favBtn.className = 'carousel-icon-btn fav';
            favBtn.innerHTML = `<img src="${favIconSrc}" alt="Favorito">`;
            favBtn.dataset.id = anime.id.toString();
            favBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (!authToken) {
                    alert('Debes iniciar sesión para añadir a favoritos.');
                    window.location.href = 'login.html';
                    return;
                }
                const id = event.currentTarget.dataset.id;
                if (favorites.includes(id)) {
                    favorites = favorites.filter(favId => favId !== id);
                    event.currentTarget.querySelector('img').src = 'https://img.icons8.com/fluency-systems-regular/48/ffffff/like.png';
                } else {
                    favorites.push(id);
                    event.currentTarget.querySelector('img').src = 'https://img.icons8.com/ios-filled/50/ffffff/like--v1.png';
                }
                localStorage.setItem('favoriteAnimeIds', JSON.stringify(favorites));
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
        if (!authToken) {
            alert('Debes iniciar sesión para añadir a favoritos.');
            window.location.href = 'login.html';
            return;
        }
        if (currentAnimeIdForPopup) {
            const id = currentAnimeIdForPopup;
            if (favorites.includes(id)) {
                favorites = favorites.filter(favId => favId !== id);
                alert('Eliminado de favoritos.');
            } else {
                favorites.push(id);
                alert('Añadido a favoritos.');
            }
            localStorage.setItem('favoriteAnimeIds', JSON.stringify(favorites));
            hideOptionsPopup();
            renderMainCarousel();
        }
    });
    popupViewNow.addEventListener('click', (event) => {
        if (currentAnimeIdForPopup) {
            const anime = animeInfoById[currentAnimeIdForPopup];
            if (anime && anime.firstEpisodeLink) {
                if (authToken) {
                    window.open(anime.firstEpisodeLink, '_blank');
                } else {
                    alert('Debes iniciar sesión para ver el episodio.');
                    window.location.href = 'login.html';
                }
            } else {
                alert('Primer episodio no disponible.');
            }
            hideOptionsPopup();
        }
    });
    popupShare.addEventListener('click', (event) => {
        if (currentAnimeIdForPopup && navigator.share) {
            const anime = animeInfoById[currentAnimeIdForPopup];
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
            link.href = anime.mainHtmlLink || '#';
            link.classList.add('protected-link'); // Añadimos la clase para proteger el enlace
            link.style.display = 'block';
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            const img = document.createElement('img');
            img.src = anime.portada;
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
                currentAnimeIdForPopup = event.currentTarget.dataset.animeId;
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
                link.classList.add('protected-link'); // Protegemos también los resultados de búsqueda
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
        if (optionsPopup && !optionsPopup.contains(event.target) && !event.target.classList.contains('anime-card-options-btn')) {
            hideOptionsPopup();
        }
        if (searchResultsContainer && !searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
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
