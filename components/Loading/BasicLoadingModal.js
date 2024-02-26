// LoadingModal.js
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { images } from "../../constants";

const BasicLoadingModal = ({ visible, customTitle, customMessage }) => {
  const spinValue = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0

  useEffect(() => {
    const startAnimation = () => {
      // First, reset the spin value to 0 to ensure it starts from the beginning
      spinValue.setValue(0);
      // Setup and start the infinite loop animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1, // Final value for rotation
          duration: 3000, // Duration for one complete rotation
          useNativeDriver: true, // Use native driver for better performance
          easing: Easing.linear, // This ensures the animation speed is constant
        })
      ).start(() => startAnimation()); // Restart animation after completion
    };

    startAnimation();
  }, [spinValue]);

  // Interpolate beginning and end values
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Rotate from 0 to 360 degrees
  });

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}} // This function needs to be defined for Android
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalWrapper}>
          <Animated.Image
            source={images.logo_icon}
            style={[styles.logo, { transform: [{ rotate: spin }] }]} // Apply the animated rotation here
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.h1}>{customTitle}</Text>
            <Text style={styles.h2}>{customMessage}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040", // Semi-transparent background
    padding: 5,
  },
  modalWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  logo: {
    width: 50,
    height: 50,
    marginEnd: 15,
  },
  textWrapper: {
    flexDirection: "Column",
  },
  h1: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
  },
  h2: {
    fontSize: 12,
    fontFamily: "MerriweatherSans-Regular",
    color: "#273176",
  },
});

export default BasicLoadingModal;
