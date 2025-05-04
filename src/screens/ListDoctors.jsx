import React, { useState } from 'react';
import { ScrollView, Image } from 'react-native';
import { View, Text, Input, Card, Button, YStack, XStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';

const sampleDoctors = [
    {
        id: '1',
        name: 'Dr. John Doe',
        specialty: 'Cardiologist',
        experience: '10 years',
        profilePicture: 'https://via.placeholder.com/100',
    },
    {
        id: '2',
        name: 'Dr. Jane Smith',
        specialty: 'Dermatologist',
        experience: '8 years',
        profilePicture: 'https://via.placeholder.com/100',
    },
    {
        id: '3',
        name: 'Dr. Emily Johnson',
        specialty: 'Pediatrician',
        experience: '5 years',
        profilePicture: 'https://via.placeholder.com/100',
    },
];

const ListDoctors = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const hospitalId = route.params?.hospitalId;

    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = sampleDoctors.filter(
        (doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDoctorPress = (doctorId) => {
        navigation.navigate('DoctorAvailableDays', { doctorId, hospitalId });
    };

    return (
        <View flex={1} padding="$4">
            <Input
                placeholder="Search by name or specialty"
                value={searchQuery}
                onChangeText={setSearchQuery}
                borderWidth={1}
                borderColor="gray"
                borderRadius="$4"
                p="$2"
                marginBottom="$4"
            />
            <ScrollView>
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <Card key={doctor.id} marginBottom="$4" padding="$4" borderWidth={1} borderColor="$borderColor">
                            <XStack alignItems="center" space="$4">
                                <Image
                                    source={{ uri: doctor.profilePicture }}
                                    style={{ width: 80, height: 80, borderRadius: 40 }}
                                />
                                <YStack>
                                    <Text fontSize="$6" fontWeight="bold">
                                        {doctor.name}
                                    </Text>
                                    <Text>Specialty: {doctor.specialty}</Text>
                                    <Text>Experience: {doctor.experience}</Text>
                                </YStack>
                            </XStack>
                            <Button
                                marginTop="$4"
                                onPress={() => handleDoctorPress(doctor.id)}
                                backgroundColor="#007BFF"
                                color="white"
                            >
                                View Available Days
                            </Button>
                        </Card>
                    ))
                ) : (
                    <Text textAlign="center" fontSize="$5" color="gray">
                        No doctors found.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

export default ListDoctors;