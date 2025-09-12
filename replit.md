# Appio Genius - AI-Powered Android App Generator

## Overview

Appio Genius is a professional web application that generates fully functional Android Studio projects using AI. The platform allows users to input their app requirements and generates complete Android projects with modern Kotlin, Jetpack Compose, and optional Firebase integration. The system provides a comprehensive dashboard for project management, user authentication, subscription handling, and project history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built as a React single-page application using modern web technologies:
- **React with TypeScript** for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **TailwindCSS** with Shadcn/UI components for consistent, responsive design
- **React Query (@tanstack/react-query)** for server state management and API communication

The frontend follows a component-based architecture with clear separation between UI components (`/components/ui`), pages (`/pages`), authentication components (`/components/auth`), and utility functions (`/lib`).

### Backend Architecture
The server-side uses a Node.js/Express foundation with a clean API design:
- **Express.js** server with TypeScript for type safety
- **RESTful API routes** organized in `/server/routes.ts`
- **Storage abstraction layer** with in-memory implementation (easily replaceable with database)
- **Middleware-based authentication** for protecting routes
- **Service layer architecture** separating business logic (AI generation, file handling)

The backend implements a clear separation of concerns with dedicated services for Android project generation and AI integration.

### Database Design
Uses Drizzle ORM with PostgreSQL schema definition:
- **Users table** - Stores user profiles, subscription plans, and usage limits
- **Projects table** - Manages generated Android projects with metadata, status tracking, and Firebase integration settings
- **Contact Messages table** - Handles support inquiries and contact form submissions

The schema supports subscription-based usage limits, project history tracking, and flexible Firebase integration options.

### Authentication System
Implements Firebase Authentication with multiple sign-in methods:
- **Firebase Auth** for user management and secure authentication
- **Email/password and Google OAuth** sign-in options
- **Server-side authentication middleware** for API route protection
- **Client-side protected routes** with loading states and redirect handling

The authentication flow maintains user sessions across page refreshes and provides secure API access through Firebase ID tokens.

### AI Integration Architecture
Core AI functionality powered by Google's Gemini AI:
- **Google Gemini API** integration for Android code generation
- **Structured prompt engineering** to generate complete Android Studio projects
- **Project specification system** that translates user requirements into technical specifications
- **File generation pipeline** that creates all necessary Android project files

The AI service generates modern Android projects following best practices with MVVM architecture, Jetpack Compose UI, and optional Firebase integration.

### File Management System
Handles Android project packaging and delivery:
- **Archiver library** for creating ZIP files of generated projects
- **Temporary file system** for project assembly before packaging
- **Download management** with unique file paths and cleanup procedures
- **Project structure generation** that creates proper Android Studio project hierarchy

## External Dependencies

### AI Services
- **Google Gemini AI** - Primary AI engine for Android code generation
- **@google/genai** - Official Google Generative AI SDK for Node.js

### Authentication & Backend Services
- **Firebase Authentication** - User authentication and session management
- **Firebase Admin SDK** - Server-side Firebase operations and token verification

### Database & Storage
- **Drizzle ORM** - Type-safe database operations with PostgreSQL
- **@neondatabase/serverless** - Serverless PostgreSQL database connection
- **PostgreSQL** - Primary database for user data, projects, and application state

### Frontend Libraries
- **React Query** - Server state management and API caching
- **Wouter** - Lightweight client-side routing
- **Shadcn/UI & Radix UI** - Comprehensive component library built on Radix primitives
- **TailwindCSS** - Utility-first CSS framework for responsive design

### Development & Build Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety across frontend and backend
- **ESBuild** - Fast JavaScript bundler for production builds

### Utility Libraries
- **Archiver** - ZIP file creation for project downloads
- **React Hook Form** - Form handling and validation
- **Date-fns** - Date manipulation utilities
- **Zod** - Schema validation for API requests and database operations