import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const LoggingOutModal = ({ title, onYesPress, onNoPress }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.logOutModal}>
          <Text style={styles.h1}>{title}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onNoPress} style={styles.button}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onYesPress} style={styles.button}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00000040",
    height: "100%",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  logOutModal: {
    padding: 20,
    zIndex: 901,
    backgroundColor: "#181C39",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  h1: {
    zIndex: 902,
    color: "#fff",
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: "MerriweatherSans-Bold",
    color: "#181C39",
  },
});

export default LoggingOutModal;
