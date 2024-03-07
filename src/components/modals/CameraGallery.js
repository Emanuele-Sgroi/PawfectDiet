/*
  CameraGallery
  -------------
  Tiny overlay: choose Gallery or Camera, or hit the red X to bail out.
*/

import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { images } from "../../constants";

const CameraGallery = ({ onGalleryPress, onCameraPress, onClosePress }) => (
  <View style={styles.container}>
    {/* modal */}
    <View style={styles.modal}>
      {[
        { img: images.gallery, fn: onGalleryPress },
        { img: images.camera, fn: onCameraPress },
      ].map(({ img, fn }) => (
        <TouchableOpacity key={img} style={styles.button} onPress={fn}>
          <Image source={img} style={styles.img} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.close} onPress={onClosePress}>
        <AntDesign name="close" color="red" size={20} />
      </TouchableOpacity>
    </View>
    {/* dim background */}
    <Pressable style={styles.touchableView} onPress={onClosePress} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  modal: {
    paddingHorizontal: 50,
    paddingVertical: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    gap: 50,
    elevation: 10,
  },
  button: {
    padding: 15,
    backgroundColor: "#273176",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  img: { width: 35, height: 35 },
  close: { position: "absolute", top: 10, right: 10 },
  touchableView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000040",
  },
});

export default React.memo(CameraGallery);
