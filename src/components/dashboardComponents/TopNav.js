/*
  TopNav
  ------
  Dashboard header: profile pic (tap → info), centre logo, bell (also taps
  to the same WIP modal). Pulls active dog info from Firestore on focus.
*/

import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { doc, getDoc } from "firebase/firestore";

import { images } from "../../constants";
import { db } from "../../../firebaseConfig";

const DEFAULT_PIC =
  "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083";

const TopNav = ({ onPress }) => {
  const [dog, setDog] = useState({ name: "", photoUrl: DEFAULT_PIC, tag: "" });

  // fetch active dog profile whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const uid = await SecureStore.getItemAsync("userId");
        const active = await SecureStore.getItemAsync("activeDogProfile");
        if (!uid || !active) return;
        try {
          const snap = await getDoc(doc(db, `users/${uid}/dogs`, active));
          if (snap.exists()) {
            const d = snap.data();
            setDog({
              name: d.dogName,
              photoUrl: d.profilePicture,
              tag: d.tagLine,
            });
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }, [])
  );

  const pad = dog.photoUrl === DEFAULT_PIC ? 10 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.imgContainer, { padding: pad }]}>
            {" "}
            <Image
              style={styles.profilePicture}
              source={{ uri: dog.photoUrl }}
            />{" "}
          </View>
        </TouchableOpacity>

        <Image source={images.logo_white} style={styles.logo} />

        <TouchableOpacity onPress={onPress}>
          {" "}
          <Image source={images.bell_white} style={styles.bell} />{" "}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// styles unchanged ↓
const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#181C39" },
  container: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#181C39",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 25,
  },
  imgContainer: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 32.5,
    overflow: "hidden",
    marginTop: 10,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    resizeMode: "cover",
  },
  logo: { width: 130, height: 40, resizeMode: "contain", marginTop: 10 },
  bell: { width: 40, height: 40, resizeMode: "contain", marginTop: 10 },
});

export default React.memo(TopNav);
