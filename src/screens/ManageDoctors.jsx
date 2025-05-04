import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  Text,
  ScrollView,
  Button,
  Card,
  XStack,
  YStack,
  Image,
  Separator,
} from 'tamagui'

import { TextInput } from 'react-native';


const sampleDoctors = [
  {
    id: '1',
    name: 'Dr. John Doe',
    avatar: 'https://i.pravatar.cc/100?img=1',
    speciality: 'Neurosurgeon',
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    avatar: 'https://i.pravatar.cc/100?img=2',
    speciality: 'Cardiologist',
  },
  {
    id: '3',
    name: 'Dr. Emily Johnson',
    avatar: 'https://i.pravatar.cc/100?img=3',
    speciality: 'Pediatrician',
  },
]

const ManageDoctors = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDoctors = sampleDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDoctorPress = (doctorId) => {
    navigation.navigate('DoctorRegistration', { doctorId })
  }

  const handleAddDoctor = () => {
    navigation.navigate('DoctorRegistration')
  }

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$3">
        Manage Doctors
      </Text>

      <TextInput
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        padding="$2"
        borderWidth={1}
        borderColor="#808080"
        borderRadius={5}
        marginBottom="$4"
      />

      <Button onPress={handleAddDoctor} marginBottom="$4">
        <Text>
            Add New Doctor
            </Text>
      </Button>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            elevate
            bordered
            size="$4"
            marginBottom="$4"
            pressStyle={{ scale: 0.98, backgroundColor: '#808080' }}
            onPress={() => handleDoctorPress(doctor.id)}
          >
            <XStack alignItems="center" space="$3">
              <Image
                source={{ uri: doctor.avatar }}
                width={50}
                height={50}
                borderRadius={25}
              />
              <YStack>
                <Text fontSize="$6" fontWeight="600">
                  {doctor.name}
                </Text>
                <Text color="#808080">{doctor.speciality}</Text>
              </YStack>
            </XStack>
          </Card>
        ))}

        {filteredDoctors.length === 0 && (
          <Text color="#808080" textAlign="center">
            No doctors found.
          </Text>
        )}
      </ScrollView>
    </YStack>
  )
}

export default ManageDoctors
