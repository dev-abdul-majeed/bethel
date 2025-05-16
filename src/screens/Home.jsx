import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TopBar from "../components/shared/TopBar";
import auth, { getAuth } from "@react-native-firebase/auth";
import ViewProfileCard from "../components/ViewProfileCard";
import { getBusinessData, getUserProfile } from "../services/firebaseUtils";
import { useIsFocused } from "@react-navigation/native";
import {
  Card,
  H2,
  Paragraph,
  XStack,
  Button,
  Image,
  ScrollView,
  H4,
  Separator,
  YStack,
} from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import HomeCard from "../components/shared/HomeCard";

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

  const handleManageBusiness = async () => {
    const business = await getBusinessData(user.uid);
    if (business) {
      if (business.data.businessType === "hospital")
        navigation.navigate("ManageHospital", {
          hospitalId: business.id,
        });
      else navigation.navigate("ManageBusiness");
    } else {
      navigation.navigate("ChooseBusiness");
    }
  };
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} info={form} />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <XStack alignItems="center" justifyContent="center">
          <HomeCard
            topImagePath={require("../../assets/vehicle-icon.png")}
            heading={"Vehicles Details"}
            paragraph={"Register and View your Vehicles."}
            leftLogo={"car-sport-outline"}
            buttonText={"Let's Go"}
            navigationPage={"Vehicles"}
            handleButtonPress={() => {
              navigation.navigate("Vehicles");
            }}
            colorScheme="rgb(1, 57, 135)"
          />
          <HomeCard
            topImagePath={require("../../assets/business-icon.png")}
            ih={100}
            iw={90}
            heading={"Manage Business"}
            paragraph={"View and manage your business details."}
            leftLogo={"pie-chart-outline"}
            buttonText={"Manage"}
            handleButtonPress={handleManageBusiness}
            top={80}
            colorScheme="rgb(108, 75, 217)"
          />
        </XStack>

        <HomeCard
          topImagePath={require("../../assets/doctor-icon-3.png")}
          iw={170}
          ih={170}
          itop={-110}
          heading={"Book Appointment"}
          paragraph={"Manage and book your appointments"}
          leftLogo={"fitness-outline"}
          buttonText={"Book Now"}
          handleButtonPress={() => {
            navigation.navigate("AppointmentsHome");
          }}
          width="100%"
          top={250}
          colorScheme="rgb(121, 31, 246)"
        />

        <HomeCard
          topImagePath={require("../../assets/employee-icon.png")}
          iw={220}
          ih={150}
          itop={-110}
          heading={"Employment Details"}
          paragraph={"Manage and view your job details"}
          leftLogo={"cash-outline"}
          buttonText={"Have a look"}
          handleButtonPress={() => {
            navigation.navigate("EmployeeDetails");
          }}
          width="100%"
          top={450}
          mb={500}
          colorScheme="rgb(67, 31, 246)"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 30,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
