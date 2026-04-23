const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:8080/api"
  : "/api";

document.addEventListener('DOMContentLoaded', () => {
  initSideMenu();
  initCurrentPage();
});

//disable for now, get it back later 
// const API_URL = '/api';

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
          <img src="${movie.poster_url}" alt="${movie.title} poster" class="movie-poster">
          <h2 class="movie-title">${movie.title}</h2>
          <p class="movie-time">In theaters ${formatReleaseDate(movie.release_date)}</p>
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
          <img src="${movie.poster_url}" alt="${movie.title} poster" class="movie-poster">
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
  const elements = {
    detailTitle: document.getElementById('detailTitle'),
    detailSub: document.getElementById('detailSub'),
    ageBadge: document.getElementById('ageBadge'),
    detailDescription: document.getElementById('detailDescription'),
    detailPoster: document.getElementById('detailPoster'),
    showtimeList: document.getElementById('showtimeList'),
    decreaseTicketsBtn: document.getElementById('decreaseTickets'),
    increaseTicketsBtn: document.getElementById('increaseTickets'),
    ticketCount: document.getElementById('ticketCount'),
    ticketTotal: document.getElementById('ticketTotal'),
    buyTicketsBtn: document.getElementById('buyTicketsBtn'),
    ticketSelectionHelp: document.getElementById('ticketSelectionHelp')
  };

  const requiredElements = Object.values(elements);
  if (requiredElements.some((element) => !element)) {
    return;
  }

  loadMovieDetails(elements);
}

function formatShowtimeDate(showDate) {
  return new Date(showDate).toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit'
  });
}

function formatShowtimeTime(showTime) {
  return String(showTime).slice(0, 5);
}

function createShowtimeOption(showtime) {
  const date = formatShowtimeDate(showtime.show_date);
  const time = formatShowtimeTime(showtime.show_time);
  const hall = showtime.hall_name || `Hall ${showtime.hall_id}`;
  const format = showtime.format || 'Standard';
  const language = showtime.language || 'EN';

  return `
    <button
      type="button"
      class="showtime-option"
      data-showtime-id="${showtime.showtime_id}"
      data-show-date="${showtime.show_date}"
      data-show-time="${showtime.show_time}"
      data-hall-name="${hall}"
      data-ticket-price="${showtime.ticket_price}"
    >
      <span class="showtime-main">${date} · ${time} · ${hall}</span>
      <span class="showtime-meta">${format} · ${language}</span>
    </button>
  `;
}

function updateTicketCountDisplay(ticketCountElement, ticketCount) {
  ticketCountElement.textContent = String(ticketCount);
}
function formatTicketMoney(value) {
  return `${Number(value).toFixed(2).replace('.', ',')} €`;
}

function updateTicketTotalDisplay(ticketTotalElement, selectedShowtime, selectedTicketCount) {
  if (!ticketTotalElement) return;

  if (!selectedShowtime || selectedShowtime.ticket_price == null) {
    ticketTotalElement.textContent = '-- €';
    return;
  }

  const unitPrice = Number(selectedShowtime.ticket_price);

  if (Number.isNaN(unitPrice)) {
    ticketTotalElement.textContent = '-- €';
    return;
  }

  const total = unitPrice * Number(selectedTicketCount);
  ticketTotalElement.textContent = formatTicketMoney(total);
}

function updateBuyButtonState(buyButton, hasSelection) {
  buyButton.disabled = !hasSelection;
}

function bindShowtimeSelection(showtimeList, onSelect) {
  const buttons = showtimeList.querySelectorAll('.showtime-option');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      onSelect({
        showtime_id: Number(button.dataset.showtimeId),
        show_date: button.dataset.showDate,
        show_time: button.dataset.showTime,
        hall_name: button.dataset.hallName,
        ticket_price: Number(button.dataset.ticketPrice)
      });
    });
  });
}

function savePendingTicketSelection(movie, selectedShowtime, ticketCount) {
  if (!selectedShowtime) return;

  const payload = {
    movie_id: movie.movie_id,
    movie_title: movie.title,
    poster_url: movie.poster_url || '',
    showtime_id: selectedShowtime.showtime_id,
    show_date: selectedShowtime.show_date,
    show_time: selectedShowtime.show_time,
    hall_name: selectedShowtime.hall_name,
    ticket_price: Number(selectedShowtime.ticket_price),
    ticket_count: ticketCount,
    total_price: Number(selectedShowtime.ticket_price) * Number(ticketCount),
    saved_at: new Date().toISOString()
  };

  window.localStorage.setItem('pendingTicketSelection', JSON.stringify(payload));
}

async function loadMovieDetails(elements) {
  const {
    detailTitle,
    detailSub,
    ageBadge,
    detailDescription,
    detailPoster,
    showtimeList,
    decreaseTicketsBtn,
    increaseTicketsBtn,
    ticketCount,
    ticketTotal,
    buyTicketsBtn,
    ticketSelectionHelp
  } = elements;

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');

  let selectedShowtime = null;
  let selectedTicketCount = 1;

  const setHelpMessage = (message) => {
    ticketSelectionHelp.textContent = message;
  };

  updateTicketCountDisplay(ticketCount, selectedTicketCount);
  updateTicketTotalDisplay(ticketTotal, selectedShowtime, selectedTicketCount);
  updateBuyButtonState(buyTicketsBtn, false);

decreaseTicketsBtn.addEventListener('click', () => {
  selectedTicketCount = Math.max(1, selectedTicketCount - 1);
  updateTicketCountDisplay(ticketCount, selectedTicketCount);
  updateTicketTotalDisplay(ticketTotal, selectedShowtime, selectedTicketCount);
});

increaseTicketsBtn.addEventListener('click', () => {
  selectedTicketCount += 1;
  updateTicketCountDisplay(ticketCount, selectedTicketCount);
  updateTicketTotalDisplay(ticketTotal, selectedShowtime, selectedTicketCount);
});

  if (!movieId) {
    detailTitle.textContent = 'Movie not found';
    detailSub.textContent = '';
    ageBadge.textContent = '-';
    detailDescription.textContent = 'No movie id was provided.';
    showtimeList.innerHTML = '<p class="showtime-empty">No showtimes available.</p>';
    setHelpMessage('Movie id missing.');
    return;
  }

  try {
    const movieResponse = await fetch(`${API_URL}/movies/${movieId}`);

    if (!movieResponse.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const movie = await movieResponse.json();

    detailPoster.src = movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster';
    detailPoster.alt = `${movie.title} poster`;

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
      showtimeList.innerHTML = '<p class="showtime-empty">No showtimes available yet.</p>';
      setHelpMessage('This movie does not currently have showtimes.');
      return;
    }

    showtimeList.innerHTML = showtimes.map(createShowtimeOption).join('');

    bindShowtimeSelection(showtimeList, (showtime) => {
      selectedShowtime = showtime;
      updateBuyButtonState(buyTicketsBtn, true);
      updateTicketTotalDisplay(ticketTotal, selectedShowtime, selectedTicketCount);
      setHelpMessage(`Selected ${formatShowtimeDate(showtime.show_date)} ${formatShowtimeTime(showtime.show_time)} • ${showtime.hall_name}`);
    });

    buyTicketsBtn.addEventListener('click', async() => {
      if (!selectedShowtime) {
        setHelpMessage('Select a showtime before continuing.');
        return;
      }
    savePendingTicketSelection(movie, selectedShowtime, selectedTicketCount);
      
    
  setHelpMessage(`Selected ${selectedTicketCount} ticket(s) for ${formatShowtimeDate(selectedShowtime.show_date)} ${formatShowtimeTime(selectedShowtime.show_time)} • ${selectedShowtime.hall_name}. Total ${formatTicketMoney(Number(selectedShowtime.ticket_price) * selectedTicketCount)}.`);
  }); 
}catch (error) {
    console.error(error);
    detailTitle.textContent = 'Movie not found';
    detailSub.textContent = '';
    ageBadge.textContent = '-';
    detailDescription.textContent = 'Could not load movie details.';
    showtimeList.innerHTML = '<p class="showtime-empty">Could not load showtimes.</p>';
    setHelpMessage('Could not load ticket options.');
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

