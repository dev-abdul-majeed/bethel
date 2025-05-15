import { StyleSheet } from "react-native";
import { H3 } from "tamagui";

const TopNavHeader = ({ text, style  }) => {
  return <H3 style={[styles.h3, style]}>{text}</H3>;
};

const styles = StyleSheet.create({
  h3: {
    backgroundColor: "rgb(255, 255, 255)",
    flex: 1,
    paddingTop: 40,
    width: "100%",
    borderRadius: 20,
    textAlign: "center",
    paddingBottom: 10,
    elevation: 7,
    marginBottom: 30,
  },
});

export default TopNavHeader;
