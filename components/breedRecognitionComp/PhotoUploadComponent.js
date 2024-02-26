import React, { useState } from "react";
import {
  View,
  Button,
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
import { CameraGallery } from "../index";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  getStorage,
  deleteObject,
} from "firebase/storage";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const PhotoUploadComponent = ({ onPhotosChange }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isAddPressed, setIsAddPressed] = useState(false);

  const [progress, setProgress] = useState(new Array(5).fill(0));

  const handleImageSelection = async (launchFunction) => {
    const userId = await SecureStore.getItemAsync("userId");
    let options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await launchFunction(options);

    if (!result.cancelled) {
      const uri = result.assets[0].uri;
      const fileName = `${userId}/breedRecognitionTemp/${new Date().getTime()}`;
      uploadImage(uri, fileName, uploadedPhotos.length);
    }
    setIsAddPressed(false);
  };

  // const uploadImage = async (uri, fileName, index) => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  //   const storageRef = ref(storage, fileName);

  //   const uploadTask = uploadBytesResumable(storageRef, blob);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setProgress((prevProgress) =>
  //         prevProgress.map((p, i) => (i === index ? prog : p))
  //       );
  //     },
  //     (error) => {
  //       onToastError("Error");
  //     },
  //     async () => {
  //       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //       setUploadedPhotos((prev) =>
  //         [...prev, { uri: downloadURL, storagePath: fileName }].slice(0, 5)
  //       );
  //       onPhotosChange([
  //         ...uploadedPhotos,
  //         { uri: downloadURL, storagePath: fileName },
  //       ]);
  //     }
  //   );
  // };

  // const deleteImage = async (index) => {
  //   const imageToDelete = uploadedPhotos[index];
  //   if (imageToDelete && imageToDelete.storagePath) {
  //     const fileRef = ref(storage, imageToDelete.storagePath);
  //     deleteObject(fileRef)
  //       .then(() => {
  //         setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  //         setProgress((prev) => prev.map((p, i) => (i === index ? 0 : p)));
  //         onToastSuccess("Image deleted successfully");
  //       })
  //       .catch((error) => {
  //         onToastError("Failed to delete the image");
  //       });
  //   }
  // };

  const uploadImage = async (uri, fileName, index) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress((prevProgress) =>
          prevProgress.map((p, i) => (i === index ? prog : p))
        );
      },
      (error) => {
        onToastError("Error");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newPhotos = [
          ...uploadedPhotos,
          { uri: downloadURL, storagePath: fileName },
        ].slice(0, 5);
        setUploadedPhotos(newPhotos);
        onPhotosChange(newPhotos); // Update the parent component with the new list of photos
      }
    );
  };

  const deleteImage = async (index) => {
    const imageToDelete = uploadedPhotos[index];
    if (imageToDelete && imageToDelete.storagePath) {
      const fileRef = ref(storage, imageToDelete.storagePath);
      deleteObject(fileRef)
        .then(() => {
          const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
          setUploadedPhotos(newPhotos);
          setProgress((prev) => prev.map((p, i) => (i === index ? 0 : p)));
          onPhotosChange(newPhotos); // Update the parent component with the new list of photos
          onToastSuccess("Image deleted successfully");
        })
        .catch((error) => {
          onToastError("Failed to delete the image");
        });
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
              if (uploadedPhotos.length < 5) {
                setIsAddPressed(true);
              } else {
                onToastError("You can upload a maximum of 5 images");
              }
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
          {Array.from({ length: 5 }).map((_, index) => {
            const photo = uploadedPhotos[index];
            const uploadProgress = progress[index];

            return (
              <View key={index} style={styles.box}>
                {uploadProgress && uploadProgress < 100 ? (
                  <AnimatedCircularProgress
                    size={50}
                    width={2}
                    fill={uploadProgress}
                    tintColor="#273176"
                    backgroundColor="#3d587500"
                  >
                    {(fill) => (
                      <Text style={{ color: "#273176" }}>{`${Math.round(
                        fill
                      )}%`}</Text>
                    )}
                  </AnimatedCircularProgress>
                ) : photo ? (
                  <>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.imageStyle}
                    />
                    <DeleteIcon
                      name="delete-circle-outline"
                      size={26}
                      color="#F14336"
                      style={styles.removeIcon}
                      onPress={() => deleteImage(index)}
                    />
                  </>
                ) : (
                  <Pressable
                    style={styles.emptyBox}
                    onPress={() => setIsAddPressed(true)}
                  >
                    <EmptyImg
                      name="tooltip-image-outline"
                      size={22}
                      color="#181C39"
                      style={styles.emptyImage}
                    />
                  </Pressable>
                )}
              </View>
            );
          })}
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
    paddingHorizontal: 15,
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
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  box: {
    flex: 0.2,
    height: 80,
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
