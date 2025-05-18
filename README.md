# Bethel City Management System

Bethel is a city management system designed to streamline operations for hospitals, businesses, vehicles, and employees. This project is built using React Native and Expo, with Firebase as the backend for authentication and data storage.

## Features

- **Hospital Management**: Manage hospitals, doctors, and appointments.
- **Business Management**: Register and manage businesses and employees.
- **Vehicle Management**: Register and manage vehicles.
- **User Profiles**: Create and update user profiles.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for running on emulators)

## Setup Instructions

1. **Unzip the Project**:

   ```bash
   unzip the project files
   cd bethel
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Firebase**:

   - Add your Firebase configuration files:
     - `google-services.json` for Android (already included in the project).
     - `GoogleService-Info.plist` for iOS (already included in the project).
   - Ensure Firebase is configured for Authentication and Firestore.

4. **Run the Project**:
   - For Android:
     ```bash
     npm expo run android
     ```
   - For iOS:
     ```bash
     npm expo run ios
     ```
   - To start the server:
     ```bash
     npm expo start
     ```

## Major Packages Used

### Frontend

- **React Native**: Framework for building native apps.
- **Expo**: Toolchain for React Native development.
- **TamagUI**: UI library for consistent styling.
- **React Navigation**: Navigation library for managing screens.
- **React Native Vector Icons**: Icons for UI components.

### Backend

- **Firebase**:
  - Authentication: User login and signup.
  - Firestore: Database for storing app data.

### Utilities

- **@react-native-firebase/app**: Firebase integration for React Native.
- **@react-native-firebase/auth**: Firebase authentication module.
- **expo-font**: Custom font integration.

## Project Structure

```
.
├── App.js                # Main entry point
├── app.json              # Expo configuration
├── assets/               # Images, icons, and fonts
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── services/         # Firebase utilities
├── ios/                  # iOS-specific files
├── android/              # Android-specific files
```
