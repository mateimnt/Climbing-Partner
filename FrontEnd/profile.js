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

let weekDataTotal = 0;
let monthDataTotal = 0;
let yearDataTotal = 0;

async function getUserSentRoutes() {
    const token = localStorage.getItem('token');
    try {
        // Fetch all routes
        const routesResponse = await fetch('http://localhost:3000/api/routes');
        if (!routesResponse.ok) {
            throw new Error('Failed to fetch routes');
        }
        const routes = await routesResponse.json();
        console.log('Fetched routes:', routes); // Log fetched routes

        // Fetch user details
        const userResponse = await fetch('http://localhost:3000/user/details', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user details');
        }
        const userData = await userResponse.json();
        const userId = userData._id;
        console.log('User ID:', userId); // Log user ID

         // Initialize counts for each time period
         const weekData = { yellow: 0, green: 0, red: 0, blue: 0, black: 0, white: 0 };
         const monthData = { yellow: 0, green: 0, red: 0, blue: 0, black: 0, white: 0 };
         const yearData = { yellow: 0, green: 0, red: 0, blue: 0, black: 0, white: 0 };
 
         // Calculate dates for week, month, year
         const now = new Date();
         const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
         const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
         const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
 
         // Filter routes sent by the logged-in user and count occurrences of each color
         routes.forEach(route => {
             route.sentBy.forEach(entry => {
                 if (entry.userId === userId) {
                     const sentDate = new Date(entry.date);
                     const color = route.sideColor.toLowerCase();
                     console.log('color:', color, 'sentDate:', sentDate);
 
                     // Count based on time periods
                     if (sentDate >= oneWeekAgo) {
                         weekData[color]++;
                         weekDataTotal++;
                     }
                     if (sentDate >= oneMonthAgo) {
                         monthData[color]++;
                         monthDataTotal++;
                     }
                     if (sentDate >= oneYearAgo) {
                         yearData[color]++;
                         yearDataTotal++;
                     }
                 }
             });
         });
 
         console.log('Week Data:', weekDataTotal); // Log week data
         console.log('Month Data:', monthDataTotal); // Log month data
         console.log('Year Data:', yearDataTotal); // Log year data
 
         return { weekData, monthData, yearData, weekDataTotal, monthDataTotal, yearDataTotal };
     } catch (error) {
         console.error('Error fetching user sent routes:', error);
         return { weekData: {}, monthData: {}, yearData: {}, weekDataTotal: 0, monthDataTotal: 0, yearDataTotal: 0};
     }
 }

 console.log('Week Data:', weekDataTotal); // Log week data
 console.log('Month Data:', monthDataTotal); // Log month data
 console.log('Year Data:', yearDataTotal); // Log year data


// Function to create a bar chart
// Function to create a bar chart
function createBarChart(data) {
    const ctx = document.getElementById('myBarChart').getContext('2d');

    const maxDataValue = Math.max(
        data.yellow || 0,
        data.green || 0,
        data.red || 0,
        data.blue || 0,
        data.black || 0,
        data.white || 0
    );

    let yAxisMin = 0;
    let yAxisMax = 1;
    let stepSize = 0.2;

    // Determine y-axis scale based on maxDataValue
    if (maxDataValue <= 5) {
        yAxisMax = 5;
        stepSize = 1;
    } else if (maxDataValue <= 10) {
        yAxisMax = 10;
        stepSize = 2;
    } else {
        yAxisMax = Math.ceil(maxDataValue / 10) * 10; // Round up to nearest 10
        stepSize = 10;
    }

    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Yellow', 'Green', 'Red', 'Blue', 'Black', 'White'],
            datasets: [{
                label: 'Routes',
                data: [
                    data.yellow || 0,
                    data.green || 0,
                    data.red || 0,
                    data.blue || 0,
                    data.black || 0,
                    data.white || 0
                ],
                backgroundColor: [
                    'rgb(255, 255, 0)',// Yellow
                    'rgb(0, 128, 0)',  // Green
                    'rgb(255, 0, 0)',  // Red
                    'rgb(0, 0, 255)',  // Blue
                    'rgb(0, 0, 0)',    // Black
                    'rgb(255, 255, 255)'  // White
                ],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide the legend
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: yAxisMin,
                    max: yAxisMax,
                    ticks: {
                        stepSize: stepSize
                    },
                    position: 'right',
                    grid: {
                        display: false // Remove y-axis grid lines
                    }
                },
                x: {
                    grid: {
                        display: false // Remove x-axis grid lines
                    }
                }
            }
        }
    });

    return barChart;
}


// Usage example:
var chart = null;

const buttons = document.querySelectorAll('.button-group button');

async function handleWeekButtonClick() {
    weekDataTotal = 0;
    const userSentRoutes = await getUserSentRoutes();
    const weekButton = document.getElementById('weekBtn');
    buttons.forEach(button => button.classList.remove('active'));
    weekButton.classList.add('active');
    if (chart) {
        chart.destroy();
    }
    chart = createBarChart(userSentRoutes.weekData);
    totalNumber.textContent = weekDataTotal;
}

async function handleMonthButtonClick() {
    monthDataTotal = 0;
    const userSentRoutes = await getUserSentRoutes();
    const monthButton = document.getElementById('monthBtn');
    var totalNumber = document.getElementById('totalNumber')
    buttons.forEach(button => button.classList.remove('active'));
    monthButton.classList.add('active');
    if (chart) {
        chart.destroy();
    }
    chart = createBarChart(userSentRoutes.monthData);
    console.log('my chart', chart);
    totalNumber.textContent = monthDataTotal;
    console.log(monthDataTotal);
}

async function handleYearButtonClick() {
    yearDataTotal = 0;
    const userSentRoutes = await getUserSentRoutes();
    const yearButton = document.getElementById('yearBtn');
    var totalNumber = document.getElementById('totalNumber')
    buttons.forEach(button => button.classList.remove('active'));
    yearButton.classList.add('active');
    if (chart) {
        chart.destroy();
    }
    chart = createBarChart(userSentRoutes.yearData);
    totalNumber.textContent = yearDataTotal;
}

async function hideProfileElements (){
    const profileElements = document.querySelector('.profile-elements');
    const fullStats = document.querySelector('.full-stats');
    var totalNumber = document.getElementById('totalNumber');
    console.log(profileElements);
    profileElements.classList.add('d-none');
    fullStats.classList.remove('d-none');
    const userSentRoutes = await getUserSentRoutes();
    console.log('User Sent Routes:', userSentRoutes);
    getUserSentRoutes();
    chart = createBarChart(userSentRoutes.weekData);
    totalNumber.textContent = weekDataTotal;
    console.log(weekDataTotal);
}

