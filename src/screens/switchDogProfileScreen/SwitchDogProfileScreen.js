/*
  SwitchDogProfileScreen
  ----------------------
  Lets the user pick an existing dog or jump into the profile‑creation flow.
  Most logic kept the same – just de‑cluttered a few bits and fixed the
  profilePadding bug (was reading from an array).
*/

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";

import { images } from "../../constants";
import { db, auth } from "../../../firebaseConfig";
import { ButtonLarge } from "../../components";

const DEFAULT_PIC =
  images.default_profile_picture ??
  "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083";

const SwitchDogProfileScreen = ({ navigation }) => {
  const [dogs, setDogs] = useState([]);
  const route = useRoute();

  // ─── fetch dogs on focus ───────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const uid = await SecureStore.getItemAsync("userId");
          if (!uid) return;
          const snap = await getDocs(collection(db, `users/${uid}/dogs`));
          setDogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch (e) {
          console.warn("Error fetching dogs:", e);
        }
      })();
    }, [])
  );

  // ─── handlers ──────────────────────────────────────────────
  const toast = (msg) => Toast.show({ type: "success", text1: msg });

  const handleDogSelection = async (name) => {
    await SecureStore.setItemAsync("activeDogProfile", name);
    toast(`All right! Let's give ${name} the best diet!`);
    navigation.navigate("Main", { refresh: true });
  };

  const handleAddNewDog = () => navigation.navigate("DogProfileCreation");

  const handleBackPress = async () => {
    if (route.params?.cameFromLogin || route.params?.cameFromSignup) {
      try {
        await signOut(auth);
        await SecureStore.deleteItemAsync("userId");
        await SecureStore.deleteItemAsync("activeDogProfile");
        navigation.replace("Login");
      } catch (e) {
        console.error(e);
      }
    } else {
      navigation.canGoBack() ? navigation.goBack() : navigation.replace("Main");
    }
  };

  // ─── render ────────────────────────────────────────────────
  return (
    <ScrollView style={styles.ScrollContainer}>
      <View style={styles.contentContainer}>
        {/* Top banner */}
        <ImageBackground source={images.park} style={styles.parkContainer}>
          <Image source={images.dog_sit} style={styles.dogImg} />
          <Image source={images.logo_icon} style={styles.logoImg} />
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="caret-back-sharp" size={32} color="#181C39" />
          </TouchableOpacity>
        </ImageBackground>

        {/* List of profiles */}
        <View style={styles.bottomContentContainer}>
          <Text style={styles.h1}>Select Your Paw Partner</Text>
          <View style={styles.line} />

          <ScrollView style={styles.scrollDogSelectionContainer}>
            <View style={styles.dogSelectionContainer}>
              {dogs.map((dog) => {
                const pad = dog.profilePicture === DEFAULT_PIC ? 10 : 0;
                return (
                  <TouchableOpacity
                    key={dog.id}
                    style={styles.previewActual}
                    onPress={() => handleDogSelection(dog.dogName)}
                  >
                    <View
                      style={[styles.previewImgContainer, { padding: pad }]}
                    >
                      {" "}
                      <Image
                        style={styles.previewProfilePicture}
                        source={{ uri: dog.profilePicture }}
                      />{" "}
                    </View>
                    <View style={styles.previewLine} />
                    <View style={styles.previewTextContainer}>
                      <Text style={styles.previewName}>{dog.dogName}</Text>
                      <Text style={styles.previewTag}>{dog.tagLine}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <ButtonLarge
            buttonName="Add a new companion"
            isThereArrow={false}
            onPress={handleAddNewDog}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ScrollContainer: { backgroundColor: "#E6ECFC", width: "100%" },
  contentContainer: { flex: 1, alignItems: "center" },
  parkContainer: { width: "100%", height: 200 },
  dogImg: {
    width: 80,
    height: 100,
    position: "absolute",
    left: 40,
    bottom: 25,
  },
  logoImg: {
    position: "absolute",
    width: 70,
    height: 70,
    top: 30,
    right: 20,
    transform: [{ rotateZ: "-36deg" }],
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    position: "absolute",
    top: 25,
    left: 18,
    padding: 1,
  },
  bottomContentContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  h1: {
    fontSize: 25,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
  },
  line: {
    width: 150,
    height: 1,
    backgroundColor: "#273176",
    marginVertical: 10,
  },
  scrollDogSelectionContainer: {
    width: "100%",
    height: 390,
    backgroundColor: "#FFFFFF",
    padding: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 5,
    marginBottom: 15,
  },
  dogSelectionContainer: { width: "100%", paddingBottom: 15 },
  previewActual: {
    width: "100%",
    backgroundColor: "#273176",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  previewImgContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  previewProfilePicture: { width: "100%", height: "100%", borderRadius: 32.5 },
  previewLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
  },
  previewTextContainer: { flexDirection: "column", justifyContent: "center" },
  previewName: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  previewTag: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.7,
  },
});

export default React.memo(SwitchDogProfileScreen);
