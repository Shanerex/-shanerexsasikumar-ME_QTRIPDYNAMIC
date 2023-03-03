import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();
  //Updates the DOM with the cities
  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  const endPoint = config.backendEndpoint + "/cities";

  try {
    let response = await fetch(endPoint);
    let data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM
  const row = document.getElementById("data");

  //<div class="col-sm-6 col-md-3 mb-4">
  const colDiv = document.createElement("div");
  colDiv.setAttribute("class", "col-6 col-md-3 mb-4");

  //<a href="pages/adventures/?city=paris" id="paris">
  const aTag = document.createElement("a");
  aTag.setAttribute("href", "pages/adventures/?city=" + id);
  aTag.setAttribute("id", id);
  
  const tileDiv = document.createElement("div")
  tileDiv.setAttribute("class", "tile")

  const img = document.createElement("img")
  img.setAttribute("src", image)
  img.setAttribute("alt", city)
  tileDiv.append(img)

  const tileTextDiv = document.createElement("div")
  tileTextDiv.setAttribute("class", "tile-text text-center")

  const cityName = document.createElement("h5")
  cityName.textContent = city
  const desc = document.createElement("p")
  desc.textContent = description


  tileTextDiv.append(cityName)
  tileTextDiv.append(desc)
  tileDiv.append(tileTextDiv)
  aTag.append(tileDiv)
  colDiv.append(aTag);
  row.append(colDiv);
}

export { init, fetchCities, addCityToDOM };
