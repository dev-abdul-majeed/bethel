import React, { useEffect, useState } from "react";
import { ScrollView, Alert, StyleSheet } from "react-native";
import { View, Text, Button, Card, Spinner } from "tamagui";
import { getUsers, terminateEmployee } from "../../services/firebaseUtils";
import { useNavigation } from "@react-navigation/native";
import TopNavHeader from "../../components/shared/TopNavHeader";

const ManageEmployees = ({ route }) => {
  const { businessId } = route.params;
  const navigation = useNavigation();

  const [employees, setEmployees] = useState([ {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Manager",
},
{
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Cashier",
},
{
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Chef",
},]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployees = async () => {
    try {
      const data = await getUsers(businessId);
      console.log("Fetched employees:", data);
    //   setEmployees(data);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [businessId]);

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
              await terminateEmployee(businessId, employeeId);
              setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
              Alert.alert("Success", "Employee terminated successfully.");
            } catch (err) {
              Alert.alert("Error", "Failed to terminate employee. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleManage = (employeeId) => {
    navigation.navigate("EmployeeDetails", { employeeId });
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
        <Button marginTop="$4" onPress={() => window.location.reload()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="white">
      <TopNavHeader text="Employees" style={{ flex: 0 }} />
    <ScrollView contentContainerStyle={styles.container}>
      {employees.map((employee) => (
        <Card key={employee.id} style={styles.card}>
          <Text fontSize="$6" fontWeight="bold">
            {employee.name}
          </Text>
          <Text fontSize="$5" marginTop="$2">
            Email: {employee.email}
          </Text>
          <Text fontSize="$5" marginTop="$2">
            Role: {employee.role || "N/A"}
          </Text>
          <View flexDirection="row" justifyContent="space-between" marginTop="$4">
            <Button
              onPress={() => handleManage(employee.id)}
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

export default ManageEmployees;