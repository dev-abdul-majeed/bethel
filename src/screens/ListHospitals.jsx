import React, { useState } from 'react';
import { View, Text, ScrollView } from 'tamagui';

import { useNavigation } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native';

const sampleHospitals = [
    { id: 1, name: 'City Hospital', logo: '🏥', location: 'Downtown', specialty: 'Cardiology' },
    { id: 2, name: 'Green Valley Clinic', logo: '🌿', location: 'Uptown', specialty: 'Pediatrics' },
    { id: 3, name: 'Sunrise Medical Center', logo: '🌅', location: 'Midtown', specialty: 'Orthopedics' },
];

const ListHospitals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    const filteredHospitals = sampleHospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleHospitalPress = (hospitalId) => {
        navigation.navigate('ListDoctors', { hospitalId });
    };

    return (
        <View flex={1} padding="$4">
            <TextInput
                placeholder="Search hospitals..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                padding="$3"
                borderWidth={1}
                borderColor="gray"
                borderRadius={5}
                marginBottom="$4"
            />
            <ScrollView>
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map(hospital => (
                        <TouchableOpacity
                            key={hospital.id}
                            onPress={() => handleHospitalPress(hospital.id)}
                        >
                            <View
                                padding="$4"
                                marginBottom="$3"
                                borderWidth={1}
                                borderColor="gray"
                                borderRadius="$4"
                                backgroundColor="gray"
                            >
                                <Text fontSize="$5" fontWeight="bold">
                                    {hospital.logo} {hospital.name}
                                </Text>
                                <Text fontSize="$4" color="gray">
                                    Location: {hospital.location}
                                </Text>
                                <Text fontSize="$4" color="gray">
                                    Specialty: {hospital.specialty}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text fontSize="$5" color="gray" textAlign="center" marginTop="$6">
                        No results found
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

export default ListHospitals;