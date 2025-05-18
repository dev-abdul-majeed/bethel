import React, { useEffect, useState } from "react";
import { ScrollView, Alert, StyleSheet, RefreshControl } from "react-native";
import { View, Text, Button, Card, Spinner, Image } from "tamagui";
import {
  getEmployeesByBusinessId,
  getUsers,
  terminateEmployee,
} from "../../services/firebaseUtils";
import { useNavigation } from "@react-navigation/native";
import TopNavHeader from "../../components/shared/TopNavHeader";

const EmployeesList = ({ navigation, route }) => {
  const { businessId } = route.params;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployees = async () => {
    try {
      if (error) setError(null);

      const data = await getEmployeesByBusinessId(businessId);
      console.log("Fetched my employees:", data);
      setEmployees(data);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleTerminate = (employeeId) => {
    Alert.alert(
      "Confirm Termination",
      "Are you sure you want to terminate this employee?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Terminate",
          style: "destructive",
          onPress: async () => {
            try {
              setRefreshing(true);
              await terminateEmployee(employeeId);
              setEmployees((prev) =>
                prev.filter((emp) => emp.id !== employeeId)
              );
              setRefreshing(false);
              Alert.alert("Success", "Employee terminated successfully.");
            } catch (err) {
              Alert.alert(
                "Error",
                "Failed to terminate employee. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleManage = (employeeId) => {
    navigation.navigate("ManageEmployee", { employeeId, businessId });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
    setRefreshing(false);
  };

  if (refreshing) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </View>
    );
  }

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
        <Button marginTop="$4" onPress={handleRefresh}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="white">
      <TopNavHeader text="Employees" style={{ flex: 0 }} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.container}
      >
        {employees.map((employee) => (
          <Card key={employee.id} style={styles.card}>
            <Image
              source={{ uri: employee.employeeProfile.profile_image }}
              style={{ width: "100%", height: 150, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Text fontSize="$6" fontWeight="bold">
              {employee.employeeProfile.first_name}{" "}
              {employee.employeeProfile.last_name}
            </Text>
            <Text fontSize="$5" marginTop="$2">
              Gender: {employee.employeeProfile.gender || "N/A"}
            </Text>
            <Text fontSize="$5" marginTop="$2">
              Role: {employee.employmentData.role || "N/A"}
            </Text>
            <View
              flexDirection="row"
              justifyContent="space-between"
              marginTop="$4"
            >
              <Button
                onPress={() => {
                  console.log("Manage employee:", employee);
                  handleManage(employee?.employmentData.employee_id)}}
                backgroundColor="#007BFF"
                textProps={{ color: "white" }}
              >
                Manage
              </Button>
              <Button
                onPress={() => handleTerminate(employee.id)}
                backgroundColor="red"
                textProps={{ color: "white" }}
              >
                Terminate
              </Button>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default EmployeesList;
