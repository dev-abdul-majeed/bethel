import { StyleSheet } from "react-native";
import { useState } from "react";
import {
  Text,
  YStack,
  Spinner,
  XStack,
  Separator,
  H1,
  H4,
  H3,
  Button,
} from "tamagui";
import { deleteAppointment } from "../../services/firebaseUtils";

const AppointmentsList = ({ appointments, loadingAppointments, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const getStatusColor = (status) => {
    return status === "available" ? "#E6F4EA" : "#FDECEA"; // green or red tint
  };

  const getBorderColor = (status) => {
    return status === "available" ? "#34A853" : "#D93025";
  };

  const handleDelete = async (appointmentId) => {
    setDeletingId(appointmentId);
    try {
      await deleteAppointment(appointmentId);
      onDelete(); // Notify parent to refresh the list
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loadingAppointments) {
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
          <XStack
            key={appt.id}
            backgroundColor={getStatusColor(appt.data.status)}
            borderLeftWidth={4}
            borderLeftColor={getBorderColor(appt.data.status)}
            borderRadius="$3"
            padding="$3"
            marginBottom="$3"
            alignItems="center"
            space="$3"
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
              <Button
                onPress={() => handleDelete(appt.id)}
                disabled={deletingId === appt.id}
                icon={<Text>X</Text>}
              >
                {deletingId === appt.id ? "Deleting..." : "Delete"}
              </Button>
            </YStack>
          </XStack>
        ))
      )}
    </YStack>
  );
};

export default AppointmentsList;

const styles = StyleSheet.create({});
