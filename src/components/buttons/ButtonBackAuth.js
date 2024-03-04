/**
 * ButtonBackAuth
 * --------------
 * Reusable circular "back" button that sits on top of authentication
 * screens. Accepts optional `size` + `color` overrides for flexibility.
 */
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/**
 * @param {object}   props
 * @param {function} props.onPress – Callback when pressed
 * @param {number=}  props.size    – Icon size (default 26)
 * @param {string=}  props.color   – Icon colour (default #181C39)
 */
const ButtonBackAuth = ({ onPress, size = 26, color = "#181C39" }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.container}
    accessibilityRole="button"
    accessibilityLabel="Back"
  >
    <MaterialIcons
      name="arrow-back-ios"
      size={size}
      color={color}
      style={styles.icon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
    width: 35,
    height: 35,
    borderRadius: 100,
    zIndex: 999,
  },
  icon: { marginLeft: 8 },
});

export default React.memo(ButtonBackAuth);
