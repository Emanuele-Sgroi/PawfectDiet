import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { images } from "../../constants/index";
import { CommonActions } from "@react-navigation/native";

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Text>MAIN SCREEN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181C39",
    padding: 10,
  },
});

export default MainScreen;
