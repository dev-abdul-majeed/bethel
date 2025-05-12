import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, Input } from "tamagui";
import { getAuth } from "@react-native-firebase/auth";
import { uploadAppointment } from "../../services/firebaseUtils";

const AppointmentForm = ({ navigation, route }) => {
  const patientId = getAuth().currentUser;
  const [form, setForm] = useState({
    date: "",
    time: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submit appointment called");
    const appointment = {
      ...form,
      doctorId: 123,
      patientId: patientId?.uid,
      appointmentBooked: false,
    };
    try {
      await uploadAppointment(appointment);
    } catch (e) {
      console.log("Something went wrong while uploading appointment: ", e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create Appointment</Text>
      <Input
        placeholder="Select Date"
        type="date"
        style={{ marginBottom: 16, width: 250 }}
        value={form.date}
        onChangeText={(text) => handleChange("date", text)}
      />
      <Input
        placeholder="Select Time"
        type="time"
        style={{ marginBottom: 16, width: 250 }}
        value={form.time}
        onChangeText={(text) => handleChange("time", text)}
      />
      <Button onPress={handleSubmit}>Submit</Button>
    </View>
  );
};

export default AppointmentForm;

const styles = StyleSheet.create({});
