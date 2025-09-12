import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { User } from "@shared/schema";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    // In a real implementation, we would verify Firebase ID tokens here
    // For now, we'll use a simple header-based authentication
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Extract the token (in real implementation, this would be a Firebase ID token)
    const token = authHeader.substring(7);
    
    // For demo purposes, we'll assume the token is the user's Firebase UID
    // In production, you would verify the Firebase ID token here
    const user = await storage.getUserByFirebaseUid(token);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = user;
    next();
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
