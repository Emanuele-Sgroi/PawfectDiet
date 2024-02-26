import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { images } from "../../constants";

const ButtonGoogle = ({ buttonType, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.buttonSubContainer}>
        <Image source={images.google} style={styles.iconStyle} />
        <Text style={styles.textButtonStyle}>{buttonType} with </Text>
        <Text style={styles.textButtonStyle2}>Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: "auto",
    marginVertical: 10,
  },
  buttonSubContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    height: "auto",
  },
  iconStyle: {
    marginRight: 10,
    width: 46,
    height: 46,
  },
  textButtonStyle: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-Regular",
    padding: 0,
    textAlignVertical: "center",
    color: "#7D7D7D",
    includeFontPadding: false,
  },
  textButtonStyle2: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    padding: 0,
    textAlignVertical: "center",
    color: "#F14336",
    includeFontPadding: false,
  },
});

export default ButtonGoogle;
