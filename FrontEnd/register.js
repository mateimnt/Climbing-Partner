// Confirm passwords match
function validateForm(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorDiv = document.getElementById("passwordMismatch");

    if (password !== confirmPassword) {
        errorDiv.style.display = "block";
        return false; // prevent form submission
    } else {
        errorDiv.style.display = "none";
    }

    // Send data to backend
    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Registration successful') {
            window.location.href = 'login.html';
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering. Please try again.');
    });

    return true; // allow form submission
}

// Attach the validateForm function to the form's submit event
document.getElementById("registerForm").addEventListener("submit", validateForm);

// Loading screen

window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});

// End
