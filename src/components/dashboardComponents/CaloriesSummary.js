/*
  CaloriesSummary
  ---------------
  Dashboard tile that crunches today’s calories from food vs calories burned out and draws a cute
  goal bar. Fetches the active dog + latest health goals on focus, then
  ensures there’s a daily log doc (creates one if missing).

*/

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { format } from "date-fns";
import * as SecureStore from "expo-secure-store";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";

import { images } from "../../constants";
import { db } from "../../../firebaseConfig";

const CaloriesSummary = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [selectedDate] = useState(new Date());
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState(null);
  // const [feedLogs, setFeedLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  // ────────────────── helpers
  const caloriesRemaining =
    healthGoals && feedLogs
      ? Math.round(
          healthGoals.dailyCalories -
            feedLogs.mealsCalories -
            feedLogs.treatsCalories +
            feedLogs.activityCalories +
            feedLogs.workCalories
        )
      : 0;

  // ────────────────── data fetcher
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const start = Date.now();

      const ensureDailyLogDoc = async (userId, dogName, goals, dog) => {
        const dateKey = format(selectedDate, "yyyy-MM-dd");
        const ref = doc(
          db,
          `users/${userId}/dogs/${dogName}/dailyLogs/${dateKey}`
        );
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            remainingCalories: Math.round(goals.dailyCalories),
            remainingProteinGrams: Math.round(
              (goals.dailyCalories * goals.dailyProtein) / 100 / 4
            ),
            remainingFatGrams: Math.round(
              (goals.dailyCalories * goals.dailyFat) / 100 / 9
            ),
            remainingCarbsGrams: Math.round(
              (goals.dailyCalories * goals.dailyCarbs) / 100 / 4
            ),
            mealsCalories: 0,
            treatsCalories: 0,
            activityCalories: 0,
            workCalories: 0,
            meals: [],
            treats: [],
            activities: [],
            work: {
              name: dog.isWorkingDog ? dog.workType : "Not working",
              duration: 0,
              calories: 0,
              time: 0,
            },
          });
        } else {
          setFeedLogs(snap.data());
        }
      };

      const load = async () => {
        const uid = await SecureStore.getItemAsync("userId");
        const dogName = await SecureStore.getItemAsync("activeDogProfile");
        if (!uid || !dogName) return;

        // dog info
        const dogSnap = await getDoc(doc(db, `users/${uid}/dogs/${dogName}`));
        if (!dogSnap.exists()) return;
        const dog = dogSnap.data();
        if (!active) return;
        setDogInfo(dog);

        // goals
        const goalsQ = query(
          collection(doc(db, `users/${uid}/dogs/${dogName}`), "healthGoals"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const goalsSnap = await getDocs(goalsQ);
        if (goalsSnap.empty) return;
        const goals = goalsSnap.docs[0].data();
        if (!active) return;
        setHealthGoals(goals);

        // ensure / fetch daily log
        await ensureDailyLogDoc(uid, dogName, goals, dog);

        // fetch feed logs (after possible doc creation)
        const logsSnap = await getDoc(
          doc(
            db,
            `users/${uid}/dogs/${dogName}/dailyLogs/${format(
              selectedDate,
              "yyyy-MM-dd"
            )}`
          )
        );
        if (logsSnap.exists()) setFeedLogs(logsSnap.data());
      };

      const minDelay = () =>
        new Promise((r) =>
          setTimeout(r, Math.max(0, 1500 - (Date.now() - start)))
        );

      if (isFocused) {
        Promise.all([load(), minDelay()]).finally(
          () => active && setLoading(false)
        );
      }

      return () => {
        active = false;
      };
    }, [isFocused, selectedDate])
  );

  // ────────────────── render helpers (unchanged UI mostly)
  const renderGoalsRow = () => (
    <View style={styles.dailyGoals}>
      {[
        {
          ico: images.flag_white,
          label: "Goal",
          val: Math.round(healthGoals.dailyCalories),
        },
        {
          ico: images.feed_log,
          label: "Food",
          val: Math.round(feedLogs.mealsCalories),
        },
        {
          ico: images.saved_food,
          label: "Treats",
          val: Math.round(feedLogs.treatsCalories),
        },
        {
          ico: images.calories_white,
          label: "Burned",
          val: Math.round(feedLogs.activityCalories + feedLogs.workCalories),
        },
      ].map(({ ico, label, val }) => (
        <View key={label} style={styles.goalWrapper}>
          <Image source={ico} style={styles.goalIcon} />
          <View>
            <Text style={styles.goalText}>{label}</Text>
            <Text style={styles.goalText}>{val}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderGoalBar = () => {
    const consumed = healthGoals.dailyCalories - caloriesRemaining;
    const pct = Math.min(
      100,
      Math.max(0, (consumed / healthGoals.dailyCalories) * 100)
    );
    const leftPct = Math.min(100, pct <= 20 ? 12 : pct + 0);
    return (
      <View style={styles.goalBarContainer}>
        <View style={styles.barImagesContainer}>
          <View style={styles.barBase}>
            <View
              style={[
                styles.goalBarFill,
                {
                  width: `${pct}%`,
                  backgroundColor:
                    caloriesRemaining < 0 ? "#bb2124" : "#22bb33",
                },
              ]}
            />
            <Image
              source={images.dog_white}
              style={[
                styles.goalBarImage,
                { left: `${leftPct}%`, transform: [{ translateX: -20 }] },
              ]}
            />
          </View>
          <Image source={images.jumping} style={styles.jumpMan} />
        </View>
      </View>
    );
  };

  // ────────────────── main render
  if (loading)
    return (
      <Image source={images.dog_gif} style={styles.logo} resizeMode="contain" />
    );
  if (!healthGoals || !feedLogs) return <Text>Loading…</Text>;

  return (
    <ImageBackground source={images.park} style={styles.container}>
      {/* header row */}
      <View style={styles.titleView}>
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HealthGoals", { refresh: true })}
        >
          <Text style={styles.buttonText}>View Goals</Text>
        </TouchableOpacity>
      </View>

      {/* card */}
      <View style={styles.caloriesView}>
        <Text style={styles.h1}>Calories Summary</Text>
        {renderGoalsRow()}
        <View style={styles.line} />
        <Text
          style={[
            styles.h2,
            {
              color:
                caloriesRemaining < 0
                  ? "#bb2124"
                  : caloriesRemaining === 0
                  ? "#22bb33"
                  : "#FFFFFF",
            },
          ]}
        >
          {" "}
          {caloriesRemaining}
          <Text style={styles.h3}> Calories Remaining</Text>
        </Text>
        {renderGoalBar()}
        <TouchableOpacity
          style={styles.logButton}
          onPress={() => navigation.navigate("Feed Log", { refresh: true })}
        >
          <Text style={styles.logText}>View Feed Log</Text>
        </TouchableOpacity>
      </View>

      <Image source={images.dog_sit} style={styles.dogSit} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    resizeMode: "cover",
    flexDirection: "row",
  },
  titleView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#000000",
  },
  button: {
    backgroundColor: "#273176",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 11,
    fontFamily: "MerriweatherSans-Bold",
    color: "#fff",
    marginBottom: 2,
  },
  caloriesView: {
    maxWidth: "60%",
    minWidth: "60%",
    minHeight: 305,
    padding: 10,
    backgroundColor: "rgba(39, 49, 118, 0.9)",
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  dailyGoals: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 10,
  },
  goalWrapper: {
    width: "45%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  goalIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 5,
  },
  goalText: {
    fontSize: 12,
    fontFamily: "MerriweatherSans-Regular",
    color: "#fff",
  },
  h1: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Bold",
    color: "#fff",
  },
  line: {
    width: "70%",
    height: 0.5,
    backgroundColor: "#FFFFFF",
  },
  h2: {
    fontSize: 14,
    fontFamily: "MerriweatherSans-ExtraBold",
  },
  h3: {
    fontSize: 14,
    fontFamily: "MerriweatherSans-Light",
    color: "#fff",
  },
  barImagesContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  goalBarContainer: {
    marginTop: 10,
  },
  barBase: {
    flex: 1,
    height: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 5,
    position: "relative",
  },
  goalBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  goalBarImage: {
    width: 40,
    height: 40,
    top: -37,
  },
  jumpMan: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  dogSit: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  logButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 5,
  },
  logText: {
    fontSize: 12,
    fontFamily: "MerriweatherSans-Bold",
    color: "#273176",
    marginBottom: 2,
  },
  logo: {
    width: 90,
    height: 45,
    resizeMode: "contain",
  },
});

export default React.memo(CaloriesSummary);
