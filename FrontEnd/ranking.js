document.addEventListener('DOMContentLoaded', async () => {
    window.addEventListener('load', function() {
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
    });
    
    try {
        const response = await fetch('http://localhost:3000/user/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();

          // Log the data received to check its structure
          console.log('Received user data:', users);

          // Ensure users is an array
          if (!Array.isArray(users)) {
              throw new Error('Users data is not an array');
          }

        // Sort users by points in descending order
        users.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points; // Sort by points descending
            } else {
                // If points are the same, sort by createdAt ascending (older first)
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });

        const rankingBody = document.getElementById('rankingBody');

        // Populate the table with user data
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            if (index === 0) {
                row.classList.add('gold-background');
            } else if (index === 1) {
                row.classList.add('silver-background');
            } else if (index === 2) {
                row.classList.add('bronze-background');
            }
            row.innerHTML = `
                 <td style="background-color: transparent;">${index + 1}</td>
                <td style="background-color: transparent;">${user.username}</td>
                <td style="background-color: transparent;">${user.points}</td>
            `;
            rankingBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
