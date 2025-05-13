import { useEffect, useState } from "react";
import { Button, Input, Image, XStack, Label, YStack, Spinner } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import {
  getDoctorData,
  uploadDoctorToFirebase,
} from "../services/firebaseUtils";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, View, StyleSheet } from "react-native";
import TopNavHeader from "../components/shared/TopNavHeader";
import { Ionicons } from "@expo/vector-icons";
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
          setLoading(true);
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
        } finally {
          setLoading(false);
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
      navigation.pop();
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
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      style={styles.view}
      getTextInputRefs={() => {
        return [this._textInputRef];
      }}
    >
      <View>
        <TopNavHeader text={"Doctors Form"} />
        <YStack gap="$2" paddingHorizontal={15}>
          {loading && <Spinner size="large" />}
          {renderLabelWithIcon("person-outline", "Full Name")}
          <Input
            placeholder="Full Name"
            backgroundColor={"white"}
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          {renderLabelWithIcon("medkit-outline", "Specialization")}
          <Input
            placeholder="Specialization"
            backgroundColor={"white"}
            value={form.specialization}
            onChangeText={(text) => handleChange("specialization", text)}
          />

          {renderLabelWithIcon("time-outline", "Experience (in years)")}
          <Input
            placeholder="Experience"
            backgroundColor={"white"}
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
            icon={<Icon name="add-circle" size={30} color={"white"} />}
            backgroundColor={"rgb(9, 99, 159)"}
            maxWidth={"$6"}
          ></Button>

          {renderLabelWithIcon("information-circle-outline", "About")}
          <Input
            placeholder="Write about the doctor..."
            backgroundColor={"white"}
            value={form.about}
            onChangeText={(text) => handleChange("about", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Button
            width={150}
            alignSelf="center"
            marginTop={40}
            onPress={handleSubmit}
            disabled={!isFormComplete || loading}
            backgroundColor="rgb(4, 197, 149)"
            textProps={{ color: "white" }}
            icon={
              loading ? (
                () => <Spinner size="large" color="white" />
              ) : (
                <Ionicons name="enter" size={20} color="white" />
              )
            }
          >
            {loading ? "" : "Submit"}
          </Button>
        </YStack>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: "white",
    paddingBottom: 50,
    marginBottom: 50,
  },
});

export default DoctorRegistration;
