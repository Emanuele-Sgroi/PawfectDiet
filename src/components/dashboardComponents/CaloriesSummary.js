import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { images } from "../../constants/index";
import { format } from "date-fns";
import { db } from "../../../firebaseConfig";
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
import * as SecureStore from "expo-secure-store";
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";

const CaloriesSummary = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState([]);
  const initialFeedLogs = {
    meals: [],
    activities: [],
    work: {
      name: dogInfo.isWorkingDog ? dogInfo.workType : "Not working",
      duration: 0,
      calories: 0,
      time: 0,
    },
    mealsCalories: 0,
    treatsCalories: 0,
    activityCalories: 0,
    workCalories: 0,
    remainingCalories: 0,
  };
  const [feedLogs, setFeedLogs] = useState(initialFeedLogs);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setIsLoading(true);
      const startLoadingTime = Date.now();

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
          setDogInfo(dogSnap.data());
        } else {
          console.log("No such document for dog info!");
          return;
        }

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
      };

      const fetchFeedLogs = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        if (!userId || !activeDogProfile) {
          console.log("User ID or active dog profile missing");
          return;
        }

        if (!dogInfo || !selectedDate || !healthGoals) return;

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const feedLogRef = doc(
          db,
          `users/${userId}/dogs/${activeDogProfile}/feedLog/${formattedDate}`
        );

        const feedLogSnap = await getDoc(feedLogRef);

        if (feedLogSnap.exists()) {
          setFeedLogs(feedLogSnap.data().logs);
        } else {
          // console.log("No feed log found for the selected date");
          setFeedLogs([]);
        }
      };

      const initializeOrFetchDailyLog = async () => {
        if (dogInfo && healthGoals) {
          const initializeOrFetchDailyLog = async () => {
            const userId = await SecureStore.getItemAsync("userId");
            const activeDogProfile = await SecureStore.getItemAsync(
              "activeDogProfile"
            );
            const formattedDate = format(selectedDate, "yyyy-MM-dd");

            const dailyLogRef = doc(
              db,
              `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
            );

            const dailyLogSnap = await getDoc(dailyLogRef);

            if (!dailyLogSnap.exists()) {
              await setDoc(dailyLogRef, {
                remainingCalories: parseFloat(
                  healthGoals.dailyCalories
                ).toFixed(0),
                remainingProteinGrams: parseFloat(
                  (
                    (healthGoals.dailyCalories * healthGoals.dailyProtein) /
                    100 /
                    4
                  ).toFixed(0)
                ),
                remainingFatGrams: parseFloat(
                  (healthGoals.dailyCalories * healthGoals.dailyFat) / 100 / 9
                ).toFixed(0),
                remainingCarbsGrams: parseFloat(
                  (
                    (healthGoals.dailyCalories * healthGoals.dailyCarbs) /
                    100 /
                    4
                  ).toFixed(0)
                ),
                mealsCalories: 0,
                treatsCalories: 0,
                activityCalories: 0,
                workCalories: 0,
                meals: [],
                treats: [],
                activities: [],
                work: {
                  name: dogInfo.isWorkingDog ? dogInfo.workType : "Not working",
                  duration: 0,
                  calories: 0,
                  time: 0,
                },
              });
            } else {
              setFeedLogs(dailyLogSnap.data());
            }
          };

          initializeOrFetchDailyLog();
        }
      };

      const ensureMinimumLoadingTime = new Promise((resolve) => {
        const minLoadingTime = 1500;
        const loadingDuration = Date.now() - startLoadingTime;
        setTimeout(resolve, Math.max(0, minLoadingTime - loadingDuration));
      });

      const fetchData = async () => {
        if (!isActive) return;

        try {
          await Promise.all([
            fetchDogInfoAndGoals(),
            fetchFeedLogs(),
            initializeOrFetchDailyLog(),
            ensureMinimumLoadingTime,
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      if (isFocused) {
        fetchData();
      }

      return () => {
        isActive = false;
      };
    }, [isFocused])
  );

  const renderCaloriesView = () => {
    return (
      <>
        {healthGoals && dogInfo && feedLogs ? (
          <View style={styles.dailyGoals}>
            <View style={styles.goalWrapper}>
              <Image source={images.flag_white} style={styles.goalIcon} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.goalText}>Goal</Text>
                <Text style={styles.goalText}>
                  {Math.round(healthGoals.dailyCalories)}
                </Text>
              </View>
            </View>
            <View style={styles.goalWrapper}>
              <Image source={images.feed_log} style={styles.goalIcon} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.goalText}>Food</Text>
                <Text style={styles.goalText}>
                  {Math.round(feedLogs.mealsCalories)}
                </Text>
              </View>
            </View>
            <View style={styles.goalWrapper}>
              <Image source={images.saved_food} style={styles.goalIcon} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.goalText}>Treats</Text>
                <Text style={styles.goalText}>
                  {Math.round(feedLogs.treatsCalories)}
                </Text>
              </View>
            </View>
            <View style={styles.goalWrapper}>
              <Image source={images.calories_white} style={styles.goalIcon} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.goalText}>Burned</Text>
                <Text style={styles.goalText}>
                  {Math.round(
                    feedLogs.activityCalories + feedLogs.workCalories
                  )}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </>
    );
  };

  const caloriesRemaining =
    healthGoals && dogInfo && feedLogs
      ? Math.round(
          parseFloat(healthGoals.dailyCalories).toFixed(0) -
            parseFloat(feedLogs.mealsCalories).toFixed(0) -
            parseFloat(feedLogs.treatsCalories).toFixed(0) +
            feedLogs.activityCalories +
            feedLogs.workCalories
        )
      : 0;

  const renderGoalBar = () => {
    const caloriesConsumed =
      parseFloat(healthGoals.dailyCalories) - caloriesRemaining;
    let fillPercentage = Math.min(
      100,
      Math.max(
        0,
        (caloriesConsumed / parseFloat(healthGoals.dailyCalories)) * 100
      )
    );

    fillPercentage = Math.min(fillPercentage, 100);

    const correction = 20;
    let imageLeftPercentage = fillPercentage;
    if (fillPercentage <= 0 + correction) {
      imageLeftPercentage = 12;
    } else if (fillPercentage >= 100) {
      imageLeftPercentage = 100 - correction + 10;
    }

    const imagePosition = {
      position: "absolute",
      left: `${imageLeftPercentage}%`,
      transform: [{ translateX: -correction }],
    };

    return (
      <View style={styles.goalBarContainer}>
        <View style={styles.barImagesContainer}>
          <View style={styles.barBase}>
            <View
              style={[
                styles.goalBarFill,
                {
                  width: `${fillPercentage}%`,
                  backgroundColor:
                    caloriesRemaining < 0 ? "#bb2124" : "#22bb33",
                },
              ]}
            />
            <Image
              source={images.dog_white}
              style={[styles.goalBarImage, imagePosition]}
            />
          </View>
          <Image source={images.jumping} style={styles.jumpMan} />
        </View>
      </View>
    );
  };

  return (
    <>
      {healthGoals && dogInfo && feedLogs ? (
        <ImageBackground source={images.park} style={styles.container}>
          <View style={styles.titleView}>
            <Text style={styles.title}>Today</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("HealthGoals", { refresh: true });
              }}
            >
              <Text style={styles.buttonText}>View Goals</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.caloriesView}>
            {!isLoading ? (
              <>
                <Text style={styles.h1}>Calories Summary</Text>
                {renderCaloriesView()}
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
                          : "#fff",
                    },
                  ]}
                >
                  {caloriesRemaining}
                  <Text style={styles.h3}> Calories Remaining</Text>
                </Text>
                {renderGoalBar()}
                <TouchableOpacity
                  style={styles.logButton}
                  onPress={() => {
                    navigation.navigate("Feed Log", { refresh: true });
                  }}
                >
                  <Text style={styles.logText}>View Feed Log</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Image
                source={images.dog_gif}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
          </View>

          <Image source={images.dog_sit} style={styles.dogSit} />
        </ImageBackground>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
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

export default CaloriesSummary;
