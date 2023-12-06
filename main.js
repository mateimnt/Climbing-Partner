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
    fetch('data.json') // Assuming data.json is in the same directory
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(cardsArray => {
            if (cardSection !== null) {
                // Clear existing cards in cardSection
                while (cardSection.firstChild) {
                    cardSection.removeChild(cardSection.firstChild);
                }

                // Create new cards based on the fetched data
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

function toggleFilterSection() {
    var filterSection = document.getElementById('filterSection');
    filterSection.classList.toggle('hidden');
}






