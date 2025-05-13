import { ScrollView, Text, YStack, H1, Spinner, XStack, H4, H3 } from "tamagui";
import AppointmentForm from "./AppointmentForm";
import AppointmentsList from "./AppointmentsList";
import { useEffect, useState } from "react";
import { getAppointmentsByDoctorId } from "../../services/firebaseUtils";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";

const AppointmentsPage = ({ navigation, route }) => {
  const doctorId = route.params.doctorId;
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      let data = await getAppointmentsByDoctorId(doctorId);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAppointmentCreated = () => {
    fetchAppointments(); // Refresh appointments after creating a new one
  };

  const handleAppointmentDeleted = () => {
    fetchAppointments(); // Refresh appointments after deletion
  };

  return (
    <ScrollView>
      <YStack f={1} backgroundColor={"white"} paddingBottom={100}>
        <XStack
          alignItems="center"
          justifyContent="center"
          mb="$4"
          gap="$5"
          style={styles.h3}
        >
          <Ionicons name="calendar-outline" size={28} color="#4CAF50" />
          <H3>Manage Appointments</H3>
        </XStack>

        <AppointmentForm
          doctorId={doctorId}
          onAppointmentCreated={handleAppointmentCreated}
        />
        <AppointmentsList
          appointments={appointments}
          loadingAppointments={loadingAppointments}
          onDelete={handleAppointmentDeleted}
        />
      </YStack>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  h3: {
    backgroundColor: "rgb(255, 255, 255)",
    paddingTop: 40,
    width: "100%",
    borderRadius: 20,
    textAlign: "center",
    paddingBottom: 10,
    elevation: 7,
    marginBottom: 30,
  },
});

export default AppointmentsPage;
