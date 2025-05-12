import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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
} from "tamagui";

import { TextInput } from "react-native";
import { getDoctorsByHospitalId } from "../services/firebaseUtils";

const ManageDoctors = ({ navigation, route }) => {
  const { hospitalId } = route.params;

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
  }, []);

  const handleDoctorPress = (doctorId) => {
    navigation.navigate("DoctorRegistration", { doctorId, hospitalId });
  };

  const handleAddDoctor = () => {
    navigation.navigate("DoctorRegistration", { hospitalId });
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$3">
        Manage Doctors
      </Text>

      <TextInput
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        padding="$2"
        borderWidth={1}
        borderColor="#808080"
        borderRadius={5}
        marginBottom="$4"
      />

      <Button onPress={handleAddDoctor} marginBottom="$4">
        <Text>Add New Doctor</Text>
      </Button>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text textAlign="center" color="#808080">
            Loading...
          </Text>
        ) : doctors.length > 0 ? (
          doctors.map((doctor) => (
            <Card
              key={doctor.id}
              elevate
              bordered
              size="$4"
              marginBottom="$4"
              pressStyle={{ scale: 0.98, backgroundColor: "#808080" }}
              onPress={() => handleDoctorPress(doctor.id)}
            >
              <XStack alignItems="center" space="$3">
                <Image
                  source={{ uri: doctor.data.photo }}
                  width={50}
                  height={50}
                  borderRadius={25}
                />
                <YStack>
                  <Text fontSize="$6" fontWeight="600">
                    {doctor.data.name}
                  </Text>
                  <Text color="#808080">{doctor.data.speciality}</Text>
                </YStack>
              </XStack>
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
