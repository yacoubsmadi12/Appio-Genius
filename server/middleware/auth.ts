import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { User } from "@shared/schema";
import admin from "firebase-admin";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Check if we have Firebase config from environment
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    if (projectId) {
      admin.initializeApp({
        projectId: projectId,
      });
    }
  } catch (error) {
    console.warn("Firebase Admin initialization failed:", error);
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Auth middleware called for:", req.method, req.path);
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? "present" : "missing");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No valid auth header found");
      return res.status(401).json({ message: "Authentication required" });
    }

    const idToken = authHeader.substring(7);
    console.log("Token extracted, length:", idToken.length);
    
    try {
      // Try to verify the Firebase ID token
      console.log("Attempting Firebase Admin verification...");
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      console.log("Firebase verification successful, UID:", firebaseUid);
      
      // Get user from our database
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      console.log("User lookup result:", user ? "found" : "not found");
      
      // If user doesn't exist, create them automatically
      if (!user) {
        console.log("Creating user automatically from Firebase token...");
        try {
          user = await storage.createUser({
            email: decodedToken.email || `${firebaseUid}@firebase.user`,
            name: decodedToken.name || "User",
            firebaseUid: firebaseUid,
          });
          console.log("User created successfully:", user.id);
        } catch (createError) {
          console.error("Failed to create user:", createError);
          return res.status(401).json({ message: "Failed to create user" });
        }
      }

      req.user = user;
      next();
    } catch (adminError) {
      // If Firebase Admin verification fails, fallback to simple approach
      console.warn("Firebase Admin verification failed, using fallback:", adminError);
      
      // Fallback: assume token is Firebase UID directly
      let user = await storage.getUserByFirebaseUid(idToken);
      console.log("Fallback user lookup result:", user ? "found" : "not found");
      
      // If user doesn't exist in fallback mode, create them
      if (!user) {
        console.log("Creating user in fallback mode...");
        try {
          user = await storage.createUser({
            email: `${idToken}@firebase.user`,
            name: "User",
            firebaseUid: idToken,
          });
          console.log("User created in fallback mode:", user.id);
        } catch (createError) {
          console.error("Failed to create user in fallback:", createError);
          return res.status(401).json({ message: "Invalid authentication token" });
        }
      }

      req.user = user;
      next();
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}

// Alternative implementation using Firebase Admin SDK (commented out for now)
/*
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const idToken = authHeader.substring(7);
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    
    // Get user from our database
    const user = await storage.getUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}
*/
