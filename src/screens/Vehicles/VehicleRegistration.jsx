import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Label,
  YStack,
  ScrollView,
  XStack,
  Avatar,
  Separator,
  Spinner,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import {
  getVehicleData,
  uploadVehicleToFirebase,
} from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import { Alert, Image, View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initializeVehicle = async () => {
      if (vid) {
        const vehicleData = await getVehicleData(user.uid, vid);
        if (vehicleData) {
          const loadedData = { ...vehicleData.data, vehicleId: vid };
          setForm(loadedData); // Correctly populate form fields
          setOriginalForm(loadedData);
        }
      }
      setLoading(false);
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
      Alert.alert("Error selecting image.");
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await uploadVehicleToFirebase(form, user);
      Alert.alert("Success", "Vehicle registered successfully!", [
        { text: "OK", onPress: () => navigation.pop() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving vehicle data.");
    } finally {
      setSaving(false);
    }
  };

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

  const hasChanges =
    originalForm &&
    Object.keys(form).some((key) => form[key] !== originalForm[key]);

  const isSaveEnabled = vid ? hasChanges : isFormComplete;

  const renderLabelWithIcon = (iconName, labelText) => (
    <XStack alignItems="center" space="$2">
      <Ionicons name={iconName} size={28} color="rgb(93, 0, 255)" />
      <Label fontSize={18}>{labelText}</Label>
    </XStack>
  );

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="rgb(93, 0, 255)" />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <YStack>
        <View
          style={{
            height: "15%",
            width: "100%",
            backgroundColor: "rgb(93, 0, 255)",
            position: "relative",
            borderBottomRightRadius: 40,
            borderBottomLeftRadius: 40,
            elevation: 5,
            marginBottom: 70,
          }}
        >
          {form.car_photo ? (
            <Image
              height={200}
              source={{ uri: form.car_photo }}
              style={{
                alignSelf: "center",
                top: "25%",
                borderWidth: 5,
                borderColor: "white",
                borderRadius: 100,
                width: 150,
                height: 150,
              }}
            />
          ) : (
            <Avatar
              circular
              size="$13"
              alignSelf="center"
              top={"25%"}
              borderWidth={5}
              borderColor={"white"}
            >
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
          )}
          <Button
            onPress={handlePickImage}
            width={60}
            height={35}
            padding={0}
            elevation={10}
            zIndex={1}
            backgroundColor={"rgb(167, 117, 255)"}
            left={"50%"}
            icon={<Ionicons name="image-outline" size={30} color={"white"} />}
          ></Button>
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 36,
            fontFamily: "Nexa-Heavy",
            color: "rgb(93, 0, 255)",
          }}
        >
          Vehicle Info
        </Text>
        <Separator
          horizontal
          borderColor={"rgb(167, 117, 255)"}
          borderWidth={2}
          width={"$3"}
          borderTopRightRadius={5}
          borderTopLeftRadius={5}
          alignSelf="center"
        />
        <YStack
          padding={20}
          borderTopColor={"rgb(93, 0, 255)"}
          borderTopWidth={3}
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          top={30}
          mb={100}
        >
          {renderLabelWithIcon("car-sport-outline", "Car Brand")}
          <Input
            value={form.brand}
            mb={15}
            onChangeText={(text) => handleChange("brand", text)}
          />

          {renderLabelWithIcon("pricetag-outline", "Car Name")}
          <Input
            value={form.name}
            mb={15}
            onChangeText={(text) => handleChange("name", text)}
          />

          {renderLabelWithIcon("calendar-outline", "Year")}
          <Input
            placeholder="YYYY"
            value={form.year}
            mb={15}
            onChangeText={(text) => handleChange("year", text)}
            keyboardType="numeric"
          />

          {renderLabelWithIcon("document-text-outline", "Registration Number")}
          <Input
            placeholder="ABC01 DEF"
            value={form.registrationNumber}
            mb={15}
            onChangeText={(text) => handleChange("registrationNumber", text)}
          />

          {renderLabelWithIcon("speedometer-outline", "Current Mileage (km)")}
          <Input
            value={form.mileage}
            mb={15}
            onChangeText={(text) => handleChange("mileage", text)}
            keyboardType="numeric"
          />

          {renderLabelWithIcon(
            "construct-outline",
            "Last Serviced Mileage (km)"
          )}
          <Input
            value={form.last_serviced_mileage}
            mb={15}
            onChangeText={(text) => handleChange("last_serviced_mileage", text)}
            keyboardType="numeric"
          />

          {renderLabelWithIcon("calendar-outline", "Last Service Date")}
          <Input
            value={form.last_service_date}
            mb={15}
            onChangeText={(text) => handleChange("last_service_date", text)}
          />

          <Button
            onPress={handleSubmit}
            backgroundColor={"rgb(93, 0, 255)"}
            width={"50%"}
            alignSelf="center"
            mb={30}
            disabled={!isSaveEnabled || saving}
            icon={
              saving ? (
                <Spinner size="small" color="white" />
              ) : (
                <Ionicons name="save-outline" color={"white"} size={25} />
              )
            }
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Nexa-Heavy",
                fontSize: 15,
              }}
            >
              {saving ? "Saving..." : "Save Vehicle"}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default VehicleRegistration;
