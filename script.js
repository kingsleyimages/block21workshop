const COHORT = '2412-FTB-ET-WEB-FT';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//DOM constants

const table = document.querySelector('#events');
const form = document.querySelector('#addEvent');

const state = {
  events: [],
};

// get existing events and add them to state

async function getEvents() {
  const response = await fetch(API_URL);
  const json = await response.json();

  state.events = json.data;
  console.log(state);
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
// display events on the page

function renderEvents() {
  if (!state.events.length) {
    table.innerHTML = `<p>No artists found</p>`;
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

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';
    row.appendChild(deleteButton);

    console.log(row);
    return row;
  });
  table.replaceChildren(...eventList);
}

async function render() {
  await getEvents();
  renderEvents();
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
  if (result.success) {
    await getEvents();
    renderEvents();
  }
});

render();
