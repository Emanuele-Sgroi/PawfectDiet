/**
 * HealthGoalsScreen
 * -----------------
 *  • Fetches the active dog profile and its latest “health‑goals” document
 *  • Presents weight / calorie targets together with a short AI‑generated intro
 *  • Allows the user to hide the AI intro banner and navigate back to Dashboard
 *
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

// UI components & assets
import { TitleOnlyNavbar } from "../../components/index";
import { images } from "../../constants/index";

// Firebase
import { db } from "../../../firebaseConfig";
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

// React‑Navigation helpers
import { useFocusEffect } from "@react-navigation/native";

const HealthGoalsScreen = ({ navigation }) => {
  /* ------------------------------------------------------------------ state */
  const [healthGoals, setHealthGoals] = useState(null); // latest goals doc
  const [dogInfo, setDogInfo] = useState(null); // active dog profile
  const [startingDate, setStartingDate] = useState(""); // first‑goal date
  const [showAiInfo, setShowAiInfo] = useState(true); // toggle banner

  /* --------------------------------------------------------- data fetching */
  useFocusEffect(
    useCallback(() => {
      const fetchDogInfoAndGoals = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        if (!userId || !activeDogProfile) return console.log("Missing IDs");

        // 1) active dog profile
        const dogRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);
        const dogSnap = await getDoc(dogRef);
        if (!dogSnap.exists()) return console.log("Dog profile not found");
        setDogInfo(dogSnap.data());

        // 2) last “healthGoals” doc
        const goalsQuery = query(
          collection(dogRef, "healthGoals"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const goalsSnap = await getDocs(goalsQuery);
        if (goalsSnap.empty) return console.log("No health goals");
        const goalsData = goalsSnap.docs[0].data();
        setHealthGoals(goalsData);

        // format starting date (if present)
        if (goalsData.createdAt) {
          const dateObj = goalsData.createdAt.toDate();
          setStartingDate(
            dateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        }
      };

      fetchDogInfoAndGoals();
    }, [])
  );

  const handleBackButton = () => {
    navigation.goBack();
    setShowAiInfo(true);
  };

  /* ---------------------------------------------------------------- render */
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.contentContainer}>
        <TitleOnlyNavbar title="Health Goals" onBackPress={handleBackButton} />

        {/* ----------------------- AI intro banner ------------------------ */}
        {healthGoals && dogInfo && showAiInfo && (
          <View style={styles.aiInfoContainer}>
            <View style={styles.aiContainer}>
              {/* header */}
              <View style={styles.aiTitle}>
                <Image source={images.chat} style={styles.aiImg} />
                <Text style={styles.aiText}>
                  Health Goals for {dogInfo.dogName}
                </Text>
              </View>

              {/* dynamic paragraph (working‑dog vs pet) */}
              <Text style={styles.aiParagraph}>
                {dogInfo.isWorkingDog
                  ? `The health goals for `
                  : `The health goals for `}
                <Text style={styles.strongText}>{dogInfo.dogName}</Text>, a{" "}
                {dogInfo.isWorkingDog ? "working " : ""}
                <Text style={styles.strongText}>{dogInfo.breed}</Text> aged{" "}
                <Text style={styles.strongText}>
                  {healthGoals.age.age} {healthGoals.age.unit}
                </Text>
                {dogInfo.isWorkingDog
                  ? ", have been carefully determined, considering both breed‑specific needs and the active lifestyle typical of working dogs. "
                  : ", have been thoughtfully established. "}
                We still recommend consulting your veterinarian for a final
                check‑up and personalised advice.
              </Text>

              {/* close “X” */}
              <Text style={styles.aiClose} onPress={() => setShowAiInfo(false)}>
                X
              </Text>
            </View>
          </View>
        )}

        {/* --------------------- main goal details ------------------------ */}
        <View style={styles.container}>
          {healthGoals && dogInfo ? (
            <>
              {/* weight cards ------------------------------------------------ */}
              <GoalRow
                label="Starting Weight:"
                value={`${healthGoals.startingWeight} Kg on ${startingDate}`}
              />
              <GoalRow
                label="Current Weight:"
                value={`${parseFloat(healthGoals.currentWeight).toFixed(2)} Kg`}
              />
              <GoalRow
                label="Goal Weight:"
                value={`${healthGoals.goalWeight} Kg`}
              />

              {/* overall wellness goal ------------------------------------- */}
              <GoalRow label="Wellness Goal:" value={healthGoals.overallGoal} />
              <View style={styles.goalContainer2}>
                <Text style={styles.h3}>
                  {healthGoals.overallGoal === "Maintaining weight"
                    ? "Focus on portion control and regular exercise."
                    : healthGoals.overallGoal === "Losing weight"
                    ? "Aim for a gradual weight loss of 1–2 % per week."
                    : "Aim for a healthy weight gain of 1–2 % per week."}
                </Text>
              </View>

              {/* calories & macros ----------------------------------------- */}
              <GoalRow
                label="Daily Calories:"
                value={`${healthGoals.dailyCalories} Cal`}
              />
              <MacroRow
                label="Carbohydrates:"
                pct={healthGoals.dailyCarbs}
                cals={healthGoals.dailyCalories}
                perGram={4}
              />
              <MacroRow
                label="Proteins:"
                pct={healthGoals.dailyProtein}
                cals={healthGoals.dailyCalories}
                perGram={4}
              />
              <MacroRow
                label="Fat:"
                pct={100 - (healthGoals.dailyProtein + healthGoals.dailyCarbs)}
                cals={healthGoals.dailyCalories}
                perGram={9}
              />

              {/* feeding frequency ---------------------------------------- */}
              <GoalRow
                label="Meals Per Day:"
                value={`${healthGoals.mealsPerDay} Meals`}
              />

              {/* back button ---------------------------------------------- */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Dashboard")}
              >
                <Text style={styles.h4}>Back to Dashboard</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ helper components ~~~~~~~~~~~~~~~~~~~~ */
const GoalRow = ({ label, value }) => (
  <View style={styles.goalContainer}>
    <Text style={styles.h1}>{label}</Text>
    <Text style={styles.h2}>{value}</Text>
  </View>
);

const MacroRow = ({ label, pct, cals, perGram }) => (
  <View style={styles.goalContainer}>
    <Text style={styles.h1}>{label}</Text>
    <Text style={styles.h2}>
      {pct}%{" "}
      <Text style={styles.h2_secondary}>
        ({((cals * pct) / 100 / perGram).toFixed(1)} g)
      </Text>
    </Text>
  </View>
);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ styles ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const styles = StyleSheet.create({
  /* layout */
  scrollContainer: { flex: 1, backgroundColor: "#E6ECFC" },
  contentContainer: { alignItems: "flex-start" },
  container: { width: "100%", marginTop: 10 },

  /* goal rows */
  goalContainer: {
    backgroundColor: "#D2DAF0",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalContainer2: {
    backgroundColor: "#D2DAF0",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginTop: -5,
    marginBottom: 2.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityContainer: {
    backgroundColor: "#D2DAF0",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginVertical: 5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  h1: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#273176",
    marginEnd: 5,
  },
  h2: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#273176",
  },
  h2_secondary: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#7D7D7D",
  },
  h3: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 14,
    color: "#7D7D7D",
  },
  aiInfoContainer: {
    width: "100%",
    padding: 20,
  },
  aiContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  aiTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  aiImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  aiText: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#000000",
    maxWidth: "90%",
  },
  aiParagraph: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 14,
    color: "#7D7D7D",
  },
  strongText: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 14,
    color: "#7D7D7D",
  },
  aiClose: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 14,
    color: "red",
    position: "absolute",
    right: 7,
    top: 2,
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
  h4: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 16,
    color: "#273176",
    textDecorationLine: "underline",
  },
});

export default HealthGoalsScreen;
