import { StyleSheet, Text, View } from "react-native";
import { Card, H2, Paragraph, XStack, Button, Image } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

const ViewProfileCard = ({ navigation }) => {
  return (
    <View>
      <Card elevate size="$4" width={"100%"} scale={0.95} borderRadius={30}>
        <Card.Header padded>
          <H2>View your profile</H2>
          <Paragraph theme="alt2">
            Set your name, DOB and Profile Image
          </Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack flex={1} />
          <Button
            borderRadius="$10"
            onPress={() => {
              navigation.navigate("ProfileForm");
            }}
          >
            Let's Go
          </Button>
        </Card.Footer>
      </Card>
    </View>
  );
};

export default ViewProfileCard;

const styles = StyleSheet.create({});
