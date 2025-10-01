# Bethel City Management System

Bethel is a city management system designed to streamline operations for hospitals, businesses, vehicles, and employees. This project is built using React Native and Expo, with Firebase as the backend for authentication and data storage.

## Features

- **Hospital Management**: Manage hospitals, doctors, and appointments.
- **Business Management**: Register and manage businesses and employees.
- **Vehicle Management**: Register and manage vehicles.
- **User Profiles**: Create and update user profiles.

## Screenshots:
<img width="222" height="500" alt="image" src="https://github.com/user-attachments/assets/80610a2f-fd81-40e6-88cf-22ce4fb5ecc5" />

<img width="205" height="462" alt="image" src="https://github.com/user-attachments/assets/f06173e2-f51d-4e7d-9b2a-d46b5a8e611e" />
<img width="202" height="455" alt="image" src="https://github.com/user-attachments/assets/fc85f5a2-87b3-44af-bece-7830551edf26" />
<img width="192" height="432" alt="image" src="https://github.com/user-attachments/assets/eb00e691-9c97-4807-9013-e0ce5031a9b5" />
<img width="230" height="519" alt="image" src="https://github.com/user-attachments/assets/45f6b950-c64f-4ba8-8b64-3a629c357e9d" />
<img width="190" height="428" alt="image" src="https://github.com/user-attachments/assets/55e84bb5-e8a9-43f6-9192-7c2a8ffd4be8" />
<img width="212" height="478" alt="image" src="https://github.com/user-attachments/assets/fe9677e4-57ba-42bb-992f-a1d9a56eeffc" />
<img width="236" height="531" alt="image" src="https://github.com/user-attachments/assets/7e1c1f21-bd8e-463c-af87-12d7a88a0e82" />
<img width="217" height="489" alt="image" src="https://github.com/user-attachments/assets/13d6263e-389d-4155-bc7b-9d203d16fbaf" />


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

## Technologies used:
<img width="173" height="188" alt="image" src="https://github.com/user-attachments/assets/a159971a-8c6d-4ba8-aca9-75b3a59ebd56" />
<img width="200" height="130" alt="image" src="https://github.com/user-attachments/assets/95d89151-e9e3-40dd-a91c-65f6f2f740ab" />
<img width="549" height="205" alt="image" src="https://github.com/user-attachments/assets/d8a13535-837d-4bff-b229-7969fffdd5d1" />

