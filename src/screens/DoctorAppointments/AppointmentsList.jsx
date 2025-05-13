import { StyleSheet } from "react-native";

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

const AppointmentsList = ({ appointments, loadingAppointments }) => {
  const getStatusColor = (status) => {
    return status === "available" ? "#E6F4EA" : "#FDECEA"; // green or red tint
  };

  const getBorderColor = (status) => {
    return status === "available" ? "#34A853" : "#D93025";
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
            key={appt.id || idx}
            backgroundColor={getStatusColor(appt.status)}
            borderLeftWidth={4}
            borderLeftColor={getBorderColor(appt.status)}
            borderRadius="$3"
            padding="$3"
            marginBottom="$3"
            alignItems="center"
            space="$3"
          >
            <YStack alignItems="center" width={170}>
              <H3 fontWeight="700" color="#333">
                {appt.date || "No date"}
              </H3>
            </YStack>

            <Separator vertical alignSelf="stretch" borderColor={"white"} />

            <YStack flex={1}>
              <H4 fontSize="$5" color="#444">
                Time: {appt.time || "No time"}
              </H4>
              <H3 fontSize="$4" color="#666">
                Status: {appt.status.toUpperCase()}
              </H3>
              <Button icon>Delete</Button>
            </YStack>
          </XStack>
        ))
      )}
    </YStack>
  );
};

export default AppointmentsList;

const styles = StyleSheet.create({});
