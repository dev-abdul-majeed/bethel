import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TopBar from "../components/shared/TopBar";
import auth, { getAuth } from "@react-native-firebase/auth";
import ViewProfileCard from "../components/ViewProfileCard";
import { getUserProfile } from "../services/firebaseUtils";

function Home({ navigation }) {
  const user = getAuth().currentUser;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    about_me: "",
    profile_image: "",
  });

  useEffect(() => {
    // Fetch data from Firebase
    const initializeProfile = async () => {
      const profileData = await getUserProfile(user.uid);
      if (profileData) {
        setForm(
          { ...profileData.data } // spread the fields correctly
        );
      }
    };

    initializeProfile();
  }, []);
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} info={form} />

      <ViewProfileCard navigation={navigation} />
      <View style={styles.body}>
        <Text>Home Screen Content, {form.first_name}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileForm");
          }}
        ></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            auth().signOut();
          }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
