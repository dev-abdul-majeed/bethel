import React from 'react';
import { View, Text, Button, Input } from 'tamagui';

const DoctorRegistration = () => {
    return (
        <View padding="$4" space="$4">
            <Text fontSize="$6" fontWeight="bold">
                Doctor Registration
            </Text>
            <Input placeholder="Full Name" />
            <Input placeholder="Email Address" keyboardType="email-address" />
            <Input placeholder="Phone Number" keyboardType="phone-pad" />
            <Input placeholder="Specialization" />
            <Button onPress={() => alert('Registration Submitted')}>
                Submit
            </Button>
        </View>
    );
};

export default DoctorRegistration;