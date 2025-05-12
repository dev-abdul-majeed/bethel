import { useEffect, useState } from "react";
import { Button, Input, Image, XStack, Label, YStack } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import {
  getDoctorData,
  uploadDoctorToFirebase,
} from "../services/firebaseUtils";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, SafeAreaView, StyleSheet } from "react-native";

const DoctorRegistration = ({ navigation, route }) => {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    experience: "",
    photo: "",
    about: "",
  });
  const [loading, setLoading] = useState(false); // New loading state
  const { hospitalId, doctorId } = route.params;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (route.params && route.params.doctorId) {
        try {
          const doctorData = await getDoctorData(doctorId);

          if (doctorData) {
            setForm({
              name: doctorData.data.name || "",
              specialization: doctorData.data.specialization || "",
              experience: doctorData.data.experience || "",
              photo: doctorData.data.photo || "",
              about: doctorData.data.about || "",
            });
          }
        } catch (error) {
          Alert.alert("Error", "Could not load doctor data.");
        }
      }
    };
    fetchDoctorData();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        handleChange("photo", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error selecting image.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true
    try {
      await uploadDoctorToFirebase(form, hospitalId, doctorId);
      Alert.alert("Success", "Doctor registered successfully!");
      setForm({
        name: "",
        specialization: "",
        experience: "",
        photo: "",
        about: "",
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving doctor data.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const isFormComplete = Object.values(form).every((val) => val !== "");

  const renderLabelWithIcon = (iconName, labelText) => (
    <XStack alignItems="center" gap="$2">
      <Icon name={iconName} size={30} color={"rgb(9, 99, 159)"} />
      <Label size={"$5"}>{labelText}</Label>
    </XStack>
  );

  return (
    <KeyboardAwareScrollView style={styles.view}>
      <YStack padding="$4" space="$2">
        {renderLabelWithIcon("person-outline", "Full Name")}
        <Input
          placeholder="Full Name"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        {renderLabelWithIcon("medkit-outline", "Specialization")}
        <Input
          placeholder="Specialization"
          value={form.specialization}
          onChangeText={(text) => handleChange("specialization", text)}
        />

        {renderLabelWithIcon("time-outline", "Experience (in years)")}
        <Input
          placeholder="Experience"
          value={form.experience}
          onChangeText={(text) => handleChange("experience", text)}
          keyboardType="numeric"
        />

        {renderLabelWithIcon("image-outline", "Photo")}
        {form.photo ? (
          <Image height={200} source={{ uri: form.photo }} />
        ) : null}
        <Button
          onPress={handlePickImage}
          icon={<Icon name="add-circle" size={30} />}
          backgroundColor={"rgb(192, 235, 216)"}
          maxWidth={"$7"}
        ></Button>

        {renderLabelWithIcon("information-circle-outline", "About")}
        <Input
          placeholder="Write about the doctor..."
          value={form.about}
          onChangeText={(text) => handleChange("about", text)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Button onPress={handleSubmit} disabled={!isFormComplete || loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </YStack>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: "white",
  },
});

export default DoctorRegistration;
