import { Alert, StyleSheet } from "react-native";
import React from "react";
import { Button, Card, H2, H4, Image, Paragraph, XStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { deleteVehicle } from "../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";

const VehicleCard = ({
  navigation,
  brand,
  name,
  vid,
  registrationNumber,
  year,
  mileage,
  lastServicedMileage,
  lastServiceDate,
  carPhoto,
  beforeDelete,
  afterDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this vehicle?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteVehicle(vid, getAuth().currentUser.uid);
            afterDelete(!beforeDelete); // callback to refresh list or navigate back
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <Card elevate bordered marginBottom={30} backgroundColor={"white"}>
      <Card.Header
        padded
        height={300}
        marginBottom={30}
        backgroundColor={"rgba(67, 59, 107, 0.82)"}
        borderBottomRightRadius={150}
        borderBottomLeftRadius={150}
      >
        <H2 color={"white"}>{brand}</H2>
        <H4 theme="alt2" color={"white"}>
          {name}
        </H4>
        <Image
          resizeMode="cover"
          alignSelf="center"
          backgroundColor={"red"}
          borderRadius={20}
          marginTop={30}
          shadowColor={"black"}
          shadowOffset={0.5}
          shadowOpacity={0.5}
          source={{
            height: 200,
            width: 320,
            uri: carPhoto,
          }}
        />
      </Card.Header>
      <Card.Header marginTop={10}>
        <Paragraph fontSize={22}>Registration: {registrationNumber}</Paragraph>
        <Paragraph fontSize={22}>Year: {year}</Paragraph>
        <Paragraph fontSize={22}>Brand: {brand}</Paragraph>
        <Paragraph fontSize={22}>Current mileage: {mileage}</Paragraph>
        <Paragraph fontSize={22}>Last Serviced at: {lastServiceDate}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          borderRadius="$10"
          backgroundColor={"rgb(0, 147, 172)"}
          textProps={{ color: "white", fontSize: 19 }}
          onPress={() => {
            navigation.navigate("VehicleRegistration", { vid });
          }}
        >
          Edit
        </Button>
        <Button
          borderRadius="$10"
          backgroundColor={"rgb(231, 105, 105)"}
          textProps={{ color: "white", fontSize: 19 }}
          marginLeft={20}
          onPress={handleDelete}
        >
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({});
