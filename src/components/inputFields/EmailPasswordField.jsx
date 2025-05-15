import { StyleSheet, Text, View } from "react-native";
import { Input } from "tamagui";

const EmailPasswordField = ({
  handleTextChange,
  keyboardType,
  isPassword,
  placeholder,
  value,
}) => {
  return (
    <Input
      minWidth={"$17"}
      maxWidth={"$17"}
      placeholder={placeholder}
      value={value}
      onChangeText={handleTextChange}
      secureTextEntry={isPassword}
      keyboardType={keyboardType}
      autoCapitalize="none"
      style={styles.input}
    />
  );
};

export default EmailPasswordField;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "transparent",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
