import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import TopBar from "../components/shared/TopBar";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

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
