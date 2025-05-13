import { useEffect, useState } from "react";
import {
  Text,
  YStack,
  Spinner,
  XStack,
  Separator,
  H4,
  H3,
  Button,
} from "tamagui";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  bookPatientAppointment,
  cancelPatientAppointment,
  getAppointmentsByDoctorId,
} from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import TopNavHeader from "../../components/shared/TopNavHeader";

const ListDoctorAppointments = () => {
  const doctorId = "DJi6QrV3XOjKz9qwGOAU";
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const patientId = getAuth().currentUser.uid;

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDoctorId(doctorId);
      console.log(data);
      setAppointments(data);
    } catch (error) {
      Alert.alert("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    return status === "available" ? "#E6F4EA" : "#FDECEA"; // green or red tint
  };

  const getBorderColor = (status) => {
    return status === "available" ? "#34A853" : "#D93025";
  };

  const handleBooking = async (appointmentId) => {
    setBookingId(appointmentId);
    try {
      await bookPatientAppointment(appointmentId, patientId);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Failed to book appointment:", error);
    } finally {
      setBookingId(null);
    }
  };

  const handleCanceling = async (appointmentId) => {
    setBookingId(appointmentId);
    try {
      await cancelPatientAppointment(appointmentId);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    } finally {
      setBookingId(null);
    }
  };

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
        <Text mt="$2">Loading appointments...</Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$2" backgroundColor={"white"} paddingBottom={100}>
      <TopNavHeader text={"Appointments List"} style={{ flex: 0 }} />
      <XStack flex={1} marginBottom={50} mx="$4" gap={"$2"}>
        <Button
          flex={0.5}
          backgroundColor={"rgb(249, 179, 99)"}
          onPress={fetchAppointments} // Fetch all appointments
          icon={<Ionicons name="calendar-outline" size={25} />}
        >
          All
        </Button>
        <Button
          flex={0.5}
          backgroundColor={"rgb(149, 252, 134)"}
          icon={<Ionicons name="funnel-outline" size={25} />}
          onPress={async () => {
            setLoading(true);
            try {
              const data = await getAppointmentsByDoctorId(doctorId);
              const availableAppointments = data.filter(
                (appt) => appt.data.status === "available"
              );
              setAppointments(availableAppointments);
            } catch (error) {
              Alert.alert("Something went wrong", error);
            } finally {
              setLoading(false);
            }
          }}
        >
          Available
        </Button>
      </XStack>

      {appointments.length === 0 ? (
        <Text>No appointments found.</Text>
      ) : (
        appointments.map((appt, idx) => (
          <XStack
            key={appt.id}
            backgroundColor={getStatusColor(appt.data.status)}
            borderLeftWidth={4}
            borderLeftColor={getBorderColor(appt.data.status)}
            borderRadius="$3"
            padding="$3"
            marginBottom="$3"
            alignItems="center"
            gap="$3"
            m="$3"
          >
            <YStack alignItems="center" width={170}>
              <H3 fontWeight="700" color="#333">
                {appt.data.date || "No date"}
              </H3>
            </YStack>

            <Separator vertical alignSelf="stretch" borderColor={"white"} />

            <YStack flex={1}>
              <H4 fontSize="$5" color="#444">
                Time: {appt.data.time || "No time"}
              </H4>
              <H3 fontSize="$4" color="#666">
                Status: {appt.data.status}
              </H3>
              {appt.data.status == "available" ? (
                <Button
                  onPress={() => handleBooking(appt.id)}
                  disabled={bookingId === appt.id}
                  backgroundColor={"rgb(32, 140, 255)"}
                  icon={
                    <Ionicons
                      name="checkmark-done-circle-outline"
                      size={20}
                      color={"white"}
                    />
                  }
                  textProps={{ color: "white" }}
                >
                  {bookingId === appt.id ? "Booking..." : "Book"}
                </Button>
              ) : appt.data.patientId == patientId ? (
                <Button
                  onPress={() => handleCanceling(appt.id)}
                  disabled={bookingId === appt.id}
                  backgroundColor={"rgb(255, 117, 32)"}
                  icon={<Ionicons name="trash" size={20} color={"white"} />}
                  textProps={{ color: "white" }}
                >
                  {bookingId === appt.id ? "Cancelling..." : "Cancel"}
                </Button>
              ) : (
                <Button
                  onPress={() => handleBooking(appt.id)}
                  disabled={true}
                  backgroundColor={"rgb(163, 163, 163)"}
                  icon={
                    <Ionicons
                      name="checkmark-done-circle-outline"
                      size={20}
                      color={"white"}
                    />
                  }
                  textProps={{ color: "white" }}
                >
                  Unavailable
                </Button>
              )}
            </YStack>
          </XStack>
        ))
      )}
    </YStack>
  );
};

export default ListDoctorAppointments;
