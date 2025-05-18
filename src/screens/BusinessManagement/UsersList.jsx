import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Spinner,
  YStack,
  ScrollView,
  Card,
  Image,
  XStack,
} from "tamagui";
import {
  getUsers,
  employUser,
  getEmployeesByBusinessId,
  getBusinessEmployees,
} from "../../services/firebaseUtils";
import { RefreshControl, TextInput } from "react-native";
import TopNavHeader from "../../components/shared/TopNavHeader";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";

const UsersList = ({ route, navigation }) => {
  const { businessId } = route.params;
  const currentUserId = getAuth().currentUser.uid;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const userList = await getUsers();
      const filteredList = userList.filter(
        (user) => user.data.user_id !== currentUserId
      );
      console.log("Fetched users:", filteredList);
      setUsers(filteredList);
      setFilteredUsers(filteredList);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getEmployeesOfBusiness = async (businessId) => {
    try {
      const employeeList = await getBusinessEmployees(businessId);
      setEmployees(employeeList);
      return employeeList;
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Failed to fetch employees. Please try again.");
    }
  };

  const checkIfAlreadyEmployed = (userId) => {
    return employees.some((employee) => {
      return (
        employee.data?.employee_id === userId &&
        employee.data?.employment_end_date === null
      ); // exists and is truthy
    });
  };

  useEffect(() => {
    console.log("Fetching users...");
    fetchUsers();
    getEmployeesOfBusiness(businessId);
  }, []);

  const handleEmploy = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (user) {
        navigation.navigate("EmployeeRegistration", { user, businessId });
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Failed to get user info:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    getEmployeesOfBusiness(businessId);
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        `${user.data.first_name} ${user.data.last_name}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

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
      <XStack gap="$2" marginBottom={10} mx="$1" px="$4">
        <Button
          flex={0.5}
          backgroundColor={"rgb(173, 50, 249)"}
          onPress={handleRefresh}
          icon={<Ionicons name="people-outline" size={25} color={"white"} />}
          textProps={{ color: "white" }}
        >
          All
        </Button>
        <Button
          flex={0.5}
          backgroundColor={"rgb(0, 155, 147)"}
          icon={<Ionicons name="funnel-outline" size={25} color={"white"} />}
          textProps={{ color: "white" }}
          onPress={async () => {
            setLoading(true);
            try {
              setFilteredUsers(
                users.filter((user) => !checkIfAlreadyEmployed(user.id))
              );
            } catch (error) {
              Alert.alert("Something went wrong", error);
            } finally {
              setLoading(false);
            }
          }}
        >
          Available
        </Button>
      </XStack>
      <TextInput
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={{
          marginHorizontal: 16,
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
        }}
      />
      {refreshing && (
        <View flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" />
        </View>
      )}
      {!refreshing && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          flex={1}
          padding="$4"
        >
          {filteredUsers.map((user) => (
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
                backgroundColor={
                  checkIfAlreadyEmployed(user.id)
                    ? "rgb(249, 179, 99)"
                    : "rgb(11, 170, 125)"
                }
                textProps={{ color: "white" }}
                disabled={checkIfAlreadyEmployed(user.id)}
              >
                {checkIfAlreadyEmployed(user.id)
                  ? "Already Employed"
                  : "Employ"}
              </Button>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default UsersList;
