/*
  BreedRecognitionScreen
  ----------------------
  Upload a dog photo, run it through our tiny CNN (TensorFlow Lite converted)
  and show the top‑3 breed guesses.  User can accept, retry, or bail out.


*/

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import {
  bundleResourceIO,
  decodeJpeg,
  fetch as tfFetch,
} from "@tensorflow/tfjs-react-native";
import { ref, deleteObject } from "firebase/storage";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import { storage, db } from "../../../firebaseConfig";
import {
  TitleOnlyNavbar,
  BreedRecognitionExamplesModal,
  PhotoUploadComponent,
  ButtonLarge,
  BreedAnalysisLoading,
} from "../../components";

const { height: screenHeight } = Dimensions.get("window");
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

const DEFAULT_MODEL_JSON = require("../../beedRecognitionModel/model.json");
const DEFAULT_MODEL_WEIGHTS = require("../../beedRecognitionModel/weights.bin");

const BreedRecognitionScreen = ({ navigation }) => {
  // ─────────────────────── state
  const [showExamples, setShowExamples] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predView, setPredView] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [topBreed, setTopBreed] = useState("");

  const [model, setModel] = useState(null);

  // ─────────────────────── helpers
  const toast = (msg, type = "error") => Toast.show({ type, text1: msg });

  // Single model‑loader effect
  useEffect(() => {
    let mounted = true;
    (async () => {
      await tf.ready();
      const loaded = await tf.loadLayersModel(
        bundleResourceIO(DEFAULT_MODEL_JSON, DEFAULT_MODEL_WEIGHTS)
      );
      if (mounted) setModel(loaded);
    })();
    return () => (mounted = false);
  }, []);

  const preprocess = (tensor) =>
    tensor
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));

  const runPrediction = useCallback(
    async (uri) => {
      if (!model) return;
      try {
        const res = await tfFetch(uri, {}, { isBinary: true });
        const imgBuffer = await res.arrayBuffer();
        const imgTensor = decodeJpeg(new Uint8Array(imgBuffer));
        const pred = await model.predict(preprocess(imgTensor)).data();
        handlePredResult(pred);
      } catch (e) {
        console.error(e);
        toast("Prediction failed – try again");
        setLoading(false);
      }
    },
    [model]
  );

  const handlePredResult = (predArray) => {
    const arr = Array.from(predArray);
    // top‑3 formatted list
    const top3 = arr
      .map((p, i) => ({ breed: breedNames[i], p }))
      .sort((a, b) => b.p - a.p)
      .slice(0, 3)
      .map(({ breed, p }) => `${breed}: ${(p * 100).toFixed(2)}%`);
    setPredictions(top3);
    setTopBreed(top3[0].split(":")[0]);
    setLoading(false);
    setPredView(true);
  };

  const handleAnalyze = () => {
    if (!uploadedPhoto) return toast("Please upload a photo");
    setLoading(true);
    runPrediction(uploadedPhoto.uri);
  };

  // ─────────────────────── Firestore/Storage cleanup helpers (shared)
  const cleanupTempData = async () => {
    const uid = await SecureStore.getItemAsync("userId");
    const tempRef = doc(db, "users", uid, "breedRecognitionTemp", "tempData");
    try {
      (await getDoc(tempRef)).exists() && (await deleteDoc(tempRef));
    } catch {}
    if (uploadedPhoto)
      try {
        await deleteObject(ref(storage, uploadedPhoto.storagePath));
      } catch {}
    setUploadedPhoto(null);
  };

  const handleCancel = async () => {
    await cleanupTempData();
    navigation.navigate("DogProfileCreation");
  };

  const handleAgree = async () => {
    await cleanupTempData();
    navigation.navigate("DogProfileCreation", { breed: topBreed });
    toast("Breed updated", "success");
  };

  const handleTryAgain = async () => {
    await cleanupTempData();
    setPredView(false);
    setTopBreed("");
    setPredictions([]);
    toast("Please use a different photo");
  };

  // ─────────────────────── render helpers
  const routeExamples = () => (
    <BreedRecognitionExamplesModal
      onClosePress={() => setShowExamples(false)}
    />
  );

  // ─────────────────────── UI
  return (
    <>
      <TitleOnlyNavbar onBackPress={handleCancel} title="Breed Recognition" />
      <ScrollView style={styles.container}>
        {!predView ? (
          <View style={styles.contentContainer}>
            {/* intro */}
            <View style={styles.textContainer}>
              <Text style={styles.h1}>Help us identify your dog's breed</Text>
              <Text style={styles.p}>
                Upload a clear photo – full body, good lighting. We'll guess the
                breed.
              </Text>
              <TouchableOpacity onPress={() => setShowExamples(true)}>
                <Text style={styles.exampleText}>View Examples</Text>
              </TouchableOpacity>
            </View>

            {/* uploader */}
            <PhotoUploadComponent onPhotosChange={setUploadedPhoto} />
            <View style={{ width: "100%", paddingHorizontal: 15 }}>
              <ButtonLarge buttonName="Analyze Breed" onPress={handleAnalyze} />
            </View>
            <Pressable style={{ marginTop: 10 }} onPress={handleCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
            {showExamples && routeExamples()}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={[styles.h1, { marginTop: 20 }]}>
              Breed Identification Result
            </Text>
            {/* list of top breeds */}
            <View style={styles.resultContainer}>
              <View style={styles.listBreedsContainer}>
                {predictions.map((line, i) => {
                  const [breed, pct] = line.split(":");
                  return (
                    <View key={i} style={styles.listBreeds}>
                      <View style={styles.breedTextWrapper}>
                        <Text style={styles.breedText}>{breed.trim()}</Text>
                        <Text style={styles.breedText}>{pct.trim()}</Text>
                      </View>
                      {i < 2 && <View style={styles.line} />}
                    </View>
                  );
                })}
              </View>
              <View style={styles.textInfoContainer}>
                <Text style={styles.textInfo}>
                  Looks like a <Text style={styles.textInfo2}>{topBreed}</Text>.
                  Feeding for a <Text style={styles.textInfo2}>{topBreed}</Text>{" "}
                  should be safe, but always double‑check with your vet.
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.p,
                { marginVertical: 20, maxWidth: "90%", textAlign: "center" },
              ]}
            >
              Not happy? Try another photo.
            </Text>
            <View style={{ width: "100%", paddingHorizontal: 15 }}>
              <ButtonLarge buttonName="I agree" onPress={handleAgree} />
            </View>
            <Pressable style={styles.tryAgainWrapper} onPress={handleTryAgain}>
              <Text style={styles.tryAgainText}>Try Again</Text>
            </Pressable>
            <Pressable style={{ marginTop: 40 }} onPress={handleCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          </View>
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

export default React.memo(BreedRecognitionScreen);
