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
} from "tamagui";

import {
  deleteDoctor,
  getDoctorsByHospitalId,
} from "../services/firebaseUtils";
import Icon from "react-native-vector-icons/Feather";
import { Dimensions } from "react-native";

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
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <XStack gap="$2" marginBottom="$4" alignItems="center">
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
          icon={<Icon name="plus" size={16} color="white" />}
          backgroundColor="#4CAF50"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderRadius="$3"
          onPress={handleAddDoctor}
        >
          <Text color="white" fontSize="$5">
            Add
          </Text>
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
                borderRadius="$4"
                width="100%"
                maxWidth={screenWidth - 32} // Adds padding around the card
                alignSelf="center"
                elevation={3}
                shadowColor="rgb(0,0,0)"
                shadowOpacity={0.8}
                shadowRadius={4}
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
                    backgroundColor="rgb(83, 154, 129)"
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

export default ManageDoctors;
