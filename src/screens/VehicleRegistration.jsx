import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  TextArea,
  YStack,
  ScrollView,
  Label,
  Select,
  Avatar,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getVehicleData,
  uploadVehicleToFirebase,
} from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import { Image } from "react-native";

const VehicleRegistration = () => {
  const user = getAuth().currentUser;

  const [form, setForm] = useState({
    car_photo: "",
    registrationNumber: "",
    year: "",
    brand: "",
    name: "",
    mileage: "",
    last_serviced_mileage: "",
    last_service_date: "",
  });

  useEffect(() => {
    const initializeVehicle = async () => {
      const vehicleData = await getVehicleData(user.uid);
      if (vehicleData) {
        setForm((prevForm) => ({
          ...prevForm,
          ...vehicleData.data,
        }));
      }
    };

    initializeVehicle();
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, car_photo: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    try {
      await uploadVehicleToFirebase(form, user);
      Alert.alert("Vehicle registered successfully!");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving vehicle data.");
    }
  };

  return (
    <ScrollView>
      <YStack space="$3" padding="$4">
        <Label>Car Brand</Label>
        <Input
          value={form.brand}
          onChangeText={(text) => setForm({ ...form, brand: text })}
        />
        <Label>Car Name</Label>
        <Input
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <Label>Year</Label>
        <Input
          placeholder="YYYY"
          value={form.year}
          onChangeText={(text) => setForm({ ...form, year: text })}
          keyboardType="numeric"
        />
        <Label>Registration Number</Label>
        <Input
          placeholder="ABC01 DEF"
          value={form.registrationNumber}
          onChangeText={(text) =>
            setForm({ ...form, registrationNumber: text })
          }
        />
        <Label>Current Mileage (km)</Label>
        <Input
          value={form.mileage}
          onChangeText={(text) => setForm({ ...form, mileage: text })}
          keyboardType="numeric"
        />
        <Label>Last Serviced Mileage (km)</Label>
        <Input
          value={form.last_serviced_mileage}
          onChangeText={(text) =>
            setForm({ ...form, last_serviced_mileage: text })
          }
          keyboardType="numeric"
        />
        <Label>Last Service Date</Label>
        <Input
          placeholder="YYYY-MM-DD"
          value={form.last_service_date}
          onChangeText={(text) => setForm({ ...form, last_service_date: text })}
        />
        <Label>Car Photo</Label>
        {form.car_photo ? (
          <Image height={200} source={{ uri: form.car_photo }} />
        ) : null}
        <Button onPress={handlePickImage}>Pick Car Photo</Button>
        <Button onPress={handleSubmit}>Save Vehicle</Button>
      </YStack>
    </ScrollView>
  );
};

export default VehicleRegistration;

// const styles = StyleSheet.create({});
