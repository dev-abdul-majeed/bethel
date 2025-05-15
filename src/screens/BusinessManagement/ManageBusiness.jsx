import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Spinner, View } from "tamagui";
import BusinessHome from "./BusinessHome";
import UsersList from "./UsersList";
import ManageEmployees from "./ManageEmployees";
// import AppointmentForm from "./BusinessAppointments/AppointmentForm";
// import AppointmentsList from "./BusinessAppointments/AppointmentsList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getBusinessData } from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
// import AppointmentsPage from "./BusinessAppointments/AppointmentsPage";

const ManageBusiness = ({ navigation, route }) => {
  const user = getAuth().currentUser;

  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBusinessData(user.uid);
        setBusinessData({ ...data.data, businessId: data.id });
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
                  } else if (route.name === "Add Employee") {
                    iconName = "person-add-outline";
                  } else if (route.name === "Manage Employees") {
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
                component={BusinessHome}
                initialParams={{
                  businessId: businessData.businessId,
                  data: businessData,
                }}
              />
              <Tab.Screen
                name="Add Employee"
                component={UsersList}
                initialParams={{ businessId: businessData.businessId }}
              />
              <Tab.Screen
                name="Manage Employees"
                component={ManageEmployees}
                initialParams={{ businessId: businessData.businessId }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        {/* <Stack.Screen name="Manage Appointments" component={AppointmentsPage} /> */}
      </Stack.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ManageBusiness;
