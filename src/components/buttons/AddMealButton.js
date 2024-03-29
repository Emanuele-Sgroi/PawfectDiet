import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const AddMealButton = ({ onPress, buttonName }) => {
  return (
    <TouchableHighlight
      underlayColor="#1d2245"
      onPress={onPress}
      style={styles.buttonContainer}
    >
      <View style={styles.buttonSubContainer}>
        <Icon
          name="add-circle-sharp"
          size={24}
          color="#FFFFFF"
          style={styles.iconStyle}
        />
        <Text style={styles.textButtonStyle}>{buttonName}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#273176",
    height: 40,
    borderRadius: 20,
  },
  buttonSubContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 2,
  },
  textButtonStyle: {
    fontSize: 16,
    fontFamily: "MerriweatherSans-Bold",
    textAlignVertical: "center",
    color: "#FFFFFF",
    includeFontPadding: false,
  },
  iconStyle: {
    marginRight: 10,
  },
});

export default AddMealButton;
