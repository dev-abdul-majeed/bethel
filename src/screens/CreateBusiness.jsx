import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  YStack,
  Input,
  Button,
  Select,
  Text,
  RadioGroup,
  Radio,
  Label,
  XStack,
} from "tamagui";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { uploadBusinessToFirebase } from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";

const CreateBusiness = ({ navigation }) => {
  const route = useRoute();
  const user = getAuth().currentUser;

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [payday, setPayday] = useState("");
  const [businessPhoto, setBusinessPhoto] = useState("");

  useEffect(() => {
    if (route.params?.type) {
      setBusinessType(route.params.type); // Set the type from params
    }
  }, [route.params?.type]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setBusinessPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error selecting image.");
    }
  };

  const handleCreateBusiness = async () => {
    if (businessName && businessType && locationAddress && contact && email) {
      await uploadBusinessToFirebase(
        {
          businessName,
          businessType,

          locationAddress,
          contact,
          email,
          businessPhoto,
        },
        user
      );

      const newScreen =
        businessType == "hospital" ? "ManageHospital" : "ManageBusiness";

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }, { name: newScreen }],
      }); // Navigate back after creation and reset navigation stack with Home at the base
    } else {
      alert("Please fill all fields");
    }
  };

  const renderLabelWithIcon = (iconName, labelText) => (
    <XStack alignItems="center" space="$2">
      <Icon name={iconName} size={20} />
      <Label>{labelText}</Label>
    </XStack>
  );

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={160}
      contentContainerStyle={{ paddingBottom: 45 }}
    >
      <YStack f={1} p="$4" bg="$background" space>
        <Text fontSize="$6" fontWeight="bold">
          Create a New Business
        </Text>
        {renderLabelWithIcon("business-outline", "Business Name")}
        <Input
          placeholder="Enter Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          p="$2"
          placeholderTextColor="#ccc"
        />
        {renderLabelWithIcon("briefcase-outline", "Business Type")}
        <Input
          placeholder="Enter Business Type"
          value={businessType}
          onChangeText={setBusinessType}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          p="$2"
          disabled={businessType == "hospital"}
          style={{ color: businessType == "hospital" ? "#808080" : "#fffff" }}
        />

        {renderLabelWithIcon("location-outline", "Location Address")}
        <Input
          placeholder="Enter Location Address"
          value={locationAddress}
          onChangeText={setLocationAddress}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          p="$2"
        />
        {renderLabelWithIcon("call-outline", "Contact Number")}
        <Input
          placeholder="Enter Contact Number"
          value={contact}
          onChangeText={setContact}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          p="$2"
        />
        {renderLabelWithIcon("mail-outline", "Email Address")}
        <Input
          placeholder="Enter Email Address"
          value={email}
          onChangeText={setEmail}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          p="$2"
        />

        {!businessPhoto && (
          <Button onPress={handlePickImage} style={{ marginBottom: 10 }}>
            Pick Business Photo
          </Button>
        )}
        {businessPhoto ? (
          <>
            <Image
              height={200}
              source={{ uri: businessPhoto }}
              style={{ marginVertical: 10, borderRadius: 10 }}
            />
            <Button onPress={() => setBusinessPhoto("")} bg="#ff4d4d">
              Remove Photo
            </Button>
          </>
        ) : null}
        <Button
          onPress={handleCreateBusiness}
          bg={
            businessName && businessType && locationAddress && contact && email
              ? "#007bff"
              : "#cccccc"
          }
        >
          Create Business
        </Button>
      </YStack>
    </KeyboardAwareScrollView>
  );
};

export default CreateBusiness;

export function RadioGroupItemWithLabel(props) {
  const id = `radiogroup-${props.value}`;
  return (
    <XStack width={150} alignItems="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={props.size} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  );
}
