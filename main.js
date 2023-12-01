// Card creating function
const cardsArray = [
    {
        id: 1,
        sideColor: "#eb4034",
        pictureUrl: "assets/route-picture.jpg",
        type1: "fa-solid fa-dumbbell",
        type2: "fa-solid fa-cat",
        type3: "fa-solid fa-medal",
        repeatNr: "10"
    },
    {
        id: 2,
        sideColor: "#24a328",
        pictureUrl: "assets/route-picture.jpg",
        type1: "fa-solid fa-dumbbell",
        type2: "fa-solid fa-cat",
        repeatNr: "10"
    },
    {
        id: 3,
        sideColor: "#344ceb",
        pictureUrl: "assets/route-picture.jpg",
        type: ["cat","medal"],
        type1: "fa-solid fa-cat",
        type2: "fa-solid fa-medal",
        repeatNr: "10"
    },
    {
        id: 4,
        sideColor: "#ede207",
        pictureUrl: "assets/route-picture.jpg",
        type1: "fa-solid fa-medal",
        repeatNr: "10"
    },
    {
        id: 5,
        sideColor: "#24a328",
        pictureUrl: "assets/route-picture.jpg",
        type1: "fa-solid fa-dumbbell",
        type2: "fa-solid fa-medal",
        repeatNr: "10"
    }
];

let cardSection = document.getElementById("card-section")

function createCard(card) {
    let cardLink = document.createElement("a");
    cardLink.className = "card-example d-flex justify-content-between my-3";

    let cardDiv = document.createElement("div");
    cardDiv.className = "d-flex";

    let sideColorDiv = document.createElement("div");
    sideColorDiv.className = "route-side-color";
    sideColorDiv.style.backgroundColor = card.sideColor;

    let routeImage = document.createElement("img");
    routeImage.className = "route-image";
    routeImage.src = `${card.pictureUrl}`;

    let routeInfo = document.createElement("div");
    routeInfo.className = "route-info d-flex flex-column justify-content-between w-100";

    let routeTypeIcons = document.createElement("div");
    routeTypeIcons.className = "route-type-icons d-flex justify-content-start mx-1 my-2";

    let typeIconDiv1 = document.createElement("div");
    let typeIconDiv2 = document.createElement("div");
    let typeIconDiv3 = document.createElement("div");

    let typeIcon1 = document.createElement("i");
    typeIcon1.className = "type-icon " + card.type1;

    let typeIcon2 = document.createElement("i");
    typeIcon2.className = "type-icon " + card.type2;

    let typeIcon3 = document.createElement("i");
    typeIcon3.className = "type-icon " + card.type3

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

    typeIconDiv1.appendChild(typeIcon1);
    typeIconDiv2.appendChild(typeIcon2);
    typeIconDiv3.appendChild(typeIcon3);

    routeTypeIcons.appendChild(typeIconDiv1);
    routeTypeIcons.appendChild(typeIconDiv2);
    routeTypeIcons.appendChild(typeIconDiv3);

    routeInfo.appendChild(routeTypeIcons);
    routeInfo.appendChild(repeatIcon);

    cardDiv.appendChild(sideColorDiv);
    cardDiv.appendChild(routeImage);

    cardLink.appendChild(cardDiv);
    cardLink.appendChild(routeInfo);
    cardLink.appendChild(arrowIconDiv);

    return cardLink;
}

if (cardSection !== null) {
    cardsArray.forEach(function (card) {
        while (cardSection.firstChild) {
            cardSection.removeChild(cardSection.firstChild);
        }
    cardsArray.forEach(function (card){
        let routeCard = createCard(card);
        cardSection.appendChild(routeCard);
    });
    })

}






