import React, { useState } from 'react';
import { View, Text, Button, Input, Image, Alert, XStack, Label, YStack, Card } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import { uploadDoctorToFirebase } from '../services/firebaseUtils';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DoctorRegistration = ({ navigation, route}) => {
    const [form, setForm] = useState({
        name: '',
        specialization: '',
        experience: '',
        photo: '',
        about: '', // New field for about
    });

    const { hospitalId } = route.params;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                handleChange('photo', result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picking error:', error);
            Alert.alert('Error selecting image.');
        }
    };

    const handleSubmit = async () => {
        try {
            await uploadDoctorToFirebase(form, hospitalId);
            Alert.alert('Success', 'Doctor registered successfully!');
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while saving doctor data.');
        }
    };

    const isFormComplete = Object.values(form).every((val) => val !== '');

    const renderLabelWithIcon = (iconName, labelText) => (
        <XStack alignItems="center" space="$2">
            <Icon name={iconName} size={20} />
            <Label>{labelText}</Label>
        </XStack>
    );

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ paddingBottom: 45 }}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={140}
        >
            <YStack padding="$4" space="$2">
                <Card elevate bordered size="$4" padding="$4">
                    <Text fontSize="$6" fontWeight="bold">
                        Doctor Registration
                    </Text>
                </Card>

                {renderLabelWithIcon('person-outline', 'Full Name')}
                <Input
                    placeholder="Full Name"
                    value={form.name}
                    onChangeText={(text) => handleChange('name', text)}
                />

                {renderLabelWithIcon('medkit-outline', 'Specialization')}
                <Input
                    placeholder="Specialization"
                    value={form.specialization}
                    onChangeText={(text) => handleChange('specialization', text)}
                />

                {renderLabelWithIcon('time-outline', 'Experience (in years)')}
                <Input
                    placeholder="Experience"
                    value={form.experience}
                    onChangeText={(text) => handleChange('experience', text)}
                    keyboardType="numeric"
                />

                {renderLabelWithIcon('image-outline', 'Photo')}
                {form.photo ? (
                    <Image height={200} source={{ uri: form.photo }} />
                ) : null}
                <Button onPress={handlePickImage}>
                    Pick Photo
                </Button>

                {renderLabelWithIcon('information-circle-outline', 'About')}
                <Input
                    placeholder="Write about the doctor..."
                    value={form.about}
                    onChangeText={(text) => handleChange('about', text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <Button onPress={handleSubmit} disabled={!isFormComplete}>
                    Submit
                </Button>
            </YStack>
        </KeyboardAwareScrollView>
    );
};

export default DoctorRegistration;