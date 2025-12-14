# Google OAuth Setup Guide

## Overview
This guide explains how to set up Google OAuth authentication for your Canaan Homes application.

## Step 1: Install Required Packages

### Server
```bash
cd server
npm install google-auth-library
```
The following packages are already in your package.json:
- passport
- passport-google-oauth20
- express-session

### Client
```bash
cd client
npm install @react-oauth/google
```

## Step 2: Google OAuth Setup

### Get Google Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:5000/api/oauth/google/callback` (development)
   - `http://localhost:5173` (frontend)
   - Your production URLs
7. Copy your Client ID and Client Secret

### Update Environment Variables:

**server/.env:**
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
SERVER_URL=http://localhost:5000
```

**client/.env:**
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

## Step 3: Complete Environment Configuration

### server/.env (full example):
```
PORT=5000
MONGO_URI=mongodb://your_mongodb_connection_string
SESSION_SECRET=your_random_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### client/.env (full example):
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Step 4: How It Works

### Login/Signup Flow:

1. **Google Login:**
   - User clicks "Sign in with Google" button
   - Google OAuth popup appears
   - After successful authentication, Google token is sent to `/auth/google-token`
   - Server verifies the token and creates/updates user in database
   - JWT token is returned and stored in localStorage
   - User is redirected to dashboard

2. **Local Login:**
   - Traditional email/password login still works
   - OAuth and local authentication can be linked to same account

## Key Features:

✅ **Account Linking:** If user already exists with same email, OAuth ID is linked to existing account
✅ **Seamless Integration:** OAuth and local authentication work together
✅ **JWT Tokens:** All auth methods return JWT tokens for consistent session management
✅ **User Photo:** OAuth profile photos are automatically saved
✅ **Flexible Auth Provider:** Users can sign up with OAuth and later add password, or vice versa

## Files Modified/Created:
Google ID is linked to existing account
✅ **Seamless Integration:** Google OAuth and local authentication work together
✅ **JWT Tokens:** All auth methods return JWT tokens for consiste
- `server/routes/oauth.js` - OAuth callback routes
- `server/routes/auth.js` - Added `/auth/google-token` endpoint
- `server/models/User.js` - Added googleId and authProvider fields
- `server/server.js` - Added Passport middleware and OAuth routes
- `server/.env.example` - Environment variables template

### Client:
- `client/src/Login.jsx` - Added Google Sign-In button
- `client/src/Signup.jsx` - Added Google Sign-Up button
- `client/src/main.jsx` - Wrapped app with GoogleOAuthProvider
- `client/.env` - Added VITE_GOOGLE_CLIENT_ID

## Troubleshooting:

**"Google token verification failed"**
- Check GOOGLE_CLIENT_ID in .env matches the one from Google Cloud Console
- Verify authorized redirect URIs in Google Cloud Console

**"Token not found in localStorage"**
- Clear browser cache and localStorage
- Check browser console for errors
- Verify .env variables are loaded correctly

**CORS errors**
- Update CORS origin in server.js to match your frontend URL
- Check CLIENT_URL in .env matches your frontend address

## Next Steps:

1. Run `npm install` in both server and client directories
2. Update .env files with your OAuth credentials
3. Start the server: `npm start` (from server directory)
4. Start the client: `npm run dev` (from client directory)
5. Test Google and Facebook login on /login and /signup pages
Google OAuth credentials
3. Start the server: `npm start` (from server directory)
4. Start the client: `npm run dev` (from client directory)
5. Test Google