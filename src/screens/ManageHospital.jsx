import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { YStack, H1, H2, ListItem, Button } from 'tamagui';

const ManageHospital = ({ navigation }) => {
    // const navigate = useNavigate();

    const stats = {
        doctors: 25,
        appointments: 120,
        patients: 300,
    };

    const handleManageDoctors = () => {
        navigation.navigate('ManageDoctors');
    };

    return (
        <YStack padding="$4" space>
            <H1>Hospital Management</H1>
            <YStack space="$3">
                <H2>Statistics</H2>
                <YStack space="$2">
                    <ListItem>Number of Doctors: {stats.doctors}</ListItem>
                    <ListItem>Number of Appointments: {stats.appointments}</ListItem>
                    <ListItem>Number of Patients: {stats.patients}</ListItem>
                </YStack>
            </YStack>
            <Button onPress={handleManageDoctors}>Manage Doctors</Button>
        </YStack>
    );
};

export default ManageHospital;
