/**
 * SignupScreen
 * ------------
 * Guided sign‑up flow that creates a new Firebase Auth user, persists a
 * base user document in Firestore, and kicks off the first‑run dog‑profile
 * wizard. Password requirements are validated locally and visualised in
 * real time.
 *
 * Notable tweaks vs original draft
 * --------------------------------
 * • Added full JSDoc + logical section headers.
 * • Switched *all* session flags to **SecureStore** for consistency with
 *   Welcome/Login screens (original used AsyncStorage by mistake).
 * • Minor stylistic refactors and extracted helpers for readability.
 *
 * @module screens/auth/SignupScreen
 * @author PawfectDiet
 * @created 2024‑05‑02
 */

// ──────────────────────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Toast from "react-native-toast-message";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";

// Firebase instances + local assets / components
import { images } from "../../constants";
import { auth, db } from "../../../firebaseConfig";
import {
  InputWithIcon,
  InputPassword,
  ButtonLarge,
  ButtonGoogle,
  BasicLoadingModal,
} from "../../components";
import ButtonBackAuth from "../../components/ButtonBackAuth";

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────
/** Password requirement definitions */
const PWD_RULES = [
  { label: "Minimum 8 characters", test: (v) => v.length >= 8 },
  { label: "At least one uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "At least one number", test: (v) => /\d/.test(v) },
  {
    label: "At least one special character",
    test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
];

const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(?:\.[\w-]+)*$/;

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
const SignupScreen = ({ navigation }) => {
  // ─────────────── Local state ───────────────
  const [orientation, setOrientation] = useState("portrait");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────── Helpers ───────────────
  const toastError = useCallback(
    (title, message) =>
      Toast.show({ type: "error", text1: title, text2: message }),
    []
  );
  const toastSuccess = useCallback(
    () =>
      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Welcome to PawfectDiet!",
      }),
    []
  );

  /** Validates all form inputs; returns `true` if passes. */
  const validateForm = () => {
    if (!username || !email || !password || !repeatPassword) {
      toastError("Unable to proceed", "Please fill in all fields.");
      return false;
    }
    if (username.length < 3) {
      toastError(
        "Unable to proceed",
        "Username must be at least 3 characters."
      );
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      toastError("Unable to proceed", "Email address is invalid.");
      return false;
    }
    if (!PWD_RULES.every((r) => r.test(password))) {
      toastError("Unable to proceed", "Password does not meet requirements.");
      return false;
    }
    if (password !== repeatPassword) {
      toastError("Unable to proceed", "Passwords do not match.");
      return false;
    }
    return true;
  };

  /** Handles Firebase sign‑up + Firestore doc creation */
  const handleSignup = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // 1. Firebase Auth
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Firestore user doc
      const userDoc = {
        username,
        email,
        uid: user.uid,
        dateCreated: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        dogNumber: 0,
      };
      await setDoc(doc(db, "users", user.uid), userDoc);

      // 3. Persist minimal session info (SecureStore keeps parity with other screens)
      await Promise.all([
        SecureStore.setItemAsync("userId", user.uid),
        SecureStore.setItemAsync("isLoggedIn", "true"),
      ]);

      toastSuccess();
      navigation.navigate("DogProfileCreation");
    } catch (err) {
      // Firebase error handling
      const map = {
        "auth/email-already-in-use": "The email address is already in use.",
        "auth/weak-password": "The password is too weak.",
      };
      toastError(
        "Failed to create an account",
        map[err.code] || "Please try again."
      );
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────── Effects ───────────────
  useEffect(() => {
    // Orientation listener
    const onChange = () => {
      const { width, height } = Dimensions.get("window");
      setOrientation(height > width ? "portrait" : "landscape");
    };
    onChange(); // initial
    const sub = Dimensions.addEventListener("change", onChange);
    return () => sub?.remove?.();
  }, []);

  // ─────────────── Derived styles ───────────────
  const heroStyle = StyleSheet.flatten([
    styles.hero,
    orientation === "portrait" ? { height: 160 } : { height: 350 },
  ]);

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ─── Hero / header ─── */}
      <ImageBackground
        source={require("../../assets/park2.png")}
        style={heroStyle}
        resizeMode="cover"
      >
        <View style={styles.backBtnWrapper}>
          <ButtonBackAuth onPress={() => navigation.goBack()} />
        </View>
        <Image
          source={images.dog_butterfly}
          style={styles.dog}
          resizeMode="contain"
        />
        <Image
          source={images.logo_icon}
          style={styles.logo}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* ─── Form ─── */}
      <View style={styles.formWrapper}>
        <Text style={[styles.text, styles.h1]}>Join PawfectDiet!</Text>
        <Text style={[styles.text, styles.h2]}>
          Let's start your journey to a happier, healthier companion…
        </Text>

        <InputWithIcon
          iconName="user"
          iconType="AntDesign"
          placeholder="Username"
          onChangeText={setUsername}
        />
        <InputWithIcon
          iconName="email"
          iconType="Fontisto"
          placeholder="Email"
          onChangeText={setEmail}
        />
        <InputPassword placeholder="Password" onChangeText={setPassword} />

        {/* Password requirements checklist */}
        <View style={styles.requirementsList}>
          {PWD_RULES.map((rule) => {
            const valid = rule.test(password);
            return (
              <View key={rule.label} style={styles.requirementItem}>
                <Text
                  style={[
                    styles.requirementText,
                    valid ? { color: "#3dc43f" } : null,
                  ]}
                >
                  • {rule.label}
                </Text>
                {valid && <Icon name="check" size={20} color="#3dc43f" />}
              </View>
            );
          })}
        </View>

        <InputPassword
          placeholder="Repeat Password"
          onChangeText={setRepeatPassword}
        />
        <ButtonLarge buttonName="SIGN UP" isThereArrow onPress={handleSignup} />

        {/* Divider */}
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <ButtonGoogle
          buttonType="Sign Up"
          onPress={() =>
            toastError(
              "Google isn't set up yet",
              "Please sign up with email & password."
            )
          }
        />

        {/* Login link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.text, styles.h4]}>Already a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.text, styles.h5]}>Login to your account!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading overlay */}
      <BasicLoadingModal
        visible={isLoading}
        customTitle="Creating your account"
        customMessage="Please wait…"
      />
    </ScrollView>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
  hero: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backBtnWrapper: { position: "absolute", top: 35, left: 20 },
  dog: { position: "absolute", width: 200, height: 200, bottom: -50, left: 50 },
  logo: {
    position: "absolute",
    width: 70,
    height: 70,
    top: 30,
    right: 20,
    transform: [{ rotateZ: "-36deg" }],
  },
  formWrapper: {
    flex: 7,
    width: "100%",
    backgroundColor: "#E6ECFC",
    paddingHorizontal: 25,
    paddingVertical: 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: { color: "#273176", fontFamily: "MerriweatherSans-Regular" },
  h1: { fontSize: 30, fontFamily: "MerriweatherSans-ExtraBold" },
  h2: { fontSize: 20, marginBottom: 10 },
  h4: { fontSize: 15, color: "#7d7d7d" },
  h5: { fontSize: 15, fontFamily: "MerriweatherSans-ExtraBold", marginLeft: 5 },
  requirementsList: { marginTop: 2 },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  requirementText: { fontSize: 15 },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: -15,
  },
  orLine: { flex: 1, height: 0.7, backgroundColor: "#7D7D7D" },
  orText: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Light",
    color: "#7D7D7D",
    marginHorizontal: 5,
    marginVertical: 20,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

// ──────────────────────────────────────────────────────────────────────────────
// Exports
// ──────────────────────────────────────────────────────────────────────────────
export default SignupScreen;
