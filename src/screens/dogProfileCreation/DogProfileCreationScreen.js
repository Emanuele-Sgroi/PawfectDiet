/**
 * DogProfileCreationScreen
 * ------------------------
 * Four‑step wizard that collects a comprehensive dog profile and stores it
 * under `/users/{uid}/dogs/{dogName}` in Firestore.  On completion it also
 * generates and saves starter "health goals" produced by our local AI
 * helper.
 *
 */

// ──────────────────────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { CommonActions, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import {
  doc,
  setDoc,
  runTransaction,
  collection,
  addDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import * as SecureStore from "expo-secure-store";

// Firebase & AI helper
import { db, auth } from "../../../firebaseConfig";
import { generateHealthGoals } from "../../AIHelper/DogDataFormatterForAI";

// UI components
import {
  TitleOnlyNavbar,
  ProfileCreationSteps,
  DogProfileCreationStep1,
  DogProfileCreationStep2,
  DogProfileCreationStep3,
  DogProfileCreationStep4,
  BasicLoadingModal,
} from "../../components";

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────
const DEFAULT_PROFILE_PIC =
  "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083";

/** Initial blank profile */
const BLANK_PROFILE = {
  // Step‑1
  dogName: "",
  breed: "",
  dateOfBirth: "",
  gender: "",
  // Step‑2
  isWorkingDog: false,
  workType: "",
  workDogOtherActivities: "",
  activityType: "",
  activityLevel: "",
  dogWeight: "",
  regularMedication: "",
  recentHealthChange: "",
  allergies: "",
  neuteredSpayed: false,
  isPregnant: false,
  pregnancyDurationMonths: "",
  pregnancyDurationWeeks: "",
  isBreastfeeding: false,
  // Step‑3
  commercialFoodPreferences: [],
  treatPreferences: [],
  homemadeFoodPreferences: [],
  opennessToNewFoods: true,
  // Step‑4
  profilePicture: DEFAULT_PROFILE_PIC,
  tagLine: "The Treats Detective",
  createdAt: new Date(),
};

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
const DogProfileCreationScreen = ({ navigation }) => {
  // ─────────────── Local state ───────────────
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(BLANK_PROFILE);

  // ─────────────── Helper toasts ───────────────
  const toastError = useCallback(
    (msg) => Toast.show({ type: "error", text1: msg }),
    []
  );
  const toastSuccess = useCallback(
    (title, msg) => Toast.show({ type: "success", text1: title, text2: msg }),
    []
  );

  // ─────────────── Navigation helpers ───────────────
  const resetAndGo = (routeName, params) =>
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: routeName, params }] })
    );

  // ─────────────── Step navigation ───────────────
  const nextStep = (data) => {
    setProfileData((p) => ({ ...p, ...data }));
    setCurrentStep((s) => s + 1);
  };
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  // ─────────────── Firestore writes ───────────────
  const persistProfile = async (data) => {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) throw new Error("Missing userId in secure storage");

    const docRef = doc(db, `users/${userId}/dogs`, data.dogName);

    // 1️⃣ Create / overwrite dog document
    await setDoc(docRef, data);

    // 2️⃣ Increment dogNumber on user doc (transaction safe)
    await runTransaction(db, async (tx) => {
      const userRef = doc(db, "users", userId);
      const snap = await tx.get(userRef);
      if (!snap.exists()) throw new Error("User doc missing");
      const cur = snap.data().dogNumber || 0;
      tx.update(userRef, { dogNumber: cur + 1 });
    });

    // 3️⃣ Mark profile active locally
    await SecureStore.setItemAsync("activeDogProfile", data.dogName);

    // 4️⃣ Generate + save starter health goals
    const goals = generateHealthGoals(data);
    await addDoc(collection(docRef, "healthGoals"), {
      ...goals,
      createdAt: new Date(),
    });
  };

  // ─────────────── Completion handler ───────────────
  const finishWizard = async (finalData) => {
    setLoading(true);
    const merged = { ...profileData, ...finalData };
    setProfileData(merged);

    try {
      await persistProfile(merged);
      toastSuccess(
        "Profile Created!",
        `Let's give ${merged.dogName} the best diet!`
      );
      resetAndGo("Main", { refresh: true });
      setProfileData(BLANK_PROFILE);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      toastError("Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────── Back / close handling ───────────────
  const handleBackPress = async () => {
    const cameFromLogin = route?.params?.cameFromLogin;
    if (cameFromLogin) {
      try {
        await signOut(auth);
        await SecureStore.deleteItemAsync("userId");
        await SecureStore.deleteItemAsync("activeDogProfile");
        resetAndGo("Login");
      } catch (e) {
        console.error("Sign‑out error", e);
      }
    } else if (!navigation.goBack()) {
      navigation.navigate("SwitchDog");
    }
  };

  // ─────────────── Effects ───────────────
  useEffect(() => {
    // Guard: ensure user is logged in (SecureStore flag)
    const verifyLogin = async () => {
      const loggedIn =
        (await SecureStore.getItemAsync("isLoggedIn")) === "true";
      if (!loggedIn) resetAndGo("Login");
    };
    verifyLogin();
  }, []); // run once

  // ─────────────── Render helpers ───────────────
  const StepComponent = () => {
    const props = { profileData, name: profileData.dogName };
    switch (currentStep) {
      case 1:
        return (
          <DogProfileCreationStep1
            {...props}
            onSubmit={nextStep}
            navigation={navigation}
          />
        );
      case 2:
        return <DogProfileCreationStep2 {...props} onSubmit={nextStep} />;
      case 3:
        return <DogProfileCreationStep3 {...props} onSubmit={nextStep} />;
      case 4:
      default:
        return <DogProfileCreationStep4 {...props} onSubmit={finishWizard} />;
    }
  };

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <TitleOnlyNavbar
        onBackPress={handleBackPress}
        title="Let's Meet Your Furry Friend"
      />
      <ProfileCreationSteps currentStep={currentStep} onPress={prevStep} />
      <StepComponent />
      <BasicLoadingModal
        visible={loading}
        customTitle={`Creating ${profileData.dogName}'s profile`}
        customMessage="This won't take long…"
      />
    </View>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
    width: "100%",
  },
});

// ──────────────────────────────────────────────────────────────────────────────
// Exports
// ──────────────────────────────────────────────────────────────────────────────
export default DogProfileCreationScreen;
