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

document.addEventListener('DOMContentLoaded', function() {
    const userNameElement = document.querySelector('.user-name');
    const pointsElement = document.querySelector('.points-nr');
    const memberSinceElement = document.querySelector('.member-since');
    
    async function fetchUserDetails() {
        const token = localStorage.getItem('token');
        if (!token) {
            userNameElement.textContent = 'Not logged in';
            pointsElement.textContent = '0 points';
            memberSinceElement.textContent = 'Member since: N/A';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Data received:', data); // Debug log
            
            // Update username
            if (userNameElement) {
                userNameElement.textContent = data.username;
                console.log('Updated username:', userNameElement.textContent); // Log to verify the update
            } else {
                console.error('Username element not found.');
            }

            // Update points
            if (pointsElement) {
                pointsElement.textContent = `${data.points} points`;
                console.log('Updated points:', pointsElement.textContent); // Log to verify the update
            } else {
                console.error('Points element not found.');
            }

             // Update member since
             if (memberSinceElement) {
                const date = new Date(data.createdAt);
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(date);
                memberSinceElement.textContent = `${formattedDate}`;
                console.log('Updated member since:', memberSinceElement.textContent); // Log to verify the update
            } else {
                console.error('Member since element not found.');
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            userNameElement.textContent = 'Error loading name';
            pointsElement.textContent = '0 points';
        }
    }

    fetchUserDetails();
});
