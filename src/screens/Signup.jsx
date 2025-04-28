import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Button, Paragraph, Spinner, XStack, YStack } from "tamagui";

import auth from "@react-native-firebase/auth";
import LoginSignupTopLogo from "../components/shared/LoginSignupTopLogo";
import EmailPasswordField from "../components/inputFields/EmailPasswordField";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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
          <LoginSignupTopLogo />

          <YStack gap="$3" minWidth={"$17"} maxWidth={"$17"}>
            <Paragraph size="$8" fontWeight="800" color={"#336D82"}>
              Register with Us
            </Paragraph>
            <XStack gap={"$2"} justifyContent="center" alignItems="center">
              <Ionicons name="mail" size={30} color="#5F99AE" />
              <EmailPasswordField
                handleTextChange={setEmail}
                placeholder="Email"
                value={email}
                keyboardType="Email"
                isPassword={false}
              />
            </XStack>
            <XStack
              gap={"$2"}
              justifyContent="center"
              alignItems="center"
              alignContent="center"
            >
              <MaterialIcons name="password" size={30} color="#5F99AE" />
              <EmailPasswordField
                handleTextChange={setPassword}
                placeholder="Password"
                value={password}
                isPassword={true}
              />
            </XStack>
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
              <Text>Already our registered user? </Text>
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

  loginCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 0,
    width: w,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
