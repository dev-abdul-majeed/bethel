import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";

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
        <View>
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
              <Button title="Sign In" onPress={signIn} disabled={loading} />
            </>
          )}

          <Button
            title="Sign Up"
            onPress={() => {
              navigation.navigate("Sign Up");
            }}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  logo: {
    fontFamily: "Gilroy-Bold",
    fontSize: 56,
    textAlign: "center",
  },
});
