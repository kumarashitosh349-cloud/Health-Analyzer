<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Health Analyzer

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3e58ad92-5eea-4ea9-8ce4-e31dc903a7a0

## Firebase setup

This app uses Firebase Authentication and Cloud Firestore. User profiles are stored at `users/{uid}`; saved reports and analyses are stored in that user's `reports` and `analyses` subcollections.

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com/), then add a Web app under **Project settings > General > Your apps**.
2. Under **Authentication > Sign-in method**, enable Email/Password. Enable Google if you want Google sign-in, and configure its support email and authorized domains.
3. Create a Cloud Firestore database. Choose a region appropriate for your users and applicable data requirements.
4. Copy `.env.example` to `.env.local` and fill in the Firebase web app configuration values from the Firebase console, along with your `GEMINI_API_KEY`. `.env.local` is git-ignored.
5. Install the Firebase CLI if needed, log in, and select your project:

   ```sh
   npx firebase-tools login
   npx firebase-tools use --add
   ```

6. Deploy the included owner-only Firestore rules:

   ```sh
   npx firebase-tools deploy --only firestore:rules
   ```

7. Install dependencies and start the app:

   ```sh
   npm install
   npm run dev
   ```

Firebase web config values (including the API key) are included in the browser app and are not server secrets. Keep Firestore rules restrictive; never use public/test rules for patient or account data. This demo is not a substitute for a security or regulatory review before storing real health information.
