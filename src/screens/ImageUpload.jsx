import React, { useState } from "react";

import { View, Button, Image, Text, ActivityIndicator } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [uploadStatus, setUploadStatus] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,

      allowsEditing: false,

      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);

      setUploadStatus("");
    }
  };

  const uploadImageToStorage = async (image, prefix) => {
    if (!image || !image.uri) throw new Error("Invalid image object");

    const imageName = `${prefix}Images/${Date.now()}_${image.uri
      .split("/")
      .pop()}`;

    const storageRef = ref(getStorage(), imageName);

    const blob = await (await fetch(image.uri)).blob();

    return await uploadBytesResumable(storageRef, blob);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);

      const uploadTask = await uploadImageToStorage(image, "user_");

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setUploadStatus(`Uploading... ${progress.toFixed(0)}%`);
        },

        (error) => {
          setUploading(false);

          setUploadStatus("Upload failed: " + error.message);
        },

        () => {
          setUploading(false);

          setUploadStatus("Upload complete!");
        }
      );
    } catch (error) {
      setUploading(false);

      setUploadStatus("Error: " + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick an Image" onPress={pickImage} />

      {image && (
        <View style={{ marginVertical: 20 }}>
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200, resizeMode: "contain" }}
          />
        </View>
      )}

      {image && (
        <Button
          title="Upload Image"
          onPress={handleUpload}
          disabled={uploading}
        />
      )}

      {uploading && <ActivityIndicator size="large" color="#0000ff" />}

      {uploadStatus !== "" && (
        <Text style={{ marginTop: 20 }}>{uploadStatus}</Text>
      )}
    </View>
  );
};

export default ImageUpload;
