// Card creating function

// main.js

let cardSection = document.getElementById("card-section");

function createCard(card) {
    let cardLink = document.createElement("a");
    cardLink.className = "card-link card-example d-flex justify-content-between my-3";
    cardLink.setAttribute("data-route-id", card._id);

    let cardDiv = document.createElement("div");
    cardDiv.className = "d-flex";

    let sideColorDiv = document.createElement("div");
    sideColorDiv.className = "route-side-color " + card.sideColor;

    let routeImage = document.createElement("img");
    routeImage.className = "route-image";
    routeImage.src = card.pictureUrl;

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
    repeatIcon.textContent = card.repeatNr;

    let arrowIconDiv = document.createElement("div");
    arrowIconDiv.className = "d-flex align-items-center mx-2";
    
    let arrowIcon = document.createElement("div");
    arrowIcon.className = "card-arrow-icon fa-solid fa-angle-right";
    
    arrowIconDiv.appendChild(arrowIcon);

    repeatIconDiv.appendChild(repeatIcon);

    routeInfo.appendChild(routeTypeIcons);
    routeInfo.appendChild(repeatIconDiv);

    cardDiv.appendChild(sideColorDiv);
    cardDiv.appendChild(routeImage);

    cardLink.appendChild(cardDiv);
    cardLink.appendChild(routeInfo);
    cardLink.appendChild(arrowIconDiv);

    return cardLink;
}

async function fetchDataAndCreateCards() {
    try {
      const response = await fetch('http://localhost:3000/api/routes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      data.forEach(cardData => {
          const cardElement = createCard(cardData);
          cardSection.appendChild(cardElement);

          if (!cardElement.hasEventListenerAdded) {
            cardElement.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                const routeId = cardElement.getAttribute('data-route-id');
                console.log('Route ID:', routeId); // Log the route ID to verify
                displayRouteDetails(routeId);
                hideEverything(); // Assuming this function hides the main page and shows the one-route page
            });
            cardElement.hasEventListenerAdded = true; // Flag to prevent adding listener again
        }
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

fetchDataAndCreateCards();
  
// async function fetchRouteDetails(routeId) {
//   try {
//       const response = await fetch(`http://localhost:3000/api/routes/${routeId}`);
//       if (!response.ok) {
//           throw new Error('Network response was not ok');
//       }
//       return await response.json();
//   } catch (error) {
//       console.error('There was a problem with the fetch operation:', error);
//   }
// }

// async function displayRouteDetails(routeId) {
//   const routeDetails = await fetchRouteDetails(routeId);
//   if (routeDetails) {
//       document.querySelector(".repeat-icon").textContent = routeDetails.repeatNr;
//       console.log(routeDetails.repeatNr);
      
//       // You can add more code here to populate other details if needed
      
//       // Hide main user page and show one-route-page
//       // document.querySelector(".main-user-page").classList.add("hidden");
//       // document.querySelector(".one-route-page").classList.remove("hidden");
//   }
// }

async function displayRouteDetails(routeId) {
  const url = `http://localhost:3000/api/routes/${routeId}`;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const routeDetails = await response.json();

      const repeatIconElement = document.getElementById('repeat-icon');
      if (repeatIconElement) {
          repeatIconElement.innerText = routeDetails.repeatNr;
          console.log('Updated repeatNr:', repeatIconElement.innerText); // Log to verify the update
      } else {
          console.error('Repeat icon element not found.');
      }

      const routeSideColorElement = document.getElementById('one-route-side-color');
    if (routeSideColorElement) {
      routeSideColorElement.classList.remove('green', 'red', 'blue', 'yellow', 'black', 'white');
      routeSideColorElement.classList.add(routeDetails.sideColor);
      console.log('Updated route-side-color:', routeDetails.sideColor); // Log to verify the update
    } else {
      console.error('Route side color element not found.');
    }

    const sendButtonContainer = document.getElementById('route-color');
    sendButtonContainer.innerHTML = ''; // Clear previous buttons
    const sendButton = document.createElement('button');
    sendButton.className = 'filter-button send-button';
    sendButton.textContent = 'Send';
    sendButton.dataset.routeId = routeId;
    sendButtonContainer.appendChild(sendButton);
    sendButton.addEventListener('click', handleSendButtonClick);

    // Create the unmark button
    const unmarkButtonContainer = document.getElementById('unmark-button');
    unmarkButtonContainer.innerHTML = ''; // Clear previous buttons
    const unmarkButton = document.createElement('button');
    unmarkButton.className = 'unmark-button px-2';
    unmarkButton.textContent = 'Unmark Route';
    unmarkButton.dataset.routeId = routeId;
    unmarkButtonContainer.appendChild(unmarkButton);
    unmarkButton.style.display = 'none';
    unmarkButton.addEventListener('click', handleUnmarkButtonClick);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}



// End

// Toggle filter section

function toggleFilterSection() {
    var filterSection = document.getElementById('filterSection');
    filterSection.classList.toggle('hidden');
}

// End

// Show route page

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
    mainUserPage.classList.toggle('hidden');
    toggleRoutePage();
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





function toggleMultipleButtons(button) {
    if (button.style.backgroundColor === 'white') {
        button.style.backgroundColor = '#C1C1C1';
    } else {
        button.style.backgroundColor = 'white';
    }
}

function toggleColorsButtons(button) {
    var icon = button.querySelector('.fa-check');

    icon.classList.toggle('hidden');

    if (!icon.classList.contains('hidden')) {
        button.style.backgroundColor = '';
    } else {
        button.style.backgroundColor = '';
    }
}




// End

// Flip One Route Page Card

function toggleFlip() {
    const container = document.querySelector('.flip-card');
    container.classList.toggle('flipped');
}

// End

// Change when pressing the Send button
// Function to toggle between card-front and card-send
function toggleCardSend() {
    var flipCardInner = document.querySelector('.flip-card-inner');
    var cardFront = flipCardInner.querySelector('.card-front');
    var cardSend = flipCardInner.querySelector('.card-send');

    // Toggle visibility of card-front and card-send
    cardFront.classList.toggle('hidden');
    cardSend.classList.toggle('hidden');
}

function toggleCardUnmark() {
  const cardFront = document.querySelector('.card-front');

  //Toggle visibility of card-front and card-send
  cardFront.classList.toggle('hidden');
  
}

async function fetchRoutes() {
  try {
    const response = await fetch('http://localhost:3000/api/routes');
    const routes = await response.json();

    // Add event listeners to each route card
    routes.forEach(route => {
      const cardLink = document.getElementById(route._id);
      if (cardLink) {
        cardLink.addEventListener('click', () => {
          displayRouteDetails(route._id);
          hideEverything();
        });
      }
    });

  } catch (error) {
    console.error('Error fetching routes:', error);
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

    button.style.display = 'none';
    document.querySelectorAll('.unmark-button').forEach(button => {
      button.style.display = 'block';
    });

    const addedPoints = data.points;
    const pointsMessageElement = document.getElementById('points-message');
    pointsMessageElement.textContent = `${addedPoints} points`;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('User not logged in!');
  }

  toggleCardSend(); // Toggle to show card-send
}


// Function to handle click event on the send button
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

    button.style.display = 'none';
    document.querySelectorAll('.send-button').forEach(button => {
      button.style.display = 'block';
    });

    console.log(data);
    button.style.display = 'none';
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('User not logged in!');
  }

  toggleCardUnmark(); // Toggle to show card-send
}


// Function to handle click event on the close button in card-send
function handleCloseButtonClick() {
    toggleCardSend();
}

//Add event listeners to the send button and close button
document.addEventListener('DOMContentLoaded', fetchRoutes);
document.querySelector('.card-send .close-button').addEventListener('click', handleCloseButtonClick);

// End

// Loading screen

window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});

// End

// Handle log in or profile page scenario

document.addEventListener('DOMContentLoaded', function() {
  const userIconLink = document.querySelector('.user-icon');
  const token = localStorage.getItem('token');
  console.log(token);

  if (token) {
      userIconLink.href = 'profile.html';
  } else {
      userIconLink.href = 'login.html';
  }
});

// End





