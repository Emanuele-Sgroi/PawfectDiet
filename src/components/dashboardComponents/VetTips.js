/*
  VetTips
  -------
  Picks one random breed‑specific tip on mount. Right now we only cover
  Jack Russell and German Shepherd as demo data. When we onboard more breeds
  just append to the arrays or fetch tips from the backend.
*/

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import * as SecureStore from "expo-secure-store";

import { images } from "../../constants";
import { db } from "../../../firebaseConfig";

// demo tips ↓
const tips = {
  "jack russell": [
    "Regular exercise is crucial for Jack Russell Terriers. Plan for at least 30‑45 minutes of vigorous activity daily to keep them fit and prevent boredom.",
    "Jack Russell Terriers are known for their intelligence and curiosity. Engage their minds with puzzle toys and training sessions to keep them mentally stimulated.",
    "Jack Russell Terriers can be quite vocal. Early training to manage barking can help maintain peace with neighbors.",
    "Socialize your Jack Russell Terrier from a young age with people and other animals to foster a well‑adjusted temperament.",
    "Jack Russell Terriers have a strong prey drive, so a secure fenced yard is essential to prevent them from chasing after small animals.",
  ],
  "german shepherd": [
    "German Shepherds need a solid 60 minutes of exercise every day to stay balanced.",
    "Mental workouts (obedience, tracking games) keep a German Shepherd’s brain happy.",
    "Early socialisation is key—expose your pup to all sorts of people and situations.",
    "That plush double coat sheds all year. A quick brush a few times a week works wonders.",
    "German Shepherds thrive on structure. Stick to regular mealtimes and walk schedules.",
  ],
};

const VetTips = () => {
  const [tip, setTip] = useState("");

  // fetch current dog & goals – we really only need the breed string
  useEffect(() => {
    (async () => {
      const uid = await SecureStore.getItemAsync("userId");
      const dogName = await SecureStore.getItemAsync("activeDogProfile");
      if (!uid || !dogName) return;

      const snap = await getDoc(doc(db, `users/${uid}/dogs/${dogName}`));
      if (!snap.exists()) return;
      const breed = (snap.data().breed || "").toLowerCase();

      const key = Object.keys(tips).find((k) => breed.includes(k));
      if (!key) return;

      const arr = tips[key];
      setTip(arr[Math.floor(Math.random() * arr.length)]);
    })();
  }, []);

  if (!tip) return null; // nothing yet

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.title}>
          <Image source={images.chat} style={styles.img} />
          <Text style={styles.h1}>Did you know?</Text>
        </View>
        <Text style={styles.h2}>{tip}</Text>
      </View>
    </View>
  );
};

// styles kept as‑is ↓
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D2DAF0",
    padding: 25,
  },
  box: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    padding: 15,
  },
  title: { flexDirection: "row", alignItems: "flex-start" },
  h1: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
    marginBottom: 10,
  },
  img: { width: 30, height: 30, marginRight: 10 },
  h2: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Regular",
    color: "#000000",
  },
});

export default React.memo(VetTips);
