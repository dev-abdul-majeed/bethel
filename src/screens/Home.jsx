import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TopBar from "../components/shared/TopBar";
import auth, { getAuth } from "@react-native-firebase/auth";
import ViewProfileCard from "../components/ViewProfileCard";
import { getBusinessData, getUserProfile } from "../services/firebaseUtils";
import { useIsFocused } from "@react-navigation/native";
import { Card, H2, Paragraph, XStack, Button, Image } from "tamagui";

function Home({ navigation }) {
  const isFocused = useIsFocused();
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
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} info={form} />

      {/* <ViewProfileCard navigation={navigation} /> */}

      <Card elevate size="$4" width={"100%"} scale={0.95} borderRadius={30}>
        <Card.Header padded>
          <H2>View your Vehicle details</H2>
          <Paragraph theme="alt2">
            Set your name, DOB and Profile Image
          </Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack flex={1} />
          <Button
            borderRadius="$10"
            onPress={() => {
              navigation.navigate("Vehicles");
            }}
          >
            Let's Go
          </Button>
        </Card.Footer>
      </Card>

      <Card elevate size="$4" width={"100%"} scale={0.95} borderRadius={30}>
        <Card.Header padded>
          <H2>Manage Business</H2>
          <Paragraph theme="alt2">
            View and manage your business details
          </Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack flex={1} />
          <Button
            borderRadius="$10"
            onPress={async () => {
              const businessExists = await getBusinessData(user.uid);
              if (businessExists) {
                if (businessExists.data.businessType === "hospital")
                  navigation.navigate("ManageHospital");
                else navigation.navigate("ManageBusiness");
              } else {
                navigation.navigate("ChooseBusiness");
              }
            }}
          >
            Manage Now
          </Button>
        </Card.Footer>
      </Card>

      <Card elevate size="$4" width={"100%"} scale={0.95} borderRadius={30}>
        <Card.Header padded>
          <H2>Book Appointment</H2>
          <Paragraph theme="alt2">Schedule your appointments easily</Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack flex={1} />
          <Button
            borderRadius="$10"
            onPress={() => {
              navigation.navigate("ManageAppointments");
            }}
          >
            Book Now
          </Button>
        </Card.Footer>
      </Card>

      <View style={styles.body}>
        <Text>Home Screen Content, {form.first_name}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileForm");
          }}
        ></TouchableOpacity>
        <Button
          theme="red"
          borderRadius="$10"
          onPress={() => {
            auth().signOut();
          }}
        >
          Log out
        </Button>
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
