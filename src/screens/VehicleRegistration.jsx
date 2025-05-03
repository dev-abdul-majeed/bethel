import React, { useEffect, useState } from "react";
import { Button, Input, Label, YStack, ScrollView, XStack } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import {
  getVehicleData,
  uploadVehicleToFirebase,
} from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import { Alert, Image, KeyboardAvoidingView, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const VehicleRegistration = ({ navigation, route }) => {
  const user = getAuth().currentUser;
  const vid = route?.params?.vid || "";

  const [form, setForm] = useState({
    car_photo: "",
    registrationNumber: "",
    year: "",
    brand: "",
    name: "",
    mileage: "",
    last_serviced_mileage: "",
    last_service_date: "",
    vehicleId: vid,
  });

  const [originalForm, setOriginalForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeVehicle = async () => {
      if (vid) {
        const vehicleData = await getVehicleData(user.uid, vid);
        if (vehicleData) {
          const loadedData = { ...form, ...vehicleData.data, vehicleId: vid };
          setForm(loadedData);
          setOriginalForm(loadedData); // store original for comparison
        }
      }
    };
    initializeVehicle();
  }, [vid, user.uid]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        handleChange("car_photo", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert("Error selecting image.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await uploadVehicleToFirebase(form, user);
      Alert.alert("Success", "Vehicle registered successfully!", [
        { text: "OK", onPress: () => navigation.pop() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving vehicle data.");
    } finally {
      setLoading(false);
    }
  };

  // Check if all fields are filled
  const isFormComplete = Object.values({
    brand: form.brand,
    name: form.name,
    year: form.year,
    registrationNumber: form.registrationNumber,
    mileage: form.mileage,
    last_serviced_mileage: form.last_serviced_mileage,
    last_service_date: form.last_service_date,
    car_photo: form.car_photo,
  }).every((val) => val !== "");

  // Check if any field has changed
  const hasChanges =
    originalForm &&
    Object.keys(form).some((key) => form[key] !== originalForm[key]);

  const isSaveEnabled = vid ? hasChanges : isFormComplete;

  const renderLabelWithIcon = (iconName, labelText) => (
    <XStack alignItems="center" space="$2">
      <Icon name={iconName} size={20} />
      <Label>{labelText}</Label>
    </XStack>
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: 45 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={140}
    >
    <ScrollView contentContainerStyle={{ paddingBottom: 45 }}>
      <YStack space="$3" padding="$4">
        {renderLabelWithIcon("car-outline", `VehicleId: ${form.vehicleId}`)}

        {renderLabelWithIcon("car-sport-outline", "Car Brand")}
        <Input
          value={form.brand}
          onChangeText={(text) => handleChange("brand", text)}
        />

        {renderLabelWithIcon("pricetag-outline", "Car Name")}
        <Input
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        {renderLabelWithIcon("calendar-outline", "Year")}
        <Input
          placeholder="YYYY"
          value={form.year}
          onChangeText={(text) => handleChange("year", text)}
          keyboardType="numeric"
        />

        {renderLabelWithIcon("document-text-outline", "Registration Number")}
        <Input
          placeholder="ABC01 DEF"
          value={form.registrationNumber}
          onChangeText={(text) => handleChange("registrationNumber", text)}
        />

        {renderLabelWithIcon("speedometer-outline", "Current Mileage (km)")}
        <Input
          value={form.mileage}
          onChangeText={(text) => handleChange("mileage", text)}
          keyboardType="numeric"
        />

        {renderLabelWithIcon(
          "construct-outline",
          "Last Serviced Mileage (km)"
        )}
        <Input
          value={form.last_serviced_mileage}
          onChangeText={(text) => handleChange("last_serviced_mileage", text)}
          keyboardType="numeric"
        />

        {renderLabelWithIcon("calendar-outline", "Last Service Date")}
        <Input
          value={form.last_service_date}
          onChangeText={(text) => handleChange("last_service_date", text)}
        />

        {renderLabelWithIcon("image-outline", "Car Photo")}
        {form.car_photo ? (
          <Image height={200} source={{ uri: form.car_photo }} />
        ) : null}
        <Button onPress={handlePickImage} disabled={loading}>
          Pick Car Photo
        </Button>
        <Button onPress={handleSubmit} disabled={!isSaveEnabled || loading}>
          {loading ? "Saving..." : "Save Vehicle"}
        </Button>
      </YStack>
    </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default VehicleRegistration;
