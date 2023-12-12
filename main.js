// Card creating function

let cardSection = document.getElementById("card-section")

function createCard(card) {
    let cardLink = document.createElement("a");
    cardLink.className = "card-example d-flex justify-content-between my-3";

    let cardDiv = document.createElement("div");
    cardDiv.className = "d-flex";

    let sideColorDiv = document.createElement("div");
    sideColorDiv.className = "route-side-color " + card.sideColor;

    let routeImage = document.createElement("img");
    routeImage.className = "route-image";
    routeImage.src = `${card.pictureUrl}`;

    let routeInfo = document.createElement("div");
    routeInfo.className = "route-info d-flex flex-column justify-content-between w-100";

    let routeTypeIcons = document.createElement("div");
    routeTypeIcons.className = "route-type-icons d-flex justify-content-start mx-1 my-2";

    card.type.forEach(typeClass => {
        let typeIconDiv = document.createElement("div");
        let typeIcon = document.createElement("i");
        typeIcon.className = "type-icon " + "fa-solid " + typeClass;
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

    arrowIcon.addEventListener("click", showRoutePage);

    arrowIconDiv.appendChild(arrowIcon);

    repeatIconDiv.appendChild(repeatIcon);

    routeInfo.appendChild(routeTypeIcons);
    routeInfo.appendChild(repeatIcon);

    cardDiv.appendChild(sideColorDiv);
    cardDiv.appendChild(routeImage);

    cardLink.appendChild(cardDiv);
    cardLink.appendChild(routeInfo);
    cardLink.appendChild(arrowIconDiv);

    return cardLink;
}

function fetchDataAndCreateCards() {
    fetch('data.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(cardsArray => {
            if (cardSection !== null) {
                Array.from(cardSection.children).forEach(existingCard => {
                    existingCard.style.display = 'none';
                });

                cardsArray.forEach(function (card) {
                    let routeCard = createCard(card);
                    cardSection.appendChild(routeCard);
                });
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


// Call the function to fetch data and create cards
fetchDataAndCreateCards();

// End

// Toggle filter section

function toggleFilterSection() {
    var filterSection = document.getElementById('filterSection');
    filterSection.classList.toggle('hidden');
}

// End

// Show route page

function showRoutePage() {
    cardSection.classList.toggle('hidden');
    document.querySelector(".route-page").style.display = "block";
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
    // Change the background color directly
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




// 



