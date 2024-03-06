/*
  InputWithImage
  --------------
  Tiny helper: text input with a left‑hand bitmap icon. We use it for
  fields like “Dog’s name” where a cute pictogram looks nicer than a plain
  vector glyph.
*/

import React from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";

const InputWithImage = ({ imageName, placeholder, onChangeText, value }) => (
  <View style={styles.inputContainer}>
    <Image source={imageName} style={styles.imageStyle} />
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#7D7D7D"
      style={styles.textInputStyle}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  imageStyle: { width: 22, height: 22, marginRight: 5 },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "MerriweatherSans-Regular",
  },
});

export default React.memo(InputWithImage);
