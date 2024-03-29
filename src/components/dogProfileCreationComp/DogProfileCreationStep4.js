import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import ButtonLarge from "../buttons/ButtonLarge";
import CameraGallery from "../modals/CameraGallery";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { storage } from "../../../firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Toast from "react-native-toast-message";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { dogTaglines, images } from "../../constants/index";

const DogProfileCreationStep4 = ({ name, onSubmit, profileData }) => {
  const [profilePicture, setProfilePicture] = useState(
    profileData.profilePicture
  );
  const [tagLine, setTagLine] = useState(profileData.tagLine);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [userChangeProfilePicture, setUserChangeProfilePicture] =
    useState(false);
  const [isAddPressed, setIsAddPressed] = useState(false);
  const [progress, setProgress] = useState(0);

  const profilePadding =
    profilePicture ===
    "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083"
      ? 20
      : 0;

  const profilePaddingPreview =
    profilePicture ===
    "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083"
      ? 10
      : 0;

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
      const fileName = `${userId}/dogs/${name}/${new Date().getTime()}`;
      setUserChangeProfilePicture(true);
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
        setProfilePicture(downloadURL);
        onToastSuccess("Profile Picture Uploaded");
      }
    );
  };

  const deleteImageFromFirebase = async (storagePath) => {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  };

  const getRandomTagline = () => {
    const randomIndex = Math.floor(Math.random() * dogTaglines.length);
    setTagLine(dogTaglines[randomIndex]);
  };

  const handleFinishProfileCreation = () => {
    const step4Data = {
      profilePicture: profilePicture,
      tagLine: tagLine,
    };

    onSubmit(step4Data);
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
      <ScrollView style={styles.container} scrollEnabled={true}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.h1}>Almost Done!!!</Text>
            <Text style={styles.h2}>Personalise {name}'s profile.</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.h3, { alignSelf: "center" }]}>
              Add a profile picture
            </Text>
            <View style={styles.inputContainerImg}>
              <TouchableOpacity
                style={[
                  styles.profilePictureContainer,
                  { padding: profilePadding },
                ]}
                onPress={() => {
                  setIsAddPressed(true);
                }}
              >
                {!userChangeProfilePicture && (
                  <Image
                    style={styles.profilePicture}
                    source={{ uri: profilePicture }}
                  />
                )}
                {userChangeProfilePicture && (
                  <>
                    {progress > 0 && progress < 100 ? (
                      <AnimatedCircularProgress
                        size={80}
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
                    ) : (
                      <Image
                        style={styles.profilePicture}
                        source={{ uri: profilePicture }}
                      />
                    )}
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Give {name} a Tagline</Text>
            <View style={styles.tagLineContainer}>
              <Image style={styles.tagLineIcon} source={images.tagline} />
              <Text style={styles.tagLine}>{tagLine}</Text>
              <TouchableOpacity
                style={styles.tagLineRepeat}
                onPress={getRandomTagline}
              >
                <Image
                  style={styles.tagLineRepeatIcon}
                  source={images.repeat}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.previewContainer}>
            <View style={styles.previewBox}>
              <Text style={styles.h3}>Preview</Text>
              <View style={styles.previewActual}>
                <View
                  style={[
                    styles.previewImgContainer,
                    { padding: profilePaddingPreview },
                  ]}
                >
                  <Image
                    style={styles.previewProfilePicture}
                    source={{ uri: profilePicture }}
                  />
                </View>
                <View style={styles.previewLine}></View>
                <View style={styles.previewTextContainer}>
                  <Text style={styles.previewName}>{name}</Text>
                  <Text style={styles.previewTag}>{tagLine}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <ButtonLarge
              buttonName="Finish"
              isThereArrow={false}
              onPress={handleFinishProfileCreation}
            />
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "#E6ECFC",
    width: "100%",
    paddingVertical: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 15,
  },
  titleContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  inputContainerImg: {
    backgroundColor: "#D2DAF0",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 75,
    overflow: "hidden",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
    resizeMode: "cover",
  },
  tagLineContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#273176",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
  tagLineIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  tagLineRepeat: {
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  tagLineRepeatIcon: {
    width: 25,
    height: 25,
  },
  tagLine: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 15,
    color: "#000000",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: "#D2DAF0",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  h1: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 20,
    color: "#273176",
    marginBottom: 5,
  },
  h2: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#273176",
  },
  h3: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 18,
    color: "#273176",
    marginBottom: 5,
  },
  h4: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 15,
    color: "#7D7D7D",
    marginBottom: 5,
  },
  previewContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  previewBox: {
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  previewActual: {
    width: "100%",
    backgroundColor: "#273176",
    padding: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 20,
  },
  previewImgContainer: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 32.5,
    overflow: "hidden",
  },
  previewProfilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    resizeMode: "cover",
  },
  previewLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 15,
  },
  previewTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  previewName: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 20,
    color: "#fff",
  },
  previewTag: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 13,
    color: "#fff",
    opacity: 0.7,
  },
});

export default DogProfileCreationStep4;
