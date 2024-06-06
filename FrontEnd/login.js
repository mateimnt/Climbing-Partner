document.addEventListener('DOMContentLoaded', (event) => {
    function validateForm(event) {
        event.preventDefault(); // Prevent default form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Send data to backend
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                alert('Login successful!');
                // Optionally store the token
                localStorage.setItem('token', data.token);
                // Optionally redirect to a protected page
                window.location.href = 'profile.html';
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again.');
        });

        return true; // allow form submission
    }

    // Attach the validateForm function to the form's submit event
    document.getElementById("loginForm").addEventListener("submit", validateForm);
});

// Loading screen

window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});

// End
