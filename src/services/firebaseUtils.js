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

async function getDocumentById(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, data: docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
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
    // Alert.alert("Failed to fetch profile.");
    return null;
  }
}

// ---------- VEHICLE FUNCTIONS ---------- //

export async function uploadVehicleToFirebase(formData, user) {
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
    // Alert.alert("Failed to fetch vehicles.");
    return [];
  }
}

export async function deleteVehicle(vehicleId, userId) {
  try {
    const docRef = doc(db, "vehicles_data", vehicleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return;
    }

    const vehicleData = docSnap.data();

    if (vehicleData.user_id !== userId) {
      return;
    }

    if (vehicleData.car_photo) {
      const storageRef = ref(getStorage(), vehicleData.car_photo);
      try {
        await deleteObject(storageRef);
      } catch (err) {}
    }

    await deleteDoc(docRef);
  } catch (error) {
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
  } catch (error) {}
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
    } else {
    }
  } catch (error) {}
}

export async function uploadDoctorToFirebase(
  formData,
  hospitalId,
  doctorId = ""
) {
  try {
    const imageUrl = await uploadImage(
      `doctor_images/${formData.name}_${Date.now()}.jpg`,
      formData.photo
    );

    const businessDoc = await getDocumentById("business_data", hospitalId);

    if (!businessDoc) {
      throw new Error("No business found for the given hospital ID.");
    }

    const doctorPayload = {
      ...formData,
      doctor_image: imageUrl,
      hospital_id: hospitalId,
    };

    await saveOrUpdateDocument("doctors_data", doctorPayload, doctorId);
  } catch (error) {}
}

export async function getDoctorData(doctorId) {
  try {
    const existingDoc = await getDocumentById("doctors_data", doctorId);
    return existingDoc ? { id: existingDoc.id, data: existingDoc.data } : null;
  } catch (error) {
    return null;
  }
}

export async function getDoctorsByHospitalId(hospitalId) {
  try {
    const q = query(
      collection(db, "doctors_data"),
      where("hospital_id", "==", hospitalId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  } catch (error) {
    return [];
  }
}

export async function deleteDoctor(userId) {
  try {
    const existingDoc = await getDocumentByField(
      "doctors_data",
      "user_id",
      userId
    );

    if (existingDoc) {
      const docRef = doc(db, "doctors_data", existingDoc.id);
      await deleteDoc(docRef);
    } else {
    }
  } catch (error) {}
}

export async function uploadAppointment(appointmentData) {
  try {
    const {
      appointmentId,
      doctorId,
      patientId,
      appointmentBooked,
      date,
      time,
    } = appointmentData;

    let docId = appointmentId;

    // If appointmentId is provided, check if it exists
    if (appointmentId) {
      const docRef = doc(db, "appointments", appointmentId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        docId = ""; // Will create new if not found
      }
    }

    const payload = {
      doctorId,
      patientId,
      appointmentBooked,
      date,
      time,
    };

    await saveOrUpdateDocument("appointments", payload, docId);
    Alert.alert(
      "Appointment saved successfully!",
      "Your appointment has been successfully saved."
    );
  } catch (error) {}
}

export async function deleteAppointment(appointmentId) {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await deleteDoc(docRef);
  } catch (error) {}
}

export async function getAppointmentsByDoctorId(doctorId) {
  try {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  } catch (error) {
    return [];
  }
}

export async function getAppointmentsByPatientId(patientId) {
  try {
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  } catch (error) {
    return [];
  }
}
