import { StyleSheet } from "react-native";
import { getAppointmentsByDoctorId } from "../../services/firebaseUtils";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, ListItem, YStack, Spinner } from "tamagui";

const AppointmentsList = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Replace 'doctorId' with the actual doctor ID as needed
        const doctorId = 123;
        const data = await getAppointmentsByDoctorId(doctorId);
        setAppointments(data || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
        <Text mt="$2">Loading appointments...</Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$2" p="$3">
      {appointments.length === 0 ? (
        <Text>No appointments found.</Text>
      ) : (
        appointments.map((appt, idx) => (
          <ListItem
            key={appt.id || idx}
            title={appt.data.appointmentBooked ? "Booked" : "Available"}
          >
            <Text>Date: {appt.data.date || "No date"}</Text>
            <Text>Time: {appt.data.time || "No time"}</Text>
            <Text
              onPress={() =>
                navigation.navigate("Manage Appointment", { appointment: appt })
              }
              style={{ color: "#007AFF", marginTop: 8 }}
            >
              Edit Appointment
            </Text>
          </ListItem>
        ))
      )}
    </YStack>
  );
};

export default AppointmentsList;

const styles = StyleSheet.create({});
