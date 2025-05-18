import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';
import { Stack, Text, Card, YStack, Button, View } from 'tamagui';
import TopNavHeader from '../../components/shared/TopNavHeader';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getEmployeeById, logEmployeeWorkHours } from '../../services/firebaseUtils';

const EmployeeDetails = ({ navigation, route }) => {
    const { employeeId } = route?.params; // Assuming you pass employeeId from the previous screen
    const employee = {
        name: 'John Doe',
        position: 'Software Engineer',
        payDay: '15th of every month',
        salary: '$5000',
    };

    const [selectedDate, setSelectedDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [hours, setHours] = useState('');
    const [error, setError] = useState('');
    const [employed, setEmployed] = useState(null)

    useEffect(() => {
        checkIfEmployed()
    }, [])

    const checkIfEmployed = async () => {
        console.log('Checking if employee is employed:', employeeId);
        const employedd = await getEmployeeById(employeeId)
        console.log('employed', employedd)
        setEmployed(employedd)
    }
    
  
    const handleDateChange = (_, date) => {
      setShowPicker(false);
      if (date) setSelectedDate(date);
    };
  
    const handleHoursChange = (value) => {
      const numeric = parseInt(value);
      setHours(value);
      if (isNaN(numeric)) {
        setError('Please enter a number');
      } else if (numeric < 1 || numeric > 8) {
        setError('Hours must be between 1 and 8');
      } else {
        setError('');
      }
    };
  
    const handleSubmit = async () => {
      if (error || !hours || !selectedDate) {
        Alert.alert('Error', 'Please select a date and valid hours');
      } else {
          await logEmployeeWorkHours({ 
              employee_id: employeeId,
              date: selectedDate,
              hours: hours
            })
        Alert.alert('Success', `Logged ${hours} hours on ${selectedDate.toDateString()}`);
      }
    };

    return (
        <ScrollView>
            <TopNavHeader text={"Your Job Details"} />
            <YStack padding="$4" space="$4">
        {!employed ? (
          
            <YStack f={1} jc="center" ai="center">
                <Text fontSize="$5" fontWeight="600">Not Employed</Text>
            </YStack>
        
        ) : (
            <>
                <Card elevate padding="$4" borderRadius="$4" shadowColor="green" shadowRadius="$2">
                    <Stack space="$3">
                        <Text fontSize="$5" fontWeight="600">
                            Name: {employee.name}
                        </Text>
                        <Text fontSize="$5" fontWeight="600">
                            Position: {employee.position}
                        </Text>
                        <Text fontSize="$5" fontWeight="600">
                            Pay Day: {employee.payDay}
                        </Text>
                        <Text fontSize="$5" fontWeight="600">
                            Salary: {employee.salary}
                        </Text>
                    </Stack>
                </Card>

                <Card elevate bordered padding="$4" margin="$3">
        <Text fontSize="$6" fontWeight="bold" marginBottom="$2">
          Log Work Hours
        </Text>
  
        <Button onPress={() => setShowPicker(true)} marginBottom="$2">
          {selectedDate ? selectedDate.toDateString() : 'Select Date'}
        </Button>
  
        {showPicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={'default'}
            onChange={handleDateChange}
          />
        )}
  
        {selectedDate && (
          <View>
            <TextInput
              placeholder="Enter number of hours (1–8)"
              keyboardType="numeric"
              value={hours}
              onChangeText={handleHoursChange}
              style={{
                borderWidth: 1,
                borderColor: error ? 'red' : '#ccc',
                padding: 10,
                borderRadius: 6,
                marginBottom: 6,
                marginTop: 8,
              }}
            />
            {error ? <Text color="red">{error}</Text> : null}
  
            <Button
              backgroundColor={!error && hours ? '#007BFF' : '#ccc'}
              disabled={!!error || !hours}
              onPress={handleSubmit}
              marginTop="$2"
            >
              Submit
            </Button>
          </View>
        )}
      </Card>
      </>
        )}
            </YStack>
        </ScrollView>
    );
};

export default EmployeeDetails;