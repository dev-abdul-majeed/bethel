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
export async function uploadProfileToFirebase(formData, user) {
  let imageUrl = "";

  //   if (formData.profile_image) {
  //     const response = await fetch(formData.profile_image);
  //     const blob = await response.blob();

  //     const imageRef = ref(storage, `users/${uid}/profile.jpg`);
  //     await uploadBytes(imageRef, blob);
  //     imageUrl = await getDownloadURL(imageRef);
  //   }

  //----------- Working code to add a doc
  // try {
  //   const docRef = await addDoc(collection(db, "profile_data"), {
  //     first_name: formData.first_name,
  //     last_name: formData.last_name,
  //     gender: formData.gender,
  //     dob: formData.dob,
  //     about_me: formData.about_me,
  //     profile_image: imageUrl,
  //     user_id: user.uid,
  //   });
  //   Alert.alert("Profile Updated Successfully");
  // } catch (e) {
  //   Alert.alert("OOps, Something went wrong!");
  // }

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
      profile_image: imageUrl,
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
