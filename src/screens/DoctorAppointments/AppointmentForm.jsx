import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Input, XStack, Text, View, YStack } from "tamagui";
import { uploadAppointment } from "../../services/firebaseUtils";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";

const AppointmentForm = ({ doctorId, onAppointmentCreated }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        doctorId,
        date: date.toDateString(),
        time: date.toTimeString(),
        status: "available",
      };
      await uploadAppointment(appointmentData);
      onAppointmentCreated(); // Notify parent component
    } catch (error) {
      console.error("Failed to create appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View paddingHorizontal={15}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create Appointment</Text>
      {show && (
        <RNDateTimePicker
          value={date}
          minimumDate={new Date()}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
          minuteInterval={30}
        />
      )}
      <YStack gap={"$4"}>
        <XStack gap="$3" alignItems="center" justifyContent="center">
          <Input
            placeholder="Select Date"
            backgroundColor={"white"}
            value={date.toDateString()}
            disabled
            width={170}
          />
          <Button
            textProps={{ color: "white" }}
            onPress={showDatepicker}
            icon={
              <Ionicons name="calendar-outline" size={20} color={"white"} />
            }
            backgroundColor={"rgb(92, 94, 244)"}
          >
            Set Date
          </Button>
        </XStack>

        <XStack gap="$3" justifyContent="center">
          <Input
            placeholder="Select Time"
            backgroundColor={"white"}
            value={date.toTimeString()}
            disabled
            width={170}
          />
          <Button
            onPress={showTimepicker}
            textProps={{ color: "white" }}
            icon={<Ionicons name="time-outline" size={20} color={"white"} />}
            backgroundColor={"rgb(92, 94, 244)"}
          >
            Set Time
          </Button>
        </XStack>

        <Button
          onPress={handleSubmit}
          textProps={{ color: "white" }}
          backgroundColor={"rgb(46, 215, 170)"}
          icon={
            <Ionicons name="checkmark-done-outline" size={20} color={"white"} />
          }
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </YStack>
    </View>
  );
};

export default AppointmentForm;

const styles = StyleSheet.create({});
