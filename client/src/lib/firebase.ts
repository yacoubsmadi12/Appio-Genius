import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: any = null;
let auth: any = null;

try {
  // Only initialize Firebase if all required config values are present
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
    // Check if Firebase app is already initialized to avoid duplicate app error
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp(); // Use existing app
    }
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase configuration is incomplete. Authentication features will be disabled.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  console.warn("Authentication features will be disabled.");
}

export { auth };
export default app;
