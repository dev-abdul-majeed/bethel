import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Alert,
  StyleSheet,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import {
  View,
  Text,
  Button,
  Card,
  Spinner,
  Image,
  Select,
  Accordion,
  Square,
  H3,
} from "tamagui";
import {
  employUser,
  getEmployeeById,
  getEmployeesByBusinessId,
  getUserProfile,
  savePayroll,
  updateEmploymentData,
} from "../../services/firebaseUtils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopNavHeader from "../../components/shared/TopNavHeader";
import { ChevronDown } from "@tamagui/lucide-icons";
import Ionicons from "react-native-vector-icons/Ionicons";

const ManageEmployee = ({ navigation, route }) => {
  const { businessId, employeeId } = route.params;
  const [role, setRole] = useState("");
  const [hourlyPay, setHourlyPay] = useState("");
  const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [scheduledEndTime, setScheduledEndTime] = useState("");
  const [scheduledDays, setScheduledDays] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // State to hold user data
  const [hoursWorked, setHoursWorked] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(0);
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    const user = await getEmployeeById(employeeId);
    setUser(user);
    setRole(user?.employmentData.role || "");
    setHourlyPay(user?.employmentData.hourly_pay || "");
    setScheduledStartTime(user?.employmentData.scheduled_start_time || "");
    setScheduledEndTime(user?.employmentData.scheduled_end_time || "");
    setScheduledDays(user?.employmentData.scheduled_days || "");
    setWeeklyHours(user?.employmentData.weekly_hours || 0);
    setRating(user?.employmentData.monthly_rating);
    setFeedback(user?.employmentData.feedback);

    setLoading(false);
  };

  const isFormValid =
    role &&
    hourlyPay &&
    scheduledStartTime &&
    scheduledEndTime &&
    scheduledDays &&
    weeklyHours;

  const handleEmploy = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill all the fields before hiring.");
      return;
    }

    Alert.alert("Confirm Updation", "Save all made changes?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Save",
        onPress: async () => {
          try {
            setLoading(true);
            await updateEmploymentData(user.id, {
              role: role,
              hourly_pay: hourlyPay,
              scheduled_start_time: scheduledStartTime,
              scheduled_end_time: scheduledEndTime,
              scheduled_days: scheduledDays,
              weekly_hours: weeklyHours,
              monthly_rating: rating,
              feedback: feedback,
            });
            Alert.alert("Success", "Employ details updated!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("ManageBusiness", {
                    screen: "ManageBusiness",
                  });
                },
              },
            ]);
          } catch (err) {
            Alert.alert("Error", "Failed to employ user. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handlePayroll = async () => {
    const data = {
      hourly_pay: hourlyPay,
      weekly_hours: weeklyHours,
      monthly_hours: weeklyHours * 4,
      actual_monthly_hours: hoursWorked,
      salary: hoursWorked * hourlyPay,
      date: `${new Date().getMonth()}-${new Date().getFullYear()}`,
    };

    try {
      await savePayroll(employeeId, businessId, data);
      Alert.alert("Payroll saved successfully");
    } catch (error) {
      Alert.alert("Error while saving payload: ", error);
    }
  };

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={190}
      contentContainerStyle={styles.container}
    >
      <TopNavHeader text={"Employee Management"} style={{ flex: 0 }} />

      <Accordion type="multiple">
        <Accordion.Item value="employeeDetails">
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            {({ open }) => (
              <>
                <Text fontSize="$6" fontWeight="bold">
                  Employee Details
                </Text>
                <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                  <ChevronDown size="$1" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator animation="medium">
            <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
              {user?.employeeProfile.profile_image && (
                <Image
                  source={{ uri: user?.employeeProfile.profile_image }}
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 8,
                    marginBottom: 16,
                    resizeMode: "cover",
                  }}
                />
              )}
              <Text fontSize="$6" fontWeight="bold">
                {user?.employeeProfile.first_name}{" "}
                {user?.employeeProfile.last_name}
              </Text>
              <Text fontSize="$5" marginTop="$2">
                Gender: {user?.employeeProfile.gender || "N/A"}
              </Text>
              <Text fontSize="$5" marginTop="$2">
                Date of Birth: {user?.employeeProfile.dob || "N/A"}
              </Text>
              <Text fontSize="$5" marginTop="$2">
                Date of Joining: {user.employmentData.employment_date || "N/A"}
              </Text>

              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Role
              </Text>
              <TextInput
                placeholder="Enter Role (manager, staff, support)"
                value={role}
                onChangeText={setRole}
                style={styles.input}
              />

              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Hourly Pay
              </Text>
              <TextInput
                placeholder="Hourly Pay"
                value={hourlyPay}
                onChangeText={setHourlyPay}
                keyboardType="numeric"
                style={styles.input}
              />
              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Scheduled Start Time
              </Text>
              <TextInput
                placeholder="Scheduled Start Time (e.g., 09:00 AM)"
                value={scheduledStartTime}
                onChangeText={setScheduledStartTime}
                style={styles.input}
              />
              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Scheduled End Time
              </Text>
              <TextInput
                placeholder="Scheduled End Time (e.g., 05:00 PM)"
                value={scheduledEndTime}
                onChangeText={setScheduledEndTime}
                style={styles.input}
              />
              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Scheduled Days
              </Text>
              <TextInput
                placeholder="Scheduled Days (e.g., Mon-Fri)"
                value={scheduledDays}
                onChangeText={setScheduledDays}
                style={styles.input}
              />
              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Weekly Hours
              </Text>
              <TextInput
                placeholder="Weekly hours (e.g. 40)"
                value={`${weeklyHours}`}
                onChangeText={setWeeklyHours}
                style={styles.input}
                inputMode="numeric"
              />
              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="star-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Monthly Performance Rating
              </Text>
              <TextInput
                placeholder="Performance Rating out of 10"
                value={`${rating}`}
                onChangeText={(val) => {
                  if (val > 10) {
                    val = 10;
                  } else if (val < 0) {
                    val = 0;
                  }
                  setRating(val);
                }}
                style={styles.input}
                inputMode="numeric"
              />
              <Text fontSize="$5" marginTop="$2">
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color="rgb(93, 0, 255)"
                />{" "}
                Feedback
              </Text>
              <TextInput
                placeholder="Feedback for employee"
                value={`${feedback}`}
                onChangeText={setFeedback}
                style={styles.input}
                inputMode="numeric"
              />
              <Button
                marginTop="$4"
                onPress={handleEmploy}
                backgroundColor={isFormValid ? "#007BFF" : "#ccc"}
                textProps={{ color: "white" }}
                disabled={!isFormValid}
              >
                Update
              </Button>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      </Accordion>

      <Accordion type="multiple">
        <Accordion.Item value="employeePayroll">
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            {({ open }) => (
              <>
                <Text fontSize="$6" fontWeight="bold">
                  Employee Payroll
                </Text>
                <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                  <ChevronDown size="$1" />
                </Square>
              </>
            )}
          </Accordion.Trigger>

          <Accordion.HeightAnimator animation="medium">
            <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
              <H3>
                Month of {month[new Date().getMonth()]}/
                {new Date().getFullYear()}
              </H3>
              <Text fontSize="$5">
                Hourly Pay: £{user?.employmentData.hourly_pay}
              </Text>
              <Text fontSize="$5">
                Scheduled Weekly Hours: {user?.employmentData.weekly_hours}
              </Text>
              <Text fontSize="$5">
                Scheduled Monthly Hours: {user?.employmentData.weekly_hours * 4}
              </Text>

              <TextInput
                placeholder={`Actual Hours for ${month[new Date().getMonth()]}`}
                value={hoursWorked}
                onChangeText={setHoursWorked}
                style={styles.input}
              />

              <Text fontSize="$5" marginTop="$2">
                Salary to be paid:{" "}
                <Text fontWeight="bold">
                  £{user?.employmentData.hourly_pay * hoursWorked || ""}
                </Text>
              </Text>

              <Button
                marginTop="$4"
                onPress={handlePayroll}
                backgroundColor={isFormValid ? "#007BFF" : "#ccc"}
                textProps={{ color: "white" }}
                disabled={!isFormValid}
              >
                Save
              </Button>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      </Accordion>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
    height: "200%",
    backgroundColor: "white",
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
    fontSize: 16,
  },
});

export default ManageEmployee;
