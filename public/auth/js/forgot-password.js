document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    const button = e.target.querySelector('button');
    
    // Clear previous messages
    errorDiv.textContent = '';
    successDiv.textContent = '';
    
    try {
        button.disabled = true;
        button.textContent = 'Sending...';
        
        const email = e.target.email.value;
        console.log('Sending request for:', email); // Debug log

        const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        console.log('Response status:', response.status); // Debug log
        
        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid server response format');
        }

        if (response.ok) {
            successDiv.textContent = 'Password reset link has been sent to your email';
            e.target.reset();
        } else {
            throw new Error(data.error || 'Request failed');
        }
    } catch (error) {
        console.error('Error details:', error);
        errorDiv.textContent = error.message || 'An error occurred';
    } finally {
        button.disabled = false;
        button.textContent = 'Send Reset Link';
    }
}); 