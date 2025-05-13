import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import { View, Text, Button, Spinner, YStack } from "tamagui";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import TopNavHeader from "../../components/shared/TopNavHeader";
import { Ionicons } from "@expo/vector-icons";
import { getAppointmentsByPatientId } from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";

// Dummy data
const dummyAppointments = [
  {
    id: 1,
    doctorName: "Dr. John Doe",
    date: "2023-10-01",
    time: "10:00 AM",
    location: "Clinic A",
  },
  {
    id: 2,
    doctorName: "Dr. Jane Smith",
    date: "2023-10-02",
    time: "2:00 PM",
    location: "Clinic B",
  },
  {
    id: 3,
    doctorName: "Dr. Emily Johnson",
    date: "2023-10-03",
    time: "11:00 AM",
    location: "Clinic C",
  },
  {
    id: 4,
    doctorName: "Dr. John Doe",
    date: "2023-10-01",
    time: "10:00 AM",
    location: "Clinic A",
  },
  {
    id: 5,
    doctorName: "Dr. Jane Smith",
    date: "2023-10-02",
    time: "2:00 PM",
    location: "Clinic B",
  },
  {
    id: 6,
    doctorName: "Dr. Emily Johnson",
    date: "2023-10-03",
    time: "11:00 AM",
    location: "Clinic C",
  },
];

const cancelAppointment = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500); // Simulate network delay
  });
};

const AppointmentsHome = ({ navigation }) => {

  const user = getAuth().currentUser;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointmentsByPatientId(user.uid);
      setAppointments(data);
    } catch (err) {
      setError("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAppointmentsByPatientId(user.uid);
      setAppointments(data);
    } catch (err) {
      setError("Failed to refresh appointments.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (err) {
      setError("Failed to cancel the appointment. Please try again.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const renderAppointment = (item) => (
    <YStack
      padding="$4"
      marginHorizontal="$4"
      marginBottom="$3"
      borderWidth={1}
      borderColor="#ccc"
      backgroundColor="#fff"
      borderRadius="$2"
      key={item.id}
    >
      <Text fontSize="$6" fontWeight="bold">
        {item.data?.doctorName || "Dr John Doe"}
      </Text>
      <YStack flexDirection="row" alignItems="center" marginTop="$2">
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text marginLeft="$2">Date: {item.data?.date}</Text>
      </YStack>
      <YStack flexDirection="row" alignItems="center" marginTop="$2">
        <Ionicons name="time-outline" size={16} color="#555" />
        <Text marginLeft="$2">Time: {item.data?.time}</Text>
      </YStack>
      <YStack flexDirection="row" alignItems="center" marginTop="$2">
        <Ionicons name="location-outline" size={16} color="#555" />
        <Text marginLeft="$2">Location: {item.data?.location}</Text>
      </YStack>
      <Button
        size="$3"
        marginTop="$2"
        backgroundColor="#ff4d4d"
        color="#fff"
        borderRadius="$2"
        onPress={() => handleCancel(item.id)}
      >
        Cancel
      </Button>
    </YStack>
  );

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="red" fontSize="$5" textAlign="center">
          {error}
        </Text>
        <Button marginTop="$4" onPress={fetchAppointments}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View flex={1} >
      <TopNavHeader text={"My Appointments"} style={{
        flex: 0,
      }
    } />

      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("ListHospitals")}>
        <Ionicons name="add-outline" size={24} color="white" />
      </TouchableOpacity>
      {/* <Button
        marginBottom="$4"
        backgroundColor="#007bff"
        color="#fff"
        borderRadius="$2"
        onPress={() => navigation.navigate("ListHospitals")}
      >
        Book New Appointment
      </Button> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {appointments.length > 0 ? (
          appointments.map(renderAppointment)
        ) : (
          <Text textAlign="center" fontSize="$5" color="gray">
            No appointments found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "#007bff", // Primary blue color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
    right: 30,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000, // Ensure it appears above other elements
  },
});

export default AppointmentsHome;
