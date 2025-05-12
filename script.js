
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.tab');
    const loginTabs = document.querySelector('.login-tabs');
    const signupLink = document.querySelector('.signup-link');
    const accountText = document.getElementById('account-text');
    
    // Password toggle functionality with updated selector for new HTML structure
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle eye icon - updated for new HTML structure
            const eyeIcon = this.querySelector('i');
            if (type === 'password') {
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        });
    });
    
    // Tab switching functionality
    function showForm(formType) {
        if (formType === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            accountText.textContent = "Don't have an account?";
            signupLink.textContent = "Sign Up";
            loginTabs.classList.remove('signup-active');
        } else {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            accountText.textContent = "Already have an account?";
            signupLink.textContent = "Log In";
            loginTabs.classList.add('signup-active');
        }
    }
    
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show the appropriate form
                const tabName = tab.getAttribute('data-tab');
                showForm(tabName);
            });
        });
    }
    
    // Also toggle via the bottom signup/login link
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle between forms
            if (loginForm.classList.contains('active')) {
                // Currently showing login, switch to signup
                tabs[1].click(); // Click the signup tab
            } else {
                // Currently showing signup, switch to login
                tabs[0].click(); // Click the login tab
            }
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Display loading state on button
            const loginButton = loginForm.querySelector('.login-btn');
            const originalText = loginButton.textContent;
            loginButton.textContent = 'Logging in...';
            loginButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Login submitted:', { email, password, rememberMe });
                
                // Reset button
                loginButton.textContent = originalText;
                loginButton.disabled = false;
                
                // Show success message (in real app, redirect to dashboard)
                alert('Login successful!');
            }, 1500);
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Basic validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            if (!termsAccepted) {
                alert('Please accept the Terms & Conditions.');
                return;
            }
            
            // Display loading state on button
            const signupButton = signupForm.querySelector('.login-btn');
            const originalText = signupButton.textContent;
            signupButton.textContent = 'Creating Account...';
            signupButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Signup submitted:', { fullName, email, password, termsAccepted });
                
                // Reset button
                signupButton.textContent = originalText;
                signupButton.disabled = false;
                
                // Show success message
                alert('Account created successfully! Please log in.');
                
                // Reset form and switch to login
                signupForm.reset();
                tabs[0].click(); // Switch to login tab
            }, 1500);
        });
    }
    
//     // Handle social login buttons
//     const socialButtons = document.querySelectorAll('.social-btn');
//     if (socialButtons.length > 0) {
//         socialButtons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const provider = button.classList[1]; // google, apple, etc.
                
//                 // Example of what you would do:
//                 console.log(`Authenticate with ${provider}`);
//                 alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication would happen here.`);
//             });
//         });
//     }


}); 

