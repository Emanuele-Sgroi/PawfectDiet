/**
 * TitleOnlyNavbar
 * ---------------
 * Slim top bar that displays a centred title and a left‑hand back button –
 * typically used in multi‑step wizards where we need just a single heading.
 */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

/**
 * @param {object}   props
 * @param {string}   props.title        – Title text
 * @param {function} props.onBackPress  – Fired when back icon is pressed
 * @param {string=}  props.bgColor      – Background colour (default #181C39)
 * @param {string=}  props.fgColor      – Foreground/icon colour (default #181C39)
 */
const TitleOnlyNavbar = ({
  title,
  onBackPress,
  bgColor = "#181C39",
  fgColor = "#181C39",
}) => (
  <View style={[styles.navBar, { backgroundColor: bgColor }]}>
    <TouchableOpacity
      onPress={onBackPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <View style={styles.btnWrapper}>
        <Ionicons name="chevron-back-outline" size={24} color={fgColor} />
      </View>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 15,
    width: "100%",
    height: 100,
  },
  btnWrapper: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    padding: 3,
  },
  title: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-Bold",
    color: "#FFFFFF",
    marginLeft: 20,
  },
});

export default React.memo(TitleOnlyNavbar);
