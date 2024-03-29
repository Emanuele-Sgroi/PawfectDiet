import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const AIFailsModal = ({ onPress, isFail, text }) => {
  return (
    <>
      {isFail && (
        <View style={styles.infoContainer}>
          <View style={styles.infoModal}>
            <Text style={styles.h1}>Ops! The AI made a mistake!!!</Text>
            <Text style={styles.p}>{text}</Text>
            <TouchableOpacity onPress={onPress} style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00000040",
    paddingVertical: 20,
    paddingHorizontal: 30,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  infoModal: {
    padding: 20,
    zIndex: 901,
    backgroundColor: "#181C39",
    borderRadius: 15,
  },
  h1: {
    zIndex: 902,
    color: "#fff",
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  h2: {
    marginTop: 5,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    color: "#F14336",
  },
  h2NoActive: {
    marginTop: 5,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    color: "#7D7D7D",
  },
  p: {
    zIndex: 902,
    color: "#fff",
    fontFamily: "MerriweatherSans-Light",
    marginBottom: 10,
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: "MerriweatherSans-Bold",
    color: "#181C39",
  },
});

export default AIFailsModal;
