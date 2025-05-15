import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, Text, Card, YStack } from 'tamagui';
import TopNavHeader from '../../components/shared/TopNavHeader';

const EmployeeDetails = () => {
    const employee = {
        name: 'John Doe',
        position: 'Software Engineer',
        payDay: '15th of every month',
        salary: '$5000',
    };

    return (
        <ScrollView>
            <TopNavHeader text={"Your Job Details"} />s
            <YStack padding="$4" space="$4">
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
            </YStack>
        </ScrollView>
    );
};

export default EmployeeDetails;