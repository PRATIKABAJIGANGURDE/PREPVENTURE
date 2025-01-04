document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    errorDiv.textContent = '';
    successDiv.textContent = '';

    try {
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            throw new Error('Invalid reset link');
        }

        const response = await fetch('http://localhost:3000/api/public/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                password
            }),
        });

        const data = await response.json();
        
        if (response.ok) {
            successDiv.textContent = 'Password has been reset successfully';
            setTimeout(() => {
                window.location.href = '/public/auth/login.html';
            }, 2000);
        } else {
            throw new Error(data.error || 'Failed to reset password');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
} 