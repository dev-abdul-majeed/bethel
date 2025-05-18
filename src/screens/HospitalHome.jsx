import { Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  YStack,
  H1,
  Separator,
  Button,
  Text,
  Image,
  ScrollView,
  H3,
  XStack,
  H4,
  H2,
} from "tamagui";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteBusiness } from "../services/firebaseUtils";
import TopNavHeader from "../components/shared/TopNavHeader";
import { LinearGradient } from "expo-linear-gradient";

const HospitalHome = ({ navigation, route }) => {
  const hospitalId = route.params.hospitalId;
  const businessData = route.params.data;
  const [loading, setLoading] = useState(false);

  const deleteHospital = async () => {
    setLoading(true);
    try {
      navigation.pop();
      await deleteBusiness(user.uid);
    } catch (error) {
      Alert.alert("Error", "Failed to delete hospital. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <YStack backgroundColor={"white"} flex={1}>
        <TopNavHeader text={"Hospital Management"} />
        {businessData && (
          <>
            <Image
              source={{ uri: businessData.business_image }}
              width="100%"
              height={250}
              borderRadius="$4"
              mb="$4"
              alignSelf="center"
            />
            <H2 textAlign="center" color="$color" mb="$2" fontWeight="bold">
              {businessData.businessName}
            </H2>
            <Separator horizontal borderColor={"rgb(168, 168, 168)"} my={16} />

            <YStack gap="$3" paddingHorizontal={50}>
              <XStack alignItems="center" gap="$4">
                <Ionicons name="call" size={26} color="rgb(3, 90, 202)" />
                <Text fontSize="$8" color="rgb(50, 50, 50)">
                  Contact: {businessData.contact}
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$4">
                <Ionicons name="mail" size={26} color="rgb(3, 90, 202)" />
                <Text fontSize="$8" color="rgb(50, 50, 50)">
                  Email: {businessData.email}
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$4">
                <Ionicons name="location" size={26} color="rgb(3, 90, 202)" />
                <Text fontSize="$8" color="rgb(50, 50, 50)">
                  Location Address: {businessData.locationAddress}
                </Text>
              </XStack>
            </YStack>
          </>
        )}

        <Button
          onPress={() => {
            Alert.alert(
              "Delete Hospital",
              "Are you sure you want to delete this hospital?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: deleteHospital },
              ]
            );
          }}
          mt={40}
          bg="rgb(238, 66, 66)"
          icon={<Ionicons name="trash" size={20} color="white" />}
          disabled={loading}
        >
          {loading ? (
            <Text color="white">Deleting...</Text>
          ) : (
            <Text color="white">Delete Hospital</Text>
          )}
        </Button>
      </YStack>
    </ScrollView>
  );
};

export default HospitalHome;
