import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

const ButtonLarge = ({ buttonName, isThereArrow, onPress }) => {
  return (
    <TouchableHighlight
      underlayColor="#1d2245"
      onPress={onPress}
      style={styles.buttonContainer}
    >
      <View style={styles.buttonSubContainer}>
        <Text style={styles.textButtonStyle}>{buttonName}</Text>
        {isThereArrow && (
          <Icon
            name="arrow-right-long"
            size={30}
            color="#FFFFFF"
            style={styles.iconStyle}
          />
        )}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#273176",
    width: "100%",
    height: 39,
    borderRadius: 20,
    marginVertical: 10,
    marginTop: 20,
  },
  buttonSubContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textButtonStyle: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-Bold",
    padding: 0,
    textAlignVertical: "center",
    color: "#FFFFFF",
    includeFontPadding: false,
  },
  iconStyle: {
    marginLeft: 10,
  },
});

export default ButtonLarge;
