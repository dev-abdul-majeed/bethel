import "expo-dev-client";

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/Signup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import Home from "./src/screens/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { useFonts } from "expo-font";
import ProfileForm from "./src/screens/ProfileForm";
import VehicleRegistration from "./src/screens/Vehicles/VehicleRegistration";
import Vehicles from "./src/screens/Vehicles/Vehicles";
import ManageBusiness from "./src/screens/ManageBusiness";
import CreateBusiness from "./src/screens/CreateBusiness";
import ChooseBusiness from "./src/screens/ChooseBusiness";
import ManageHospital from "./src/screens/ManageHospital";
import ManageDoctors from "./src/screens/ManageDoctors";
import DoctorRegistration from "./src/screens/DoctorRegistration";
import AppointmentsHome from "./src/screens/PatientAppointments/AppointmentsHome";
import ListHospitals from "./src/screens/PatientAppointments/ListHospitals";
import ListDoctors from "./src/screens/PatientAppointments/ListDoctors";
import ListDoctorAppointments from "./src/screens/PatientAppointments/ListDoctorAppointments";
export default function App() {
  const config = createTamagui(defaultConfig);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [loaded, error] = useFonts({});
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const Stack = createNativeStackNavigator();

  if (initializing) {
    return (
      <TamaguiProvider config={config}>
        <SafeAreaView>
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      </TamaguiProvider>
    );
  }
  return (
    <TamaguiProvider config={config}>
      <SafeAreaProvider>
        <StatusBar hidden />
        <NavigationContainer>
          {user ? (
            <>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen name="ProfileForm" component={ProfileForm} />
                <Stack.Screen
                  name="VehicleRegistration"
                  component={VehicleRegistration}
                />
                <Stack.Screen name="Vehicles" component={Vehicles} />
                <Stack.Screen
                  name="ChooseBusiness"
                  component={ChooseBusiness}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreateBusiness"
                  component={CreateBusiness}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ManageBusiness"
                  component={ManageBusiness}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ManageHospital"
                  component={ManageHospital}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="ManageDoctors"
                  component={ManageDoctors}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="DoctorRegistration"
                  component={DoctorRegistration}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="AppointmentsHome"
                  component={AppointmentsHome}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ListHospitals"
                  component={ListHospitals}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ListDoctors"
                  component={ListDoctors}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ListDoctorAppointments"
                  component={ListDoctorAppointments}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </>
          ) : (
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Sign Up"
                component={SignUp}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
