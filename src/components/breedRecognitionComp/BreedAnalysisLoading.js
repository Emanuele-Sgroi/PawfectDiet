/*
  BreedAnalysisLoading
  --------------------
  Full‑screen hold screen while TensorFlow chews on the photo.
  Just a sleeping dog gif + a few reassuring lines.
*/

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { images } from "../../constants";

const BreedAnalysisLoading = () => (
  <View style={styles.fullScreenOverlay}>
    <View style={styles.centeredContent}>
      <Image source={images.dog_sleeping} style={styles.image} />
      <View style={styles.textWrapper}>
        <Text style={styles.h1}>The system is analysing the breed…</Text>
        <Text style={styles.h2}>This might take a minute</Text>
      </View>
      <Text style={styles.h3}>
        Please keep this screen open until we’re done.
      </Text>
    </View>
  </View>
);

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
    backgroundColor: "#181C39",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 200, height: 105, marginBottom: 30 },
  textWrapper: { justifyContent: "center", alignItems: "center", gap: 5 },
  h1: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "MerriweatherSans-ExtraBold",
  },
  h2: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "MerriweatherSans-Regular",
  },
  h3: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "MerriweatherSans-Regular",
    textAlign: "center",
    maxWidth: "90%",
    marginTop: 50,
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
    color: "#FFFFFF",
    fontFamily: "MerriweatherSans-ExtraBold",
    marginBottom: 5,
  },
});

export default React.memo(BreedAnalysisLoading);
