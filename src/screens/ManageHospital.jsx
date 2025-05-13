import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Spinner, View } from "tamagui";
import HospitalHome from "./HospitalHome";
import DoctorRegistration from "./DoctorRegistration";
import ManageDoctors from "./ManageDoctors";
import AppointmentForm from "./DoctorAppointments/AppointmentForm";
import AppointmentsList from "./DoctorAppointments/AppointmentsList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getBusinessData } from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import AppointmentsPage from "./DoctorAppointments/AppointmentsPage";

const ManageHospital = ({ navigation, route }) => {
  const user = getAuth().currentUser;

  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBusinessData(user.uid);
        setBusinessData({ ...data.data, hospitalId: data.id });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  navigation.reset;

  const Tab = createBottomTabNavigator();

  const Stack = createNativeStackNavigator();

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );
  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs">
          {() => (
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
                headerShown: false,
              })}
            >
              <Tab.Screen
                name="Home"
                component={HospitalHome}
                initialParams={{
                  hospitalId: businessData.hospitalId,
                  data: businessData,
                }}
              />
              <Tab.Screen
                name="Add Doctor"
                component={DoctorRegistration}
                initialParams={{ hospitalId: businessData.hospitalId }}
              />
              <Tab.Screen
                name="Manage Doctors"
                component={ManageDoctors}
                initialParams={{ hospitalId: businessData.hospitalId }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Manage Appointments" component={AppointmentsPage} />
      </Stack.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ManageHospital;
