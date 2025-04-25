import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or 'react-native-vector-icons/Ionicons'
import profileImage from "../../../assets/favicon.png";
function TopBar() {
  const username = "John"; // Replace with actual user data

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={() => {
          /* navigation open drawer logic here later */
        }}
      >
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.bannerText}>Welcome, {username}!</Text>

      <Image source={profileImage} style={styles.profileImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    padding: 10,
    elevation: 4,
    height: 65,
    marginTop: 0,
    borderRadius: 20,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 180,
    marginLeft: 8,
    borderColor: "black",
    borderWidth: 2,
  },
});

export default TopBar;
