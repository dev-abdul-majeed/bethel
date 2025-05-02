import { View, Text } from "react-native";
import React from "react";
import { Spinner } from "tamagui";

const LoadingContent = ({
  text = "Loading...",
  size = "large",
  color = "#0000ff",
  ...props // allows passing additional props
}) => {
  return (
    <View style={styles.container}>
      <Spinner size={size} color={color} {...props} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default LoadingContent;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
};
