/*
  PhotoUploadComponent
  --------------------
  One‑photo uploader for the breed recognition flow. Handles gallery/camera
  pick, progress ring, Firebase upload, delete, and passes the result back
  up via `onPhotosChange`.
*/

import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Toast from "react-native-toast-message";

import CameraGallery from "../modals/CameraGallery";
import { storage } from "../../../firebaseConfig";

const PhotoUploadComponent = ({ onPhotosChange }) => {
  // ── state
  const [file, setFile] = useState(null); // { uri, storagePath }
  const [pickerVisible, setPickerVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // ── toast helpers
  const toast = (msg, type = "error") => Toast.show({ type, text1: msg });

  // ── image pick + upload
  const pickImage = async (launcher) => {
    const userId = await SecureStore.getItemAsync("userId");
    const res = await launcher({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (res.cancelled) return;

    setPickerVisible(false);
    const uri = res.assets[0].uri;
    const storagePath = `${userId}/breedRecognitionTemp/${Date.now()}`;

    if (file) await deleteObject(ref(storage, file.storagePath)); // cleanup previous
    upload(uri, storagePath);
  };

  const upload = async (uri, storagePath) => {
    const blob = await (await fetch(uri)).blob();
    const task = uploadBytesResumable(ref(storage, storagePath), blob);
    task.on(
      "state_changed",
      (s) => setProgress((s.bytesTransferred / s.totalBytes) * 100),
      () => toast("Upload failed"),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        const uploaded = { uri: url, storagePath };
        setFile(uploaded);
        onPhotosChange(uploaded);
        setProgress(0);
      }
    );
  };

  // ── delete
  const deleteCurrent = async () => {
    if (!file) return;
    await deleteObject(ref(storage, file.storagePath));
    setFile(null);
    onPhotosChange(null);
    toast("Image deleted", "success");
  };

  // ── UI
  return (
    <>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setPickerVisible(true)}>
            <Ionicons
              name="add-circle"
              size={32}
              color="#181C39"
              style={styles.addIcon}
            />
          </TouchableOpacity>
          <Text style={styles.h1}>Upload Photos</Text>
        </View>

        {/* preview / progress */}
        <View style={styles.photoContainer}>
          <View style={styles.box}>
            {!file && progress === 0 && (
              <Pressable
                style={styles.emptyBox}
                onPress={() => setPickerVisible(true)}
              >
                <MaterialCommunityIcons
                  name="tooltip-image-outline"
                  size={40}
                  color="#181C39"
                  style={styles.emptyImage}
                />
              </Pressable>
            )}
            {progress > 0 && progress < 100 && (
              <AnimatedCircularProgress
                size={50}
                width={2}
                fill={progress}
                tintColor="#273176"
                backgroundColor="#3d587500"
              >
                {(fill) => (
                  <Text style={{ color: "#273176" }}>{`${Math.round(
                    fill
                  )}%`}</Text>
                )}
              </AnimatedCircularProgress>
            )}
            {file && progress === 0 && (
              <>
                <Image source={{ uri: file.uri }} style={styles.imageStyle} />
                <MaterialCommunityIcons
                  name="delete-circle-outline"
                  size={40}
                  color="#F14336"
                  style={styles.removeIcon}
                  onPress={deleteCurrent}
                />
              </>
            )}
          </View>
        </View>
      </View>

      {pickerVisible && (
        <CameraGallery
          onGalleryPress={() => pickImage(ImagePicker.launchImageLibraryAsync)}
          onCameraPress={() => pickImage(ImagePicker.launchCameraAsync)}
          onClosePress={() => setPickerVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D2DAF0",
    marginTop: 15,
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  photoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  box: {
    flex: 1,
    height: 300,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBox: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  emptyImage: { opacity: 0.5 },
  addIcon: { marginEnd: 5 },
  h1: { fontFamily: "MerriweatherSans-Bold", color: "#000000", fontSize: 16 },
  imageStyle: { width: "100%", height: "100%", resizeMode: "cover" },
  removeIcon: { position: "absolute", bottom: 0, right: 0 },
});

export default React.memo(PhotoUploadComponent);
