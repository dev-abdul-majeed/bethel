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

export default function App() {
  const config = createTamagui(defaultConfig);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    console.log("onAuthStateChanged: ", user);
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
      <SafeAreaView>
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
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
