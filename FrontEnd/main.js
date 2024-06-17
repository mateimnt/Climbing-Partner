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

// End Filters

// Card js

// Card creating function

let cardSection = document.getElementById("card-section");
let userId;

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
    mainCheckIconContainer.className = "main-check-icon";
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
    repeatIcon.textContent = card.repeatNr;

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

// End

// Create the cards with the data from the data base
async function fetchDataAndCreateCards() {
    try {
      const response = await fetch('http://localhost:3000/api/routes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      data.forEach(cardData => {
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
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

fetchDataAndCreateCards();
// End

document.addEventListener('DOMContentLoaded', async function() {
  updateRouteImagesOpacity();
});

document.addEventListener('DOMContentLoaded', async function() {
  updateMainCheckIcon();
});

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

    // Get all route images
    const routeImages = document.querySelectorAll('.route-image');

    routeImages.forEach((image) => {
      const routeId = image.getAttribute('data-route-id');
      const route = routes.find(route => route._id === routeId);

      if (route && route.sentBy.includes(userId)) {
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

      if (route && route.sentBy.includes(userId)) {
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
  const url = `http://localhost:3000/api/routes/${routeId}`;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const routeDetails = await response.json();
      console.log(routeDetails);
      const repeatIconElement = document.getElementById('repeat-icon');
      if (repeatIconElement) {
          repeatIconElement.innerText = routeDetails.repeatNr;
          console.log('Updated repeatNr:', repeatIconElement.innerText); 
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

    const sendButtonContainer = document.getElementById('route-color');
    sendButtonContainer.innerHTML = ''; 
    const sendButton = document.createElement('button');
    sendButton.className = 'filter-button send-button';
    sendButton.textContent = 'Send';
    sendButton.dataset.routeId = routeId;
    sendButtonContainer.appendChild(sendButton);
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
      if (routeDetails.sentBy.includes(userId)) {
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
  const token = localStorage.getItem('token');
  console.log(token);

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

// End card js





