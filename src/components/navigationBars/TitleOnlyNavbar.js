import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TitleOnlyNavbar = ({ title, onBackPress }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={onBackPress}>
        <View style={styles.buttonContainer}>
          <Icon name="chevron-back-outline" size={24} color="#181C39" />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
    height: 100,
    backgroundColor: "#181C39",
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    padding: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 20,
    fontFamily: "MerriweatherSans-Bold",
    color: "#ffffff",
  },
});

export default TitleOnlyNavbar;
