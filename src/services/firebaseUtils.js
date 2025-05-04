import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Alert } from "react-native";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

// ---------- REUSABLE HELPERS ---------- //

async function uploadImage(path, fileUri) {
  const storageRef = ref(getStorage(), path);
  const blob = await (await fetch(fileUri)).blob();
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}

async function getDocumentByField(collectionName, field, value) {
  const q = query(collection(db, collectionName), where(field, "==", value));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0] : null;
}

async function saveOrUpdateDocument(collectionName, payload, docId = "") {
  if (docId) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, payload);
  } else {
    await addDoc(collection(db, collectionName), payload);
  }
}

// ---------- PROFILE FUNCTIONS ---------- //

export async function uploadProfileToFirebase(formData, user) {
  try {
    const imageUrl = await uploadImage(
      `profile_images/${user.uid}.jpg`,
      formData.profile_image
    );

    const profilePayload = {
      ...formData,
      profile_image: imageUrl,
      user_id: user.uid,
    };

    const existingDoc = await getDocumentByField(
      "profile_data",
      "user_id",
      user.uid
    );

    await saveOrUpdateDocument("profile_data", profilePayload, existingDoc?.id);

    // Alert.alert("Profile saved successfully!");
  } catch (error) {
    console.error("Error saving profile:", error);
    // Alert.alert("Oops, something went wrong!");
  }
}

export async function getUserProfile(uid) {
  try {
    const existingDoc = await getDocumentByField(
      "profile_data",
      "user_id",
      uid
    );
    return existingDoc
      ? { id: existingDoc.id, data: existingDoc.data() }
      : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    // Alert.alert("Failed to fetch profile.");
    return null;
  }
}

// ---------- VEHICLE FUNCTIONS ---------- //

export async function uploadVehicleToFirebase(formData, user) {
  console.log(formData);
  try {
    const imageUrl = await uploadImage(
      `vehicle_images/${user.uid}_${Date.now()}.jpg`,
      formData.car_photo
    );

    const vehiclePayload = {
      ...formData,
      car_photo: imageUrl,
      user_id: user.uid,
    };

    await saveOrUpdateDocument(
      "vehicles_data",
      vehiclePayload,
      formData.vehicleId
    );

    // Alert.alert("Vehicle saved successfully!");
  } catch (error) {
    console.error("Error saving vehicle data:", error);
    throw new Error("Failed to upload image."); // <-- throw here!
  }
}

export async function getVehicleData(uid, vid) {
  try {
    const docRef = doc(db, "vehicles_data", vid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().user_id === uid) {
      return { id: docSnap.id, data: docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting vehicle:", error);
    // Alert.alert("Failed to fetch vehicle.");
    return null;
  }
}

export async function getVehiclesData(uid) {
  try {
    const q = query(
      collection(db, "vehicles_data"),
      where("user_id", "==", uid)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  } catch (error) {
    console.error("Error getting user vehicles:", error);
    // Alert.alert("Failed to fetch vehicles.");
    return [];
  }
}

export async function deleteVehicle(vehicleId, userId) {
  try {
    const docRef = doc(db, "vehicles_data", vehicleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("No such vehicle document!");
      return;
    }

    const vehicleData = docSnap.data();

    if (vehicleData.user_id !== userId) {
      console.warn("User is not authorized to delete this vehicle.");
      return;
    }

    if (vehicleData.car_photo) {
      const storageRef = ref(getStorage(), vehicleData.car_photo);
      try {
        await deleteObject(storageRef);
        console.log("Image deleted from storage.");
      } catch (err) {
        console.warn("Failed to delete image from storage:", err);
      }
    }

    await deleteDoc(docRef);
    console.log("Vehicle document deleted from Firestore.");
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    // Alert.alert("Failed to delete vehicle.");
  }
}

// ---------- Business FUNCTIONS ---------- //

export async function uploadBusinessToFirebase(formData, user) {
  try {
    const imageUrl = await uploadImage(
      `business_images/${user.uid}.jpg`,
      formData.businessPhoto
    );

    const businessPayload = {
      ...formData,
      business_image: imageUrl,
      user_id: user.uid,
    };

    const existingDoc = await getDocumentByField(
      "business_data",
      "user_id",
      user.uid
    );

    await saveOrUpdateDocument(
      "business_data",
      businessPayload,
      existingDoc?.id
    );
  } catch (error) {
    console.error("Error saving business data:", error);
  }
}

export async function getBusinessData(uid) {
  try {
    const existingDoc = await getDocumentByField(
      "business_data",
      "user_id",
      uid
    );
    return existingDoc
      ? { id: existingDoc.id, data: existingDoc.data() }
      : null;
  } catch (error) {
    console.error("Error getting business data:", error);
    return null;
  }
}

export async function deleteBusiness(userId) {
  try {
    const existingDoc = await getDocumentByField(
      "business_data",
      "user_id",
      userId
    );

    if (existingDoc) {
      const docRef = doc(db, "business_data", existingDoc.id);
      await deleteDoc(docRef);
      console.log("Business document deleted from Firestore.");
    } else {
      console.warn("No such business document!");
    }
  } catch (error) {
    console.error("Error deleting business:", error);
  }
}
export async function getBusinessImageUrl(uid) {
  try {
    const existingDoc = await getDocumentByField(
      "business_data",
      "user_id",
      uid
    );
    return existingDoc ? existingDoc.data().business_image : null;
  } catch (error) {
    console.error("Error getting business image URL:", error);
    return null;
  }
}

export async function getBusinessImagePath(uid) {
  try {
    const existingDoc = await getDocumentByField(
      "business_data",
      "user_id",
      uid
    );
    return existingDoc ? existingDoc.data().business_image : null;
  } catch (error) {
    console.error("Error getting business image path:", error);
    return null;
  }
}