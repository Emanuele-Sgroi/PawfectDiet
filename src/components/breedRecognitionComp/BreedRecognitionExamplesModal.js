/*
  BreedRecognitionExamplesModal
  -----------------------------
  Quick overlay showcasing good vs bad sample photos for breed recognition.
  Tap “Close” (or anywhere on the dimmed backdrop) to dismiss.
*/

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
} from "react-native";
import { images } from "../../constants";

const goodPics = [
  images.example_good_1,
  images.example_good_2,
  images.example_good_3,
  images.example_good_4,
];
const badPics = [
  images.example_bad_1,
  images.example_bad_2,
  images.example_bad_3,
  images.example_bad_4,
];

const BreedRecognitionExamplesModal = ({ onClosePress }) => (
  <View style={styles.container}>
    <Pressable style={styles.buttonClose} onPress={onClosePress}>
      <Text style={styles.buttonCloseText}>Close</Text>
    </Pressable>

    {[
      { data: goodPics, icon: images.yes },
      { data: badPics, icon: images.close },
    ].map(({ data, icon }, row) => (
      <View key={row} style={styles.imagesContainer}>
        {data.map((src, i) => (
          <View key={i} style={styles.imageContainer}>
            <ImageBackground
              source={src}
              resizeMode="cover"
              style={styles.image}
            >
              <Image source={icon} style={styles.icon} />
            </ImageBackground>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#00000040",
    position: "absolute",
    paddingTop: 10,
  },
  buttonClose: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonCloseText: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    marginBottom: 3,
  },
  imagesContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  icon: {
    width: 25,
    height: 25,
    position: "absolute",
    bottom: 5,
    right: 5,
  },
});

export default React.memo(BreedRecognitionExamplesModal);
