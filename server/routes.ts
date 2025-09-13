import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertContactMessageSchema } from "@shared/schema";
import { authenticateUser } from "./middleware/auth";
import { generateAndroidProject } from "./services/android-generator";
import fs from "fs";
import path from "path";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    fieldSize: 2 * 1024 * 1024  // 2MB for other fields
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, JPEG and WebP are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User management
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseUid(userData.firebaseUid);
      if (existingUser) {
        return res.json(existingUser);
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get current user projects
  app.get("/api/projects", authenticateUser, async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(req.user!.id);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate new Android app (supports both JSON and FormData)
  app.post("/api/generate-app", authenticateUser, upload.single('iconFile'), async (req, res) => {
    try {
      // Parse data from either JSON or FormData
      let projectData;
      
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        // Handle FormData (with file upload)
        const { 
          appName, 
          prompt, 
          pages, 
          iconType, 
          firebaseIntegration, 
          databaseIntegration, 
          includeProductImages, 
          productImageCount 
        } = req.body;
        
        projectData = {
          userId: req.user!.id,
          appName,
          prompt,
          pages: pages ? JSON.parse(pages) : [],
          iconType: iconType || 'ai_generated',
          iconPath: req.file ? req.file.path : null,
          firebaseIntegration: firebaseIntegration ? JSON.parse(firebaseIntegration) : { auth: false, firestore: false, storage: false, cloudFunctions: false },
          databaseIntegration: databaseIntegration ? JSON.parse(databaseIntegration) : { type: "none", features: [] },
          includeProductImages: includeProductImages === 'true',
          productImageCount: productImageCount ? parseInt(productImageCount) : 0
        };
      } else {
        // Handle regular JSON
        projectData = {
          ...req.body,
          userId: req.user!.id
        };
      }

      // Validate with schema
      const validatedData = insertProjectSchema.parse(projectData);

      // Check generation limits based on subscription plan
      const user = req.user!;
      const generationLimits = {
        starter: 5,
        pro: 25,
        team: 100,
        enterprise: Infinity
      };

      const limit = generationLimits[user.subscriptionPlan as keyof typeof generationLimits] || 5;
      if (user.generationsUsed >= limit) {
        return res.status(403).json({ message: "Generation limit reached for your plan" });
      }

      // Create project record
      const project = await storage.createProject(validatedData);

      // Start async generation process
      generateAndroidProject(project.id).catch(console.error);

      // Update user generation count
      await storage.updateUser(user.id, {
        generationsUsed: user.generationsUsed + 1
      });

      res.json(project);
    } catch (error: any) {
      // Clean up uploaded file if there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ message: error.message });
    }
  });

  // Download project ZIP
  app.get("/api/projects/:id/download", authenticateUser, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (project.status !== "ready" || !project.zipFilePath) {
        return res.status(400).json({ message: "Project not ready for download" });
      }

      const filePath = path.resolve(project.zipFilePath);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Project file not found" });
      }

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="android-project-${project.id}.zip"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", authenticateUser, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete ZIP file if it exists
      if (project.zipFilePath && fs.existsSync(project.zipFilePath)) {
        fs.unlinkSync(project.zipFilePath);
      }

      await storage.deleteProject(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Subscription management
  app.post("/api/subscription", authenticateUser, async (req, res) => {
    try {
      const { plan } = req.body;
      
      const validPlans = ["starter", "pro", "team", "enterprise"];
      if (!validPlans.includes(plan)) {
        return res.status(400).json({ message: "Invalid subscription plan" });
      }

      const updatedUser = await storage.updateUser(req.user!.id, {
        subscriptionPlan: plan,
        generationsUsed: 0 // Reset generation count on plan change
      });

      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
