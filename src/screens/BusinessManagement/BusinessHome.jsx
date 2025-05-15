import React, { useEffect, useState } from "react";
import { View, Text, Button, Spinner, YStack } from "tamagui";
import { getBusinessData } from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";

const BusinessHome = ({ route, navigation }) => {
  const { businessId } = route.params;
  const user = getAuth().currentUser;

  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBusinessData(user.uid, businessId);
        setBusinessData(data);
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId, user.uid]);

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </View>
    );
  }

  if (!businessData) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>No business data found.</Text>
      </View>
    );
  }

  return (
    <YStack flex={1} padding="$4">
      <Text fontSize="$6" fontWeight="bold">
        Welcome to {businessData.name}
      </Text>
      <Text fontSize="$5" marginTop="$2">
        Location: {businessData.location}
      </Text>
      <Text fontSize="$5" marginTop="$2">
        Contact: {businessData.contact}
      </Text>
      <Text fontSize="$5" marginTop="$2">
        Services: {businessData.services?.join(", ") || "N/A"}
      </Text>

      <Button
        marginTop="$4"
        onPress={() => navigation.navigate("ManageEmployees", { businessId })}
      >
        Manage Employees
      </Button>
      <Button
        marginTop="$4"
        onPress={() => navigation.navigate("AppointmentsPage", { businessId })}
      >
        Manage Appointments
      </Button>
    </YStack>
  );
};

export default BusinessHome;