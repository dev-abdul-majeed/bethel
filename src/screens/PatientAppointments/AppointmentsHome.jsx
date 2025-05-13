import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { View, Text, Button, Spinner, YStack } from "tamagui";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

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
];

// Mock API functions
const getUserAppointments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyAppointments), 1000); // Simulate network delay
  });
};

const cancelAppointment = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500); // Simulate network delay
  });
};

const AppointmentsHome = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserAppointments();
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
      const data = await getUserAppointments();
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
      marginBottom="$3"
      borderWidth={1}
      borderColor="#ccc"
      backgroundColor="#fff"
      borderRadius="$2"
      key={item.id}
    >
      <Text fontSize="$5" fontWeight="bold">
        {item.doctorName}
      </Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Location: {item.location}</Text>
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
    <View flex={1} padding="$4">
      <Button
        marginBottom="$4"
        backgroundColor="#007bff"
        color="#fff"
        borderRadius="$2"
        onPress={() => navigation.navigate("ListHospitals")}
      >
        Book New Appointment
      </Button>
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

export default AppointmentsHome;
