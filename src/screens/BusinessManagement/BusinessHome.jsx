import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Spinner,
  YStack,
  ScrollView,
  Image,
  Separator,
  XStack,
  Label,
} from "tamagui";
import { getBusinessData } from "../../services/firebaseUtils";
import { getAuth } from "@react-native-firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";

const BusinessHome = ({ route, navigation }) => {
  const { businessId } = route.params;
  const user = getAuth().currentUser;

  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBusinessData(user.uid, businessId);
        setBusinessData(data.data);
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId, user.uid]);

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="rgb(93, 0, 255)" />
      </View>
    );
  }

  if (!businessData) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>No business data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <YStack>
        <View
          style={{
            height: "15%",
            width: "100%",
            backgroundColor: "rgb(93, 0, 255)",
            position: "relative",
            borderBottomRightRadius: 40,
            borderBottomLeftRadius: 40,
            elevation: 5,
            marginBottom: 70,
          }}
        >
          <Image
            source={{ uri: businessData.business_image }}
            style={{
              alignSelf: "center",
              top: "25%",
              borderWidth: 5,
              borderColor: "white",
              borderRadius: 100,
              width: 150,
              height: 150,
            }}
          />
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 36,
            fontFamily: "Nexa-Heavy",
            color: "rgb(93, 0, 255)",
          }}
        >
          {businessData.businessName}
        </Text>
        <Separator
          horizontal
          borderColor={"rgb(167, 117, 255)"}
          borderWidth={2}
          width={"$3"}
          borderTopRightRadius={5}
          borderTopLeftRadius={5}
          alignSelf="center"
        />
        <YStack
          padding={20}
          borderTopColor={"rgb(93, 0, 255)"}
          borderTopWidth={3}
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          top={30}
          mb={100}
        >
          <XStack alignItems="center" space="$2">
            <Ionicons
              name="business-outline"
              size={28}
              color="rgb(93, 0, 255)"
            />
            <Label fontSize={18}>Business Type</Label>
          </XStack>
          <Text fontSize="$5" marginTop="$2">
            {businessData.businessType}
          </Text>

          <XStack alignItems="center" space="$2">
            <Ionicons
              name="location-outline"
              size={28}
              color="rgb(93, 0, 255)"
            />
            <Label fontSize={18}>Location</Label>
          </XStack>
          <Text fontSize="$5" marginTop="$2">
            {businessData.locationAddress}
          </Text>

          <XStack alignItems="center" space="$2">
            <Ionicons name="call-outline" size={28} color="rgb(93, 0, 255)" />
            <Label fontSize={18}>Contact</Label>
          </XStack>
          <Text fontSize="$5" marginTop="$2">
            {businessData.contact}
          </Text>

          <XStack alignItems="center" space="$2">
            <Ionicons name="mail-outline" size={28} color="rgb(93, 0, 255)" />
            <Label fontSize={18}>Email</Label>
          </XStack>
          <Text fontSize="$5" marginTop="$2">
            {businessData.email}
          </Text>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default BusinessHome;
