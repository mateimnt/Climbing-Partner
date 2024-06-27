function showAddImagePage() {
    // Get references to the elements
    const addButton = document.querySelector('.add-route-button');
    const mainUserPage = document.querySelector('.main-user-page');
    const addImagePage = document.querySelector('.add-image-page');

    // Hide the add button and main user page
    addButton.classList.add('d-none');
    mainUserPage.classList.add('d-none');

    // Show the add route page
    addImagePage.classList.remove('d-none');
}

function showAddDetailsPage() {
    // Get references to the elements
    const addDetailsPage = document.querySelector('.add-details-page');
    const addImagePage = document.querySelector('.add-image-page');

    // Hide the add button and main user page
    
    addImagePage.classList.add('d-none');

    // Show the add route page
    addDetailsPage.classList.remove('d-none');
}

// Function to show everything again
function hideAddRoutePage() {
    const addButton = document.querySelector('.add-route-button');
    const mainUserPage = document.querySelector('.main-user-page');
    const addImagePage = document.querySelector('.add-image-page');
    const addDetailsPage = document.querySelector('.add-details-page');

    // Show the add button and main user page
    addButton.classList.remove('d-none');
    mainUserPage.classList.remove('d-none');

    // Hide the add route page
    addImagePage.classList.add('d-none');
    addDetailsPage.classList.add('d-none');
}

let selectedColor = ''; // Global variable to store selected color
let selectedTypes = []; // Global variable to store selected types
let selectedImageUrl = ''; // Global variable to store selected image URL

function toggleAdminColorsButtons(button) {
    const buttons = document.querySelectorAll('.color-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedColor = button.id;

    // Hide all icons
    buttons.forEach(btn => {
        const icon = btn.querySelector('.admin-color-icon');
        icon.classList.add('hidden');
    });

    // Show the icon of the clicked button
    const icon = button.querySelector('.admin-color-icon');
    icon.classList.remove('hidden');
}

function toggleTypeButtonAdmin(button) {
    button.classList.toggle('active');
    const type = button.id;
    if (selectedTypes.includes(type)) {
        selectedTypes = selectedTypes.filter(t => t !== type);
    } else {
        selectedTypes.push(type);
    }
}

async function addRoute() {
    const imageUrlInput = document.getElementById('imageUrl');
    selectedImageUrl = imageUrlInput.value.trim();

    console.log('Data to be sent:', { selectedColor, selectedImageUrl, selectedTypes });

    if (!selectedColor || !selectedImageUrl || selectedTypes.length === 0) {
        alert('Please fill in all the fields.');
        return;
    }

    const routeData = {
        sideColor: selectedColor,
        pictureUrl: selectedImageUrl,
        typeClass: selectedTypes
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(routeData)
        });

        if (!response.ok) {
            throw new Error('Failed to add route');
        }

        const result = await response.json();
        console.log('Route added successfully:', result);
        window.location.reload();
        hideAddRoutePage();
    } catch (error) {
        console.error('Error adding route:', error);
        alert('Error adding route');
    }
}






