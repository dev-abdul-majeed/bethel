import { StyleSheet } from "react-native";
import React from "react";
import { Button, Card, H2, H4, Image, Paragraph, XStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

const VehicleCard = ({
  brand,
  name,
  registrationNumber,
  year,
  mileage,
  lastServicedMileage,
  lastServiceDate,
  carPhoto,
}) => {
  return (
    <Card elevate bordered marginBottom={30} backgroundColor={"white"}>
      <Card.Header
        padded
        height={300}
        marginBottom={30}
        backgroundColor={"rgba(207, 216, 234, 0.65)"}
      >
        <LinearGradient
          colors={["rgba(0, 179, 179, 0.2)", "rgb(0, 147, 172)"]}
          start={{ x: 0.96, y: 0.7 }}
          end={{ x: 0.04, y: 0.3 }}
          style={{ width: 500, paddingLeft: 10, borderRadius: 10 }}
        >
          <H2 color={"white"}>{brand}</H2>
          <H4 theme="alt2" color={"white"}>
            {name}
          </H4>
        </LinearGradient>
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
        >
          Edit
        </Button>
        <Button
          borderRadius="$10"
          backgroundColor={"rgb(231, 105, 105)"}
          textProps={{ color: "white", fontSize: 19 }}
          marginLeft={20}
        >
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({});
