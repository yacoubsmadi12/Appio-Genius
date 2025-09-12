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
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
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
  signInWithRedirect(auth, provider);
};

export const handleGoogleRedirect = async () => {
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
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
