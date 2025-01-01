async function checkAuth() {
    const token = localStorage.getItem('token');
    const deviceId = localStorage.getItem('deviceId');
    const lastLoginTime = localStorage.getItem('lastLoginTime');

    if (!token || !deviceId) {
        handleLogout();
        return false;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Device-ID': deviceId
            }
        });

        if (!response.ok) {
            handleLogout();
            return false;
        }

        // Update last login time
        localStorage.setItem('lastLoginTime', new Date().getTime());
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
        return false;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('deviceId');
    localStorage.removeItem('lastLoginTime');
    
    if (!window.location.pathname.includes('/auth/login.html')) {
        window.location.href = '/auth/login.html';
    }
}

// Check auth status every minute
setInterval(checkAuth, 60000);

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