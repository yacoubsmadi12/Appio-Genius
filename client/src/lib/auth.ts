import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { apiRequest } from "./queryClient";

const provider = new GoogleAuthProvider();

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user in our database
  await apiRequest("POST", "/api/users", {
    email: result.user.email,
    name,
    firebaseUid: result.user.uid,
  });
  
  return result.user;
};

export const signInWithGoogle = () => {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  signInWithRedirect(auth, provider);
};

export const handleGoogleRedirect = async () => {
  if (!auth) {
    console.warn("Firebase authentication is not configured");
    return null;
  }
  const result = await getRedirectResult(auth);
  if (result && result.user) {
    // Check if user exists in our database, if not create them
    try {
      await apiRequest("POST", "/api/users", {
        email: result.user.email,
        name: result.user.displayName || "User",
        firebaseUid: result.user.uid,
      });
    } catch (error: any) {
      // User might already exist, which is fine
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }
  }
  return result;
};

export const logout = () => {
  if (!auth) {
    throw new Error("Firebase authentication is not configured");
  }
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    // If auth is not configured, immediately call callback with null user
    setTimeout(() => callback(null), 0);
    return () => {}; // Return empty unsubscribe function
  }
  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.warn("Firebase auth state change failed:", error);
    setTimeout(() => callback(null), 0);
    return () => {};
  }
};
