import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ChooseBusiness = ({ navigation }) => {
    const handleSelection = (type) => {
        navigation.navigate("CreateBusiness", { type });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Business</Text>
            <Text style={styles.subtitle}>
                Decide which new business you want to create
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.businessButton]}
                    onPress={() => handleSelection("business")}
                >
                    <Text style={styles.buttonText}>Business</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.hospitalButton]}
                    onPress={() => handleSelection("hospital")}
                >
                    <Text style={styles.buttonText}>Hospital</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        marginBottom: 24,
    },
    buttonContainer: {
        width: "100%",
        maxWidth: 300,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16,
    },
    businessButton: {
        backgroundColor: "#007BFF",
    },
    hospitalButton: {
        backgroundColor: "#28A745",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ChooseBusiness;