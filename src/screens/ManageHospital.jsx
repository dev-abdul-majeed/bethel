import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { View } from "tamagui";
import HospitalHome from "./HospitalHome";
import DoctorRegistration from "./DoctorRegistration";
import ManageDoctors from "./ManageDoctors";

const ManageHospital = ({ navigation, route }) => {
    
    const { hospitalId } = route.params;
  navigation.reset;
  const Tab = createBottomTabNavigator();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Add Doctor") {
              iconName = "person-add-outline";
            } else if (route.name === "Manage Doctors") {
              iconName = "people-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007BFF",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HospitalHome}
            initialParams={{ hospitalId }}
        />
        <Tab.Screen name="Add Doctor" component={DoctorRegistration} initialParams={hospitalId} />
        <Tab.Screen name="Manage Doctors" component={ManageDoctors} initialParams={hospitalId} />
      </Tab.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ManageHospital;
