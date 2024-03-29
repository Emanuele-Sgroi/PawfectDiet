import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { images } from "../../constants/index";
import * as SecureStore from "expo-secure-store";
import {
  doc,
  getDoc,
  query,
  collection,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../../firebaseConfig";

const jackRussellTips = [
  "Regular exercise is crucial for Jack Russell Terriers. Plan for at least 30-45 minutes of vigorous activity daily to keep them fit and prevent boredom.",
  "Jack Russell Terriers are known for their intelligence and curiosity. Engage their minds with puzzle toys and training sessions to keep them mentally stimulated.",
  "Jack Russell Terriers can be quite vocal. Early training to manage barking can help maintain peace with neighbors.",
  "Socialize your Jack Russell Terrier from a young age with people and other animals to foster a well-adjusted temperament.",
  "Jack Russell Terriers have a strong prey drive, meaning a secure, fenced yard is essential to prevent them from chasing after small animals.",
  "Be consistent with training; Jack Russell Terriers respond well to positive reinforcement techniques such as treats and praise.",
  "Regular grooming is necessary to manage shedding for Jack Russell Terriers, but their coat maintenance is relatively low compared to other breeds.",
  "Keep an eye on the diet of your Jack Russell Terrier to prevent obesity, a common health issue, by measuring food and incorporating plenty of exercise.",
  "Jack Russell Terriers are known escape artists. Ensure your home is secure to prevent any adventurous escapes.",
  "Jack Russell Terriers love to dig. Consider providing a dedicated digging area or sandbox in your yard to satisfy their digging instinct without ruining your garden.",
];

const germanShepherdTips = [
  "German Shepherds require regular exercise to stay healthy and happy. Aim for at least 60 minutes of physical activity each day.",
  "Mental stimulation is just as important as physical exercise for German Shepherds. Training exercises, puzzle toys, and interactive play can keep their minds sharp.",
  "Early socialization is crucial for German Shepherds. Expose them to various situations, people, and other animals to develop a well-rounded character.",
  "German Shepherds are known for their loyalty and protective nature. Positive, reward-based training from a young age can help manage their protective instincts.",
  "German Shepherds have a dense double coat that sheds year-round. Regular brushing can help manage shedding and keep their coat healthy.",
  "German Shepherds are prone to certain genetic disorders like hip dysplasia. Regular vet check-ups and maintaining a healthy weight can help mitigate health risks.",
  "German Shepherds thrive on structure and routine. Try to keep a consistent schedule for meals, walks, and training sessions.",
  "German Shepherds are highly trainable and excel in various canine sports and activities such as agility, obedience, and tracking.",
  "Be patient and consistent with training. German Shepherds are eager to learn but require clear and consistent guidance.",
  "Due to their strong bonding tendencies, German Shepherds may develop separation anxiety. Practice leaving them alone for short periods and gradually increase as they become more comfortable.",
];

const VetTips = () => {
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState(null);
  const [tip, setTip] = useState("");

  useEffect(() => {
    const fetchDogInfoAndGoals = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      const activeDogProfile = await SecureStore.getItemAsync(
        "activeDogProfile"
      );
      if (!userId || !activeDogProfile) {
        console.log("User ID or active dog profile missing");
        return;
      }

      const dogRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);
      const dogSnap = await getDoc(dogRef);

      if (dogSnap.exists()) {
        const dogData = dogSnap.data();
        setDogInfo(dogData);

        const goalsQuery = query(
          collection(dogRef, "healthGoals"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const goalsSnap = await getDocs(goalsQuery);

        if (!goalsSnap.empty) {
          const goalsData = goalsSnap.docs[0].data();
          setHealthGoals(goalsData);
        } else {
          console.log("No health goals found");
        }
      } else {
        console.log("No such document for dog info!");
      }
    };

    fetchDogInfoAndGoals();
  }, []);

  useEffect(() => {
    if (dogInfo && dogInfo.breed) {
      let breedTips = [];
      if (dogInfo.breed.toLowerCase().includes("jack russell")) {
        breedTips = jackRussellTips;
      } else if (dogInfo.breed.toLowerCase().includes("german shepherd")) {
        breedTips = germanShepherdTips;
      }

      if (breedTips.length > 0) {
        const randomIndex = Math.floor(Math.random() * breedTips.length);
        setTip(breedTips[randomIndex]);
      }
    }
  }, [dogInfo]);

  return (
    <>
      {healthGoals && dogInfo && tip && (
        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.title}>
              <Image source={images.chat} style={styles.img} />
              <Text style={styles.h1}>Did you know?</Text>
            </View>
            <Text style={styles.h2}>{tip}</Text>
          </View>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 5,
    backgroundColor: "#D2DAF0",
    padding: 25,
  },
  box: {
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    padding: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  h1: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
    marginBottom: 10,
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  h2: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Regular",
    color: "#000000",
  },
});

export default VetTips;
