/**
 * ButtonGoogle
 * ------------
 * Google‑branded sign‑in / sign‑up button.
 */
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { images } from "../../constants";

const ButtonGoogle = ({ buttonType = "Login", onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <View style={styles.inner}>
      <Image source={images.google} style={styles.icon} />
      <Text style={styles.label}>{buttonType} with </Text>
      <Text style={styles.labelBold}>Google</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  inner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 46, height: 46, marginRight: 10 },
  label: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-Regular",
    color: "#7D7D7D",
  },
  labelBold: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#F14336",
  },
});

export default ButtonGoogle;
