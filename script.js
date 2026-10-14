
const input = document.querySelector("#movieInput");
const searchForm = document.querySelector("#searchForm");
const movieContainer = document.querySelector("#movieContainer");
const statusMessage = document.querySelector("#statusMessage");

const movieModal = document.querySelector("#movieModal");
const modalContent = document.querySelector("#modalContent");
const closeModal = document.querySelector("#closeModal");

const API_KEY = "d600d997";

// Get saved favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Search for movies
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const movieName = input.value.trim();

  if (movieName === "") {
    statusMessage.textContent = "Please enter a movie name.";
    movieContainer.innerHTML = "";
    return;
  }

  searchMovies(movieName);
});

async function searchMovies(movieName) {
  statusMessage.textContent = "Searching movies...";
  movieContainer.innerHTML = "";

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movieName)}`
    );

    const data = await response.json();

    if (data.Response === "True") {
      statusMessage.textContent = "Search results:";
      movieContainer.innerHTML = "";

      for (let i = 0; i < data.Search.length; i++) {
        const movie = data.Search[i];

        let poster = movie.Poster;

        if (poster === "N/A") {
          poster = "https://placehold.co/300x450?text=No+Poster";
        }

        let isFavorite = false;

        for (let j = 0; j < favorites.length; j++) {
          if (favorites[j].id === movie.imdbID) {
            isFavorite = true;
          }
        }

        const card = `
          <div
            data-id="${movie.imdbID}"
            class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-violet-500"
          >
            <img
              src="${poster}"
              alt="${movie.Title} poster"
              class="h-80 w-full object-cover"
            >

            <div class="p-4">
              <p class="mb-2 text-sm text-violet-400">
                ${movie.Type}
              </p>

              <h2 class="truncate text-lg font-bold">
                ${movie.Title}
              </h2>

              <p class="mt-2 text-sm text-slate-400">
                ${movie.Year}
              </p>

              <button
                type="button"
                class="detailsButton mt-4 w-full rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700"
              >
                View Details
              </button>

              <button
                type="button"
                class="favoriteButton mt-2 w-full rounded-lg bg-violet-600 px-3 py-2 hover:bg-violet-500"
              >
                ${isFavorite ? "Remove Favorite" : "Add to Favorites"}
              </button>
            </div>
          </div>
        `;

        movieContainer.innerHTML += card;
      }
    } else {
      statusMessage.textContent = data.Error || "No movies found.";
    }
  } catch (error) {
    statusMessage.textContent =
      "Something went wrong. Please check your internet connection.";
  }

  input.value = "";
}

// Handle clicks on movie cards
movieContainer.addEventListener("click", function (event) {
  const card = event.target.closest("[data-id]");

  if (!card) {
    return;
  }

  const movieId = card.dataset.id;

  if (event.target.classList.contains("detailsButton")) {
    showMovieDetails(movieId);
  }

  if (event.target.classList.contains("favoriteButton")) {
    const title = card.querySelector("h2").textContent;
    const poster = card.querySelector("img").src;

    let favoriteIndex = -1;

    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].id === movieId) {
        favoriteIndex = i;
      }
    }

    if (favoriteIndex === -1) {
      favorites.push({
        id: movieId,
        title: title,
        poster: poster
      });
    } else {
      favorites.splice(favoriteIndex, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Update the button text
    if (favoriteIndex === -1) {
      event.target.textContent = "Remove Favorite";
    } else {
      event.target.textContent = "Add to Favorites";
    }
  }
});

// Fetch and show movie details
async function showMovieDetails(movieId) {
  modalContent.textContent = "Loading movie details...";

  movieModal.classList.remove("hidden");
  movieModal.classList.add("flex");

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURIComponent(movieId)}`
    );

    const movie = await response.json();

    if (movie.Response === "False") {
      modalContent.textContent = "Movie details not found.";
      return;
    }

    let poster = movie.Poster;

    if (poster === "N/A") {
      poster = "https://placehold.co/300x450?text=No+Poster";
    }

    modalContent.innerHTML = `
      <h2 class="mb-4 text-2xl font-bold">${movie.Title}</h2>

      <img
        src="${poster}"
        alt="${movie.Title} poster"
        class="mb-4 w-40 rounded-lg"
      >

      <p class="mb-2"><strong>Year:</strong> ${movie.Year}</p>
      <p class="mb-2"><strong>Genre:</strong> ${movie.Genre}</p>
      <p class="mb-2"><strong>Director:</strong> ${movie.Director}</p>
      <p class="mb-2"><strong>Actors:</strong> ${movie.Actors}</p>
      <p class="mb-2"><strong>Runtime:</strong> ${movie.Runtime}</p>
      <p class="mb-2"><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
      <p class="mt-4 text-slate-300">${movie.Plot}</p>
    `;
  } catch (error) {
    modalContent.textContent = "Unable to load movie details.";
  }
}

// Close modal with the X button
closeModal.addEventListener("click", function () {
  movieModal.classList.add("hidden");
  movieModal.classList.remove("flex");
});

// Close modal by clicking outside the content box
movieModal.addEventListener("click", function (event) {
  if (event.target === movieModal) {
    movieModal.classList.add("hidden");
    movieModal.classList.remove("flex");
  }
});

// Close modal by pressing Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    movieModal.classList.add("hidden");
    movieModal.classList.remove("flex");
  }
});