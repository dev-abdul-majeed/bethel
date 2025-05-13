import { ScrollView, Text, YStack, H1, Spinner, XStack, H4 } from "tamagui";
import AppointmentForm from "./AppointmentForm";
import AppointmentsList from "./AppointmentsList";
import { useEffect, useState } from "react";
import { getAppointmentsByDoctorId } from "../../services/firebaseUtils";
import Ionicons from "react-native-vector-icons/Ionicons";

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
      <YStack f={1} p="$4" marginTop={"$5"}>
        <XStack alignItems="center" justifyContent="center" mb="$4" gap="$5">
          <Ionicons name="calendar-outline" size={28} color="#4CAF50" />
          <H4>Manage Appointments</H4>
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

export default AppointmentsPage;
