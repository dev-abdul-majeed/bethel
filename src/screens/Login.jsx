import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { Button } from "tamagui";

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
          <Text style={styles.logo}>Bethel</Text>
          <Text>Login</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {loading ? (
            <Text>Loading ...</Text>
          ) : (
            <>
              <TouchableOpacity
                onPress={signIn}
                disabled={loading}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            title="Sign Up"
            onPress={() => {
              navigation.navigate("Sign Up");
            }}
            disabled={loading}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Button>Hi</Button>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  },
  input: {
    height: 40,
    width: 250,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 12,
    width: 90,
    alignItems: "center",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  logo: {
    fontFamily: "AIRBORNE-GP",
    fontSize: 56,
    textAlign: "center",
  },
  loginCard: {
    flex: 0.7,
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    width: w,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
