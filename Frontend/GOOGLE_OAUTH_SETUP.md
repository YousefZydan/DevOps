# Google OAuth Setup Instructions

## Issue: "This content is blocked. Contact the site owner to fix the issue."

This error occurs because the backend's Google OAuth configuration is not properly set up. The backend developer needs to complete the following steps:

## Backend Configuration Required

### 1. Google Cloud Console Setup

The backend team needs to configure the OAuth consent screen and credentials at [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services > Credentials**
2. Select the OAuth 2.0 Client ID being used
3. Under "Authorized redirect URIs", add:
   \`\`\`
   https://clinic13.runasp.net/api/OAuth/google-response
   \`\`\`

### 2. Backend Redirect Configuration

After successful OAuth authentication, the backend should redirect to the frontend with the token:

\`\`\`
https://your-frontend-domain.com/oauth-callback?token=<jwt_token>
\`\`\`

Or for local development:
\`\`\`
http://localhost:3000/oauth-callback?token=<jwt_token>
\`\`\`

### 3. Environment Variables

The backend needs:
- `GOOGLE_CLIENT_ID`: The OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: The OAuth client secret from Google Cloud Console

### 4. OAuth Scopes

The backend should request these minimum scopes:
- `openid`
- `email`
- `profile`

## Frontend Implementation

The frontend is already configured to:
1. Redirect users to `/api/OAuth/signin-google`
2. Handle callbacks at `/oauth-callback`
3. Store the JWT token and user data
4. Show appropriate error messages

## Testing

Once the backend configuration is complete:

1. Click "Sign in with Google"
2. You should be redirected to Google's consent screen
3. After authorizing, you should be redirected back to the app
4. The app will store your token and log you in

## Troubleshooting

If you still see "This content is blocked":
- Verify the redirect URI in Google Cloud Console matches exactly (including http/https)
- Ensure the OAuth client ID is correctly configured in the backend
- Check that the OAuth consent screen is published (not in testing mode) or your email is added as a test user
- Clear browser cookies and try again
