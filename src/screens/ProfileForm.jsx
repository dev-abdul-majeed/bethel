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
  XStack,
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
        <XStack alignItems="center" space="$2">
          <Ionicons name="person-outline" size={20} />
          <Label>First Name</Label>
        </XStack>
        <Input
          value={form.first_name}
          onChangeText={(text) => setForm({ ...form, first_name: text })}
        />
        <XStack alignItems="center" space="$2">
          <Ionicons name="person-outline" size={20} />
          <Label>Last Name</Label>
        </XStack>
        <Input
          value={form.last_name}
          onChangeText={(text) => setForm({ ...form, last_name: text })}
        />
        <XStack alignItems="center" space="$2">
          <Ionicons name="male-female-outline" size={20} />
          <Label>Gender</Label>
        </XStack>
        <Select
          value={form.gender}
          onValueChange={(val) => setForm({ ...form, gender: val })}
        >
          <Select.Item index={0} value="Male">
            Male
            <Select.ItemIndicator marginLeft="auto">
              <Ionicons name="male" size={30} color="#5F99AE" />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item index={1} value="Female">
            Female
            <Select.ItemIndicator marginLeft="auto">
              <Ionicons name="female" size={30} color="#5F99AE" />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item index={2} value="Other">
            Other
            <Select.ItemIndicator marginLeft="auto">
              <Ionicons name="person" size={30} color="#5F99AE" />
            </Select.ItemIndicator>
          </Select.Item>
        </Select>
        <XStack alignItems="center" space="$2">
          <Ionicons name="calendar-outline" size={20} />
          <Label>Date of Birth</Label>
        </XStack>
        <Input
          placeholder="YYYY-MM-DD"
          value={form.dob}
          onChangeText={(text) => setForm({ ...form, dob: text })}
        />
        <XStack alignItems="center" space="$2">
          <Ionicons name="information-circle-outline" size={20} />
          <Label>About Me</Label>
        </XStack>
        <TextArea
          value={form.about_me}
          onChangeText={(text) => setForm({ ...form, about_me: text })}
        />
        <XStack alignItems="center" space="$2">
          <Ionicons name="image-outline" size={20} />
          <Label>Profile Image</Label>
        </XStack>
        {form.profile_image ? (
          <Avatar circular size="$20" alignSelf="center">
            <Avatar.Image accessibilityLabel="Cam" src={form.profile_image} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        ) : null}
        <Button onPress={handlePickImage}>Pick Image</Button>
        <Button onPress={handleSubmit}>Save Profile</Button>
      </YStack>
    </ScrollView>
  );
}
