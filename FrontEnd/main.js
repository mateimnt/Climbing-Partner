// Filters
// Toggle filter section

function toggleFilterSection() {
  var filterSection = document.getElementById('filterSection');
  filterSection.classList.toggle('hidden');
}

// End

// Toggle button

let activeButtons = { group1: null, group2: null, group3: null };

function toggleOneButton(button) {
    if (!button || !button.dataset || !button.dataset.group) {
        return;
    }

    const group = button.dataset.group;

    if (activeButtons[group] !== null && activeButtons[group] !== button) {
        activeButtons[group].style.backgroundColor = '';
    }

    if (button.style.backgroundColor === 'white' || button.style.backgroundColor === '') {
        button.style.backgroundColor = 'white';
        activeButtons[group] = button;
    } else {
        button.style.backgroundColor = '';
        activeButtons[group] = null;
    }
}

window.onload = function () {
    const defaultGroup1Button = document.querySelector('[data-group="group1"]');
    const defaultGroup2Button = document.querySelector('[data-group="group2"]');
    const defaultGroup3Button = document.querySelector('[data-group="group3"]');

    toggleOneButton(defaultGroup1Button);
    toggleOneButton(defaultGroup2Button);
    toggleOneButton(defaultGroup3Button);
};


// Toggle color buttons
function toggleColorsButtons(button) {
  const icon = button.querySelector('.color-icon');
  icon.classList.toggle('hidden');

  const color = button.id.replace('Btn', '').toLowerCase(); // Extract color from button ID

  if (activeColors.has(color)) {
      activeColors.delete(color); // Remove color if it's already active
  } else {
      activeColors.add(color); // Add color if it's not active
  }

  renderCards(currentSortOrder, currentFilter); // Re-render cards based on active filters
}

// End

// End Filters

// Card js

// Card creating function

let cardSection = document.getElementById("card-section");
let userId;
let currentRouteId = null;
const token = localStorage.getItem('token');
console.log(token);

// Card creating function using DOM
function createCard(card) {
    let cardLink = document.createElement("a");
    cardLink.className = "card-link card-example d-flex justify-content-between my-3";
    cardLink.setAttribute("data-route-id", card._id);

    let cardDiv = document.createElement("div");
    cardDiv.className = "d-flex position-relative";

    let sideColorDiv = document.createElement("div");
    sideColorDiv.className = "route-side-color " + card.sideColor;

    let routeImage = document.createElement("img");
    routeImage.className = "route-image";
    routeImage.src = card.pictureUrl;
    routeImage.setAttribute("data-route-id", card._id);

    let mainCheckIconContainer = document.createElement("div");
    mainCheckIconContainer.className = "main-check-icon d-none";
    mainCheckIconContainer.setAttribute("data-route-id", card._id);

    let mainCheckIcon = document.createElement("i");
    mainCheckIcon.className = "fa-solid fa-check";

    let routeInfo = document.createElement("div");
    routeInfo.className = "route-info d-flex flex-column justify-content-between w-100";

    let routeTypeIcons = document.createElement("div");
    routeTypeIcons.className = "route-type-icons d-flex justify-content-start mx-1 my-2";

    card.typeClass.forEach(typeClass => {
        let typeIconDiv = document.createElement("div");
        let typeIcon = document.createElement("i");
        typeIcon.className = "type-icon fa-solid " + typeClass;
        typeIconDiv.appendChild(typeIcon);
        routeTypeIcons.appendChild(typeIconDiv);
    });

    let repeatIconDiv = document.createElement("div");
    let repeatIcon = document.createElement("i");
    repeatIcon.className = "repeat-icon fa-solid fa-rotate-right mx-2 my-2";
    repeatIcon.textContent = card.sentBy.length;

    let arrowIconDiv = document.createElement("div");
    arrowIconDiv.className = "d-flex align-items-center mx-2";
    
    let arrowIcon = document.createElement("div");
    arrowIcon.className = "card-arrow-icon fa-solid fa-angle-right";
    
    arrowIconDiv.appendChild(arrowIcon);

    repeatIconDiv.appendChild(repeatIcon);

    routeInfo.appendChild(routeTypeIcons);
    routeInfo.appendChild(repeatIconDiv);

    mainCheckIconContainer.appendChild(mainCheckIcon);

    cardDiv.appendChild(sideColorDiv);
    cardDiv.appendChild(routeImage);
    cardDiv.appendChild(mainCheckIconContainer);

    cardLink.appendChild(cardDiv);
    cardLink.appendChild(routeInfo);
    cardLink.appendChild(arrowIconDiv);

    return cardLink;
}
// End

// Get user ID 
if(token != null){
document.addEventListener('DOMContentLoaded', async function() {
  try {
      const userResponse = await fetch('http://localhost:3000/user/details', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (!userResponse.ok) {
          throw new Error('Network response was not ok');
      }

      const userData = await userResponse.json();
      userId = userData._id;

  } catch (error) {
      console.error('Error fetching user details or routes:', error);
  }
});
}

// End

// Create the cards with the data from the data base
let routeCards = []; // To store fetched route cards
let currentSortOrder = 'new';
let currentFilter = null;
let activeColors = new Set(); // To store active colors
let activeTypes = new Set(); // To store active types

// Fetch route cards from backend and create cards
async function fetchDataAndCreateCards() {
    try {
        const response = await fetch('http://localhost:3000/api/routes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        routeCards = data; // Store fetched data
        renderCards(currentSortOrder, currentFilter); // Render cards based on the initial sort order and filter
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Render cards based on sort order, filter, and active colors
function renderCards(sortOrder, filter) {
    if(token != null){
      updateRouteImagesOpacity();
    }
    if(token != null){
      updateMainCheckIcon();
    }
    // Clear the card section
    cardSection.innerHTML = '';

    // Apply filter and sorting
    let filteredData = routeCards;

    if (activeColors.size > 0) {
        filteredData = filteredData.filter(card => activeColors.has(card.sideColor));
    }

    if (activeTypes.size > 0) {
      filteredData = filteredData.filter(card => 
          [...activeTypes].every(type => card.typeClass.includes(type))
      );
  }

    if (filter === 'many') {
        filteredData = sortByRepetitionsDescending(filteredData);
    } else if (filter === 'few') {
        filteredData = sortByRepetitionsAscending(filteredData);
    } else if (sortOrder === 'new') {
        filteredData = sortByNew(filteredData);
    } else if (sortOrder === 'old') {
        filteredData = sortByOld(filteredData);
    }

    // Update number of routes
    const noOfRoutes = filteredData.length;
    const noOfRoutesElement = document.getElementById('no-of-routes');
    noOfRoutesElement.textContent = `${noOfRoutes} Routes`;

    // Create and append card elements
    filteredData.forEach(cardData => {
        const cardElement = createCard(cardData);
        cardSection.appendChild(cardElement);
        if (!cardElement.hasEventListenerAdded) {
            cardElement.addEventListener('click', (event) => {
                event.preventDefault();
                const routeId = cardElement.getAttribute('data-route-id');
                handleCardClick(routeId);
                displayRouteDetails(routeId, userId);
                hideEverything();
            });
            cardElement.hasEventListenerAdded = true;
        }
    });
}

// Sort functions
function sortByNew(data) {
    return data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function sortByOld(data) {
    return data.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function sortByRepetitionsDescending(data) {
    return data.slice().sort((a, b) => b.sentBy.length - a.sentBy.length);
}

function sortByRepetitionsAscending(data) {
    return data.slice().sort((a, b) => a.sentBy.length - b.sentBy.length);
}

// Toggle type buttons
function toggleTypeButton(button) {
  button.classList.toggle('active');

  const typeClass = button.id; // Use button ID as the type

  if (activeTypes.has(typeClass)) {
      activeTypes.delete(typeClass); // Remove type if it's already active
      button.style.backgroundColor = ''; // Change background to grey when inactive
  } else {
      activeTypes.add(typeClass); // Add type if it's not active
      button.style.backgroundColor = 'white'; // Change background to white when active
  }

  renderCards(currentSortOrder, currentFilter); // Re-render cards based on active filters
}

// Add event listeners to sort and filter buttons
document.getElementById('newBtn').addEventListener('click', () => {
    currentSortOrder = 'new';
    currentFilter = null;
    renderCards(currentSortOrder, currentFilter);
});

document.getElementById('oldBtn').addEventListener('click', () => {
    currentSortOrder = 'old';
    currentFilter = null;
    renderCards(currentSortOrder, currentFilter);
});

document.getElementById('manyBtn').addEventListener('click', () => {
    currentFilter = 'many';
    currentSortOrder = null;
    renderCards(currentSortOrder, currentFilter);
});

document.getElementById('fewBtn').addEventListener('click', () => {
    currentFilter = 'few';
    currentSortOrder = null;
    renderCards(currentSortOrder, currentFilter);
});

// Add event listeners to color filter buttons
document.querySelectorAll('.clr-green, .clr-red, .clr-yellow, .clr-blue, .clr-black, .clr-white').forEach(button => {
    button.addEventListener('click', () => toggleColorsButtons(button));
});

// Initial fetch and render
fetchDataAndCreateCards();


// End

if(token != null){
document.addEventListener('DOMContentLoaded', async function() {
  updateRouteImagesOpacity();
});
}

if(token != null){
document.addEventListener('DOMContentLoaded', async function() {
  updateMainCheckIcon();
});
}

async function updateRouteImagesOpacity() {
  try {
    const userResponse = await fetch('http://localhost:3000/user/details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const userData = await userResponse.json();
    const userId = userData._id;

    // Fetch routes
    const response = await fetch('http://localhost:3000/api/routes');
    const routes = await response.json();
    console.log(routes);

    // Get all route images
    const routeImages = document.querySelectorAll('.route-image');

    routeImages.forEach((image) => {
      const routeId = image.getAttribute('data-route-id');
      const route = routes.find(route => route._id === routeId);

      if (route && route.sentBy.some(entry => entry.userId.toString() === userId.toString())) {
        image.classList.add('image-opacity');
    } else {
        image.classList.remove('image-opacity');
    }    
    });
  } catch (error) {
    console.error('Error fetching user details or routes:', error);
  }
}


async function updateMainCheckIcon() {
  try {
    const userResponse = await fetch('http://localhost:3000/user/details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const userData = await userResponse.json();
    const userId = userData._id;

    // Fetch routes
    const response = await fetch('http://localhost:3000/api/routes');
    const routes = await response.json();

    // Get all route images
    const mainCheckIcons = document.querySelectorAll('.main-check-icon');

    mainCheckIcons.forEach((icon) => {
      const routeId = icon.getAttribute('data-route-id');
      const route = routes.find(route => route._id === routeId);

      if (route && route.sentBy.some(entry => entry.userId.toString() === userId.toString())) {
        icon.classList.remove('d-none');
       } else {
         icon.classList.add('d-none');
      }
    });
  } catch (error) {
    console.error('Error fetching user details or routes:', error);
  }
}

function handleCardClick(routeId) {
  const routeImage = document.querySelector(`.route-image[data-route-id="${routeId}"]`);
  console.log(routeImage);
  const oneRouteImage = document.querySelector('.one-route-image');
  const checkIcon = document.querySelector('.check-icon')
  if(routeImage.classList.contains('image-opacity')){
    oneRouteImage.classList.add('image-opacity');
    checkIcon.classList.remove('d-none');
    
  }
  console.log("added");

}


// Show one route page

function toggleRoutePage() {
    var routePage = document.getElementById('oneRoutePage');
    routePage.classList.toggle('hidden');
    routePage.classList.toggle('active');
}

function hideEverything() {
    var mainUserPage = document.querySelector('.main-user-page');
    mainUserPage.classList.add('hidden');
    toggleRoutePage();
}

function showEverything() {
    var mainUserPage = document.querySelector('.main-user-page');
    const oneRouteImage = document.querySelector('.one-route-image');
    const checkIcon = document.querySelector('.check-icon')
    checkIcon.classList.add('d-none');
    oneRouteImage.classList.remove('image-opacity');
    mainUserPage.classList.toggle('hidden');
    toggleRoutePage();
    updateRouteImagesOpacity();
    updateMainCheckIcon();
    const routeId = getCurrentRouteId(); 
    updateRepeatNumber(routeId);
}

// End

// Flip One Route Page Card

function toggleFlip() {
    const container = document.querySelector('.flip-card');
    container.classList.toggle('flipped');
}

// End

// Function to toggle between card-front and card-send
function toggleCardSend() {
    const flipCardInner = document.querySelector('.flip-card-inner');
    const cardFront = flipCardInner.querySelector('.card-front');
    const cardSend = flipCardInner.querySelector('.card-send');

    cardSend.classList.toggle('hidden');
    cardFront.classList.toggle('hidden');
}

// Updating the one-route-page with the details of the selected route from main-page and updating sent/not sent scenario

async function displayRouteDetails(routeId, userId) {
  currentRouteId = routeId;
  const typeMapping = {
    'fa-dumbbell': 'Power',
    'fa-cat': 'Tricky',
    'fa-medal': 'Rewarding'
  };
  const url = `http://localhost:3000/api/routes/${routeId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const routeDetails = await response.json();
    
    const repeatIconElement = document.getElementById('repeat-icon');
        if (repeatIconElement) {
            const repeatNr = routeDetails.sentBy.length;
            repeatIconElement.innerText = repeatNr;
            console.log('Updated repeatNr:', repeatNr); 
        } else {
            console.error('Repeat icon element not found.');
        }
    
    const repeatitionsCardBack = document.getElementById('repetitions-card-back');
    if (repeatitionsCardBack) {
        const repeatNr = routeDetails.sentBy.length;
        repeatitionsCardBack.innerText = repeatNr;
        console.log('Updated repeatNr:', repeatNr); 
    } else {
        console.error('Repeat icon element not found.');
    }

    const routeSideColorElement = document.getElementById('one-route-side-color');
    if (routeSideColorElement) {
      routeSideColorElement.classList.remove('green', 'red', 'blue', 'yellow', 'black', 'white');
      routeSideColorElement.classList.add(routeDetails.sideColor);
      console.log('Updated route-side-color:', routeDetails.sideColor); 
    } else {
      console.error('Route side color element not found.');
    }

    const oneRouteImageElement = document.getElementById('one-route-image');
    if (oneRouteImageElement) {
      oneRouteImageElement.src = routeDetails.pictureUrl; 
      console.log('Updated image src:', oneRouteImageElement.src); 
    } else {
      console.error('One route image element not found.');
    }

    // Update the icons
    const icons = routeDetails.typeClass || [];
    for (let i = 0; i < 3; i++) {
        const iconElement = document.getElementById(`icon-${i + 1}`);
        const iconElementBorder = document.getElementById(`icon-border-${i + 1}`);
        if (iconElement) {
            if (icons[i]) {
                iconElement.className = `one-route-icons fa-solid ${icons[i]}`;
                iconElementBorder.className = 'info-icon-border';
            } else {
                iconElement.className = 'one-route-icons fa-solid';
                iconElementBorder.className = ' ';
            }
        }
    }

     // New code for displaying type names
     const typeNames = icons.map(icon => typeMapping[icon]).filter(name => name);
     const typesParagraph = document.getElementById('types-card-back');
     typesParagraph.textContent = typeNames.join(', ');
 
    const colorDot = document.getElementById('color-dot');
    if (colorDot) {
      colorDot.classList.remove('green', 'red', 'blue', 'yellow', 'black', 'white');
      colorDot.classList.add(routeDetails.sideColor);
      console.log('Updated route-side-color:', colorDot.sideColor); 
    } else {
      console.error('Route side color element not found.');
    }

    const sendButtonContainer = document.getElementById('route-color');
    sendButtonContainer.innerHTML = ''; 
    const sendButton = document.createElement('button');
    sendButton.className = 'filter-button send-button';
    sendButton.textContent = 'Send';
    sendButton.dataset.routeId = routeId;
    if(token != null){
      sendButtonContainer.appendChild(sendButton);
    }
    sendButton.addEventListener('click', handleSendButtonClick);

    const unmarkButtonContainer = document.getElementById('unmark-button');
    unmarkButtonContainer.innerHTML = ''; 
    const unmarkButton = document.createElement('button');
    unmarkButton.className = 'unmark-button px-2';
    unmarkButton.textContent = 'Unmark Route';
    unmarkButton.dataset.routeId = routeId;
    unmarkButtonContainer.appendChild(unmarkButton);
    unmarkButton.style.display = 'none';
    unmarkButton.addEventListener('click', handleUnmarkButtonClick);

    if (sendButton && unmarkButton){
      if (routeDetails.sentBy.some(entry => entry.userId.toString() === userId.toString())) {
          sendButton.style.display = 'none';
          unmarkButton.style.display = 'block';
          // oneRouteImage.style.opacity = '0.5';
      } else {
          sendButton.style.display = 'block';
          unmarkButton.style.display = 'none';
          // oneRouteImage.style.opacity = '1';
      }
    }
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

// End

function getCurrentRouteId() {
  return currentRouteId;
}

function updateRepeatNumber(routeId) {
  // Find the route element in the DOM
  const routeElement = document.querySelector(`[data-route-id="${routeId}"]`);
  if (routeElement) {
      // Fetch the route data to get the updated sentBy field
      fetch(`http://localhost:3000/api/routes/${routeId}`)
          .then(response => response.json())
          .then(routeData => {
              // Update the repeat number based on the length of sentBy
              const repeatIcon = routeElement.querySelector('.repeat-icon');
              if (repeatIcon) {
                  repeatIcon.textContent = routeData.sentBy.length;
                  console.log(repeatIcon);
              }
          })
          .catch(error => console.error('Error fetching route data:', error));
  }
}

// Function to handle click event on the send button

async function handleSendButtonClick(event) {
  const button = event.target;
  const routeId = button.dataset.routeId;

  try {
    const response = await fetch('http://localhost:3000/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ routeId, action: 'add' })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    updateRepeatNumber(routeId);

    button.style.display = 'none';
    document.querySelector(`.unmark-button[data-route-id="${routeId}"]`).style.display = 'block';

    const addedPoints = data.points;
    const pointsMessageElement = document.getElementById('points-message');
    pointsMessageElement.textContent = `${addedPoints} points`;

    await handleMarkRouteAsSent(routeId);

    const oneRouteImage = document.querySelector('.one-route-image');
    const checkIcon = document.querySelector('.check-icon')
    console.log(checkIcon);
    oneRouteImage.classList.add('image-opacity');
    checkIcon.classList.remove('d-none');

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('User not logged in!');
  }

  toggleCardSend(); 
}
// End


// Function to handle click event on the unamrk button

async function handleUnmarkButtonClick(event) {
  const button = event.target;
  const routeId = button.dataset.routeId;

  try {
    const response = await fetch('http://localhost:3000/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ routeId, action: 'subtract' })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    updateRepeatNumber(routeId);

    button.style.display = 'none';
    document.querySelector(`.send-button[data-route-id="${routeId}"]`).style.display = 'block';

    const oneRouteImage = document.querySelector('.one-route-image');
    const checkIcon = document.querySelector('.check-icon')
    oneRouteImage.classList.remove('image-opacity');
    checkIcon.classList.add('d-none');
    
    await handleUnmarkRouteAsSent(routeId);

    console.log(data);
    button.style.display = 'none';
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('User not logged in!');
  }

  //toggleCardUnmark(); 
}
// End

// Function to handle click event on the close button in card-send

function handleCloseButtonClick() {
    toggleCardSend();
}
// End

// Function that handles adding the "sent route" status of the user to the sent route

async function handleMarkRouteAsSent(routeId) {
  try {
      const response = await fetch('http://localhost:3000/api/mark-as-sent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ routeId })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data.message);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

async function handleUnmarkRouteAsSent(routeId) {
  try {
      const response = await fetch('http://localhost:3000/api/unmark-as-sent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ routeId })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data.message);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}


// End

//Add event listeners to the send button and close button

document.querySelector('.card-send .close-button').addEventListener('click', handleCloseButtonClick);

// End

// Loading screen

window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});

// End

// Handle log in or profile page scenario

document.addEventListener('DOMContentLoaded', async function() {
  const userIconLink = document.querySelector('.user-icon');

  if (token) {
    try {
      const response = await fetch('http://localhost:3000/auth/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        userIconLink.href = 'profile.html';
      } else {
        localStorage.removeItem('token');
        userIconLink.href = 'login.html';
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
      userIconLink.href = 'login.html';
    }
  } else {
    userIconLink.href = 'login.html';
  }

});
// End

// Hide ranking button if not logged in
const rankingButton = document.querySelector('.ranking-button');
if(token != null){
  rankingButton.classList.remove('d-none');
}
// 

// End card js





