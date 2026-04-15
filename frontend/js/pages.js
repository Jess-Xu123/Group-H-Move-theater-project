document.addEventListener('DOMContentLoaded', () => {
  initSideMenu();
  initCurrentPage();
});

const API_URL = 'http://localhost:3001/api';

function getCurrentFileName() {
  return window.location.pathname.split('/').pop().toLowerCase();
}

function initCurrentPage() {
  const currentPage = getCurrentFileName();

  if (currentPage === 'moviemenuj.html') {
    initMovieMenuPage();
    return;
  }

  if (currentPage === 'upcomingmenuj.html') {
    initUpcomingMenuPage();
    return;
  }

  if (currentPage === 'moviedetailsj.html') {
    initMovieDetailsPage();
    return;
  }

  if (currentPage === 'foodmenuj.html') {
    initFoodMenuPage();
  }
}

function initSideMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('menuOverlay');
  const openBtn = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose');

  if (!menu || !overlay || !openBtn || !closeBtn) return;

  const openMenu = () => {
    menu.classList.add('active');
    overlay.classList.add('active');
  };

  const closeMenu = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
  };

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}

function initMovieMenuPage() {
  const movieGrid = document.getElementById('movieGrid');
  if (!movieGrid) return;

  loadNowShowingMovies(movieGrid);
}

async function loadNowShowingMovies(movieGrid) {
  try {
    const response = await fetch(`${API_URL}/movies/now-showing`);

    if (!response.ok) {
      throw new Error('Failed to fetch now showing movies');
    }

    const movies = await response.json();

    movieGrid.innerHTML = movies.map((movie) => `
      <a href="movieDetailsJ.html?id=${movie.movie_id}" class="movie-link">
        <article class="movie-card">
          <div class="movie-poster"></div>
          <h2 class="movie-title">${movie.title}</h2>
          <p class="movie-time">${movie.genre}</p>
        </article>
      </a>
    `).join('');
  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = '<p class="movie-time">Failed to load movies.</p>';
  }
}

function initUpcomingMenuPage() {
  const movieGrid = document.getElementById('movieGrid');
  if (!movieGrid) return;

  loadUpcomingMovies(movieGrid);
}

function formatReleaseDate(releaseDate) {
  const date = new Date(releaseDate);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
}

async function loadUpcomingMovies(movieGrid) {
  try {
    const response = await fetch(`${API_URL}/movies/upcoming`);

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming movies');
    }

    const movies = await response.json();

    movieGrid.innerHTML = movies.map((movie) => `
      <a href="movieDetailsJ.html?id=${movie.movie_id}" class="movie-link">
        <article class="movie-card">
          <div class="movie-poster"></div>
          <h2 class="movie-title">${movie.title}</h2>
          <p class="movie-time">In theaters ${formatReleaseDate(movie.release_date)}</p>
        </article>
      </a>
    `).join('');
  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = '<p class="movie-time">Failed to load upcoming movies.</p>';
  }
}

function initMovieDetailsPage() {
  const detailTitle = document.getElementById('detailTitle');
  const detailSub = document.getElementById('detailSub');
  const detailTime = document.getElementById('detailTime');
  const ageBadge = document.getElementById('ageBadge');
  const detailDescription = document.getElementById('detailDescription');

  if (!detailTitle || !detailSub || !detailTime || !ageBadge || !detailDescription) {
    return;
  }

  loadMovieDetails(detailTitle, detailSub, detailTime, ageBadge, detailDescription);
}

async function loadMovieDetails(detailTitle, detailSub, detailTime, ageBadge, detailDescription) {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');

  if (!movieId) {
    detailTitle.textContent = 'Movie not found';
    detailSub.textContent = '';
    detailTime.textContent = '';
    ageBadge.textContent = '-';
    detailDescription.textContent = 'No movie id was provided.';
    return;
  }

  try {
    const movieResponse = await fetch(`${API_URL}/movies/${movieId}`);

    if (!movieResponse.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const movie = await movieResponse.json();

    const showtimeResponse = await fetch(`${API_URL}/movies/${movieId}/showtimes`);

    if (!showtimeResponse.ok) {
      throw new Error('Failed to fetch movie showtimes');
    }

    const showtimes = await showtimeResponse.json();

    detailTitle.textContent = movie.title;
    detailSub.textContent = `${movie.genre} • ${movie.duration_min} min`;
    ageBadge.textContent = movie.age_rating;
    detailDescription.textContent = movie.description;

    if (showtimes.length === 0) {
      detailTime.textContent = 'No showtimes available';
    } else {
      detailTime.innerHTML = showtimes.map((showtime) => {
        const date = new Date(showtime.show_date).toLocaleDateString('fi-FI', {
          day: '2-digit',
          month: '2-digit'
        });

        const time = showtime.show_time.slice(0, 5);

        return `${date} ${time} • ${showtime.hall_name}`;
      }).join('<br>');
    }
  } catch (error) {
    console.error(error);
    detailTitle.textContent = 'Movie not found';
    detailSub.textContent = '';
    detailTime.textContent = '';
    ageBadge.textContent = '-';
    detailDescription.textContent = 'Could not load movie details.';
  }
}

function initFoodMenuPage() {
  const foodList = document.getElementById('foodList');
  const drinksList = document.getElementById('drinksList');
  const snacksList = document.getElementById('snacksList');
  const othersList = document.getElementById('othersList');

  if (!foodList || !drinksList || !snacksList || !othersList) return;

  initFoodMenuTabs();
  loadFoods(foodList, drinksList, snacksList, othersList);
}

function initFoodMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tabs .menu-tab');
  const sections = document.querySelectorAll('.menu-section');

  if (!tabs.length || !sections.length) return;

  const showSection = (targetSelector) => {
    sections.forEach((section) => {
      if (`#${section.id}` === targetSelector) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  };

  showSection('#food');

  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();

      const targetSelector = tab.getAttribute('href');
      if (!targetSelector) return;

      tabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');

      showSection(targetSelector);
    });
  });
}

function formatPrice(price) {
  return `${Number(price).toFixed(2).replace('.', ',')}€`;
}

function createItemHtml(item) {
  return `
    <article class="menu-item">
      <div class="menu-image"></div>
      <div class="menu-info">
        <h3 class="menu-name">${item.name}</h3>
        <p class="menu-desc">${item.description}</p>
        <p class="menu-price">${formatPrice(item.price)}</p>
      </div>
      <div class="menu-action">
        <button class="add-btn" type="button">add</button>
      </div>
    </article>
  `;
}

function renderFoods(items, foodList, drinksList, snacksList, othersList) {
  foodList.innerHTML = '';
  drinksList.innerHTML = '';
  snacksList.innerHTML = '';
  othersList.innerHTML = '';

  items.forEach((item) => {
    const html = createItemHtml(item);

    if (item.category === 'Food') {
      foodList.innerHTML += html;
    } else if (item.category === 'Drinks') {
      drinksList.innerHTML += html;
    } else if (item.category === 'Snacks') {
      snacksList.innerHTML += html;
    } else if (item.category === 'Others') {
      othersList.innerHTML += html;
    }
  });
}

async function loadFoods(foodList, drinksList, snacksList, othersList) {
  try {
    const response = await fetch(`${API_URL}/foods`);

    if (!response.ok) {
      throw new Error('Failed to fetch food items');
    }

    const items = await response.json();
    renderFoods(items, foodList, drinksList, snacksList, othersList);
  } catch (error) {
    console.error(error);
    foodList.innerHTML = '<p class="menu-desc">Failed to load menu items.</p>';
  }
}