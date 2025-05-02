// firebaseUtils.ts
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
  try {
    const q = query(
      collection(db, "profile_data"),
      where("user_id", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, data: doc.data() };
    } else {
      Alert.alert("No profile found for user:", uid);
      return null;
    }
  } catch (e) {
    Alert.alert("Error getting user profile:", e);
    return null;
  }
}

export async function uploadVehicleToFirebase(formData, user) {
  let imageUrl = "";

  try {
    // Generate unique image name
    const imageName = `vehicle_images/${user.uid}_${Date.now()}.jpg`;
    const storageRef = ref(getStorage(), imageName);

    // Convert image URI to blob
    const blob = await (await fetch(formData.car_photo)).blob();

    // Upload the blob
    await uploadBytes(storageRef, blob);

    // Get downloadable URL
    imageUrl = await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Image upload error:", error);
    Alert.alert("Failed to upload image.");
    return;
  }

  const vehiclePayLoad = {
    car_photo: imageUrl,
    year: formData.year,
    brand: formData.brand,
    name: formData.name,
    mileage: formData.mileage,
    last_serviced_mileage: formData.last_serviced_mileage,
    last_service_date: formData.last_service_date,
    registrationNumber: formData.registrationNumber,
    user_id: user.uid,
  };

  try {
    if (formData.vehicleId) {
      // Update existing vehicle by ID
      const docRef = doc(db, "vehicles_data", formData.vehicleId);
      await updateDoc(docRef, vehiclePayLoad);
    } else {
      // Create new vehicle entry
      await addDoc(collection(db, "vehicles_data"), vehiclePayLoad);
    }
  } catch (e) {
    console.error("Error saving vehicle data:", e);
  }
}

export async function getVehicleData(uid, vid) {
  try {
    const vehicleDocRef = doc(db, "vehicles_data", vid);
    const vehicleDoc = await getDoc(vehicleDocRef);

    if (vehicleDoc.exists()) {
      // Optionally check if this vehicle belongs to the user
      if (vehicleDoc.data().user_id === uid) {
        return { id: vehicleDoc.id, data: vehicleDoc.data() };
      } else {
        // console.warn("Vehicle does not belong to user:", uid);
        return null;
      }
    } else {
      // console.log("No vehicle found with ID:", vid);
      return null;
    }
  } catch (e) {
    Alert.alert("Error getting vehicle:", e);
    return null;
  }
}

export async function getVehiclesData(uid) {
  try {
    const q = query(
      collection(db, "vehicles_data"),
      where("user_id", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    const vehicles = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        vehicles.push({ id: doc.id, data: doc.data() });
      });
    } else {
      // console.log("No vehicles found for user:", uid);
    }

    return vehicles; // always return an array (empty if none)
  } catch (e) {
    Alert.alert("Error getting user vehicles:", e);
    return [];
  }
}

export async function deleteVehicle(vehicleId, userId) {
  try {
    const docRef = doc(db, "vehicles_data", vehicleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No such vehicle document!");
      return;
    }

    const vehicleData = docSnap.data();

    // Check if the user owns the vehicle
    if (vehicleData.user_id !== userId) {
      console.warn("User is not authorized to delete this vehicle.");
      return;
    }

    // Delete image from storage if exists
    if (vehicleData.car_photo) {
      const storageRef = ref(getStorage(), vehicleData.car_photo);

      try {
        await deleteObject(storageRef);
        console.log("Image deleted from storage.");
      } catch (err) {
        console.warn("Failed to delete image from storage:", err);
      }
    }

    // Delete Firestore document
    await deleteDoc(docRef);
    console.log("Vehicle document deleted from Firestore.");
  } catch (error) {
    console.error("Error deleting vehicle:", error);
  }
}
