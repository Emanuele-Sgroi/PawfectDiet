/**
 * InputWithIcon
 * -------------
 * Single‑line text input adorned with a left‑hand icon drawn from a
 * configurable icon pack.
 */

import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ICON_PACKS = {
  Fontisto,
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
};

export const InputWithIcon = React.memo(
  ({
    iconName,
    iconType = "Fontisto",
    placeholder = "",
    onChangeText,
    value = "",
    keyboardType = "default",
  }) => {
    const Icon = ICON_PACKS[iconType] || Fontisto;
    return (
      <View style={styles.container}>
        <Icon name={iconName} size={22} color="#000" style={styles.icon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#7D7D7D"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
);

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
});

export default InputWithIcon;
