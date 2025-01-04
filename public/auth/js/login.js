document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorDiv = document.getElementById('error-message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', 'user-token');
            localStorage.setItem('username', username);
            
            const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/index.html';
            localStorage.removeItem('redirectAfterLogin');
            
            window.location.href = redirectUrl;
        } else {
            errorDiv.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Clear login attempts after successful login
window.addEventListener('load', () => {
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
    }
}); 