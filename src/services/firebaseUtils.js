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
  uploadBytesResumable,
} from "firebase/storage";
export async function uploadProfileToFirebase(formData, user) {
  let imageUrl = "";

  const downloadURL = "";
  try {
    const imageName = `profile_images/${
      formData.first_name + "_" + Date.now()
    }_${formData.profile_image.split("/").pop()}`;

    const storageRef = ref(getStorage(), imageName);

    const blob = await (await fetch(formData.profile_image)).blob();

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log("Error while uploading Image", error);
      },

      async () => {
        downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      }
    );
  } catch (error) {
    console.log(error.message);
  }

  try {
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
      profile_image: downloadURL,
      user_id: user.uid,
    };

    if (!querySnapshot.empty) {
      // Document exists – update the first match
      const existingDoc = querySnapshot.docs[0];
      const docRef = doc(db, "profile_data", existingDoc.id);
      await updateDoc(docRef, profilePayload);
    } else {
      // No existing document – create a new one
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
