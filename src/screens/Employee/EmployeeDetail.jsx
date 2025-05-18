import React, { useState, useEffect } from "react";
import { Alert, ScrollView } from "react-native";
import {
  Stack,
  Text,
  Card,
  YStack,
  View,
  Avatar,
  Button,
  Separator,
  XStack,
} from "tamagui";
import TopNavHeader from "../../components/shared/TopNavHeader";
import {
  getBusinessById,
  getEmployeeEmploymentData,
  getPayrollDataByEmployeeId,
} from "../../services/firebaseUtils";
import { Ionicons } from "@expo/vector-icons";

const EmployeeDetails = ({ navigation, route }) => {
  const { employeeId } = route?.params;

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [business, setBusiness] = useState(null);
  const [payroll, setPayroll] = useState(null);

  useEffect(() => {
    checkIfEmployed();
  }, []);

  const checkIfEmployed = async () => {
    setLoading(true);
    try {
      const employedd = await getEmployeeEmploymentData(employeeId);
      const businessDetails = await getBusinessById(
        employedd.employmentData.business_id
      );
      const payrollDetails = await getPayrollDataByEmployeeId(employeeId);
      console.log("payrollDetails", payrollDetails);
      setPayroll(payrollDetails);
      setBusiness(businessDetails);
      setEmployee(employedd);
      setLoading(false);
    } catch (error) {
      Alert.alert("Couldn't find your data");
      navigation.goBack();
    } finally {
    }
  };

  const hourlyPayDetails = {
    hourlyPay: employee?.employmentData.hourly_pay,
    weeklyHours: employee?.employmentData.weekly_hours,
    monthlyHours: employee?.employmentData.weekly_hours * 4,
    actualMonthlyHours: employee?.employmentData.actual_monthly_hours,
    salary:
      employee?.employmentData.actual_monthly_hours *
      employee?.employmentData.hourly_pay,
    date: `${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
  };

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <TopNavHeader text="Employee Details" />
      <YStack>
        <YStack
          padding={20}
          borderTopColor={"rgb(93, 0, 255)"}
          borderTopWidth={3}
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          top={30}
          mb={100}
          space="$4"
        >
          <Card elevate padding="$4" borderRadius="$4">
            <YStack space="$3">
              <Text fontSize="$6" fontWeight="bold" marginBottom="$2">
                Employment Overview
              </Text>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="business-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text fontSize="$5" fontWeight="600">
                  Business Name: {business?.data?.businessName}
                </Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text fontSize="$5" fontWeight="600">
                  Position: {employee?.employmentData.role}
                </Text>
              </XStack>
            </YStack>
          </Card>

          <Separator
            horizontal
            borderColor={"rgb(167, 117, 255)"}
            borderWidth={2}
            width={"50%"}
            borderTopRightRadius={5}
            borderTopLeftRadius={5}
            alignSelf="center"
            marginVertical="$1"
          />

          <Card elevate bordered padding="$4" margin="$">
            <YStack space="$3">
              <Text fontSize="$6" fontWeight="bold" marginBottom="$2">
                Hourly Pay Details
              </Text>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text>Hourly Pay: ${payroll?.data.hourly_pay}</Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text>Weekly Hours: {payroll.data.weekly_hours}</Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text>Monthly Hours: {payroll.data.monthly_hours}</Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text>
                  Actual Monthly Hours: {payroll.data.actual_monthly_hours}
                </Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text>Salary: ${payroll.data.salary}</Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />
                <Text>Date: {payroll.data.date}</Text>
              </XStack>
            </YStack>
          </Card>

          <Separator
            horizontal
            borderColor={"rgb(167, 117, 255)"}
            borderWidth={2}
            width={"50%"}
            borderTopRightRadius={5}
            borderTopLeftRadius={5}
            alignSelf="center"
            marginVertical="$1"
          />

          <Card elevate bordered padding="$4">
            <Text fontSize="$6" fontWeight="bold" marginBottom="$2">
              Feedback and Rating
            </Text>
            <XStack alignItems="center" space="$2">
              <Ionicons name="star-outline" size={20} color="rgb(93, 0, 255)" />
              <Text>
                Rating: {employee.employmentData.monthly_rating || "No rating"}
              </Text>
            </XStack>
            <XStack alignItems="center" space="$2">
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="rgb(93, 0, 255)"
              />
              <Text>
                Feedback: {employee.employmentData.feedback || "No feedback"}
              </Text>
            </XStack>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default EmployeeDetails;
