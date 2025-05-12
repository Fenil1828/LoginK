console.log("Firebase script loaded!");

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

console.log("Firebase imports successful");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOyl07Kkv3cx3juqGjYKf3r9-b0w4edwg",
  authDomain: "krupixi.firebaseapp.com",
  projectId: "krupixi",
  storageBucket: "krupixi.firebasestorage.app",
  messagingSenderId: "1007726706266",
  appId: "1:1007726706266:web:3e70f2b00ea7833ed9a263",
  measurementId: "G-KG5HP066N1"
};

// Initialize Firebase
let app, analytics, auth, provider;

try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized:", app.name);
  
  analytics = getAnalytics(app);
  auth = getAuth(app);
  auth.languageCode = 'en';
  provider = new GoogleAuthProvider();
  console.log("Firebase auth initialized");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Handle tab switching
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality elements
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const signupLink = document.querySelector('.signup-link');
  const accountText = document.getElementById('account-text');

  // Tab switching functionality
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show corresponding form
      const tabType = tab.getAttribute('data-tab');
      if (tabType === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        accountText.textContent = "Don't have an account?";
        signupLink.textContent = "Sign Up";
      } else if (tabType === 'signup') {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        accountText.textContent = "Already have an account?";
        signupLink.textContent = "Log In";
      }
    });
  });

  // Handle signup/login link click
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginForm.classList.contains('active')) {
      // Switch to signup
      tabs[1].click(); // Click signup tab
    } else {
      // Switch to login
      tabs[0].click(); // Click login tab
    }
  });

  // Handle form submissions
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      console.log("Login attempted with email:", email);
      
      try {
        import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js')
          .then(({ signInWithEmailAndPassword }) => {
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("User logged in:", user);
                
                localStorage.setItem('user', JSON.stringify({
                  displayName: user.displayName || email.split('@')[0],
                  email: user.email,
                  uid: user.uid
                }));
                
                window.location.href = "https://krupixi-k38.vercel.app/";
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Login error:", errorCode, errorMessage);
                alert("Login failed: " + errorMessage);
              });
          });
      } catch(e) {
        console.error("Error importing Firebase auth:", e);
        alert("Login system error. Please try again later.");
      }
    });
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const fullname = document.getElementById('fullname').value;
      
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      
      console.log("Signup attempted with email:", email);
      
      try {
        import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js')
          .then(({ createUserWithEmailAndPassword, updateProfile }) => {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log("User created:", user);
                
                // Update the user profile with the fullname
                return updateProfile(user, {
                  displayName: fullname
                }).then(() => {
                  console.log("Profile updated with name:", fullname);
                  
                  localStorage.setItem('user', JSON.stringify({
                    displayName: fullname,
                    email: user.email,
                    uid: user.uid
                  }));
                  
                  window.location.href = "https://krupixi-k38.vercel.app/";
                });
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Signup error:", errorCode, errorMessage);
                alert("Sign up failed: " + errorMessage);
              });
          });
      } catch(e) {
        console.error("Error importing Firebase auth:", e);
        alert("Sign up system error. Please try again later.");
      }
    });
  }

  // Google sign-in functionality
  const googleLoginButtons = document.querySelectorAll('[id="google-login"]');
  console.log("Found Google login buttons:", googleLoginButtons.length);
  
  if (googleLoginButtons.length > 0) {
    googleLoginButtons.forEach(button => {
      console.log("Adding click listener to Google button:", button.className);
      button.addEventListener("click", handleGoogleLogin);
    });
  } else {
    console.error("No Google login buttons found!");
  }
});

function handleGoogleLogin(e) {
    e.preventDefault();
    console.log("Google login clicked");
    
    if (!auth || !provider) {
      console.error("Firebase auth not initialized properly");
      alert("Authentication system not initialized. Please try again later.");
      return;
    }
    
    // Simplify the Google sign-in configuration
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    
    // Try using a different authentication method if popup is being blocked
    try {
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            console.log("Successfully logged in:", user);
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid
            }));
            
            // Redirect to your app
            const redirectUrl = "https://krupixi-k38.vercel.app/";
            console.log("Redirecting to:", redirectUrl);
            
            // Redirect after successful login
            window.location.href = redirectUrl;
        }).catch((error) => {
            // Handle specific error codes
            if (error.code === 'auth/popup-blocked') {
                alert("Popup was blocked. Please allow popups for this website and try again.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log("Popup request was cancelled by the user");
                // No need to show alert for user cancellation
            } else if (error.code === 'auth/unauthorized-domain') {
                alert("This domain is not authorized for OAuth operations. Please add it to your Firebase console.");
                console.error("Unauthorized domain. Add this domain to Firebase console > Authentication > Sign-in method > Authorized domains");
            } else {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Firebase auth error:", errorCode, errorMessage);
                console.error("Error details:", error);
                alert("Login failed: " + errorMessage);
            }
        });
    } catch (e) {
        console.error("Error during signInWithPopup:", e);
        alert("Authentication failed. Please try again later.");
    }
}