import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import TopBar from "../components/shared/TopBar";
import auth from "@react-native-firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileForm from "./ProfileForm";
const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <TopBar />

      <View style={styles.body}>
        <Text>Home Screen Content</Text>
        <Button
          title="Log Out"
          onPress={() => {
            auth().signOut();
          }}
        />
      </View>
    </View>

    // <Stack.Navigator initialRouteName="ProfileForm">
    //   <Stack.Screen
    //     name="ProfileForm"
    //     component={ProfileForm}
    //     options={{
    //       headerShown: false,
    //     }}
    //   />
    // </Stack.Navigator>
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
