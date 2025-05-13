import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { View, Text, Input, Card, Button, YStack, XStack, Spinner, Image } from 'tamagui';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import TopNavHeader from '../../components/shared/TopNavHeader';
import { getDoctorsByHospitalId } from '../../services/firebaseUtils';
import { Ionicons } from '@expo/vector-icons';

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
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);

    const filteredDoctors = doctors.filter(
        (doctor) =>
            doctor.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.data.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.data.experience.toLowerCase().includes(searchQuery.toLowerCase())
            
    );

    const handleDoctorPress = (doctorId) => {
        navigation.navigate('ListDoctorAppointments', { doctorId });
    };

    useFocusEffect(
        useCallback(() => {
            fetchDoctors();
        }, [])
    );

    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDoctorsByHospitalId(hospitalId);
        console.log("Fetched doctors:", data); // Debugging line
        setDoctors(data);
      } catch (err) {
        setError("Failed to fetch doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDoctors();
        setRefreshing(false);
        // setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
    };

    //  if (loading) {
    //    return (
    //      <View flex={1} justifyContent="center" alignItems="center">
    //        <Spinner size="large" />
    //      </View>
    //    );
    //  }

    return (
        <View flex={1} padding="$4">
            <TopNavHeader text="Doctors" style={{ flex: 0 }} />
        
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
            {loading && (
                <View flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="large" />
                </View>
            )}
            {error && (
                <View flex={1} justifyContent="center" alignItems="center" padding="$4">
                    <Text color="red" fontSize="$5" textAlign="center">
                        {error}
                    </Text>
                    <Button marginTop="$4" onPress={fetchDoctors}>
                        Retry
                    </Button>
                </View>
            )}
            {!loading && !error && (
                <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <Card key={doctor.id} marginBottom="$4" padding="$4" borderWidth={1} borderColor="$borderColor">
                                <Image
                                    source={{ uri: doctor.data.doctor_image }}
                                    width="100%"
                                    height={150}
                                    borderRadius="$4"
                                    mb="$4"
                                    alignSelf="center"
                                />
                                <YStack space="$2">
                                    <Text fontSize="$6" fontWeight="bold">
                                        {doctor.data.name}
                                    </Text>
                                    <XStack alignItems="center" space="$2">
                                        <Ionicons name="medkit-outline" size={16} color="gray" />
                                        <Text>Specialty: {doctor.data.specialization}</Text>
                                    </XStack>
                                    <XStack alignItems="center" space="$2">
                                        <Ionicons name="time-outline" size={16} color="gray" />
                                        <Text>Experience: {doctor.data.experience} years</Text>
                                    </XStack>
                                    <XStack alignItems="center" space="$2">
                                        <Ionicons name="information-circle-outline" size={16} color="gray" />
                                        <Text>About: {doctor.data.about}</Text>
                                    </XStack>
                                </YStack>
                                <Button
                                    marginTop="$4"
                                    onPress={() => handleDoctorPress(doctor.id)}
                                    backgroundColor="#007BFF"
                                    color="white"
                                >
                                    View Appointments
                                </Button>
                            </Card>
                        ))
                    ) : (
                        <Text textAlign="center" fontSize="$5" color="gray">
                            No doctors found.
                        </Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default ListDoctors;