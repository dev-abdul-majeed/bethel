import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, YStack } from "tamagui";
import VehicleCard from "../../components/VehicleCard";
import { getVehiclesData } from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import LoadingContent from "../../components/shared/LoadingContent";
const Vehicles = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [vehicles, setVehicles] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = getAuth().currentUser;

  useEffect(() => {
    const initializeVehicle = async () => {
      setLoading(true); // start loading
      try {
        const vehicleData = await getVehiclesData(user.uid);
        setVehicles(vehicleData);
      } catch (error) {
      } finally {
        setLoading(false); // stop loading no matter what
      }
    };

    initializeVehicle();
  }, [isFocused, deleted]);

  if (loading)
    return (
      <LoadingContent
        text="Loading Vehicles..."
        size="large"
        color="rgb(0, 86, 135)"
      />
    );

  return (
    <ScrollView marginBottom={20} paddingTop={15}>
      <Button
        marginBottom="$4"
        onPress={() => {
          navigation.navigate("VehicleRegistration");
        }}
      >
        Add a car
      </Button>

      <YStack gap="$3">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <VehicleCard
              navigation={navigation}
              key={vehicle.id}
              vid={vehicle.id}
              brand={vehicle.data.brand}
              name={vehicle.data.name}
              registrationNumber={vehicle.data.registrationNumber}
              year={vehicle.data.year}
              mileage={vehicle.data.mileage}
              lastServicedMileage={vehicle.data.last_serviced_mileage}
              lastServiceDate={vehicle.data.last_service_date}
              carPhoto={vehicle.data.car_photo}
              beforeDelete={deleted}
              afterDelete={setDeleted}
            />
          ))
        ) : (
          <Button disabled>No vehicles found</Button>
        )}
      </YStack>
    </ScrollView>
  );
};

export default Vehicles;

const styles = StyleSheet.create({});
