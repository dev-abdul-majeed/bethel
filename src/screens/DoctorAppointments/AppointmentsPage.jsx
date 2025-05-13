import { ScrollView, Text, View } from "tamagui";
import AppointmentForm from "./AppointmentForm";
import AppointmentsList from "./AppointmentsList";
import { useEffect, useState } from "react";

const AppointmentsPage = ({ navigation, route }) => {
  const doctorId = route.params.doctorId;
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      loadingAppointments(true);
      try {
        const data = await getAppointmentsByDoctorId(doctorId);
        setAppointments(data || []);
      } catch (error) {
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <ScrollView>
      <Text>AppointmentPage {route?.params?.doctorId}</Text>
      <AppointmentForm doctorId={doctorId} />
      <AppointmentsList
        appointments={appointments}
        loadingAppointments={loadingAppointments}
      />
    </ScrollView>
  );
};

export default AppointmentsPage;
