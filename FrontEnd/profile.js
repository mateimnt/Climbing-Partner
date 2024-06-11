// Loading screen

window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});

// End

// Sign out button

document.addEventListener('DOMContentLoaded', function() {
    const signOutButton = document.querySelector('.sign-out-button');

    signOutButton.addEventListener('click', function() {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        
        // Redirect to index.html
        window.location.href = 'index.html';
    });
});

// End

// Fill username

document.addEventListener('DOMContentLoaded', function() {
    const userNameElement = document.querySelector('.user-name');

    async function fetchUserName() {
        try {
            const response = await fetch('http://localhost:3000/user/username', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Data received:', data); // Debug log
            userNameElement.textContent = data.username;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            userNameElement.textContent = 'Error loading name';
        }
    }

    fetchUserName();
});

// End