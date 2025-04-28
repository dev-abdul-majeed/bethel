import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Button, Input, Paragraph, Spinner, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

import auth from "@react-native-firebase/auth";

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async ({ navigation }) => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      alert("Check your email");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.loginCard}>
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

          <YStack gap="$3" minWidth={"$17"} maxWidth={"$17"}>
            <Paragraph size="$8" fontWeight="800" color={"#336D82"}>
              Register with Us
            </Paragraph>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              size="$5"
            />
            <Input
              size="$5"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </YStack>
          <YStack gap="$10" alignItems="flex-end">
            <>
              <Button
                size="$4"
                textProps={{ fontSize: 16, fontWeight: "bold" }}
                width="$12"
                marginTop={"$5"}
                onPress={signUp}
                disabled={loading}
                elevation="$1"
                color={"#ffffff"}
                backgroundColor={"#06C09D"}
                icon={
                  loading
                    ? () => <Spinner size="large" color="#6D61A" />
                    : undefined
                }
              >
                Sign Up
              </Button>
            </>

            <XStack alignItems="center">
              <Text>Already our user? </Text>
              <Button
                backgroundColor={"transparent"}
                color={"#06C09D"}
                size="$2"
                textProps={{ fontSize: 16, fontWeight: "bold" }}
                onPress={() => {
                  navigation.navigate("Login");
                }}
                disabled={loading}
              >
                Sign In
              </Button>
            </XStack>
          </YStack>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
const w = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "gray",
  },
  topGradient: {
    borderBottomRightRadius: 100,
    elevation: 4,
    marginBottom: 50,
    paddingTop: 30,
  },
  input: {
    height: 40,
    borderColor: "blue",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
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
  loginCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 0,
    width: w,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
