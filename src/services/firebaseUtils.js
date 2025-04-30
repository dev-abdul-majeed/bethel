// firebaseUtils.ts
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db, storage } from "./firebase";
export async function uploadProfileToFirebase(formData, user) {
  console.log("Uploading...");
  let imageUrl = "";

  //   if (formData.profile_image) {
  //     const response = await fetch(formData.profile_image);
  //     const blob = await response.blob();

  //     const imageRef = ref(storage, `users/${uid}/profile.jpg`);
  //     await uploadBytes(imageRef, blob);
  //     imageUrl = await getDownloadURL(imageRef);
  //   }
  try {
    console.log("Trying to upload...");

    const docRef = await addDoc(collection(db, "UserMD"), {
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      dob: formData.dob,
      about_me: formData.about_me,
      profile_image: imageUrl,
    });
    console.log("Document written with ID: ", docRef.id);
    console.log("successful");
  } catch (e) {
    console.log("Something went wrong: ", e);
  }
  console.log("After upload...");
}
