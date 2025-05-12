import { getAuth } from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { YStack, H1, Paragraph, Card, Button, Text } from "tamagui";
import { deleteBusiness } from "../services/firebaseUtils";

const ManageBusiness = ({ navigation }) => {
  const user = getAuth().currentUser;
  const stats = {
    profitToDate: 50000,
    expensesToDate: 20000,
    profitMarginToDate: "60%",
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(user.uid);
    } catch (error) {
    } finally {
      navigation.navigate("Home");
    }
  };

  return (
    <YStack f={1} p="$4" bg="$background" space="$4">
      <H1 ta="center">Business Stats</H1>
      <Card elevate size="$4" bordered>
        <YStack space="$2">
          <Paragraph size="$3" color="$color">
            Profit to Date:
          </Paragraph>
          <Paragraph size="$5" fontWeight="bold">
            ${stats.profitToDate}
          </Paragraph>
        </YStack>
      </Card>
      <Card elevate size="$4" bordered>
        <YStack space="$2">
          <Paragraph size="$3" color="$color">
            Expenses to Date:
          </Paragraph>
          <Paragraph size="$5" fontWeight="bold">
            ${stats.expensesToDate}
          </Paragraph>
        </YStack>
      </Card>
      <Card elevate size="$4" bordered>
        <YStack space="$2">
          <Paragraph size="$3" color="$color">
            Profit Margin to Date:
          </Paragraph>
          <Paragraph size="$5" fontWeight="bold">
            {stats.profitMarginToDate}
          </Paragraph>
        </YStack>
      </Card>
      <Button
        onPress={() => {
          Alert.alert(
            "Delete Business",
            "Are you sure you want to delete this business?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "OK", onPress: handleDelete },
            ]
          );
        }}
      >
        <Text>Delete Business</Text>
      </Button>
    </YStack>
  );
};

export default ManageBusiness;
