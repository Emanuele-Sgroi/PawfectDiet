import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { TitleOnlyNavbar } from "../../components/index";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { images } from "../../constants/index";

const HealthGoalsScreen = ({ navigation }) => {
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState(null);
  const [startingDate, setStartingDate] = useState("");
  const [showAiInfo, setShowAiInfo] = useState(true);

  useFocusEffect(
    useCallback(() => {
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
          if (goalsData.createdAt) {
            const date = goalsData.createdAt.toDate();
            setStartingDate(
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            );
          }
        } else {
          console.log("No health goals found");
        }
      };

      fetchDogInfoAndGoals();
    }, [])
  );

  const handleBackButton = () => {
    navigation.goBack();
    setShowAiInfo(true);
  };

  //   1 gram of protein = 4 calories
  // 1 gram of carbohydrates = 4 calories
  // 1 gram of fat = 9 calories

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.contentContainer}>
        <TitleOnlyNavbar onBackPress={handleBackButton} title="Health Goals" />
        {healthGoals && dogInfo ? (
          <>
            {showAiInfo && (
              <View style={styles.aiInfoContainer}>
                <View style={styles.aiContainer}>
                  <View style={styles.aiTitle}>
                    <Image source={images.chat} style={styles.aiImg} />
                    <Text style={styles.aiText}>
                      Health Goals for {dogInfo.dogName}
                    </Text>
                  </View>
                  {dogInfo.isWorkingDog ? (
                    <Text style={styles.aiParagraph}>
                      The health goals for{" "}
                      <Text style={styles.strongText}>{dogInfo.dogName}</Text>,
                      a working{" "}
                      <Text style={styles.strongText}>{dogInfo.breed}</Text>{" "}
                      aged{" "}
                      <Text style={styles.strongText}>
                        {healthGoals.age.age} {healthGoals.age.unit}
                      </Text>
                      , have been carefully determined, considering both
                      breed-specific needs and the active lifestyle typical of
                      working dogs. These goals are tailored to the health
                      information you've provided. However, we recommend
                      consulting your veterinarian to ensure these goals align
                      perfectly with your dog's unique health requirements.
                    </Text>
                  ) : (
                    <Text style={styles.aiParagraph}>
                      The health goals for{" "}
                      <Text style={styles.strongText}>{dogInfo.dogName}</Text>,
                      a <Text style={styles.strongText}>{dogInfo.breed}</Text>{" "}
                      aged{" "}
                      <Text style={styles.strongText}>
                        {healthGoals.age.age} {healthGoals.age.unit}
                      </Text>
                      , have been thoughtfully established, taking into account
                      the health information you provided. While these goals are
                      tailored to support your dog's well-being, we recommend
                      consulting your veterinarian for personalized advice and
                      confirmation.
                    </Text>
                  )}

                  <Text
                    onPress={() => {
                      setShowAiInfo(false);
                    }}
                    style={styles.aiClose}
                  >
                    X
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          ""
        )}

        <View style={styles.container}>
          {healthGoals && dogInfo ? (
            <>
              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Starting Weight:</Text>
                <Text style={styles.h2}>
                  {healthGoals.startingWeight} Kg on {startingDate}
                </Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Current Weight:</Text>
                <Text style={styles.h2}>
                  {parseFloat(healthGoals.currentWeight).toFixed(2)} Kg
                </Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Goal Weight:</Text>
                <Text style={styles.h2}>{healthGoals.goalWeight} Kg</Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Wellness Goal:</Text>

                <Text style={styles.h2}>{healthGoals.overallGoal}</Text>
              </View>

              <View style={styles.goalContainer2}>
                <Text style={styles.h3}>
                  {healthGoals.overallGoal === "Maintaining weight"
                    ? "For weight maintenance, focus on portion control and regular, moderate exercise."
                    : healthGoals.overallGoal === "Losing weight"
                    ? "We recommend a gradual weight loss of 1% to 2% per week."
                    : "Aim for a healthy weight gain of 1% to 2% per week."}
                </Text>
              </View>
              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Daily Calories:</Text>
                <Text style={styles.h2}>
                  {healthGoals.dailyCalories} Calories
                </Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Carbohydrates:</Text>
                <Text style={styles.h2}>
                  {healthGoals.dailyCarbs}%{" "}
                  <Text style={styles.h2_secondary}>
                    {"("}
                    {(
                      (healthGoals.dailyCalories * healthGoals.dailyCarbs) /
                      100 /
                      4
                    ).toFixed(1)}
                    g{")"}
                  </Text>
                </Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Proteins:</Text>
                <Text style={styles.h2}>
                  {healthGoals.dailyProtein}%{" "}
                  <Text style={styles.h2_secondary}>
                    {"("}
                    {(
                      (healthGoals.dailyCalories * healthGoals.dailyProtein) /
                      100 /
                      4
                    ).toFixed(1)}
                    g{")"}
                  </Text>
                </Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Fat:</Text>
                <Text style={styles.h2}>
                  {100 - (healthGoals.dailyProtein + healthGoals.dailyCarbs)}%{" "}
                  <Text style={styles.h2_secondary}>
                    {"("}
                    {(
                      (healthGoals.dailyCalories *
                        (100 -
                          (healthGoals.dailyProtein +
                            healthGoals.dailyCarbs))) /
                      100 /
                      9
                    ).toFixed(1)}
                    g{")"}
                  </Text>
                </Text>
              </View>

              <View style={styles.goalContainer}>
                <Text style={styles.h1}>Meals Per Day:</Text>
                <Text style={styles.h2}>{healthGoals.mealsPerDay} Meals</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate("Dashboard");
                }}
              >
                <Text style={styles.h4}>Back to DashBoard</Text>
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

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#E6ECFC",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
  },
  goalContainer: {
    backgroundColor: "#D2DAF0",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
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
