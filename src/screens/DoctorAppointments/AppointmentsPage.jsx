import { ScrollView, Text, View } from "tamagui";
import AppointmentForm from "./AppointmentForm";
import AppointmentsList from "./AppointmentsList";
import { useEffect, useState } from "react";
import { getAppointmentsByDoctorId } from "../../services/firebaseUtils";

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
      <Text>Appointments for Doctor {route?.params?.doctorId}</Text>
      <AppointmentForm
        doctorId={doctorId}
        onAppointmentCreated={handleAppointmentCreated}
      />
      <AppointmentsList
        appointments={appointments}
        loadingAppointments={loadingAppointments}
        onDelete={handleAppointmentDeleted}
      />
    </ScrollView>
  );
};

export default AppointmentsPage;
