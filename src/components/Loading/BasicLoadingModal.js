/**
 * BasicLoadingModal
 * -------------------
 * Simple modal overlay presenting a title, message, and a single OK
 * action button.
 */
import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, Animated, Easing } from "react-native";
import { images } from "../../constants";

const BasicLoadingModal = ({ visible, customTitle, customMessage }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      spinValue.setValue(0);

      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start(() => startAnimation());
    };

    startAnimation();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
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
            style={[styles.logo, { transform: [{ rotate: spin }] }]}
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
    backgroundColor: "#00000040",
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
