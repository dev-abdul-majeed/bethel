import { Dimensions, StyleSheet } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { YStack, Text } from "tamagui";
import { useFonts } from "expo-font";

const LoginSignupTopLogo = () => {
  const [loaded, error] = useFonts({
    arthemis: require("../../../assets/fonts/arthemis.ttf"),
    nexa: require("../../../assets/fonts/Nexa-Heavy.ttf"),
    "nexa-light": require("../../../assets/fonts/Nexa-ExtraLight.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
    }
  }, [loaded, error]);

  return (
    <LinearGradient
      colors={["#06C09D", "#2DB3BB"]}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.5, y: 1.0 }}
      style={styles.topGradient}
    >
      <YStack
        gap="$0"
        marginBottom="$10"
        width={w}
        alignItems="center"
        justifyContent="center"
      >
        <Text style={styles.logo} fontSize={"$15"}>
          Bethel
        </Text>
        <Text style={styles.tagline} fontSize={w * 0.07}>
          A City of the Future!
        </Text>
      </YStack>
    </LinearGradient>
  );
};

export default LoginSignupTopLogo;

const w = Dimensions.get("window").width;

const styles = StyleSheet.create({
  topGradient: {
    borderBottomRightRadius: 100,
    elevation: 7,
    marginBottom: 50,
    paddingTop: 30,
    minWidth: "fit-content",
  },
  logo: {
    fontFamily: "arthemis",
    textAlign: "center",

    color: "white",
  },
  tagline: {
    fontFamily: "nexa-light",
    color: "white",
  },
});
