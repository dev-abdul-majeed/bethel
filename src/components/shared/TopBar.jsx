import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
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
        colors={["rgb(74, 25, 208)", "rgba(156, 156, 156, 0)"]}
        start={{ x: 0.5, y: 1.0 }}
        end={{ x: 0.5, y: 0.0 }}
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
          gap={"$4"}
          py={"$3"}
        >
          <Avatar circular size="$8" borderColor={"white"} borderWidth={3}>
            <Avatar.Image accessibilityLabel="Cam" src={img} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
          <H3 style={[styles.bannerText, { color: "white" }]}>
            Welcome {username}
          </H3>
          <Separator
            horizontal
            borderColor={"white"}
            borderWidth={2}
            width={"$3"}
            borderRadius={5}
          />
        </YStack>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    elevation: 4,
    height: 200,
  },
  bannerText: {
    fontWeight: "600",
    fontFamily: "Nexa-ExtraLight",
  },
});

export default TopBar;
