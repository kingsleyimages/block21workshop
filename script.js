const COHORT = '2412-FTB-ET-WEB-FT';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//DOM constants

const table = document.querySelector('#events');
const form = document.querySelector('#addEvent');
// const deleteButtonConst = document.querySelector('#events button');
const state = {
  events: [],
};

// get existing events and add them to state

async function getEvents() {
  const response = await fetch(API_URL);
  const json = await response.json();
  // add data from fetch to the state.events array
  state.events = json.data;
  // console.log(state);
  renderEvents();
  // TODO
}

async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
}

// delete event

async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    // if (json.success) {
    //   console.log(`Event with ID: ${eventId} deleted successfully`);
    // } else {
    //   console.log(`Failed to delete event with ID: ${eventId}`);
    // }
  } catch (err) {
    console.error(err);
  }
  // update events after deleting
  await getEvents();
}
// display events on the page

async function renderEvents() {
  if (!state.events.length) {
    table.innerHTML = `<p>No events found</p>`;
    return;
  }
  const eventList = state.events.map((event) => {
    const row = document.createElement('tr');

    const eventName = document.createElement('td');
    eventName.innerText = event.name;
    row.appendChild(eventName);
    const eventDescription = document.createElement('td');
    eventDescription.innerText = event.description;
    row.appendChild(eventDescription);
    const eventDate = document.createElement('td');
    eventDate.innerText = event.date;
    row.appendChild(eventDate);
    const eventLocation = document.createElement('td');
    eventLocation.innerText = event.location;
    row.appendChild(eventLocation);

    const delContainer = document.createElement('td');
    const deleteButton = document.createElement('button');
    // add class to button for targeting
    deleteButton.setAttribute('class', 'delete-button');
    // add data-id to button for retrieving id of event
    deleteButton.setAttribute('data-id', event.id);

    deleteButton.innerText = 'Delete Event';
    delContainer.appendChild(deleteButton);
    row.appendChild(delContainer);

    // console.log(row);
    return row;
  });
  table.replaceChildren(...eventList);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newEvent = {
    name: form.eventName.value,
    description: form.description.value,
    date: form.eventDate.value,
    location: form.eventLocation.value,
  };
  const result = await addEvent(newEvent);
  // adding event was successful
  if (result.success) {
    await getEvents();
  }
});

table.addEventListener('click', async (e) => {
  // listen to the table for a submit event
  // if the submit event contained the class delete-button
  if (e.target.classList.contains('delete-button')) {
    // retrieve the id of the event to be deleted
    const id = e.target.dataset.id;
    // pass the ide to the deleteEvent function
    await deleteEvent(id);
  }
});

async function render() {
  await getEvents();
}
render();
