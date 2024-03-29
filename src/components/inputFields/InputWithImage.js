import React from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";

const InputWithImage = ({ imageName, placeholder, onChangeText, value }) => {
  return (
    <View style={styles.inputContainer}>
      <Image source={imageName} style={styles.imageStyle} />
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor="#7D7D7D"
        style={styles.textInputStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: 32,
    borderRadius: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "MerriweatherSans-Regular",
  },
  imageStyle: {
    marginRight: 5,
    width: 22,
    height: 22,
  },
});

export default InputWithImage;
