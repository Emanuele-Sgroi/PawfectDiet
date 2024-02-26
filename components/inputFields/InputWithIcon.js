import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const iconComponents = {
  Fontisto, //email
  AntDesign, //lock1, user
  FontAwesome, //birthday-cake
  Ionicons, //tennisball-outline, scale-outline
  MaterialIcons, //health-and-safety, arrow-forward-ios
  MaterialCommunityIcons, //peanut-off-outline

  // other icon packs here
};

// Add props to the component
const InputWithIcon = ({
  iconName,
  iconType,
  placeholder,
  onChangeText,
  value,
  keyboardType,
}) => {
  const IconComponent = iconComponents[iconType];

  return (
    <View style={styles.inputContainer}>
      <IconComponent
        name={iconName}
        size={22}
        color="#000"
        style={styles.iconStyle}
      />
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor="#7D7D7D"
        style={styles.textInputStyle}
        keyboardType={keyboardType}
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
    fontFamily: "MerriweatherSans-Light",
  },
  iconStyle: {
    marginRight: 5,
  },
});

export default InputWithIcon;
