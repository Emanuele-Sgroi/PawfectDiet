import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { images } from "../../constants";

// Add props to the component
const ButtonBackAuth = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Icon
        name="arrow-back-ios"
        size={26}
        color="#181C39"
        style={styles.iconStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
    width: 35,
    height: 35,
    borderRadius: 100,
    zIndex: 999,
  },
  iconStyle: {
    padding: 0,
    includeFontPadding: false,
    marginLeft: 8,
  },
});

export default ButtonBackAuth;
