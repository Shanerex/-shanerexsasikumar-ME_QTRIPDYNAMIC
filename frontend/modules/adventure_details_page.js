import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const URL = new URLSearchParams(search);
  const params = URL.get("adventure");
  // Place holder for functionality to work in the Stubs
  return params;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try {
    const URL =
      config.backendEndpoint + "/adventures/detail/?adventure=" + adventureId;
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }

  // Place holder for functionality to work in the Stubs
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  //Name
  const adventureName = document.getElementById("adventure-name");
  adventureName.textContent = adventure.name;

  //Subtitle
  const adventureSubtitle = document.getElementById("adventure-subtitle");
  adventureSubtitle.textContent = adventure.subtitle;

  //Images
  const photoGallery = document.getElementById("photo-gallery");
  adventure.images.forEach((imgSrc, index) => {
    const photoDiv = document.createElement("div");

    const image = document.createElement("img");
    image.setAttribute("class", "activity-card-image");
    image.setAttribute("src", imgSrc);
    image.setAttribute("alt", `${adventure.name} image ${index + 1}`);

    photoDiv.append(image);
    photoGallery.append(photoDiv);
  });

  //Adventure content
  const adventureContent = document.getElementById("adventure-content");
  adventureContent.textContent = adventure.content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  const photoGallery = document.getElementById("photo-gallery");
  photoGallery.innerHTML = "";
  const carousel = document.createElement("div");
  carousel.setAttribute("id", "carouselExampleIndicators");
  carousel.setAttribute("class", "carousel slide");
  carousel.setAttribute("data-bs-ride", "carousel");

  const carouselIndicators = document.createElement("div");
  carouselIndicators.setAttribute("class", "carousel-indicators");
  images.forEach((image, index) => {
    const indicatorBtn = document.createElement("button");

    indicatorBtn.setAttribute("type", "button");
    indicatorBtn.setAttribute("data-bs-target", "#carouselExampleIndicators");
    indicatorBtn.setAttribute("data-bs-slide-to", index);
    if (index == 0) {
      indicatorBtn.setAttribute("class", "active");
      indicatorBtn.setAttribute("aria-current", "true");
    }
    indicatorBtn.setAttribute("aria-label", `Slide ${index + 1}`);

    carouselIndicators.append(indicatorBtn);
  });

  const carouselInner = document.createElement("div");
  carouselInner.setAttribute("class", "carousel-inner");

  images.forEach((image, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index == 0) carouselItem.classList.add("active");

    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", image);
    imgElement.setAttribute("alt", `Image ${index + 1}`);
    imgElement.setAttribute("class", "activity-card-image d-block");

    carouselItem.append(imgElement);
    carouselInner.append(carouselItem);
  });
  carousel.append(carouselIndicators);
  carousel.append(carouselInner);

  carousel.innerHTML += `
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `;

  photoGallery.append(carousel);
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  console.log(adventure.available);
  if (adventure.available) {
    //hiding soldout panel
    const soldOutPanel = document.getElementById("reservation-panel-sold-out");
    soldOutPanel.setAttribute("style", "display: none");

    //showing reservation panel
    const reservationPanel = document.getElementById(
      "reservation-panel-available"
    );
    reservationPanel.setAttribute("style", "display: block");

    const costPerHead = document.getElementById("reservation-person-cost");
    costPerHead.textContent = adventure.costPerHead;
  } else {
    //showing soldout panel
    const soldOutPanel = document.getElementById("reservation-panel-sold-out");
    soldOutPanel.setAttribute("style", "display: block");

    //hiding reservation panel
    const reservationPanel = document.getElementById(
      "reservation-panel-available"
    );
    reservationPanel.setAttribute("style", "display: none");
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  const totalElement = document.getElementById("reservation-cost");

  const total = adventure.costPerHead * persons;
  console.log(total);

  totalElement.textContent = total;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  const form = document.getElementById("myForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.elements["name"].value;
    const date = form.elements["date"].value;
    const noOfPersons = form.elements["person"].value;

    const URL = config.backendEndpoint + "/reservations/new";
    const dataToSend = {
      name: name,
      date: date,
      person: noOfPersons,
      adventure: adventure.id,
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
      if (response.ok) {
        alert("Success!");
        location.reload();
      } else {
        alert("Failed!");
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  });
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  const reservedBanner = document.getElementById("reserved-banner");
  if (adventure.reserved) {
    reservedBanner.setAttribute("style", "display: block");
  } else {
    reservedBanner.setAttribute("style", "display: none");
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
