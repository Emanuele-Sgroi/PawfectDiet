/*
  SavedFoodScreen
  ---------------
  Placeholder screen while the real feature is being built. Keeps the same
  colour scheme so navigation feels consistent.
*/

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SavedFoodScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>This section is under development</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
  text: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#273176",
  },
});

export default React.memo(SavedFoodScreen);
