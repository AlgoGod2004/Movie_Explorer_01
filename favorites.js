
const favoritesContainer = document.querySelector("#favoritesContainer");

// Get saved movies from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Display all saved movies
function displayFavorites() {
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <p class="col-span-full py-10 text-center text-slate-400">
        No favorite movies yet. Go to Home and add some movies!
      </p>
    `;
    return;
  }

  // Go through each favorite movie
  for (let i = 0; i < favorites.length; i++) {
    const movie = favorites[i];

    const card = `
      <div
        class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
      >
        <img
          src="${movie.poster}"
          alt="${movie.title} poster"
          class="h-80 w-full object-cover"
        >

        <div class="p-4">
          <h2 class="mb-4 text-lg font-bold">
            ${movie.title}
          </h2>

          <button
            class="removeFavorite w-full rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
            data-id="${movie.id}"
          >
            Remove Favorite
          </button>
        </div>
      </div>
    `;

    favoritesContainer.innerHTML += card;
  }
}

// Remove a movie from favorites
favoritesContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("removeFavorite")) {
    const movieId = event.target.dataset.id;

    // Find the movie in the favorites array
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].id === movieId) {
        favorites.splice(i, 1);
        break;
      }
    }

    // Save the updated array
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Display the updated favorites
    displayFavorites();
  }
});

// Show favorites when the page opens
displayFavorites();