function checkAuth() {
    const token = localStorage.getItem('token');
    const publicPaths = [
        '/auth/login.html', 
        '/auth/register.html', 
        '/auth/forgot-password.html'
    ];
    const currentPath = window.location.pathname;

    if (!token && !publicPaths.includes(currentPath)) {
        localStorage.setItem('redirectAfterLogin', currentPath);
        window.location.href = '/auth/login.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth); 