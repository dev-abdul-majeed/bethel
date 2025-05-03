import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { YStack, Input, Button, Select, Text, RadioGroup, Radio, Label, XStack } from 'tamagui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CreateBusiness = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [operationalHours, setOperationalHours] = useState('');
    const [locationAddress, setLocationAddress] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [payday, setPayday] = useState(''); // New payday field
    const [paymentFrequency, setPaymentFrequency] = useState('monthly'); // Renamed from payday

    useEffect(() => {
        if (route.params?.type) {
            setBusinessType(route.params.type); // Set the type from params
        }
    }, [route.params?.type]);

    const handleCreateBusiness = () => {
        if (
            businessName &&
            businessType &&
            operationalHours &&
            locationAddress &&
            contact &&
            email &&
            payday &&
            paymentFrequency
        ) {
            console.log('Business Created:', {
                businessName,
                businessType,
                operationalHours,
                locationAddress,
                contact,
                email,
                payday,
                paymentFrequency,
            });
            navigation.goBack(); // Navigate back after creation
        } else {
            alert('Please fill all fields');
        }
    };

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={160}
        >
            <YStack f={1} p="$4" bg="$background" space>
                <Text fontSize="$6" fontWeight="bold">
                    Create a New Business
                </Text>
                <Input
                    placeholder="Enter Business Name"
                    value={businessName}
                    onChangeText={setBusinessName}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                    placeholderTextColor="#ccc"
                />
                <Input
                    placeholder="Enter Business Type"
                    value={businessType.charAt(0).toUpperCase() + businessType.slice(1)}
                    onChangeText={setBusinessType}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                    disabled={businessType !== ''} // Disable if already set from params
                    style={{ color: businessType == 'hospital' ? '#808080' : '#fff' }} 

                />
                <Input
                    placeholder="Enter Operational Hours"
                    value={operationalHours}
                    onChangeText={setOperationalHours}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                />
                <Input
                    placeholder="Enter Location Address"
                    value={locationAddress}
                    onChangeText={setLocationAddress}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                />
                <Input
                    placeholder="Enter Contact Number"
                    value={contact}
                    onChangeText={setContact}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                />
                <Input
                    placeholder="Enter Email Address"
                    value={email}
                    onChangeText={setEmail}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                />
                <Input
                    placeholder="Enter Payday"
                    value={payday}
                    onChangeText={setPayday}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                />
                <Text fontSize="$5" fontWeight="bold">
                    Select Payment Frequency
                </Text>
                <RadioGroup aria-labelledby="Select one item" defaultValue="2" name="form">
                    <XStack width={300} alignItems="center" space="$2">
                        <RadioGroupItemWithLabel size="$3" value="monthly" label="Monthly" />
                        <RadioGroupItemWithLabel size="$4" value="weekly" label="Weekly" />
                    </XStack>
                </RadioGroup>
                <Select
                    value={paymentFrequency}
                    onValueChange={setPaymentFrequency}
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    p="$2"
                >
                    <Select.Item label="Select Payment Frequency" value="" />
                    <Select.Item label="Weekly" value="weekly" />
                    <Select.Item label="Monthly" value="monthly" />
                </Select>
                <Button onPress={handleCreateBusiness}>Create Business</Button>
            </YStack>
        </KeyboardAwareScrollView>
    );
};

export default CreateBusiness;

export function RadioGroupItemWithLabel(props) {
    const id = `radiogroup-${props.value}`;
    return (
        <XStack width={150} alignItems="center" space="$4">
            <RadioGroup.Item value={props.value} id={id} size={props.size}>
                <RadioGroup.Indicator />
            </RadioGroup.Item>

            <Label size={props.size} htmlFor={id}>
                {props.label}
            </Label>
        </XStack>
    );
}