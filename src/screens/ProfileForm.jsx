// ProfileForm.tsx
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
  getUserProfile,
  uploadProfileToFirebase,
} from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import { auth } from "../services/firebase";

export default function ProfileForm() {
  const user = getAuth().currentUser;

  useEffect(() => {
    // Fetch data from Firebase
    const initializeProfile = async () => {
      const profileData = await getUserProfile(user.uid);
      if (profileData) {
        setForm((prevForm) => ({
          ...prevForm,
          ...profileData.data, // spread the fields correctly
        }));
      }
    };

    initializeProfile();
  }, []);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    about_me: "",
    profile_image: "",
  });

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, profile_image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    await uploadProfileToFirebase(form, user);
  };

  return (
    <ScrollView>
      <YStack space="$3" padding="$4">
        <Label>First Name</Label>
        <Input
          value={form.first_name}
          onChangeText={(text) => setForm({ ...form, first_name: text })}
        />
        <Label>Last Name</Label>
        <Input
          value={form.last_name}
          onChangeText={(text) => setForm({ ...form, last_name: text })}
        />
        <Label>Gender</Label>
        <Select
          value={form.gender}
          onValueChange={(val) => setForm({ ...form, gender: val })}
        >
          <Select.Item index={0} value="Male">
            Male
            <Select.ItemIndicator marginLeft="auto">
              <Ionicons name="mail" size={30} color="#5F99AE" />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item index={1} value="Female">
            Female
            <Select.ItemIndicator marginLeft="auto">
              <Ionicons name="mail" size={30} color="#5F99AE" />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item index={2} value="Other">
            Other
            <Select.ItemIndicator marginLeft="auto">
              <Ionicons name="mail" size={30} color="#5F99AE" />
            </Select.ItemIndicator>
          </Select.Item>
        </Select>
        <Label>Date of Birth</Label>
        <Input
          placeholder="YYYY-MM-DD"
          value={form.dob}
          onChangeText={(text) => setForm({ ...form, dob: text })}
        />
        <Label>About Me</Label>
        <TextArea
          value={form.about_me}
          onChangeText={(text) => setForm({ ...form, about_me: text })}
        />
        <Label>Profile Image</Label>
        {form.profile_image ? (
          <Avatar size="$4" source={{ uri: form.profile_image }} />
        ) : null}
        <Button onPress={handlePickImage}>Pick Image</Button>
        <Button onPress={handleSubmit}>Save Profile</Button>
      </YStack>
    </ScrollView>
  );
}
