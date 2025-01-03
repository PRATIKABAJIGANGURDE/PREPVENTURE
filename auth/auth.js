// Simplified auth handling
function login(email, password) {
    // For now, just redirect to dashboard
    window.location.href = '/index.html';
}

function register(name, email, password) {
    // For now, just redirect to login
    window.location.href = '/auth/login.html';
}

function logout() {
    window.location.href = '/auth/login.html';
} 