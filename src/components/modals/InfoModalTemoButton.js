/**
 * InfoModalTemoButton
 * -------------------
 * Simple modal overlay presenting a title, message, and a single OK
 * action button.
 */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const InfoModalTemoButton = ({ title, message, onOkPress }) => (
  <View style={styles.overlay}>
    <View style={styles.card}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.p}>{message}</Text>
      <TouchableOpacity onPress={onOkPress} style={styles.btn}>
        <Text style={styles.btnText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000040",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  card: {
    padding: 20,
    backgroundColor: "#181C39",
    borderRadius: 15,
    minWidth: 250,
  },
  h1: {
    color: "#FFF",
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  p: {
    color: "#FFF",
    fontFamily: "MerriweatherSans-Light",
    marginBottom: 10,
  },
  btn: {
    alignSelf: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
  btnText: {
    fontFamily: "MerriweatherSans-Bold",
    color: "#181C39",
  },
});

export default InfoModalTemoButton;
