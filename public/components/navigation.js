function createNavigation() {
    const token = localStorage.getItem('token');
    const nav = `
    <nav class="nav">
        <div class="logo">
            <img src="/public/landingpage/logo-prep.png" alt="Prepventure Logo">
        </div>
        <button class="menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div class="navbar">
            <ul>
                <li><a href="/index.html">Home</a></li>
                <li><a href="/public/physics/physics.html">Physics</a></li>
                <li><a href="/public/math/math.html">Mathematics</a></li>
                <li><a href="/public/chemistry/chem.html">Chemistry</a></li>
                <li><a href="/public/bio/bio.html">Biology</a></li>
            </ul>
        </div>
        <button class="button-submit" onclick="${token ? 'logout()' : 'login()'}">
            <span class="text">${token ? 'Logout' : 'Login'}</span>
            <span class="additional-text"> Now →</span>
        </button>
    </nav>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', nav);
}

function login() {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/public/auth/login.html';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/public/auth/login.html';
}

// Initialize navigation when page loads
document.addEventListener('DOMContentLoaded', () => {
    createNavigation();
    
    // Add menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });
}); 