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
  ImageBackground,
  Image,
} from "react-native";
import { images } from "../../constants/index";

const BreedRecognitionExamplesModal = ({ onClosePress }) => {
  const goodExamples = [
    images.example_good_1,
    images.example_good_2,
    images.example_good_3,
    images.example_good_4,
  ];
  const badExamples = [
    images.example_bad_1,
    images.example_bad_2,
    images.example_bad_3,
    images.example_bad_4,
  ];

  return (
    <View style={styles.container}>
      <Pressable style={styles.buttonClose} onPress={onClosePress}>
        <Text style={styles.buttonCloseText}>Close</Text>
      </Pressable>
      <View style={styles.imagesContainer}>
        {goodExamples.map((img, index) => {
          return (
            <View key={index} style={styles.imageContainer}>
              <ImageBackground
                source={img}
                resizeMode="cover"
                style={styles.image}
              >
                <Image source={images.yes} style={styles.icon} />
              </ImageBackground>
            </View>
          );
        })}
      </View>
      <View style={styles.imagesContainer}>
        {badExamples.map((img, index) => {
          return (
            <View key={index} style={styles.imageContainer}>
              <ImageBackground
                source={img}
                resizeMode="cover"
                style={styles.image}
              >
                <Image source={images.close} style={styles.icon} />
              </ImageBackground>
            </View>
          );
        })}
      </View>
    </View>
  );
};

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

export default BreedRecognitionExamplesModal;
