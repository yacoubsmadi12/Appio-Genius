import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AndroidProjectSpec {
  appName: string;
  packageName: string;
  mainActivity: string;
  pages: Array<{
    name: string;
    description: string;
    composableFunction: string;
  }>;
  firebaseIntegration: {
    auth: boolean;
    firestore: boolean;
    storage: boolean;
  };
  dependencies: string[];
  files: Array<{
    path: string;
    content: string;
  }>;
}

export async function generateProjectStructure(
  appName: string,
  pages: Array<{ title: string; description: string }>,
  prompt: string,
  firebaseIntegration: { auth: boolean; firestore: boolean; storage: boolean }
): Promise<AndroidProjectSpec> {
  try {
    const systemPrompt = `You are an expert Android developer who generates complete Android Studio projects using Kotlin and Jetpack Compose.

Generate a complete Android project structure based on the user's requirements. The project should:
1. Use modern Android architecture (MVVM, Repository pattern)
2. Implement Jetpack Compose for UI
3. Follow Material Design 3 guidelines
4. Include proper navigation between screens
5. Have clean, production-ready code
6. Include appropriate dependencies in build.gradle files

${firebaseIntegration.auth ? "- Include Firebase Authentication setup" : ""}
${firebaseIntegration.firestore ? "- Include Firestore database integration" : ""}
${firebaseIntegration.storage ? "- Include Firebase Storage integration" : ""}

Respond with JSON in this exact format:
{
  "appName": "string",
  "packageName": "string (com.example.appname format)",
  "mainActivity": "string",
  "pages": [
    {
      "name": "string (page name)",
      "description": "string",
      "composableFunction": "string (function name)"
    }
  ],
  "firebaseIntegration": {
    "auth": boolean,
    "firestore": boolean,
    "storage": boolean
  },
  "dependencies": ["string array of dependencies"],
  "files": [
    {
      "path": "string (relative path in project)",
      "content": "string (complete file content)"
    }
  ]
}`;

    const userPrompt = `Create an Android app with the following specifications:

App Name: ${appName}
Pages: ${pages.map(p => `- ${p.title}: ${p.description}`).join('\n')}
Additional Requirements: ${prompt}

Firebase Integration:
- Authentication: ${firebaseIntegration.auth ? 'Yes' : 'No'}
- Firestore Database: ${firebaseIntegration.firestore ? 'Yes' : 'No'}
- Storage: ${firebaseIntegration.storage ? 'Yes' : 'No'}

Generate a complete, production-ready Android Studio project with all necessary files.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            appName: { type: "string" },
            packageName: { type: "string" },
            mainActivity: { type: "string" },
            pages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  composableFunction: { type: "string" }
                },
                required: ["name", "description", "composableFunction"]
              }
            },
            firebaseIntegration: {
              type: "object",
              properties: {
                auth: { type: "boolean" },
                firestore: { type: "boolean" },
                storage: { type: "boolean" }
              },
              required: ["auth", "firestore", "storage"]
            },
            dependencies: {
              type: "array",
              items: { type: "string" }
            },
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  content: { type: "string" }
                },
                required: ["path", "content"]
              }
            }
          },
          required: ["appName", "packageName", "mainActivity", "pages", "firebaseIntegration", "dependencies", "files"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    console.log(`Generated project structure for ${appName}`);

    if (rawJson) {
      const projectSpec: AndroidProjectSpec = JSON.parse(rawJson);
      return projectSpec;
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error("Failed to generate project structure:", error);
    throw new Error(`Failed to generate Android project: ${error}`);
  }
}

export async function generateAdditionalFiles(
  projectSpec: AndroidProjectSpec,
  additionalRequirements: string
): Promise<Array<{ path: string; content: string }>> {
  try {
    const systemPrompt = `You are an expert Android developer. Generate additional files for an Android project based on the existing project structure and new requirements.

Respond with JSON in this format:
{
  "files": [
    {
      "path": "string (relative path in project)",
      "content": "string (complete file content)"
    }
  ]
}`;

    const userPrompt = `Project: ${projectSpec.appName}
Package: ${projectSpec.packageName}
Existing files: ${projectSpec.files.map(f => f.path).join(', ')}

Additional requirements: ${additionalRequirements}

Generate any additional files needed to fulfill these requirements.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  content: { type: "string" }
                },
                required: ["path", "content"]
              }
            }
          },
          required: ["files"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      const result = JSON.parse(rawJson);
      return result.files;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to generate additional files:", error);
    return [];
  }
}
