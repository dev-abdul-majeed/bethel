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
  let document = "";
  if (docId) {
    const docRef = doc(db, collectionName, docId);
    document = await updateDoc(docRef, payload);
  } else {
    document = await addDoc(collection(db, collectionName), payload);
  }
  return document;
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

export async function getBusinessById(businessId) {
  try {
    const businessDoc = await getDocumentById("business_data", businessId);
    return businessDoc ? { id: businessDoc.id, data: businessDoc.data } : null;
  } catch (error) {
    console.error("Failed to fetch business by ID:", error);
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
    let previousImageUrl = null;

    // If doctorId exists, fetch the existing doctor data
    if (doctorId) {
      const existingDoc = await getDocumentById("doctors_data", doctorId);
      if (existingDoc) {
        previousImageUrl = existingDoc.data.doctor_image;
      }
    }

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

    // Delete the previous image from storage if it exists
    if (previousImageUrl) {
      const storageRef = ref(getStorage(), previousImageUrl);
      try {
        await deleteObject(storageRef);
      } catch (err) {
        console.error("Failed to delete previous image:", err);
      }
    }
  } catch (error) {
    console.error("Failed to upload doctor:", error);
  }
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

export async function deleteDoctor(doctorId) {
  try {
    const existingDoc = await getDocumentById("doctors_data", doctorId);

    if (existingDoc) {
      const doctorData = existingDoc.data;

      // Delete the doctor's image from storage if it exists
      if (doctorData.doctor_image) {
        const storageRef = ref(getStorage(), doctorData.doctor_image);
        try {
          await deleteObject(storageRef);
        } catch (err) {
          console.error("Failed to delete doctor image from storage:", err);
        }
      }

      // Delete the doctor document from Firestore
      const docRef = doc(db, "doctors_data", existingDoc.id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error("Failed to delete doctor:", error);
  }
}

export async function uploadAppointment(appointmentData) {
  try {
    const { doctorId, date, time, status } = appointmentData;

    // Fetch doctor's data
    const doctorDoc = await getDocumentById("doctors_data", doctorId);
    if (!doctorDoc) {
      Alert.alert("Error", "Doctor not found.");
      return;
    }
    const doctorName = doctorDoc.data.name;

    // Fetch hospital's data using doctor.hospital_id
    const hospitalDoc = await getDocumentById(
      "business_data",
      doctorDoc.data.hospital_id
    );
    if (!hospitalDoc) {
      Alert.alert("Error", "Hospital not found.");
      return;
    }
    const hospitalName = hospitalDoc.data.businessName;
    const hospitalLocation = hospitalDoc.data.locationAddress;
    const hospitalContact = hospitalDoc.data.contact;

    // Check if an appointment already exists for the same doctor, date, and time
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId),
      where("date", "==", date),
      where("time", "==", time)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      Alert.alert(
        "Appointment Conflict",
        "An appointment already exists for this doctor at the specified date and time."
      );
      return;
    }

    const payload = {
      doctorId,
      doctorName,
      hospitalName,
      hospitalLocation,
      hospitalContact,
      date,
      time,
      status,
      patientId: null,
    };

    await saveOrUpdateDocument("appointments", payload);
    Alert.alert(
      "Appointment saved successfully!",
      "Your appointment has been successfully saved."
    );
  } catch (error) {
    console.error("Failed to upload appointment:", error);
  }
}

export async function deleteAppointment(appointmentId) {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Failed to delete appointment:", error);
  }
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

export async function bookPatientAppointment(appointmentId, patientId) {
  try {
    // Check if the patient already has 2 booked appointments
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId),
      where("status", "==", "booked")
    );
    const snapshot = await getDocs(q);

    if (snapshot.size >= 2) {
      Alert.alert(
        "Booking Limit Reached",
        "You can only have 2 active appointments at a time."
      );
      return;
    }

    const docRef = doc(db, "appointments", appointmentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const appointmentData = docSnap.data();

      if (appointmentData.status === "booked") {
        Alert.alert("Error", "This appointment is already booked.");
        return;
      }

      await updateDoc(docRef, { patientId, status: "booked" });
      Alert.alert("Appointment booked successfully!");
    } else {
      Alert.alert("Error", "Appointment not found.");
    }
  } catch (error) {
    console.error("Failed to book appointment:", error);
  }
}

export async function cancelPatientAppointment(appointmentId) {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await updateDoc(docRef, { patientId: null, status: "available" });
    Alert.alert("Appointment canceled successfully!");
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
  }
}

export async function getHospitalsList() {
  try {
    const hospitalsRef = collection(db, "business_data");
    const q = query(hospitalsRef, where("businessType", "==", "hospital"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  } catch (error) {
    console.error("Failed to fetch hospitals:", error);
    return [];
  }
}

export async function getUsers(businessId = null) {
  try {
    const q = businessId
      ? query(
          collection(db, "profile_data"),
          where("business_id", "==", businessId)
        )
      : collection(db, "profile_data");

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

// Employer side APIs

export async function employUser({
  business_id,
  employee_id,
  role,
  hourly_pay,
  scheduled_start_time,
  scheduled_end_time,
  scheduled_days,
  monthly_rating = 0,
  feedback = "",
  employment_date,
  employment_end_date = null,
  weekly_hours,
}) {
  try {
    // Validate business and employee profiles
    const businessProfile = await getDocumentById("business_data", business_id);
    const employeeProfile = await getDocumentById("profile_data", employee_id);

    if (!businessProfile || !employeeProfile) {
      throw new Error("Invalid business or employee profile.");
    }

    const payload = {
      business_id,
      employee_id,
      role,
      hourly_pay,
      scheduled_start_time,
      scheduled_end_time,
      scheduled_days,
      weekly_hours,
      monthly_rating,
      feedback,
      employment_date,
      employment_end_date,
    };

    await saveOrUpdateDocument("employment_data", payload);
    console.log("Employment record created successfully!");
  } catch (error) {
    console.error("Failed to create employment record:", error);
  }
}

// gets user data from employment_data and profile_data collections
export async function getEmployeesByBusinessId(businessId) {
  try {
    const q = query(
      collection(db, "employment_data"),
      where("business_id", "==", businessId)
    );
    const snapshot = await getDocs(q);

    const activeEmployees = await Promise.all(
      snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return (
            !("employment_end_date" in data) ||
            data.employment_end_date === null
          );
        })
        .map(async (doc) => {
          const employmentData = doc.data();
          const employeeProfile = await getDocumentById(
            "profile_data",
            employmentData.employee_id
          );
          return {
            id: doc.id,
            employmentData,
            employeeProfile: employeeProfile ? employeeProfile.data : null,
          };
        })
    );

    return activeEmployees;
  } catch (error) {
    console.error("Failed to fetch active employees:", error);
    return [];
  }
}

export async function getEmployeeById(employeeId) {
  try {
    const docRef = doc(db, "employment_data", employeeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const employmentData = docSnap.data();
      const employeeProfile = await getDocumentById(
        "profile_data",
        employmentData.employee_id
      );
      return {
        id: docSnap.id,
        employmentData,
        employeeProfile: employeeProfile ? employeeProfile.data : null,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch employee by ID:", error);
    return null;
  }
}

export async function updateEmploymentData(employmentId, updatedData) {
  try {
    const docRef = doc(db, "employment_data", employmentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Employment record not found.");
    }

    await updateDoc(docRef, updatedData);
    console.log("Employment data updated successfully!");
  } catch (error) {
    console.error("Failed to update employment data:", error);
  }
}

export async function getBusinessEmployees(businessId) {
  try {
    const q = query(
      collection(db, "employment_data"),
      where("business_id", "==", businessId)
    );
    const snapshot = await getDocs(q);

    const employees = snapshot.docs.map((doc) => {
      const employmentData = doc.data();
      return {
        id: doc.id,
        data: employmentData,
      };
    });

    return employees;
  } catch (error) {
    console.error("Failed to fetch business employees:", error);
    return [];
  }
}

export async function terminateEmployee(employmentId) {
  try {
    const docRef = doc(db, "employment_data", employmentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Employment record not found.");
    }

    const employmentData = docSnap.data();

    // Add employment_end_date with the current date
    const employmentEndDate = new Date().toISOString();
    await updateDoc(docRef, { employment_end_date: employmentEndDate });

    console.log("Employee terminated successfully!");
  } catch (error) {
    console.error("Failed to terminate employee:", error);
  }
}

// Employee side APIs

export async function logEmployeeWorkHours({ employee_id, date, hours }) {
  try {
    // Fetch employment data using employee_id
    const employmentDoc = await getDocumentByField(
      "employment_data",
      "employee_id",
      employee_id
    );

    if (!employmentDoc) {
      throw new Error("Employment record not found for the given employee.");
    }

    const business_id = employmentDoc.data().business_id;

    // Validate employee and business profiles
    const employeeProfile = await getDocumentById("profile_data", employee_id);
    const businessProfile = await getDocumentById("business_data", business_id);

    if (!employeeProfile || !businessProfile) {
      throw new Error("Invalid employee or business profile.");
    }

    const payload = {
      employee_id,
      business_id,
      date,
      hours,
    };

    await saveOrUpdateDocument("employee_log", payload);
    console.log("Employee work hours logged successfully!");
  } catch (error) {
    console.error("Failed to log employee work hours:", error);
  }
}

export async function savePayroll(employeeId, businessId, data) {
  try {
    const { date } = data;

    // Check if a payroll already exists for the same employee, business, and date
    const existingPayroll = await getDocumentByField(
      "payroll_data",
      "date",
      date
    );

    if (
      existingPayroll &&
      existingPayroll.data().employee_id === employeeId &&
      existingPayroll.data().business_id === businessId
    ) {
      // Update the existing payroll
      await saveOrUpdateDocument("payroll_data", data, existingPayroll.id);
      console.log("Payroll data updated successfully!");
    } else {
      // Save a new payroll
      const payload = {
        employee_id: employeeId,
        business_id: businessId,
        ...data,
      };

      await saveOrUpdateDocument("payroll_data", payload);
      console.log("Payroll data saved successfully!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function getEmployeeEmploymentData(employeeId) {
  try {
    // Fetch employment data using employee_id
    const employmentDoc = await getDocumentByField(
      "employment_data",
      "employee_id",
      employeeId
    );

    if (!employmentDoc) {
      throw new Error("Employment record not found for the given employee.");
    }

    const employmentData = employmentDoc.data();

    // Fetch employee profile data using employee_id
    const employeeProfile = await getDocumentById("profile_data", employeeId);

    if (!employeeProfile) {
      throw new Error("Employee profile not found.");
    }

    return {
      employmentData,
      employeeProfile: employeeProfile.data,
    };
  } catch (error) {
    console.error("Failed to fetch employee employment data:", error);
    return null;
  }
}

export async function getPayrollDataByEmployeeId(employeeId) {
  try {
    const q = query(
      collection(db, "payroll_data"),
      where("employee_id", "==", employeeId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, data: doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch payroll data:", error);
    return null;
  }
}