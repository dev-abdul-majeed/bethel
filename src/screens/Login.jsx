import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { Button, Input, Paragraph, Spinner, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("dev.abdul.majeed@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  // const navigation = useNavigation;
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
          <LinearGradient
            colors={["#fffff", "#00000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          ></LinearGradient>
          <YStack gap="$0" marginBottom="$10" alignItems="center">
            <Text style={styles.logo}>Bethel</Text>
            <Text style={styles.tagline}>A City of the Future</Text>
          </YStack>

          <YStack gap="$3">
            <Paragraph size="$8" fontWeight="800">
              Login
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
          <YStack gap="$8" alignItems="flex-end">
            <>
              <Button
                size="$4"
                textProps={{ fontSize: 16, fontWeight: "bold" }}
                width="$12"
                onPress={signIn}
                disabled={loading}
                elevation="$1"
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
              <Text>Don't Have an account? </Text>
              <Button
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
  },
  tagline: {
    fontSize: 26,
    fontFamily: "Halvetica",
  },
  loginCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    width: w,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
