import { storage } from "../storage";
import { generateProjectStructure } from "./gemini";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { randomUUID } from "crypto";

export async function generateAndroidProject(projectId: string): Promise<void> {
  try {
    // Get project from storage
    const project = await storage.getProject(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Update project status to generating
    await storage.updateProject(projectId, { status: "generating" });

    // Generate project structure using Gemini AI
    const projectSpec = await generateProjectStructure(
      project.appName,
      project.pages,
      project.prompt,
      project.firebaseIntegration
    );

    // Create temporary directory for project files
    const tempDir = path.join(process.cwd(), "temp", projectId);
    fs.mkdirSync(tempDir, { recursive: true });

    // Create Android project directory structure
    const projectDir = path.join(tempDir, sanitizeFileName(project.appName));
    createAndroidProjectStructure(projectDir, projectSpec);

    // Write all generated files
    for (const file of projectSpec.files) {
      const filePath = path.join(projectDir, file.path);
      const fileDir = path.dirname(filePath);
      
      // Ensure directory exists
      fs.mkdirSync(fileDir, { recursive: true });
      
      // Write file content
      fs.writeFileSync(filePath, file.content, 'utf8');
    }

    // Create additional Android project files
    createStandardAndroidFiles(projectDir, projectSpec);

    // Create ZIP file
    const zipFileName = `android-project-${projectId}.zip`;
    const zipFilePath = path.join(process.cwd(), "generated", zipFileName);
    
    // Ensure generated directory exists
    fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
    
    await createZipFile(projectDir, zipFilePath);

    // Update project with completion status
    await storage.updateProject(projectId, { 
      status: "ready", 
      zipFilePath: zipFilePath 
    });

    // Clean up temporary files
    fs.rmSync(tempDir, { recursive: true, force: true });

  } catch (error) {
    // Update project with failed status
    await storage.updateProject(projectId, { status: "failed" });
    
    throw error;
  }
}

function createAndroidProjectStructure(projectDir: string, projectSpec: any): void {
  // Create standard Android project directories
  const directories = [
    "app/src/main/java/" + projectSpec.packageName.replace(/\./g, "/"),
    "app/src/main/res/layout",
    "app/src/main/res/values",
    "app/src/main/res/drawable",
    "app/src/main/res/mipmap-hdpi",
    "app/src/main/res/mipmap-mdpi",
    "app/src/main/res/mipmap-xhdpi",
    "app/src/main/res/mipmap-xxhdpi",
    "app/src/main/res/mipmap-xxxhdpi",
    "gradle/wrapper"
  ];

  directories.forEach(dir => {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  });
}

function createStandardAndroidFiles(projectDir: string, projectSpec: any): void {
  // Create build.gradle (Project level)
  const projectBuildGradle = `
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.2.0' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.20' apply false
    ${projectSpec.firebaseIntegration.auth || projectSpec.firebaseIntegration.firestore || projectSpec.firebaseIntegration.storage ? 
      `id 'com.google.gms.google-services' version '4.4.0' apply false` : ''}
}
`;

  fs.writeFileSync(path.join(projectDir, "build.gradle"), projectBuildGradle);

  // Create build.gradle (App level)
  const firebaseDependencies = [];
  if (projectSpec.firebaseIntegration.auth) {
    firebaseDependencies.push('implementation "com.google.firebase:firebase-auth-ktx:22.3.0"');
  }
  if (projectSpec.firebaseIntegration.firestore) {
    firebaseDependencies.push('implementation "com.google.firebase:firebase-firestore-ktx:24.10.0"');
  }
  if (projectSpec.firebaseIntegration.storage) {
    firebaseDependencies.push('implementation "com.google.firebase:firebase-storage-ktx:20.3.0"');
  }

  const appBuildGradle = `
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    ${projectSpec.firebaseIntegration.auth || projectSpec.firebaseIntegration.firestore || projectSpec.firebaseIntegration.storage ? 
      `id 'com.google.gms.google-services'` : ''}
}

android {
    namespace '${projectSpec.packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${projectSpec.packageName}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary true
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
    buildFeatures {
        compose true
    }
    composeOptions {
        kotlinCompilerExtensionVersion '1.5.5'
    }
    packaging {
        resources {
            excludes += '/META-INF/{AL2.0,LGPL2.1}'
        }
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
    implementation 'androidx.activity:activity-compose:1.8.2'
    implementation platform('androidx.compose:compose-bom:2023.10.01')
    implementation 'androidx.compose.ui:ui'
    implementation 'androidx.compose.ui:ui-graphics'
    implementation 'androidx.compose.ui:ui-tooling-preview'
    implementation 'androidx.compose.material3:material3'
    implementation 'androidx.navigation:navigation-compose:2.7.6'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0'
    
    ${firebaseDependencies.length > 0 ? `
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    ${firebaseDependencies.join('\n    ')}
    ` : ''}
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation platform('androidx.compose:compose-bom:2023.10.01')
    androidTestImplementation 'androidx.compose.ui:ui-test-junit4'
    debugImplementation 'androidx.compose.ui:ui-tooling'
    debugImplementation 'androidx.compose.ui:ui-test-manifest'
}
`;

  fs.writeFileSync(path.join(projectDir, "app", "build.gradle"), appBuildGradle);

  // Create AndroidManifest.xml
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.${sanitizeFileName(projectSpec.appName)}"
        tools:targetApi="31">
        <activity
            android:name=".${projectSpec.mainActivity}"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.${sanitizeFileName(projectSpec.appName)}">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  fs.writeFileSync(path.join(projectDir, "app", "src", "main", "AndroidManifest.xml"), androidManifest);

  // Create strings.xml
  const strings = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${projectSpec.appName}</string>
</resources>`;

  fs.writeFileSync(path.join(projectDir, "app", "src", "main", "res", "values", "strings.xml"), strings);

  // Create colors.xml
  const colors = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>`;

  fs.writeFileSync(path.join(projectDir, "app", "src", "main", "res", "values", "colors.xml"), colors);

  // Create themes.xml
  const themes = `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.${sanitizeFileName(projectSpec.appName)}" parent="android:Theme.Material.DayNight.NoActionBar">
        <item name="android:statusBarColor" tools:targetApi="l">?android:attr/colorPrimaryVariant</item>
    </style>
</resources>`;

  fs.writeFileSync(path.join(projectDir, "app", "src", "main", "res", "values", "themes.xml"), themes);

  // Create gradle.properties
  const gradleProperties = `
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
`;

  fs.writeFileSync(path.join(projectDir, "gradle.properties"), gradleProperties);

  // Create settings.gradle
  const settingsGradle = `
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${projectSpec.appName}"
include ':app'
`;

  fs.writeFileSync(path.join(projectDir, "settings.gradle"), settingsGradle);

  // Create gradle wrapper files
  const gradleWrapperProperties = `
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.2-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;

  fs.writeFileSync(path.join(projectDir, "gradle", "wrapper", "gradle-wrapper.properties"), gradleWrapperProperties);

  // Create proguard-rules.pro
  fs.writeFileSync(path.join(projectDir, "app", "proguard-rules.pro"), "# Add project specific ProGuard rules here.\n");

  // Create README for the project
  const readmeContent = `# ${projectSpec.appName}

This Android project was generated by Appio Genius AI.

## Features

${projectSpec.pages.map((page: any) => `- ${page.name}: ${page.description}`).join('\n')}

## Firebase Integration

${projectSpec.firebaseIntegration.auth ? '- Authentication enabled' : ''}
${projectSpec.firebaseIntegration.firestore ? '- Firestore database enabled' : ''}
${projectSpec.firebaseIntegration.storage ? '- Firebase Storage enabled' : ''}

## Setup

1. Open this project in Android Studio
2. Sync the project with Gradle files
3. ${projectSpec.firebaseIntegration.auth || projectSpec.firebaseIntegration.firestore || projectSpec.firebaseIntegration.storage ? 'Add your google-services.json file to the app directory' : ''}
4. Build and run the app

## Architecture

This project uses:
- Kotlin
- Jetpack Compose for UI
- MVVM architecture pattern
- Material Design 3

Generated by Appio Genius - AI-Powered Android Development
`;

  fs.writeFileSync(path.join(projectDir, "README.md"), readmeContent);
}

interface ArchiveError extends Error {
  code?: string;
}

function createZipFile(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`ZIP file created: ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on('error', (err: ArchiveError) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^\d+/, '') // Remove leading numbers
    .substring(0, 50) || 'GeneratedApp';
}
