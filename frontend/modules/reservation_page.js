import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them
  const URL = config.backendEndpoint+"/reservations"
  try {
    const response = await fetch(URL)
    const data = await response.json()
    console.log(data)
    return data
  } catch(err) {
    console.log(err)
    return null
  }
  // Place holder for functionality to work in the Stubs
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table
  const noReservationBanner = document.getElementById('no-reservation-banner')
  const reservationTable = document.getElementById('reservation-table-parent')
  if(reservations.length <= 0) {
    noReservationBanner.setAttribute("style", "display: block")
    reservationTable.setAttribute("style", "display: none")
    return
  } else {
    noReservationBanner.setAttribute("style", "display: none")
    reservationTable.setAttribute("style", "display: block")

    const tableBody = document.getElementById('reservation-table')
    reservations.forEach(reservation => {
      const date = new Date(reservation.date)
      console.log(date.toLocaleDateString('en-IN'))
      const time = new Date(reservation.time)
      console.log(time.toLocaleString('en-IN', {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }))
      const tableRow = document.createElement('tr')
      tableRow.innerHTML = `
      <td>${reservation.id}</td>
      <td>${reservation.name}</td>
      <td>${reservation.adventureName}</td>
      <td>${reservation.person}</td>
      <td>${date.toLocaleDateString('en-IN')}</td>
      <td>${reservation.price}</td>
      <td>${time.toLocaleString('en-IN', {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).replace(' at', ',')}</td>
      <td id=${reservation.id}><a href="/frontend/pages/adventures/detail/?adventure=${reservation.adventure}" class="reservation-visit-button">Visit Adventure</td>
      `
      tableBody.append(tableRow)
    });
  }
  //Conditionally render the no-reservation-banner and reservation-table-parent

  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */

}

export { fetchReservations, addReservationToTable };
