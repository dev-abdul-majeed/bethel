import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/Signup";
import auth, { onAuthStateChanged } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const router = useRouter();
  const onAuthStateChanged = (user) => {
    console.log("onAuthStateChanged: ", user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return (
      <>
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      </>
    );
  }
  return (
    <>
      <Stack>
        <Login />
      </Stack>
    </>
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
