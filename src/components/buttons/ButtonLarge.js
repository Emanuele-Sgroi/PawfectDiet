/**
 * ButtonLarge
 * -----------
 * Branded filled button. Shows an optional right arrow icon.
 */
import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const ButtonLarge = ({ buttonName, isThereArrow = false, onPress }) => (
  <TouchableHighlight
    underlayColor="#1d2245"
    onPress={onPress}
    style={styles.container}
  >
    <View style={styles.inner}>
      <Text style={styles.label}>{buttonName}</Text>
      {isThereArrow && (
        <FontAwesome6
          name="arrow-right-long"
          size={30}
          color="#FFFFFF"
          style={styles.icon}
        />
      )}
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#273176",
    width: "100%",
    height: 39,
    borderRadius: 20,
    marginVertical: 20,
  },
  inner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  label: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-Bold",
    color: "#FFFFFF",
  },
  icon: { marginLeft: 10 },
});

export default ButtonLarge;
