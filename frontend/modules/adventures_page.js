import config from "../conf/index.js";

let adventuresCopy = ""

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  const urlObj = new URLSearchParams(search);
  const cityId = urlObj.get("city");
  console.log(cityId);
  return cityId;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  const URL = config.backendEndpoint + "/adventures?city=" + city;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    adventuresCopy=data;
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  adventures.forEach((adventure) => {
    addAdventureCardToDOM(
      adventure.id,
      adventure.category,
      adventure.image,
      adventure.name,
      adventure.costPerHead,
      adventure.duration,
      adventure.currency
    );
  });
}

function addAdventureCardToDOM(
  id,
  category,
  image,
  name,
  cost,
  duration,
  currency
) {
  const row = document.getElementById("data");
  const col = document.createElement("col");
  col.setAttribute("class", "col-6 col-lg-3 mb-3");

  const aTag = document.createElement("a");
  aTag.setAttribute("href", "detail/?adventure=" + id);
  aTag.setAttribute("id", id);

  const activityCard = document.createElement("div");
  activityCard.setAttribute("class", "activity-card");

  const categoryComponent = document.createElement("div");
  categoryComponent.setAttribute("class", "category-banner");
  categoryComponent.innerHTML = `
  <span>${category}</span>
  `;

  const img = document.createElement("img");
  img.setAttribute("src", image);
  img.setAttribute("alt", name);

  const priceDiv = document.createElement("div");
  priceDiv.setAttribute(
    "class",
    "w-100 d-flex justify-content-between p-2 pb-0"
  );
  priceDiv.innerHTML = `
  <span>${name}</span>
  <span>${currency} ${cost}</span>
  `;

  const durationDiv = document.createElement("div");
  durationDiv.setAttribute("class", "w-100 d-flex justify-content-between p-2");
  durationDiv.innerHTML = `
  <span>Duration</span>
  <span>${duration} hours</span>
  `;

  activityCard.append(categoryComponent);
  activityCard.append(img);
  activityCard.append(priceDiv);
  activityCard.append(durationDiv);
  aTag.append(activityCard);
  col.append(aTag);
  row.append(col);
}

async function fetchNewAdventures(city) {
  const URL = config.backendEndpoint + "/adventures/new";
  const dataToSend = {
    city: city,
  };
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  };
  try {
    const response = await fetch(URL, settings);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
    return null;
  }
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  return list.filter(
    (adventure) => adventure.duration >= low && adventure.duration <= high
  );
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list

  let filteredList = list.filter((adventure) =>
    categoryList.includes(adventure.category)
  );
  return filteredList;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  // Place holder for functionality to work in the Stubs
  if (filters.duration.length) {
    let hours = filters.duration.split("-");
    console.log(hours);
    list = filterByDuration(list, hours[0], hours[1]);
    console.log(list);
  }

  if (filters.category.length) {
    list = filterByCategory(list, filters.category);
  }

  console.log(list);
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  // if(localStorage.getItem('filters') != null) return JSON.parse(localStorage.getItem('filters'))
  // Place holder for functionality to work in the Stubs
  // return null;
  return JSON.parse(localStorage.getItem("filters"));
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  const categoryList = document.getElementById("category-list");
  console.log(filters);
  if (filters.duration != "") {
    document.getElementById("duration-select").value = filters.duration;
  }
  filters.category.forEach((category, index) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("class", "category-filter");
    categoryDiv.setAttribute("style", "position: relative");

    const categoryText = document.createElement("span");
    categoryText.setAttribute("class", "me-3");
    categoryText.textContent = category;

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("class", "btn");
    closeBtn.setAttribute("style", "position: absolute;right:0;top:0");
    closeBtn.innerHTML = `
    <i class="fa fa-close"></i>
    `;
    closeBtn.addEventListener("click", () => {
      filters.category.splice(index, 1);
      document.getElementById("data").innerHTML = "";
      categoryList.innerHTML = "";
      generateFilterPillsAndUpdateDOM(filters);
      let filteredAdventures = filterFunction(adventuresCopy, filters);
      addAdventureToDOM(filteredAdventures);
      saveFiltersToLocalStorage(filters);
    });

    categoryDiv.append(categoryText);
    categoryDiv.append(closeBtn);
    categoryList.append(categoryDiv);
  });
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  fetchNewAdventures,
};
