import React from 'react';
import { YStack, H1, Paragraph, Card } from 'tamagui';

const ManageBusiness = () => {
    const stats = {
        profitToDate: 50000, // Example value
        expensesToDate: 20000, // Example value
        profitMarginToDate: '60%', // Example value
    };

    return (
        <YStack f={1} p="$4" bg="$background" space="$4">
            <H1 ta="center">Business Stats</H1>
            <Card elevate size="$4" bordered>
                <YStack space="$2">
                    <Paragraph size="$3" color="$color">Profit to Date:</Paragraph>
                    <Paragraph size="$5" fontWeight="bold">${stats.profitToDate}</Paragraph>
                </YStack>
            </Card>
            <Card elevate size="$4" bordered>
                <YStack space="$2">
                    <Paragraph size="$3" color="$color">Expenses to Date:</Paragraph>
                    <Paragraph size="$5" fontWeight="bold">${stats.expensesToDate}</Paragraph>
                </YStack>
            </Card>
            <Card elevate size="$4" bordered>
                <YStack space="$2">
                    <Paragraph size="$3" color="$color">Profit Margin to Date:</Paragraph>
                    <Paragraph size="$5" fontWeight="bold">{stats.profitMarginToDate}</Paragraph>
                </YStack>
            </Card>
        </YStack>
    );
};

export default ManageBusiness;
