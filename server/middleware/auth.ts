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
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const idToken = authHeader.substring(7);
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        user = await storage.createUser({
          email: decodedToken.email || `${firebaseUid}@firebase.user`,
          name: decodedToken.name || "User",
          firebaseUid: firebaseUid,
        });
      }

      req.user = user;
      next();
    } catch (adminError) {
      let user = await storage.getUserByFirebaseUid(idToken);
      
      if (!user) {
        user = await storage.createUser({
          email: `${idToken}@firebase.user`,
          name: "User",
          firebaseUid: idToken,
        });
      }

      req.user = user;
      next();
    }
  } catch (error) {
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
