import { KeyboardAvoidingView, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import {
  Button,
  Input,
  Paragraph,
  Spinner,
  XStack,
  YStack,
  View,
  Text,
} from "tamagui";
import LoginSignupTopLogo from "../components/shared/LoginSignupTopLogo";
import EmailPasswordField from "../components/inputFields/EmailPasswordField";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("dev.abdul.majeed@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      alert("Logged In");
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
            <Paragraph size="$8" fontWeight="800" color={"#336D82"} right={20}>
              Welcome Back
            </Paragraph>
            <XStack gap={"$2"} justifyContent="center" alignItems="center">
              <Ionicons name="mail" size={20} color="#5F99AE" />
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
              <MaterialIcons name="password" size={20} color="#5F99AE" />
              <EmailPasswordField
                handleTextChange={setPassword}
                placeholder="Password"
                value={password}
                isPassword={true}
              />
            </XStack>
          </YStack>
          <YStack
            gap="$10"
            alignItems="flex-end"
            minWidth={"$18"}
            maxWidth={"$18"}
          >
            <>
              <Button
                size="$4"
                textProps={{ fontSize: 16, fontWeight: "bold" }}
                width="$12"
                marginTop={"$5"}
                onPress={signIn}
                disabled={loading}
                elevation="$1"
                color={"#ffffff"}
                backgroundColor={"#06C09D"}
                alignSelf="flex-end"
                icon={
                  loading
                    ? () => <Spinner size="large" color="#6D61A" />
                    : undefined
                }
              >
                Sign In
              </Button>
            </>

            <XStack alignItems="center">
              <Text>Don't have an account? </Text>
              <Button
                backgroundColor={"transparent"}
                color={"#06C09D"}
                size="$2"
                textProps={{ fontSize: 16, fontWeight: "bold" }}
                onPress={() => {
                  navigation.navigate("Sign Up");
                }}
                disabled={loading}
              >
                Sign Up
              </Button>
            </XStack>
          </YStack>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
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
