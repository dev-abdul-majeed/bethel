import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TopBar from "../components/shared/TopBar";
import auth from "@react-native-firebase/auth";
import ViewProfileCard from "../components/ViewProfileCard";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <ViewProfileCard navigation={navigation} />
      <View style={styles.body}>
        <Text>Home Screen Content</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileForm");
          }}
        ></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            auth().signOut();
          }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>
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
