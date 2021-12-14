// NASA API
const favoritesBtn = document.querySelector("#favorites");
const loadMoreBtn = document.querySelector("#loadMore");
const resultsNav = document.querySelector("#resultsNav");
const loader = document.querySelector(".loader");
const imagesContainer = document.querySelector(".images-container");
const savedConfirmed = document.querySelector(".save-confirmed");
const count = 10;
const apiKey = "cldFC5ROcleXrvl5qScYMRImCw1Dmt93ZfVZbauc";
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

// Loader Event
const loading = function (e) {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
};

// Create card element
const createCard = function (page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Update Favorite button
    const addFavorite = `
      <p class="clickable" onclick="saveFavorite('${result.url}')">Add to Favorites</p>
      `;
    const deleteFavorite = `
      <p class="clickable" onclick="removeFavorite('${result.url}')">Remove from Favorites</p>
      `;
    const card = `
      <div class="card">
          <a href="#" title="View Full Image" target="_blank"
              ><img
                src="${result.url}"
                alt="${result.title}"
                class="card-img-top"
            /></a>
          <div class="card-body">
              <h5 class="card-title">${result.title}</h5>
              ${page === "results" ? addFavorite : deleteFavorite}
              <p class="card-text">${result.explanation}</p>
              <small class="text-muted">
                <strong>${result.date}</strong>
                <span>${result.copyright || ""}</span>
              </small>
          </div>
      </div>
      `;
    imagesContainer.insertAdjacentHTML("afterbegin", card);
  });
};

const updateDOM = function (page) {
  // Get Favorites from localStorage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createCard(page);
  loading();
};

// Get 10 images from NASA
const getNasaPictures = async function (page = "results") {
  // Show loader
  loader.classList.remove("hidden");
  try {
    const data = await fetch(apiURL);
    resultsArray = await data.json();
    updateDOM(page);
  } catch (err) {
    console.log(err);
  }
};

// Add item to favorites
const saveFavorite = function (itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      // Set Favorites in localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));

      // Show Save Confirmation for 2 seconds
      savedConfirmed.hidden = false;
      setTimeout(() => {
        savedConfirmed.hidden = true;
      }, 2000);
    }
  });
};

// Remove item from favorites
const removeFavorite = function (itemUrl) {
  delete favorites[itemUrl];
  //Update localStorage
  localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
  updateDOM("favorites");
};

getNasaPictures();

// {data,explanation,hdurl,title,url}

// Event Listeners
favoritesBtn.addEventListener("click", function () {
  getNasaPictures("favorites");
});
loadMoreBtn.addEventListener("click", function () {
  getNasaPictures("results");
});
