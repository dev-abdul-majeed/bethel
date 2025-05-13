import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Input, XStack, Text, View, YStack } from "tamagui";
import { getAuth } from "@react-native-firebase/auth";
import { uploadAppointment } from "../../services/firebaseUtils";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";

const AppointmentForm = ({ doctorId }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
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

  return (
    <View>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create Appointment</Text>
      {show && (
        <RNDateTimePicker
          value={date}
          minimumDate={date}
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
            type="date"
            value={date.toDateString()}
            disabled
            width={170}
          />
          <Button
            onPress={showDatepicker}
            icon={<Ionicons name="calendar-outline" size={20} />}
          >
            Set Date
          </Button>
        </XStack>

        <XStack gap="$3" justifyContent="center">
          <Input
            placeholder="Select Time"
            type="time"
            value={date.toTimeString()}
            disabled
            width={170}
          />
          <Button
            onPress={showTimepicker}
            icon={<Ionicons name="time-outline" size={20} />}
          >
            Set Time
          </Button>
        </XStack>

        <Button
          onPress={handleSubmit}
          icon={<Ionicons name="checkmark-done-outline" size={20} />}
        >
          Submit
        </Button>
      </YStack>
      <YStack>
        <Text>Previous Appointments</Text>
      </YStack>
    </View>
  );
};

export default AppointmentForm;

const styles = StyleSheet.create({});
