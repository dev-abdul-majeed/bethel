import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { YStack } from "tamagui";

const LoginSignupTopLogo = () => {
  return (
    <LinearGradient
      colors={["#06C09D", "#2DB3BB"]}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.5, y: 1.0 }}
      style={styles.topGradient}
    >
      <YStack gap="$0" marginBottom="$10" alignItems="center">
        <Text style={styles.logo}>Bethel</Text>
        <Text style={styles.tagline}>A City of the Future</Text>
      </YStack>
    </LinearGradient>
  );
};

export default LoginSignupTopLogo;

const w = Dimensions.get("window").width;

const styles = StyleSheet.create({
  topGradient: {
    borderBottomRightRadius: 100,
    elevation: 4,
    marginBottom: 50,
    paddingTop: 30,
  },
  logo: {
    fontFamily: "arthemis",
    fontSize: 106,
    textAlign: "center",
    width: w,
    color: "white",
  },
  tagline: {
    fontSize: 26,
    fontFamily: "Halvetica",
    color: "white",
  },
});
