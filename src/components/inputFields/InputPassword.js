/**
 * InputPassword
 * -------------
 * Password input with an optional "Show/Hide" toggle.
 */
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const InputPassword = ({
  isPassword = true,
  placeholder = "",
  onChangeText,
}) => {
  const [hidden, setHidden] = useState(isPassword);
  return (
    <View style={styles.container}>
      <AntDesign name="lock1" size={22} color="#000" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#7D7D7D"
        secureTextEntry={hidden}
        style={styles.input}
        onChangeText={onChangeText}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setHidden((p) => !p)}>
          <Text style={styles.toggle}>{hidden ? "Show" : "Hide"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  icon: { marginRight: 5 },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "MerriweatherSans-Regular",
  },
  toggle: { textDecorationLine: "underline", color: "#000" },
});

export default InputPassword;
