import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import {
  TitleOnlyNavbar,
  BreedRecognitionExamplesModal,
  PhotoUploadComponent,
  ButtonLarge,
  BreedAnalysisLoading,
} from "../../components/index";
import Toast from "react-native-toast-message";
import { storage, db } from "../../../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import {
  bundleResourceIO,
  decodeJpeg,
  fetch,
} from "@tensorflow/tfjs-react-native";

const screenHeight = Dimensions.get("window").height;

const BreedRecognitionScreen = ({ navigation }) => {
  const [showExamples, setShowExamples] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionView, setPredictionView] = useState(false);
  const [model, setModel] = useState(null);
  const [breedsPredicted, setBreedPredicted] = useState([]);
  const [highestBreedPredicted, setHighestBreedPredicted] = useState("");

  const breedNames = [
    "Pomeranian",
    "Golden Retriever",
    "Beagle",
    "Chihuahua",
    "Maltese",
    "Pekinese",
    "Basset",
    "Jack Russell Terrier",
    "German Shepherd",
    "Labrador",
    "Doberman",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      await tf.ready();
      const modelJson = require("../../beedRecognitionModel/model.json");
      const modelWeights = require("../../beedRecognitionModel/weights.bin");
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );
      if (isMounted) {
        setModel(model);
        //console.log("Model loaded successfully");
      }
    };

    loadModel();

    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, []);

  function processPrediction(prediction) {
    const predictedIndex = prediction.indexOf(Math.max(...prediction));
    return breedNames[predictedIndex];
  }

  function processTopPredictions(predictions, topK = 3) {
    const predictionArray = Array.isArray(predictions)
      ? predictions
      : Array.from(predictions);

    const breedProbabilities = predictionArray.map((probability, index) => ({
      breed: breedNames[index],
      probability,
    }));

    const sortedByProbability = breedProbabilities.sort(
      (a, b) => b.probability - a.probability
    );

    const topPredictions = sortedByProbability.slice(0, topK);

    const formattedPredictions = topPredictions.map(
      (prediction) =>
        `${prediction.breed}: ${(prediction.probability * 100).toFixed(2)}%`
    );

    return formattedPredictions;
  }

  async function predictImage(imageUrl) {
    if (!model) {
      // console.log("Model is not loaded.");
      return;
    }

    try {
      L;
      const response = await fetch(imageUrl, {}, { isBinary: true });
      const imageData = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(imageData));

      const processedTensor = preprocessImage(imageTensor);

      const prediction = await model.predict(processedTensor).data();

      const predictedBreed = processPrediction(prediction);
      const topPredictions = processTopPredictions(prediction);
      setBreedPredicted(topPredictions);
      setHighestBreedPredicted(predictedBreed);
      setPredictionView(true);
    } catch (error) {
      console.error("Prediction error:", error);
      clearInterval(intervalId);
      onToastError("Failed. Please try again");
    } finally {
      setLoading(false);
    }
  }

  function preprocessImage(imageTensor) {
    return imageTensor
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));
  }

  const handlePhotosChange = (photo) => {
    // console.log("Updated photos in parent component:", photo);
    setUploadedPhoto(photo);
  };

  const handleAnalyzeBreedButton = () => {
    if (uploadedPhoto === null) {
      onToastError("Please upload a photo");
    } else {
      setLoading(true);
      predictImage(uploadedPhoto.uri);
    }
  };

  const handleCancel = async () => {
    const userId = await SecureStore.getItemAsync("userId");

    const tempDocRef = doc(
      db,
      "users",
      userId,
      "breedRecognitionTemp",
      "tempData"
    );
    try {
      const docSnap = await getDoc(tempDocRef);
      if (docSnap.exists()) {
        await deleteDoc(tempDocRef);
        //console.log("Deleted document in Firestore");
      } else {
        // console.log("No document to delete in Firestore");
      }
    } catch (error) {
      console.error("Failed to delete document in Firestore", error);
    }

    if (uploadedPhoto) {
      const photoRef = ref(storage, uploadedPhoto.storagePath);
      try {
        await deleteObject(photoRef);
        //console.log(`Deleted photo: ${uploadedPhoto.storagePath}`);
      } catch (error) {
        console.error(
          `Failed to delete photo: ${uploadedPhoto.storagePath}`,
          error
        );
      }
    }
    setUploadedPhoto(null);
    navigation.navigate("DogProfileCreation");
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

  const handleAgree = async () => {
    const userId = await SecureStore.getItemAsync("userId");

    const tempDocRef = doc(
      db,
      "users",
      userId,
      "breedRecognitionTemp",
      "tempData"
    );
    try {
      const docSnap = await getDoc(tempDocRef);
      if (docSnap.exists()) {
        await deleteDoc(tempDocRef);
        // console.log("Deleted document in Firestore");
      } else {
        //  console.log("No document to delete in Firestore");
      }
    } catch (error) {
      console.error("Failed to delete document in Firestore", error);
    }

    if (uploadedPhoto) {
      const photoRef = ref(storage, uploadedPhoto.storagePath);
      try {
        await deleteObject(photoRef); // Delete the photo from Firebase Storage
        //console.log(`Deleted photo: ${uploadedPhoto.storagePath}`);
      } catch (error) {
        console.error(
          `Failed to delete photo: ${uploadedPhoto.storagePath}`,
          error
        );
      }
    }

    setUploadedPhoto(null);

    navigation.navigate("DogProfileCreation", {
      breed: highestBreedPredicted,
    });

    onToastSuccess("Breed updated");
  };

  const handleTryAgain = async () => {
    setPredictionView(false);
    const userId = await SecureStore.getItemAsync("userId");

    const tempDocRef = doc(
      db,
      "users",
      userId,
      "breedRecognitionTemp",
      "tempData"
    );
    try {
      const docSnap = await getDoc(tempDocRef);
      if (docSnap.exists()) {
        await deleteDoc(tempDocRef); // Delete the document from Firestore
        //console.log("Deleted document in Firestore");
      } else {
        // console.log("No document to delete in Firestore");
      }
    } catch (error) {
      console.error("Failed to delete document in Firestore", error);
    }

    if (uploadedPhoto) {
      const photoRef = ref(storage, uploadedPhoto.storagePath);
      try {
        await deleteObject(photoRef); // Delete the photo from Firebase Storage
        // console.log(`Deleted photo: ${uploadedPhoto.storagePath}`);
      } catch (error) {
        console.error(
          `Failed to delete photo: ${uploadedPhoto.storagePath}`,
          error
        );
      }
    }

    setUploadedPhoto(null);
    onToastError("Please use a different photo");
    setHighestBreedPredicted("");
    setBreedPredicted([]);
  };

  return (
    <>
      <TitleOnlyNavbar onBackPress={handleCancel} title="Breed Recognition" />
      <ScrollView style={styles.container} scrollEnabled={true}>
        {!predictionView ? (
          <>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.h1}>Help us identify your dog's breed</Text>
                <Text style={styles.p}>
                  Use the button below to upload a photo of your dog. Make sure
                  to do not choose images that are too dark and make sure the
                  full body of your dog is visible.{" "}
                </Text>
                <TouchableOpacity onPress={() => setShowExamples(true)}>
                  <Text style={styles.exampleText}>View Examples</Text>
                </TouchableOpacity>
              </View>
              <PhotoUploadComponent onPhotosChange={handlePhotosChange} />
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
          </>
        ) : (
          <>
            <View style={styles.contentContainer}>
              <Text style={[styles.h1, { marginTop: 20 }]}>
                Breed Identification Result{" "}
              </Text>
              <View style={styles.resultContainer}>
                <View style={styles.listBreedsContainer}>
                  {breedsPredicted.map((breed, index) => {
                    const match = breed.match(/(\d+(\.\d+)?%)/);
                    const matchText = breed.match(/^(.*?):/);
                    const percentage = match[0];
                    const breedName = matchText[1].trim();

                    return (
                      <View style={styles.listBreeds} key={index}>
                        <View style={styles.breedTextWrapper}>
                          <Text style={styles.breedText}>{breedName}</Text>
                          <Text style={styles.breedText}>{percentage}</Text>
                        </View>
                        {index < 2 && <View style={styles.line}></View>}
                      </View>
                    );
                  })}
                </View>
                <View style={styles.textInfoContainer}>
                  <Text style={styles.textInfo}>
                    It appears your furry friend shares strong traits of a{" "}
                    <Text style={styles.textInfo2}>
                      {highestBreedPredicted}
                    </Text>
                    . Feeding your dog with a diet tailored for a{" "}
                    <Text style={styles.textInfo2}>
                      {highestBreedPredicted}
                    </Text>{" "}
                    should be save. However, we reccomend to ask your vet for
                    more accurate information about your dog's breed.
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.p,
                  { marginVertical: 20, maxWidth: "90%", textAlign: "center" },
                ]}
              >
                If you are unhappy with the result, please try again with a
                different photo.
              </Text>
              <View style={{ width: "100%", paddingHorizontal: 15 }}>
                <ButtonLarge
                  isThereArrow={false}
                  buttonName="I agree"
                  onPress={handleAgree}
                />
              </View>
              <Pressable
                style={styles.tryAgainWrapper}
                onPress={handleTryAgain}
              >
                <Text style={styles.tryAgainText}>Try Again</Text>
              </Pressable>
              <Pressable style={{ marginTop: 40 }} onPress={handleCancel}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
      {loading && <BreedAnalysisLoading />}
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
  resultContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    elevation: 10,
    marginTop: 20,
  },
  listBreedsContainer: {
    backgroundColor: "#ffffff",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  listBreeds: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  breedTextWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breedText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 16,
    color: "#000000",
    marginVertical: 5,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#7D7D7D",
    alignSelf: "center",
  },
  textInfoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#273176",
  },
  textInfo: {
    textAlign: "center",
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#ffffff",
  },
  textInfo2: {
    textAlign: "center",
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#ffffff",
  },
  tryAgainWrapper: {
    marginTop: 30,
  },
  tryAgainText: {
    textAlign: "center",
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#273176",
    textDecorationLine: "underline",
  },
});

export default BreedRecognitionScreen;
