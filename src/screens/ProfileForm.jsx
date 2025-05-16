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
  View,
  Separator,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserProfile,
  uploadProfileToFirebase,
} from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import { Text } from "react-native";
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
          <Avatar
            circular
            size="$13"
            alignSelf="center"
            top={"25%"}
            borderWidth={5}
            borderColor={"white"}
          >
            <Avatar.Image accessibilityLabel="Cam" src={form?.profile_image} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
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
          Profile Info
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
          <XStack alignItems="center" space="$2">
            <Ionicons
              name="person-outline"
              size={28}
              color={"rgb(93, 0, 255)"}
            />
            <Label fontSize={18}>First Name</Label>
          </XStack>
          <Input
            value={form.first_name}
            mb={15}
            onChangeText={(text) => setForm({ ...form, first_name: text })}
          />
          <XStack alignItems="center" space="$2">
            <Ionicons
              color={"rgb(93, 0, 255)"}
              name="person-outline"
              size={28}
            />
            <Label fontSize={18}>Last Name</Label>
          </XStack>
          <Input
            mb={15}
            value={form.last_name}
            onChangeText={(text) => setForm({ ...form, last_name: text })}
          />
          <XStack alignItems="center" space="$2">
            <Ionicons
              color={"rgb(93, 0, 255)"}
              name="male-female-outline"
              size={28}
            />
            <Label fontSize={18}>Gender</Label>
          </XStack>
          <Select
            value={form.gender}
            onValueChange={(val) => setForm({ ...form, gender: val })}
          >
            <Select.Item index={0} value="Male">
              Male
              <Select.ItemIndicator marginLeft="auto">
                <Ionicons size={28} color={"rgb(93, 0, 255)"} name="male" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item index={1} value="Female">
              Female
              <Select.ItemIndicator marginLeft="auto">
                <Ionicons size={28} color={"rgb(93, 0, 255)"} name="female" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item index={2} value="Other">
              Other
              <Select.ItemIndicator marginLeft="auto">
                <Ionicons size={28} color={"rgb(93, 0, 255)"} name="person" />
              </Select.ItemIndicator>
            </Select.Item>
          </Select>
          <XStack alignItems="center" space="$2">
            <Ionicons
              size={28}
              color={"rgb(93, 0, 255)"}
              name="calendar-outline"
            />
            <Label fontSize={18}>Date of Birth</Label>
          </XStack>
          <Input
            mb={15}
            placeholder="YYYY-MM-DD"
            value={form.dob}
            onChangeText={(text) => setForm({ ...form, dob: text })}
          />
          <XStack alignItems="center" space="$2">
            <Ionicons
              size={28}
              color={"rgb(93, 0, 255)"}
              name="information-circle-outline"
            />
            <Label fontSize={18}>About Me</Label>
          </XStack>
          <TextArea
            value={form.about_me}
            mb={20}
            onChangeText={(text) => setForm({ ...form, about_me: text })}
          />

          <Button
            onPress={handleSubmit}
            backgroundColor={"rgb(93, 0, 255)"}
            width={"50%"}
            alignSelf="center"
            mb={30}
            icon={<Ionicons name="save-outline" color={"white"} size={25} />}
          >
            <Text
              style={{ color: "white", fontFamily: "Nexa-Heavy", fontSize: 15 }}
            >
              Save Profile
            </Text>
          </Button>

          <Button
            onPress={() => {
              auth.signOut();
            }}
            backgroundColor={"rgb(247, 72, 72)"}
            width={"40%"}
            borderRadius={40}
            alignSelf="center"
            iconAfter={
              <Ionicons name="log-out-outline" color={"white"} size={25} />
            }
          >
            <Text
              style={{ color: "white", fontFamily: "Nexa-Heavy", fontSize: 15 }}
            >
              Log Out
            </Text>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
