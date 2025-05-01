// firebaseUtils.ts
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Alert } from "react-native";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
export async function uploadProfileToFirebase(formData, user) {
  let imageUrl = "";

  try {
    // Generate unique image name
    const imageName = `profile_images/${user.uid}.jpg`;

    const storageRef = ref(getStorage(), imageName);

    // Convert image URI to blob
    const blob = await (await fetch(formData.profile_image)).blob();

    // Upload the blob
    await uploadBytes(storageRef, blob);

    // Get downloadable URL
    imageUrl = await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Image upload error:", error);
    Alert.alert("Failed to upload image.");
    return;
  }

  try {
    // Query for existing profile
    const q = query(
      collection(db, "profile_data"),
      where("user_id", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    const profilePayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      dob: formData.dob,
      about_me: formData.about_me,
      profile_image: imageUrl,
      user_id: user.uid,
    };

    if (!querySnapshot.empty) {
      // Update existing profile
      const existingDoc = querySnapshot.docs[0];
      const docRef = doc(db, "profile_data", existingDoc.id);
      await updateDoc(docRef, profilePayload);
    } else {
      // Create new profile
      await addDoc(collection(db, "profile_data"), profilePayload);
    }

    Alert.alert("Profile saved successfully!");
  } catch (e) {
    console.error("Error saving profile:", e);
    Alert.alert("Oops, something went wrong!");
  }
}

export async function getUserProfile(uid) {
  console.log("UserID:", uid);
  try {
    const q = query(
      collection(db, "profile_data"),
      where("user_id", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    console.log("QuerySnapshot:", querySnapshot);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log("Profile: ", doc.data());
      return { id: doc.id, data: doc.data() };
    } else {
      console.log("No profile found for user:", uid);
      return null;
    }
  } catch (e) {
    console.error("Error getting user profile:", e);
    return null;
  }
}
