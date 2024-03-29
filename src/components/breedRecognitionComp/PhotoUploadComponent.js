import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import AddIcon from "react-native-vector-icons/Ionicons";
import EmptyImg from "react-native-vector-icons/MaterialCommunityIcons";
import DeleteIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import CameraGallery from "../modals/CameraGallery";
import { storage } from "../../../firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Toast from "react-native-toast-message";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const PhotoUploadComponent = ({ onPhotosChange }) => {
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [isAddPressed, setIsAddPressed] = useState(false);

  const [progress, setProgress] = useState(0);

  const handleImageSelection = async (launchFunction) => {
    const userId = await SecureStore.getItemAsync("userId");
    const result = await launchFunction({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setIsAddPressed(false);
      const uri = result.assets[0].uri;
      const fileName = `${userId}/breedRecognitionTemp/${new Date().getTime()}`;
      if (uploadedPhoto) {
        // Delete the previous photo from Firebase before uploading a new one
        await deleteImageFromFirebase(uploadedPhoto.storagePath);
      }
      uploadImage(uri, fileName);
    }
  };

  const uploadImage = async (uri, fileName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.error("Upload error: ", error);
        onToastError("Upload failed");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadedPhoto({ uri: downloadURL, storagePath: fileName });
        onPhotosChange({ uri: downloadURL, storagePath: fileName });
      }
    );
  };

  const deleteImageFromFirebase = async (storagePath) => {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  };

  const deleteImage = async () => {
    if (uploadedPhoto && uploadedPhoto.storagePath) {
      await deleteImageFromFirebase(uploadedPhoto.storagePath);
      setUploadedPhoto(null);
      setProgress(0);
      onPhotosChange(null);
      onToastSuccess("Image deleted successfully");
    }
  };

  const onToastError = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const onToastSuccess = (message) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsAddPressed(true);
            }}
          >
            <AddIcon
              name="add-circle"
              size={32}
              color="#181C39"
              style={styles.addIcon}
            />
          </TouchableOpacity>
          <Text style={styles.h1}>Upload Photos</Text>
        </View>

        <View style={styles.photoContainer}>
          <View style={styles.box}>
            {!uploadedPhoto && !progress ? (
              // Render the pressable empty box if there is no uploaded photo and no progress
              <Pressable
                style={styles.emptyBox}
                onPress={() => setIsAddPressed(true)}
              >
                <EmptyImg
                  name="tooltip-image-outline"
                  size={40}
                  color="#181C39"
                  style={styles.emptyImage}
                />
              </Pressable>
            ) : progress > 0 && progress < 100 ? (
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
            ) : uploadedPhoto ? (
              // Render the uploaded photo and delete icon if there is an uploaded photo
              <>
                <Image
                  source={{ uri: uploadedPhoto.uri }}
                  style={styles.imageStyle}
                />
                <DeleteIcon
                  name="delete-circle-outline"
                  size={40}
                  color="#F14336"
                  style={styles.removeIcon}
                  onPress={deleteImage}
                />
              </>
            ) : null}
          </View>
        </View>
      </View>
      {isAddPressed && (
        <CameraGallery
          onGalleryPress={() =>
            handleImageSelection(ImagePicker.launchImageLibraryAsync)
          }
          onCameraPress={() =>
            handleImageSelection(ImagePicker.launchCameraAsync)
          }
          onClosePress={() => setIsAddPressed(false)}
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
  emptyImage: {
    opacity: 0.5,
  },
  addIcon: {
    marginEnd: 5,
  },
  h1: {
    fontFamily: "MerriweatherSans-Bold",
    color: "#000000",
    fontSize: 16,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});

export default PhotoUploadComponent;
