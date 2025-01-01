async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/auth/login.html')) {
            window.location.href = '/auth/login.html';
        }
        return false;
    }
    return true;
}

// Check protected routes
document.addEventListener('DOMContentLoaded', () => {
    const protectedPaths = [
        '/physics/',
        '/math/',
        '/chemistry/',
        '/bio/'
    ];
    
    const currentPath = window.location.pathname;
    const isProtectedRoute = protectedPaths.some(path => currentPath.includes(path));
    
    if (isProtectedRoute) {
        checkAuth();
    }
});

// Export functions for use in other files
window.checkAuth = checkAuth;
window.login = () => window.location.href = '/auth/login.html';
window.logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login.html';
}; 