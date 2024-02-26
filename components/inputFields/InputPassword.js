import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

// Add props to the component
const InputPassword = ({ isPassword, placeholder, onChangeText }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  return (
    <View style={styles.inputContainer}>
      <Icon name="lock1" size={22} color="#000" style={styles.iconStyle} />
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        placeholderTextColor="#7D7D7D"
        style={styles.textInputStyle}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setSecureTextEntry((prev) => !prev)}
          style={styles.toggleVisibility}
        >
          <Text style={styles.toggleText}>
            {secureTextEntry ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      )}
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
    fontFamily: "MerriweatherSans-Light",
  },
  iconStyle: {
    marginRight: 5,
  },
  toggleVisibility: {
    // Style as needed
  },
  toggleText: {
    textDecorationLine: "underline",
    color: "#000000", // Choose your color
    // Additional styling for the text
  },
});

export default InputPassword;
