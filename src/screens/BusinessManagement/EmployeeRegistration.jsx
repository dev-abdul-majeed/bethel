import React, { useEffect, useState } from "react";
import { View, Text, Button, Spinner, YStack, ScrollView, Card, Image } from "tamagui";
import { getUsers, employUser } from "../../services/firebaseUtils";
import { RefreshControl } from "react-native";
import TopNavHeader from "../../components/shared/TopNavHeader";

const EmployeeRegistration = ({ route }) => {
  const { businessId } = route.params;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const userList = await getUsers();
      console.log("Fetched users:", userList);    
      setUsers(userList);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEmploy = async (userId) => {
    try {
      await employUser(businessId, userId);
      alert("User successfully employed!");
    } catch (err) {
      alert("Failed to employ user. Please try again.");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

  if (refreshing) {
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
        <Button marginTop="$4" onPress={handleRefresh}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="white">
      <TopNavHeader text="Users" style={{ flex: 0 }} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        flex={1}
        padding="$4"
      >
        {users.map((user) => (
          <Card
            key={user.id}
            padding="$4"
            marginBottom="$4"
            borderWidth={1}
            borderColor="#ccc"
          >
            {user.data.profile_image && (
              <Image
                source={{ uri: user.data.profile_image }}
                style={{ width: "100%", height: 150, borderRadius: 8 }}
                resizeMode="cover"
              />
            )}
            <Text fontSize="$6" fontWeight="bold" marginTop="$4">
              {user.data.first_name} {user.data.last_name}
            </Text>
            <Text fontSize="$5" marginTop="$2">
              Date of Birth: {user.data.dob}
            </Text>
            <Text fontSize="$5" marginTop="$2">
              Gender: {user.data.gender || "N/A"}
            </Text>
            <Button
              marginTop="$4"
              onPress={() => handleEmploy(user.id)}
              backgroundColor="rgb(11, 170, 125)"
              textProps={{ color: "white" }}
            >
              Employ
            </Button>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

export default EmployeeRegistration;