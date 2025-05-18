import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet } from "react-native";
import {
  Avatar,
  H1,
  H3,
  H4,
  Image,
  Separator,
  Text,
  View,
  YStack,
} from "tamagui";
function TopBar({ navigation, info }) {
  const [loaded, error] = useFonts({});

  const username = info?.first_name || ""; // Replace with actual user data
  const img = info?.profile_image || require("../../../assets/favicon.png");
  return (
    <View style={styles.topBar}>
      <Image
        source={require("../../../assets/bethel-logo.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        }}
      />
      <LinearGradient
        colors={["rgb(49, 1, 171)", "rgba(0, 255, 187, 0.4)"]}
        start={{ x: 0.5, y: 1.0 }}
        end={{ x: 0.5, y: 0.09 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <YStack
          justifyContent="center"
          alignItems="center"
          gap={"$3"}
          pt={"$6"}
        >
          <Avatar
            circular
            size={70}
            borderColor={"white"}
            borderWidth={3}
            onPress={() => {
              navigation.navigate("Profile Form");
            }}
          >
            <Avatar.Image accessibilityLabel="Cam" src={img} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
          <H3
            style={[styles.bannerText, { color: "white", textAlign: "center" }]}
          >
            Welcome {username}
          </H3>
          <Separator
            horizontal
            borderColor={"white"}
            borderWidth={2}
            width={"$3"}
            borderTopRightRadius={5}
            borderTopLeftRadius={5}
          />
        </YStack>
      </LinearGradient>
    </View>
  );
}
const h = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  topBar: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    elevation: 7,
    height: 200,
    minHeight: h * 0.26,
    marginBottom: 30,
  },

  bannerText: {
    fontFamily: "Nexa-ExtraLight",
  },
});

export default TopBar;
