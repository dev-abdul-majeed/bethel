import { StyleSheet, Text, View } from "react-native";
import { Card, Paragraph, XStack, Button, Image, H4, Separator } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const HomeCard = ({
  topImagePath,
  ih,
  iw,
  width = "47%",
  heading,
  paragraph,
  leftLogo,
  buttonText,
  top = 20,
  handleButtonPress,
  itop,
  mb,
  colorScheme = "black",
}) => {
  const [loaded, error] = useFonts({});

  return (
    <Card
      elevate
      size="$4"
      width={width}
      scale={0.95}
      borderRadius={15}
      position="relative"
      borderWidth={1}
      borderColor={colorScheme}
      top={top}
      marginBottom={mb}
      backgroundColor={"rgb(255, 255, 255)"}
    >
      <Image
        src={topImagePath}
        style={{
          elevation: 9,
          height: ih || 120,
          width: iw || 120,
          position: "absolute",
          top: itop || -60,
          left: "35%",
        }}
      />
      <Card.Header padded>
        <Text
          style={{
            fontFamily: "Nexa-Heavy",
            marginTop: 30,
            fontSize: 30,
            marginBottom: 5,
            color: colorScheme,
          }}
        >
          {heading}
        </Text>
        <Separator
          horizontal
          borderWidth={1}
          borderColor={"gray"}
          width={"40%"}
        />
        <Paragraph top={20}>{paragraph}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          gap={"$7"}
          width={"95%"}
        >
          <Ionicons name={leftLogo} size={40} color={colorScheme} />
          <Button
            borderRadius="$10"
            backgroundColor={colorScheme}
            textProps={{ color: "white" }}
            onPress={handleButtonPress}
          >
            {buttonText}
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
};

export default HomeCard;
