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
  SafeAreaView,
  Image,
} from "react-native";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { BlurView } from "expo-blur";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { images } from "../../constants/index";

const BreedAnalysisLoading = ({ onDiscardPress }) => {
  const [loading, setLoading] = useState(false);
  const [analysingProgress, setAnalysisngProgress] = useState(65);

  return (
    <View style={styles.fullScreenOverlay}>
      <BlurView intensity={100} style={styles.fullScreenOverlay} tint="dark">
        <View style={styles.centeredContent}>
          <AnimatedCircularProgress
            size={150}
            width={10}
            fill={analysingProgress}
            tintColor="#ffffff"
            backgroundColor="#3d587500"
          >
            {(fill) => (
              <Text style={styles.progressText}>{`${Math.round(fill)}%`}</Text>
            )}
          </AnimatedCircularProgress>
          <Image source={images.dog_sleeping} style={styles.image} />
          <View style={styles.textWrapper}>
            <Text style={styles.h1}>The system is analysing the breed...</Text>
            <Text style={styles.h2}>This process might take a while</Text>
          </View>
          <TouchableOpacity
            underlayColor="#1d2245"
            onPress={onDiscardPress}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#181C3999",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  progressText: {
    fontSize: 30,
    color: "#fff",
    fontFamily: "MerriweatherSans-ExtraBold",
  },
  image: {
    width: 200,
    height: 105,
  },
  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  h1: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "MerriweatherSans-ExtraBold",
  },
  h2: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "MerriweatherSans-Regular",
  },
  buttonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F14336",
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "MerriweatherSans-ExtraBold",
    marginBottom: 5,
  },
});

export default BreedAnalysisLoading;
