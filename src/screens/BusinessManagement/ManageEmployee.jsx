import React, { useEffect, useState } from "react";
import { ScrollView, Alert, StyleSheet, TextInput, Touchable, TouchableOpacity } from "react-native";
import { View, Text, Button, Card, Spinner, Image, Select, Accordion, Square } from "tamagui";
import { employUser, getEmployeeById, getEmployeesByBusinessId, getUserProfile } from "../../services/firebaseUtils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopNavHeader from "../../components/shared/TopNavHeader";
import { ChevronDown } from "@tamagui/lucide-icons";

const ManageEmployee = ({ navigation, route }) => {
    const { businessId, employeeId } = route.params;
    const [role, setRole] = useState("");
    const [hourlyPay, setHourlyPay] = useState("");
    const [scheduledStartTime, setScheduledStartTime] = useState("");
    const [scheduledEndTime, setScheduledEndTime] = useState("");
    const [scheduledDays, setScheduledDays] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // State to hold user data
    const [hoursWorked, setHoursWorked] = useState("");

    const dateOfJoining = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

    useEffect(() => {
      fetchUserInfo();
    }, [])

    const fetchUserInfo = async () => {
        setLoading(true)
        const user = await getEmployeeById(employeeId) 
        console.log("Fetched user:", user);
        setUser(user)
        setRole(user?.employmentData.role || "");
        setHourlyPay(user?.employmentData.hourly_pay || "");
        setScheduledStartTime(user?.employmentData.scheduled_start_time || "");
        setScheduledEndTime(user?.employmentData.scheduled_end_time || "");
        setScheduledDays(user?.employmentData.scheduled_days || "");
        setLoading(false)
    }
    

    const isFormValid =
        role &&
        hourlyPay &&
        scheduledStartTime &&
        scheduledEndTime &&
        scheduledDays;

    const handleEmploy = async () => {
        if (!isFormValid) {
            Alert.alert("Error", "Please fill all the fields before hiring.");
            return;
        }

        Alert.alert(
            "Confirm Employment",
            "Are you sure you want to employ this user?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Employ",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await employUser({
                              business_id: businessId,
                              employee_id: user.id,
                              role: role,
                              hourly_pay: hourlyPay,
                              scheduled_start_time: scheduledStartTime,
                              scheduled_end_time: scheduledEndTime,
                              scheduled_days: scheduledDays,
                              monthly_rating: 0,
                              feedback: feedback,
                              employment_date: dateOfJoining,
                            });
                            Alert.alert("Success", "User successfully employed!", [
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
            ]
        );
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
        <TopNavHeader text={"Employee Management"} style={{ flex: 1 }} />

        {/* <Card shadowColor="green" shadowRadius="$4" style={styles.card}> */}
          <Accordion type="multiple" 
        //   defaultValue={['employeeDetails']}
          >
            <Accordion.Item value="employeeDetails" >
              <Accordion.Trigger defaultOpen={true} flexDirection="row" justifyContent="space-between">
                {({ open }) => (
                  <
                //    activeOpacity={0.7}
                //   style={{
                //     flexDirection: "row",
                //     justifyContent: "space-between",
                //     alignItems: "center",
                //     paddingVertical: 10,
                //     paddingHorizontal: 8,
                //     margin: 10,
                //     borderColor: "red",
                //     borderWidth: 1
                //   }}  
                // //   onPress={() => setOpen(!open)}
                  >
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
                    }}
                    resizeMode="cover"
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
                  Date of Joining:{" "}
                  {user.employmentData.employment_date || "N/A"}
                </Text>

                <TextInput
                  placeholder="Enter Role (manager, staff, support)"
                  value={role}
                  onChangeText={setRole}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Hourly Pay"
                  value={hourlyPay}
                  onChangeText={setHourlyPay}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Scheduled Start Time (e.g., 09:00 AM)"
                  value={scheduledStartTime}
                  onChangeText={setScheduledStartTime}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Scheduled End Time (e.g., 05:00 PM)"
                  value={scheduledEndTime}
                  onChangeText={setScheduledEndTime}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Scheduled Days (e.g., Mon-Fri)"
                  value={scheduledDays}
                  onChangeText={setScheduledDays}
                  style={styles.input}
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


          
          <Accordion type="multiple" defaultValue={['employeePayroll']}>
            <Accordion.Item value="employeePayroll" >
              <Accordion.Trigger defaultOpen={true} flexDirection="row" justifyContent="space-between">
                {({ open }) => (
                  <
                //    activeOpacity={0.7}
                //   style={{
                //     flexDirection: "row",
                //     justifyContent: "space-between",
                //     alignItems: "center",
                //     paddingVertical: 10,
                //     paddingHorizontal: 8,
                //     margin: 10,
                //     borderColor: "red",
                //     borderWidth: 1
                //   }}  
                // //   onPress={() => setOpen(!open)}
                  >
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
    
                <Text fontSize="$5" >
                 Hourly Pay: {user?.employmentData.hourly_pay} 
                 </Text>
                 
                 <TextInput
                  placeholder="Hours Worked"
                  value={hoursWorked}
                  onChangeText={setHoursWorked}
                  style={styles.input}
                />

                <Text fontSize="$5" marginTop="$2">
                  : {user?.employmentData.gender || "N/A"}
                </Text>
                <Text fontSize="$5" marginTop="$2">
                  Salary to be paid: <Text fontWeight="bold">
                     ${ user?.employmentData.hourly_pay * hoursWorked || "N/A"}
                    </Text>
                </Text>
                <Text fontSize="$5" marginTop="$2">
                  Date of Joining:{" "}
                  {user.employmentData.employment_date || "N/A"}
                </Text>

                {/* <TextInput
                  placeholder="Enter Role (manager, staff, support)"
                  value={role}
                  onChangeText={setRole}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Hourly Pay"
                  value={hourlyPay}
                  onChangeText={setHourlyPay}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Scheduled Start Time (e.g., 09:00 AM)"
                  value={scheduledStartTime}
                  onChangeText={setScheduledStartTime}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Scheduled End Time (e.g., 05:00 PM)"
                  value={scheduledEndTime}
                  onChangeText={setScheduledEndTime}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Scheduled Days (e.g., Mon-Fri)"
                  value={scheduledDays}
                  onChangeText={setScheduledDays}
                  style={styles.input}
                /> */}
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
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 100
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