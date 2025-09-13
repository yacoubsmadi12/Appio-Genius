import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  subscriptionPlan: text("subscription_plan").notNull().default("starter"),
  subscriptionStatus: text("subscription_status").notNull().default("active"),
  generationsUsed: integer("generations_used").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  appName: text("app_name").notNull(),
  description: text("description"),
  pages: jsonb("pages").$type<Array<{title: string; description: string}>>().notNull().default([]),
  prompt: text("prompt").notNull(),
  
  // Icon options
  iconType: text("icon_type").notNull().default("ai_generated"), // ai_generated, uploaded
  iconPath: text("icon_path"), // Path to uploaded icon or generated icon
  
  // Firebase Integration (expanded)
  firebaseIntegration: jsonb("firebase_integration").$type<{
    auth: boolean;
    firestore: boolean;
    storage: boolean;
    cloudFunctions: boolean;
  }>().notNull().default({auth: false, firestore: false, storage: false, cloudFunctions: false}),
  
  // Database Integration Options
  databaseIntegration: jsonb("database_integration").$type<{
    type: string; // "none", "firebase", "supabase", "mysql", "postgresql", "mongodb"
    features: string[]; // ["authentication", "data_storage", "real_time", "analytics"]
  }>().notNull().default({type: "none", features: []}),
  
  // Image Generation Options
  includeProductImages: boolean("include_product_images").notNull().default(false),
  productImageCount: integer("product_image_count").default(0),
  
  // Generation Progress
  generationProgress: jsonb("generation_progress").$type<{
    currentStep: string;
    completedSteps: string[];
    totalSteps: number;
    progressPercentage: number;
  }>().default({currentStep: "", completedSteps: [], totalSteps: 0, progressPercentage: 0}),
  
  status: text("status").notNull().default("generating"), // generating, ready, failed
  zipFilePath: text("zip_file_path"),
  setupGuideFilePath: text("setup_guide_file_path"), // Path to setup instructions file
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, read, replied
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const pageSchema = z.object({ 
  title: z.string(), 
  description: z.string() 
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  zipFilePath: true,
  setupGuideFilePath: true,
  generationProgress: true,
}).extend({
  pages: pageSchema.array().default([]),
  firebaseIntegration: z.object({ 
    auth: z.boolean(), 
    firestore: z.boolean(), 
    storage: z.boolean(),
    cloudFunctions: z.boolean()
  }).default({ auth: false, firestore: false, storage: false, cloudFunctions: false }),
  databaseIntegration: z.object({
    type: z.string(),
    features: z.array(z.string())
  }).default({ type: "none", features: [] }),
  description: z.string().nullable().optional(),
  iconType: z.string().default("ai_generated"),
  iconPath: z.string().nullable().optional(),
  includeProductImages: z.boolean().default(false),
  productImageCount: z.number().int().min(0).max(20).default(0),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
