import { Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  YStack,
  H1,
  H2,
  ListItem,
  Button,
  Text,
  H4,
  H3,
  View,
  Spinner,
  Image,
  ScrollView,
} from "tamagui";
import { getBusinessData, deleteBusiness } from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";

const HospitalHome = ({ navigation, route }) => {
  const { hospitalId } = route.params;
  const user = getAuth().currentUser;
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBusinessData(user.uid);
        console.log("Business Data:", data);
        setBusinessData(data.data);
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteHospital = async () => {
    try {
      navigation.pop();
      // Assuming you have a function to delete hospital data in firebaseUtils
      await deleteBusiness(user.uid);
      console.log("Hospital deleted successfully");
    } catch (error) {
      console.error("Error deleting hospital:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleManageDoctors = () => {
    navigation.navigate("ManageDoctors", { hospitalId });
  };

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView>
      <YStack padding="$4" space>
        <H3>Hospital Management</H3>
        <YStack space="$3">
          <H2>Business Information</H2>
          {businessData && (
            <YStack space="$2">
              <ListItem>
                <Text>Business Name: {businessData.businessName}</Text>
              </ListItem>
              <ListItem>
                <Image
                  source={{
                    uri:
                      businessData.businessPhoto || businessData.business_image,
                  }}
                  width={100}
                  height={100}
                  borderRadius="$2"
                />
              </ListItem>
              <ListItem>
                <Text>Business Type: {businessData.businessType}</Text>
              </ListItem>
              <ListItem>
                <Text>Contact: {businessData.contact}</Text>
              </ListItem>
              <ListItem>
                <Text>Email: {businessData.email}</Text>
              </ListItem>
              <ListItem>
                <Text>Location Address: {businessData.locationAddress}</Text>
              </ListItem>
              <ListItem>
                <Text>Operational Hours: {businessData.operationalHours}</Text>
              </ListItem>
              <ListItem>
                <Text>Payday: {businessData.payday}</Text>
              </ListItem>
              <ListItem>
                <Text>Payment Frequency: {businessData.paymentFrequency}</Text>
              </ListItem>
            </YStack>
          )}
        </YStack>
        <Button onPress={handleManageDoctors}>Manage Doctors</Button>
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
        >
          <Text>Delete Hospital</Text>
        </Button>
        <Button
          onPress={() => {
            navigation.pop();
          }}
        >
          <Text>Home</Text>
        </Button>
      </YStack>
    </ScrollView>
  );
};

export default HospitalHome;

const styles = StyleSheet.create({});
