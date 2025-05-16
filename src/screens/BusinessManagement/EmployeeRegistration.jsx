import React, { useEffect, useState } from "react";
import { ScrollView, Alert, StyleSheet, TextInput } from "react-native";
import { View, Text, Button, Card, Spinner, Image, Select } from "tamagui";
import { employUser } from "../../services/firebaseUtils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopNavHeader from "../../components/shared/TopNavHeader";

const EmployeeRegistration = ({ navigation, route }) => {
    const { businessId, user } = route.params;
    const [role, setRole] = useState("");
    const [hourlyPay, setHourlyPay] = useState("");
    const [scheduledStartTime, setScheduledStartTime] = useState("");
    const [scheduledEndTime, setScheduledEndTime] = useState("");
    const [scheduledDays, setScheduledDays] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const dateOfJoining = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

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
      <KeyboardAwareScrollView  enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={190} contentContainerStyle={styles.container}>
      <TopNavHeader text={"Employee registration"} style={{ flex: 1  }} />

        <Card shadowColor="green" shadowRadius="$4" style={styles.card}>
          {user.data.profile_image && (
            <Image
              source={{ uri: user.data.profile_image }}
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
            {user.data.first_name} {user.data.last_name}
          </Text>
          <Text fontSize="$5" marginTop="$2">
            Gender: {user.data.gender || "N/A"}
          </Text>
          <Text fontSize="$5" marginTop="$2">
            Date of Birth: {user.data.dob || "N/A"}
          </Text>
          <Text fontSize="$5" marginTop="$2">
            Date of Joining: {dateOfJoining}
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
            Hire
          </Button>
        </Card>
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

export default EmployeeRegistration;