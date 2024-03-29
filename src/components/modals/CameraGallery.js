import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { images } from "../../constants/index";

const CameraGallery = ({ onGalleryPress, onCameraPress, onClosePress }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.button} onPress={onGalleryPress}>
            <Image source={images.gallery} style={styles.img} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onCameraPress}>
            <Image source={images.camera} style={styles.img} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.close} onPress={onClosePress}>
            <Icon name="close" color="red" size={20} />
          </TouchableOpacity>
        </View>
        <Pressable style={styles.touchableView} onPress={onClosePress} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  modal: {
    paddingHorizontal: 50,
    paddingVertical: 70,
    zIndex: 901,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    flexDirection: "row",
    gap: 50,
  },
  button: {
    padding: 15,
    backgroundColor: "#273176",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  img: {
    width: 35,
    height: 35,
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  touchableView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "#00000040",
  },
});

export default CameraGallery;
