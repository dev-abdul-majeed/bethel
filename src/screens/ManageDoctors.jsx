import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  Button,
  Card,
  XStack,
  YStack,
  Image,
  Separator,
  Input,
  H3,
} from "tamagui";

import {
  deleteDoctor,
  getDoctorsByHospitalId,
} from "../services/firebaseUtils";
import Icon from "react-native-vector-icons/Feather";
import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
const ManageDoctors = ({ navigation, route }) => {
  const { hospitalId } = route.params;
  const isFocused = useIsFocused();

  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctorsByHospitalId(hospitalId);
        setDoctors(data);
      } catch (error) {
        setDoctors([]);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [isFocused]);

  const handleDoctorPress = (doctorId) => {
    navigation.navigate("DoctorRegistration", { doctorId, hospitalId });
  };

  const handleAddDoctor = () => {
    navigation.navigate("DoctorRegistration", { hospitalId });
  };

  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctor(doctorId);
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.id !== doctorId)
      );
      alert("Doctor deleted successfully.");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor. Please try again.");
    }
  };

  return (
    <YStack flex={1} backgroundColor="white">
      <H3 style={styles.h3}>Manage Doctors</H3>
      <XStack
        gap="$2"
        marginBottom="$4"
        alignItems="center"
        paddingHorizontal={10}
      >
        <XStack
          flex={1}
          alignItems="center"
          paddingHorizontal="$2"
          borderWidth={1}
          borderColor="#ccc"
          borderRadius="$3"
          backgroundColor="#f9f9f9"
        >
          <Icon
            name="search"
            size={18}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            flex={1}
            paddingVertical="$2"
            fontSize="$4"
            borderWidth={0}
            backgroundColor="transparent"
          />
        </XStack>

        <Button
          icon={<Icon name="plus-circle" size={16} color="white" />}
          backgroundColor="rgb(0, 128, 255)"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderRadius="$3"
          onPress={handleAddDoctor}
          textProps={{ color: "white" }}
        >
          Add
        </Button>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "white" }}
      >
        {loading ? (
          <Text textAlign="center" color="#808080">
            Loading...
          </Text>
        ) : doctors.length > 0 ? (
          doctors
            .filter((doctor) =>
              doctor.data.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((doctor) => (
              <Card
                key={doctor.id}
                bordered
                padding="$4"
                marginBottom="$5"
                backgroundColor="white"
                width="100%"
                maxWidth={screenWidth - 32} // Adds padding around the card
                alignSelf="center"
                borderColor={"rgb(15, 112, 191)"}
              >
                <YStack alignItems="center" marginBottom="$4">
                  <XStack
                    alignItems="center"
                    justifyContent="flex-start"
                    gap={"$2"}
                  >
                    <Image
                      source={{ uri: doctor.data.photo }}
                      width={130}
                      height={130}
                      borderRadius={12} // Rounded square
                    />
                    <Separator alignSelf="stretch" vertical mx={16} />

                    <Text
                      fontSize="$7"
                      fontWeight="700"
                      marginTop="$2"
                      color="#333"
                      minWidth={"$12"}
                      maxWidth={"$12"}
                    >
                      Dr. {doctor.data.name}
                    </Text>
                  </XStack>
                </YStack>
                <Separator alignSelf="stretch" horizontal mx={16} />

                <YStack alignItems="flex-start" gap="$1" marginTop="$4">
                  <XStack alignItems="center" gap="$2">
                    <Icon name="briefcase" size={16} color="#666" />
                    <Text fontSize="$5" color="#666">
                      Specialization: {doctor.data.specialization}
                    </Text>
                  </XStack>

                  <XStack alignItems="center" space="$2">
                    <Icon name="clock" size={16} color="#666" />
                    <Text fontSize="$5" color="#666">
                      Years of Experience: {doctor.data.experience}
                    </Text>
                  </XStack>
                </YStack>

                <XStack
                  justifyContent="space-between"
                  gap="$2"
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <Button
                    backgroundColor="rgb(37, 221, 132)"
                    icon={<Icon name="edit" size={16} color="white" />}
                    color="white"
                    onPress={() => handleDoctorPress(doctor.id)}
                    flex={0.5}
                  >
                    Edit
                  </Button>
                  <Button
                    backgroundColor="rgb(78, 94, 242)"
                    icon={<Icon name="calendar" size={16} color="white" />}
                    color="white"
                    marginTop={20}
                    flex={0.5}
                    onPress={() => {
                      navigation.navigate("Manage Appointments", {
                        doctorId: doctor.id,
                      });
                    }}
                  >
                    Appointments
                  </Button>
                </XStack>
                <Button
                  backgroundColor="rgb(251, 115, 115)"
                  icon={<Icon name="trash-2" size={16} color="white" />}
                  color="white"
                  onPress={() => handleDelete(doctor.id)}
                  maxWidth={"$10"}
                >
                  Delete
                </Button>
              </Card>
            ))
        ) : (
          <Text color="#808080" textAlign="center">
            No doctors found for: {hospitalId}.
          </Text>
        )}
      </ScrollView>
    </YStack>
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

export default ManageDoctors;
