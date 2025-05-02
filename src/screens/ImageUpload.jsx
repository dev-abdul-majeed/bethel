import React, { useState } from "react";

import { View, Button, Image, Text, ActivityIndicator } from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../services/firebase";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [uploadStatus, setUploadStatus] = useState("");

  const [downloadUrl, setDownloadUrl] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: false,

      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);

      setUploadStatus("");

      setDownloadUrl("");
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);

      const imageName = `user_Images/${Date.now()}_${image.uri
        .split("/")
        .pop()}`;

      const storageRef = ref(getStorage(), imageName);

      const blob = await (await fetch(image.uri)).blob();

      // DO NOT await here

      const uploadTask = uploadBytesResumable(storageRef, blob);

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

        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          setUploading(false);

          setUploadStatus("Upload complete!");

          setDownloadUrl(downloadURL);

          // console.log("File available at:", downloadURL);
        }
      );
    } catch (error) {
      setUploading(false);

      setUploadStatus("Error: " + error.message);

      // console.log(error.message);
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

      {downloadUrl !== "" && (
        <Text selectable style={{ marginTop: 10, color: "blue" }}>
          {downloadUrl}
        </Text>
      )}
    </View>
  );
};

export default ImageUpload;
