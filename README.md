# Appio Genius - AI-Powered Android App Generator

Appio Genius is a professional web application that generates fully functional Android Studio projects using AI. Built with Next.js, TailwindCSS, and powered by Google's Gemini AI, it transforms your app ideas into production-ready Android applications in minutes.

## Features

- 🤖 **AI-Powered Generation**: Advanced AI understands your requirements and generates complete Android projects
- 📱 **Modern Architecture**: Generated apps follow Android best practices with MVVM pattern and Jetpack Compose
- 🔥 **Firebase Integration**: Automatic setup for Authentication, Firestore database, and Cloud Storage
- 📊 **Project Management**: Dashboard to manage and download your generated projects
- 🎨 **Responsive Design**: Modern, professional UI with Android and AI theming
- 👤 **User Authentication**: Firebase Auth with email/password and Google sign-in
- 💳 **Subscription Plans**: Tiered pricing with different generation limits

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TailwindCSS** for styling
- **Firebase SDK v9+** for authentication and data
- **React Query** for state management
- **Wouter** for client-side routing
- **Shadcn/ui** for UI components

### Backend
- **Node.js** with Express
- **Firebase Admin SDK** for authentication
- **Google Gemini AI** for code generation
- **Archiver** for ZIP file creation
- **TypeScript** for type safety

## Prerequisites

Before setting up the project, ensure you have:

- Node.js 18+ installed
- A Firebase project set up
- A Google Gemini API key
- Git for version control

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appio-genius
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create environment files with the required secrets:

   **Frontend Environment Variables** (`.env.local` or set in deployment):
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

   **Backend Environment Variables**:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   SESSION_SECRET=your_session_secret
   ```

## Firebase Setup

1. **Create a Firebase Project**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore Database

2. **Configure Authentication**
   - Enable Email/Password authentication
   - Enable Google sign-in provider
   - Add your domain to authorized domains

3. **Get Firebase Configuration**
   - In Project Settings, find your web app configuration
   - Copy the `apiKey`, `projectId`, and `appId` values
   - Set these as environment variables

## Google Gemini API Setup

1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an API key for Gemini
   - Set `GEMINI_API_KEY` environment variable

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Open http://localhost:5000 in your browser
   - The app will be available on port 5000 (both frontend and backend)

## Project Structure

