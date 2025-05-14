import React, { useState, useCallback } from "react";
import { View, Text, Spinner, Button, Image, YStack } from "tamagui";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import TopNavHeader from "../../components/shared/TopNavHeader";
import { Ionicons } from "@expo/vector-icons";
import { getHospitalsList } from "../../services/firebaseUtils";

const sampleHospitals = [
  {
    id: 1,
    name: "City Hospital",
    logo: "🏥",
    location: "Downtown",
    specialty: "Cardiology",
  },
  {
    id: 2,
    name: "Green Valley Clinic",
    logo: "🌿",
    location: "Uptown",
    specialty: "Pediatrics",
  },
  {
    id: 3,
    name: "Sunrise Medical Center",
    logo: "🌅",
    location: "Midtown",
    specialty: "Orthopedics",
  },
];

const ListHospitals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchHospitals();
    }, [])
  );

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHospitalsList();
      console.log("Fetched hospitals:", data); // Debugging line
      setHospitals(data);
    } catch (err) {
      setError("Failed to fetch hospitals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.data.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHospitalPress = (hospitalId) => {
    navigation.navigate("ListDoctors", { hospitalId });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHospitals();
    setRefreshing(false);
    // setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
  };

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="red" fontSize="$5" textAlign="center">
          {error}
        </Text>
        <Button marginTop="$4" onPress={fetchHospitals}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View flex={1}>
      <TopNavHeader text="Hospitals" style={{ flex: 0 }} />
      <YStack backgroundColor={"white"} py="$5" px="$3">
        <TextInput
          placeholder="Search hospitals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <TouchableOpacity
                key={hospital.id}
                onPress={() => handleHospitalPress(hospital.id)}
              >
                <View
                  style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    backgroundColor: "white",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    padding: 16,
                    borderColor: "gray",
                    borderWidth: 1,
                  }}
                >
                  <Image
                    source={{ uri: hospital.data.business_image }}
                    width="95%"
                    height={150}
                    borderRadius="$4"
                    mb="$4"
                    alignSelf="center"
                  />
                  <Text style={styles.hospitalName}>
                    {hospital.data.businessName}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Ionicons name="location-outline" size={16} color="gray" />
                    <Text style={[styles.hospitalDetails, { marginLeft: 8 }]}>
                      Address: {hospital.data.locationAddress}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Ionicons name="call-outline" size={16} color="gray" />
                    <Text style={[styles.hospitalDetails, { marginLeft: 8 }]}>
                      Contact: {hospital.data.contact}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Ionicons name="mail-outline" size={16} color="gray" />
                    <Text style={[styles.hospitalDetails, { marginLeft: 8 }]}>
                      Email: {hospital.data.email}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>No results found</Text>
          )}
        </ScrollView>
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 16,
  },
  hospitalCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "white",
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  hospitalDetails: {
    fontSize: 16,
    color: "gray",
  },
  noResultsText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 24,
  },
});

export default ListHospitals;
