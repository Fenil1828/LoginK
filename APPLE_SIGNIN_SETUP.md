# Setting Up Apple Sign-In with Firebase

To get Apple Sign-In working with your Firebase project, follow these steps:

## Prerequisites
- An Apple Developer account ($99/year)
- Access to Firebase console with admin permissions
- Your web app domain

## Step 1: Configure Apple Developer Account

1. Sign in to your [Apple Developer Account](https://developer.apple.com)
2. Go to "Certificates, Identifiers & Profiles"
3. Under "Identifiers", click the "+" to register a new identifier
4. Select "App IDs" and click "Continue"
5. Select "App" type and click "Continue"
6. Enter a description and Bundle ID (e.g., "com.krupixi.app")
7. Scroll down to "Capabilities" and enable "Sign In with Apple"
8. Click "Continue" and then "Register"

## Step 2: Create a Service ID

1. In "Identifiers", click "+" again
2. Select "Service IDs" and click "Continue"
3. Enter a description and identifier (e.g., "com.krupixi.service")
4. Enable "Sign In with Apple"
5. Click "Configure" and add your domain and redirect URL
   - Domain: Your website domain (e.g., "krupixi-k38.vercel.app")
   - Return URL: `https://<your-firebase-project-id>.firebaseapp.com/__/auth/handler`
6. Save and click "Continue", then "Register"

## Step 3: Create a Private Key

1. Go to "Keys" in the sidebar and click "+"
2. Enter a key name and enable "Sign In with Apple"
3. Click "Configure" for Sign In with Apple
4. Select your Primary App ID created in Step 1
5. Click "Save" and "Continue", then "Register"
6. Download the key file (it downloads only ONCE)

## Step 4: Set Up Apple Sign-In in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Authentication" > "Sign-in method"
4. Click on "Apple"
5. Enable the provider
6. Enter the following details:
   - Service ID: The service ID created in Step 2
   - Apple Team ID: Found in your Apple Developer account membership page
   - Key ID: The ID of the private key created in Step 3
   - Private Key: Upload the key file downloaded in Step 3
7. Click "Save"

## Step 5: Add Authorized Domains

1. Still in Firebase Authentication
2. Go to the "Settings" tab
3. Under "Authorized domains", add your web app domain
   - Add both localhost and your production domain

## Step 6: Test Apple Sign-In

1. Open your web app
2. Click the "Continue with Apple" button
3. Check the browser console for any errors

## Troubleshooting

- If you see "invalid_request" error: Double-check your Service ID and redirect URLs
- If you see "unauthorized_client": Ensure your domain is properly authorized
- If sign-in popup doesn't appear: Check for popup blockers and console errors

## Notes

- Apple Sign-In requires HTTPS, so it won't work on plain HTTP
- The Apple User ID is unique per app, per user, per device
- Apple doesn't always provide user's name or email after the first sign-in 