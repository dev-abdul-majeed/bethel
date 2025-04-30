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
function TopBar({ navigation, info }) {
  const username = info?.first_name || ""; // Replace with actual user data
  const img = info?.profile_image || profileImage;
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProfileForm");
        }}
      >
        <Image
          source={
            "https://firebasestorage.googleapis.com/v0/b/bethel-36eb6.firebasestorage.app/o/profile_images%2FM.%20Abdul%20Majeed%20uppp_1746035534105_f49ae3e8-36b4-4853-b0d0-c8f4946b5344.jpeg?alt=media&token=3d34ac3e-c5d3-45f0-988a-660a60b9b423"
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.bannerText}>Welcome {username}</Text>
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
