import { initializeApp } from "firebase/app";

import { GoogleAuthProvider, getAuth } from "firebase/auth";

import { firestore, getFirestore } from "firebase/firestore";

import { ref as StorageRef, getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import {
  getDoc,
  getDocs,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCGEgXz4gm2oVw7JlzTcfx9_Uy5XIh-PIQ",
  projectId: "bethel-36eb6",
  storageBucket: "bethel-36eb6.firebasestorage.app",
  appId: "1:896585879663:android:4b78165eb54f55ab6fbd9a",
};

const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const googleProvider = new GoogleAuthProvider(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export { StorageRef };
