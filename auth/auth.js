// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;

        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data); // Debug log

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
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

// Add this to check if the server is running
fetch('http://localhost:5000/auth/verify')
    .then(response => {
        console.log('Server is running');
    })
    .catch(error => {
        console.error('Server connection error:', error);
    }); 