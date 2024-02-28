/**
 * WelcomeScreen
 * -------------
 * Lightweight splash / gatekeeper screen that decides where to send the
 * user a few seconds after launch. It inspects values cached in Expo
 * SecureStore to attempt an "auto‑login" flow and then routes according
 * to how many dog profiles the user has.
 *
 * This version adds:
 *   • Clear documentation + typed JSDoc where helpful
 *   • Minor refactorings for readability (named constants, early returns)
 *   • Centralised navigation helpers
 *
 */

// ──────────────────────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getDoc, doc } from "firebase/firestore";

// Assets & constants
import { images } from "../../constants/index";
import { db } from "../../../firebaseConfig";

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────
const SPLASH_DURATION_MS = 3_000; // 3‑second delay before auto‑routing

/**
 * Calculates a responsive logo size (95 % of screen width, capped at 600).
 */
const screenWidth = Dimensions.get("window").width;
const LOGO_SIZE = Math.min(screenWidth * 0.95, 600);

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} WelcomeScreenProps
 * @property {object} navigation – React‑Navigation prop injected by Stack
 */

/**
 * Splash screen component that determines the next screen.
 *
 * @param {WelcomeScreenProps} param0 – See typedef above
 * @returns {JSX.Element}
 */
const WelcomeScreen = ({ navigation }) => {
  // ────────────────────────────────
  // Effect: attempt auto‑login after SPLASH_DURATION_MS
  // ────────────────────────────────
  useEffect(() => {
    const timeoutId = setTimeout(checkAutoLogin, SPLASH_DURATION_MS);
    return () => clearTimeout(timeoutId); // cleanup if unmounted early
  }, []); // eslint‑disable‑line react-hooks/exhaustive-deps – run once

  // ────────────────────────────────
  // Helper functions
  // ────────────────────────────────

  /**
   * Navigates to a Stack root by *resetting* the nav state so that the
   * back button never returns to the splash.
   *
   * @param {string} routeName – e.g. "Login", "Main"
   * @param {object=} params   – Optional route params
   */
  const resetTo = (routeName, params) => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: routeName, params }] })
    );
  };

  /**
   * Reads cached login info and decides the next logical screen.
   */
  const checkAutoLogin = async () => {
    try {
      const [isLoggedIn, userId, activeDogProfile] = await Promise.all([
        SecureStore.getItemAsync("isLoggedIn"),
        SecureStore.getItemAsync("userId"),
        SecureStore.getItemAsync("activeDogProfile"),
      ]);

      // Early return: force login if flag or uid missing
      if (isLoggedIn !== "true" || !userId) {
        resetTo("Login");
        return;
      }

      // Fetch user doc to determine dog profile count
      const userSnap = await getDoc(doc(db, "users", userId));
      if (!userSnap.exists()) {
        resetTo("Login");
        return;
      }

      const { dogNumber } = userSnap.data();

      /** Logical routing table
       * ┌─────────────┬──────────────────────────────┐
       * │ dogNumber   │ nextScreen                   │
       * ├─────────────┼──────────────────────────────┤
       * │ 0           │ "DogProfileCreation"         │
       * │ 1           │ activeDogProfile ? "Main"    │
       * │             │             : "Login"        │ (shouldn't happen)
       * │ >1          │ "SwitchDog"                  │
       * └─────────────┴──────────────────────────────┘
       */
      if (dogNumber === 0) {
        resetTo("DogProfileCreation");
      } else if (dogNumber === 1) {
        resetTo(activeDogProfile ? "Main" : "Login");
      } else {
        // 2+ dogs
        resetTo("SwitchDog");
      }
    } catch (err) {
      console.error("Auto‑login error:", err);
      resetTo("Login");
    }
  };

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Powered by AI</Text>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181C39",
    padding: 10,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    maxWidth: 600,
    maxHeight: 600,
  },
  tagline: {
    position: "absolute",
    bottom: 20,
    fontSize: 18,
    color: "#FFFFFF",
  },
});

// ──────────────────────────────────────────────────────────────────────────────
// Exports
// ──────────────────────────────────────────────────────────────────────────────
export default WelcomeScreen;
