/*
  LoggingOutModal
  ---------------
  Tiny confirm‑dialog that fades over the whole screen and asks “Yes / No”.
  Still just two callbacks – wire them to whatever you need.
*/

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const LoggingOutModal = ({ title, onYesPress, onNoPress }) => (
  <View style={styles.container}>
    <View style={styles.logOutModal}>
      <Text style={styles.h1}>{title}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={onNoPress}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onYesPress}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// styles kept intact ↓
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00000040",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  logOutModal: {
    backgroundColor: "#181C39",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  h1: {
    fontSize: 18,
    fontFamily: "MerriweatherSans-Bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  buttonText: { fontFamily: "MerriweatherSans-Bold", color: "#181C39" },
});

export default React.memo(LoggingOutModal);
