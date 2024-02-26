import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import {
  TitleOnlyNavbar,
  BreedRecognitionExamplesModal,
  PhotoUploadComponent,
  SizeSelectionComponent,
  ButtonLarge,
  BreedAnalysisLoading,
} from "../../components/index";
import Toast from "react-native-toast-message";
import { storage, db } from "../../firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { doc, setDoc, collection } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";

const screenHeight = Dimensions.get("window").height;

const BreedRecognitionScreen = ({ navigation }) => {
  const [showExamples, setShowExamples] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePhotosChange = (photos) => {
    console.log("Updated photos in parent component:", photos);
    setUploadedPhotos(photos); // Update the state in the parent component
  };

  const handleSizeSelection = (size) => {
    console.log("Selected size:", size);
    setSelectedSize(size);
  };

  const handleAnalyzeBreedButton = () => {
    if (uploadedPhotos.length < 3) {
      onToastError("You need to upload a minimum of 3 images");
    } else {
      if (selectedSize === "") {
        onToastError("Select dog size please");
      } else {
        uploadPhase();
      }
    }
  };

  const uploadPhase = async () => {
    setLoading(true);
    const userId = await SecureStore.getItemAsync("userId");

    try {
      const tempDocRef = doc(
        db,
        "users",
        userId,
        "breedRecognitionTemp",
        "tempData"
      );
      await setDoc(
        tempDocRef,
        {
          uploadedPhotos: uploadedPhotos,
          selectedSize: selectedSize,
        },
        { merge: true }
      );
    } catch (error) {
      console.log("error -->", error.message);
    }
  };

  const handleCancel = async () => {
    // Delete uploaded photos from Firebase Storage
    for (const photo of uploadedPhotos) {
      const photoRef = ref(storage, photo.storagePath);
      try {
        await deleteObject(photoRef);
        console.log(`Deleted photo: ${photo.storagePath}`);
      } catch (error) {
        console.error(`Failed to delete photo: ${photo.storagePath}`, error);
      }
    }

    // Clear local state
    setUploadedPhotos([]);
    setSelectedSize("");

    // Navigate back to Dog Profile Creation
    navigation.navigate("DogProfileCreation");
  };

  const handleDiscard = () => {
    setLoading(false);
  };

  const onToastError = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };
  return (
    <>
      <TitleOnlyNavbar
        onBackPress={() => {
          navigation.navigate("DogProfileCreation");
        }}
        title="Breed Recognition"
      />
      <ScrollView style={styles.container} scrollEnabled={true}>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.h1}>Help us identify your dog's breed</Text>
            <Text style={styles.p}>
              Upload between 3 to 5 photos of your dog. Make sure to do not
              choose images that are too dark and make sure the full body of
              your dog is visible.{" "}
            </Text>
            <TouchableOpacity onPress={() => setShowExamples(true)}>
              <Text style={styles.exampleText}>View Examples</Text>
            </TouchableOpacity>
          </View>
          <PhotoUploadComponent onPhotosChange={handlePhotosChange} />
          <SizeSelectionComponent onSizeSelection={handleSizeSelection} />
          <View style={{ width: "100%", paddingHorizontal: 15 }}>
            <ButtonLarge
              isThereArrow={false}
              buttonName="Analyze Breed"
              onPress={() => handleAnalyzeBreedButton()}
            />
          </View>
          <Pressable style={{ marginTop: 10 }} onPress={handleCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          {showExamples && (
            <BreedRecognitionExamplesModal
              onClosePress={() => setShowExamples(false)}
            />
          )}
        </View>
      </ScrollView>
      {loading && <BreedAnalysisLoading onDiscardPress={handleDiscard} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6ECFC",
  },
  contentContainer: {
    width: "100%",
    minHeight: screenHeight - 70,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  h1: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 20,
    color: "#273176",
    marginBottom: 10,
  },
  p: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#273176",
    marginBottom: 10,
  },
  exampleText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 16,
    color: "#F14336",
    textDecorationLine: "underline",
  },
  cancel: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 18,
    color: "#7D7D7D",
  },
});

export default BreedRecognitionScreen;
