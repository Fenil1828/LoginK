// Firebase Authentication Module
console.log("Firebase Auth Module Loaded");

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  signInWithRedirect,
  getRedirectResult,
  OAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

// Firebase Configuration
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
let app, auth, analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  analytics = getAnalytics(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Redirect URL after successful authentication
const REDIRECT_URL = "https://krupixi-k38.vercel.app/";

// Helper function to store user data
function storeUserData(user) {
  localStorage.setItem('user', JSON.stringify({
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email,
    photoURL: user.photoURL || null,
    uid: user.uid
  }));
}

// Helper function to handle authentication errors
function handleAuthError(error) {
  console.error("Authentication error:", error.code, error.message);
  
  let errorMsg = "Authentication failed. Please try again.";
  
  switch(error.code) {
    case 'auth/email-already-in-use':
      errorMsg = "This email is already registered. Please sign in instead.";
      break;
    case 'auth/invalid-email':
      errorMsg = "Invalid email address. Please check and try again.";
      break;
    case 'auth/weak-password':
      errorMsg = "Password is too weak. Please use a stronger password.";
      break;
    case 'auth/wrong-password':
      errorMsg = "Incorrect password. Please try again.";
      break;
    case 'auth/user-not-found':
      errorMsg = "No account found with this email. Please sign up first.";
      break;
    case 'auth/popup-blocked':
      errorMsg = "Pop-up blocked by browser. Please allow pop-ups for this site.";
      break;
    case 'auth/unauthorized-domain':
      errorMsg = "This domain is not authorized for OAuth operations.";
      console.error("Add this domain to Firebase Console > Authentication > Sign-in methods > Authorized domains");
      break;
    case 'auth/operation-not-allowed':
      errorMsg = "This authentication method is not enabled.";
      console.error("Enable this auth method in Firebase Console > Authentication > Sign-in method");
      break;
    case 'auth/account-exists-with-different-credential':
      errorMsg = "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.";
      break;
    case 'auth/cancelled-popup-request':
      // User cancelled, no need to show error
      return;
    case 'auth/apple-auth-error':
      errorMsg = "Apple authentication failed. Please try again or use another method.";
      break;
  }
  
  alert(errorMsg);
}

// Handle redirection after authentication
function redirectAfterAuth() {
  window.location.href = REDIRECT_URL;
}

// Email/Password Sign Up
async function emailSignUp(email, password, fullname) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully");
    
    // Update user profile with name
    await updateProfile(userCredential.user, { displayName: fullname });
    console.log("Profile updated with name:", fullname);
    
    storeUserData(userCredential.user);
    redirectAfterAuth();
    return userCredential.user;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
}

// Email/Password Sign In
async function emailSignIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in successfully");
    
    storeUserData(userCredential.user);
    redirectAfterAuth();
    return userCredential.user;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
}

// Google Authentication
async function googleAuth() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Try popup method first
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful (popup)");
      storeUserData(result.user);
      redirectAfterAuth();
      return result.user;
    } catch (popupError) {
      // If popup is blocked, fall back to redirect
      if (popupError.code === 'auth/popup-blocked') {
        console.log("Popup blocked, trying redirect method");
        await signInWithRedirect(auth, provider);
        return null; // Redirect will happen, so no user to return yet
      } else {
        throw popupError; // Re-throw other errors
      }
    }
  } catch (error) {
    handleAuthError(error);
    return null;
  }
}

// Apple Authentication
async function appleAuth() {
  try {
    const provider = new OAuthProvider('apple.com');
    
    // Apple-specific configuration
    provider.addScope('email');
    provider.addScope('name');
    
    // Optional: Request user's name during sign-in
    provider.setCustomParameters({
      // Request user name and email from Apple
      locale: 'en',
      // Customize how Apple displays the sign-in screen
      response_mode: 'form_post'
    });
    
    // Try popup method first
    try {
      console.log("Starting Apple sign-in popup flow");
      const result = await signInWithPopup(auth, provider);
      console.log("Apple sign-in successful (popup)");
      
      // Apple may not return displayName, handle that case
      let displayName = result.user.displayName;
      
      // If no display name from Apple, use email or default
      if (!displayName) {
        displayName = result.user.email?.split('@')[0] || 'Apple User';
        // Try to update profile with display name if not provided
        try {
          await updateProfile(result.user, { displayName });
          console.log("Updated profile with display name from email");
        } catch (profileError) {
          console.error("Could not update profile with display name", profileError);
        }
      }
      
      storeUserData(result.user);
      redirectAfterAuth();
      return result.user;
    } catch (popupError) {
      console.error("Apple popup error:", popupError.code, popupError.message);
      
      // If popup is blocked, fall back to redirect
      if (popupError.code === 'auth/popup-blocked') {
        console.log("Popup blocked, trying redirect method for Apple sign-in");
        await signInWithRedirect(auth, provider);
        return null;
      } else if (popupError.code === 'auth/cancelled-popup-request') {
        console.log("User cancelled the Apple sign-in");
        return null;
      } else if (popupError.code === 'auth/operation-not-allowed') {
        alert("Apple Sign-In is not enabled. Please enable it in Firebase console.");
        console.error("Enable Apple Sign-In in Firebase console > Authentication > Sign-in method");
        return null;
      } else {
        throw popupError;
      }
    }
  } catch (error) {
    handleAuthError(error);
    return null;
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("Setting up auth event listeners");
  
  // Check for redirect result (from Google or Apple redirect auth)
  getRedirectResult(auth)
    .then(result => {
      if (result && result.user) {
        console.log("Got redirect result");
        storeUserData(result.user);
        redirectAfterAuth();
      }
    })
    .catch(error => {
      console.error("Redirect result error:", error);
    });
  
  // Get form elements
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const googleLoginBtn = document.getElementById('google-login');
  const appleLoginBtn = document.getElementById('apple-login');
  
  // Email/password login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await emailSignIn(email, password);
    });
  }
  
  // Email/password signup form
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const fullname = document.getElementById('fullname').value;
      
      if (!email || !password || !confirmPassword || !fullname) {
        alert("Please fill out all fields");
        return;
      }
      
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      
      await emailSignUp(email, password, fullname);
    });
  }
  
  // Google login button
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log("Google login button clicked");
      await googleAuth();
    });
  }
  
  // Apple login button
  if (appleLoginBtn) {
    appleLoginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log("Apple login button clicked");
      await appleAuth();
    });
  }
  
  // Set up tab switching
  setupTabSwitching();
});

// Tab switching functionality
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const signupLink = document.querySelector('.signup-link');
  const accountText = document.getElementById('account-text');
  
  if (!tabs.length || !loginForm || !signupForm || !signupLink || !accountText) {
    console.error("Some UI elements were not found for tab switching");
    return;
  }
  
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
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    });
  });
});