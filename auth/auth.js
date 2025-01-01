import config from '../config/config.js';

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const deviceId = generateDeviceId();

    try {
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;

        const response = await fetch(`${config.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Device-ID': deviceId
            },
            body: JSON.stringify({ 
                email, 
                password,
                deviceId 
            })
        });

        const data = await response.json();
        console.log('Login response:', data); // Debug log

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            localStorage.setItem('deviceId', deviceId);
            localStorage.setItem('lastLoginTime', new Date().getTime());
            alert('Login successful!');
            window.location.href = '/index.html';
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server connection error. Please try again later.');
    } finally {
        // Reset button state
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.textContent = 'Login';
        submitButton.disabled = false;
    }
});

// Generate unique device ID
function generateDeviceId() {
    const existingId = localStorage.getItem('deviceId');
    if (existingId) return existingId;
    
    const newId = 'dev_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', newId);
    return newId;
}

// Add ths to check if the server is running
fetch('https://prepventure-quiz.vercel.app/')
    .then(response => {
        console.log('Server is running');
    })
    .catch(error => {
        console.error('Server connection error:', error);
    }); 