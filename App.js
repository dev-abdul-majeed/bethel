import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/Signup";
import auth, { onAuthStateChanged } from "@react-native-firebase/auth";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import ImageUpload from "./src/screens/ImageUpload";

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCGEgXz4gm2oVw7JlzTcfx9_Uy5XIh-PIQ",
    projectId: "bethel-36eb6",
    storageBucket: "bethel-36eb6.firebasestorage.app",
    appId: "1:896585879663:android:4b78165eb54f55ab6fbd9a",
  };

  initializeApp(firebaseConfig);

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
      <Login />
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
