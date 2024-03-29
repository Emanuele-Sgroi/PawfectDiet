import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { format, subDays, addDays, isSameDay } from "date-fns";
import { images } from "../../constants/index";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign"; // questioncircleo - star
import FontAwesome from "react-native-vector-icons/FontAwesome"; // remove
import Foundation from "react-native-vector-icons/FontAwesome"; // refresh
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
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  ButtonLarge,
  BasicLoadingModal,
  AddFoodModal,
  AIFailsModal,
  AddTreatModal,
  AddActivityModal,
  Stopwatch,
} from "../../components/index";
import { dailyLogAIPrompt } from "../../AIHelper/DogFoodSuggestionForAI";
import { dailyLogResultPrompt } from "../../AIHelper/DogDailyResultForAI";
import { fetchAISuggestions } from "../../../OpenAIService";
import {
  dogCommercialFoodData,
  dogHomemadeFoodData,
  dogTreatsData,
} from "../../../dogFoodData";
import ConfettiCannon from "react-native-confetti-cannon";

const combinedFoodData = [...dogCommercialFoodData, ...dogHomemadeFoodData];

const dogExercises = [
  "Walking",
  "Running",
  "Fetch",
  "Swimming",
  "Agility Training",
  "Ball Games",
  "Frisbee",
  "Hiking",
  "Hide and Seek",
  "Obstacle Course",
];

const MET_VALUES = {
  Walking: 3.0, // Moderate walking
  Running: 8.0, // Running at a moderate pace
  Fetch: 4.0, // Playing fetch, includes running and resting
  Swimming: 10.0, // Active swimming
  "Agility Training": 5.0, // Agility exercises
  "Ball Games": 4.0, // Playing with balls, moderate to vigorous effort
  Frisbee: 4.0, // Playing frisbee
  Hiking: 7.0, // Hiking in rough terrain
  "Hide and Seek": 3.0, // Playing hide and seek
  "Obstacle Course": 5.0, // Navigating an obstacle course
};

const workMetValues = {
  "Athletic and Agility Competitions": 8,
  "Search and Rescue": 7,
  "Service Dog": 3,
  Herding: 6,
  "Therapy Work": 2,
};

const FeedLogScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todayDate = new Date();
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
  const [isLoading, setIsLoading] = useState(false);
  const [isAiFail, setIsAiFail] = useState(false);
  const [aiFailMessage, setAiFailMessage] = useState("");
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [addFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [addTreatModalVisible, setAddTreatModalVisible] = useState(false);
  const [addActivityModalVisible, setAddActivityModalVisible] = useState(false);
  const [workDuration, setWorkDuration] = useState(0); // Duration in hours
  const [manualDuration, setManualDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [setDuration, setSetDuration] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyResultAI, setDailyResultAI] = useState("");
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

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
        } else {
          console.log("No health goals found");
        }
      };

      fetchDogInfoAndGoals();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
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
          setFeedLogs(feedLogSnap.data().logs || []);
        } else {
          console.log("No feed log found for the selected date");
          setFeedLogs([]); // Reset/empty the logs if none found
        }
      };

      fetchFeedLogs();
    }, [selectedDate, dogInfo])
  );

  useFocusEffect(
    useCallback(() => {
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
              remainingCalories: parseFloat(healthGoals.dailyCalories).toFixed(
                0
              ),
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
    }, [selectedDate, dogInfo, healthGoals])
  );

  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const generateDailyLogWithAI = async () => {
    setIsLoading(true);

    try {
      const personalisedPlanAI = dailyLogAIPrompt(
        dogInfo,
        healthGoals,
        feedLogs
      );
      const aiResponseString = await fetchAISuggestions(personalisedPlanAI);
      // console.log("AI Response: ", aiResponseString); // Debugging

      const aiResponse = JSON.parse(aiResponseString);
      //console.log("AI Response: ", aiResponse);

      calculateCalories(
        aiResponse.food,
        aiResponse.treats,
        aiResponse.activities,
        aiResponse.work
      );
    } catch (error) {
      console.error("Error generating daily log with AI:", error);
      setIsLoading(false);
      setIsAiFail(true);
      setAiFailMessage(
        "There was a connection error between the AI and the System. PLEASE TRY AGAIN"
      );
    }
  };

  const calculateCalories = (food, treats, activities, work) => {
    // console.log("dogInfo:", dogInfo);
    // console.log("healthGoals:", healthGoals);
    // console.log("activities:", activities);
    // console.log("food:", food);
    // console.log("treats:", treats);

    const CALORIES_PER_GRAM_PROTEIN = 4;
    const CALORIES_PER_GRAM_CARBS = 4;
    const CALORIES_PER_GRAM_FAT = 9;

    let totalTreatCalories = 0;
    let totalFoodCalories = 0;
    let foodDetails = [];
    let treatDetails = [];

    let totalCaloriesNeeded = healthGoals.dailyCalories;
    let totalProteinsNeeded =
      (healthGoals.dailyCalories * healthGoals.dailyProtein) /
      100 /
      CALORIES_PER_GRAM_PROTEIN;
    let totalCarbsNeeded =
      (healthGoals.dailyCalories * healthGoals.dailyCarbs) /
      100 /
      CALORIES_PER_GRAM_CARBS;
    let totalFatsNeeded =
      (healthGoals.dailyCalories * healthGoals.dailyFat) /
      100 /
      CALORIES_PER_GRAM_FAT;

    let caloriesBurnedActivity = activities.reduce((total, activity) => {
      const metValue = MET_VALUES[activity.name] || 0;
      const durationInHours = Number(activity.durationInMinutes) / 60;
      const weightKg = Number(dogInfo.dogWeight);
      return Number(total + metValue * weightKg * durationInHours);
    }, 0);

    //  console.log("activity calories", caloriesBurnedActivity);

    totalCaloriesNeeded += caloriesBurnedActivity;
    const additionalCarbsNeeded = (caloriesBurnedActivity * 0.6) / 4; // 4 calories per gram for carbs
    const additionalProteinsNeeded = (caloriesBurnedActivity * 0.25) / 4; // 4 calories per gram for protein
    const additionalFatsNeeded = (caloriesBurnedActivity * 0.15) / 9; // 9 calories per gram for fats
    totalProteinsNeeded += additionalProteinsNeeded;
    totalCarbsNeeded += additionalCarbsNeeded;
    totalFatsNeeded += additionalFatsNeeded;

    const activitiesDetails = activities.map((activity) => {
      const metValue = MET_VALUES[activity.name] || 0;
      const durationInHours = activity.durationInMinutes / 60;
      const weightKg = Number(dogInfo.dogWeight);
      const caloriesBurned = metValue * weightKg * durationInHours;
      return {
        ...activity,
        caloriesBurned: Number(caloriesBurned.toFixed(0)),
      };
    });

    // console.log(activitiesDetails);

    // console.log(
    //   totalCaloriesNeeded,
    //   totalProteinsNeeded,
    //   totalCarbsNeeded,
    //   totalFatsNeeded
    // );

    let remainingCalories = totalCaloriesNeeded;
    let remainingProteins = totalProteinsNeeded;
    let remainingCarbs = totalCarbsNeeded;
    let remainingFats = totalFatsNeeded;

    // find and calculate treats calories
    let treatsNutrientsCalculation = treats.reduce(
      (totals, treatItem) => {
        const dbTreat = dogTreatsData.find(
          (dbItem) =>
            dbItem.name === treatItem.treatName &&
            dbItem.brand === treatItem.treatBrand
        );

        if (dbTreat) {
          const numberOfTreats = treatItem.numberOfTreatPerDay;
          const treatCalories =
            dbTreat.nutritionalInfo.caloriesPerPiece * numberOfTreats;

          totalTreatCalories +=
            dbTreat.nutritionalInfo.caloriesPerPiece * numberOfTreats;

          const treatProteins =
            (treatCalories * (dbTreat.nutritionalInfo.protein / 100)) /
            CALORIES_PER_GRAM_PROTEIN;
          const treatCarbs =
            (treatCalories * (dbTreat.nutritionalInfo.carb / 100)) /
            CALORIES_PER_GRAM_CARBS;
          const treatFats =
            (treatCalories * (dbTreat.nutritionalInfo.fat / 100)) /
            CALORIES_PER_GRAM_FAT;

          // Updating total nutrients with values
          totals.calories += treatCalories;
          totals.proteins += treatProteins;
          totals.carbs += treatCarbs;
          totals.fats += treatFats;

          let treatObject = {
            treatName: dbTreat.name,
            brand: dbTreat.brand,
            numberOfTreatsPerDay: numberOfTreats,
            totalCalories: totals.calories,
          };
          treatDetails.push(treatObject);
        }
        return totals;
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );

    remainingCalories -= treatsNutrientsCalculation.calories;
    remainingProteins -= treatsNutrientsCalculation.proteins;
    remainingCarbs -= treatsNutrientsCalculation.carbs;
    remainingFats -= treatsNutrientsCalculation.fats;

    //console.log(remainingCalories);

    let totalNutritionalContribution = {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
    };

    let totalGramsNeeded = {};

    food.forEach((foodItem) => {
      let dbItem =
        dogCommercialFoodData.find(
          (item) =>
            item.name === foodItem.foodName && item.brand === foodItem.foodBrand
        ) ||
        dogHomemadeFoodData.find(
          (item) =>
            item.name === foodItem.foodName && item.brand === foodItem.foodBrand
        );

      if (dbItem) {
        const shareOfCalories = remainingCalories / food.length;
        const gramsNeeded =
          shareOfCalories / dbItem.nutritionalInfo.caloriesPerGram;

        const proteins = (gramsNeeded * dbItem.nutritionalInfo.protein) / 100;
        const carbs = (gramsNeeded * dbItem.nutritionalInfo.carb) / 100;
        const fats = (gramsNeeded * dbItem.nutritionalInfo.fat) / 100;

        totalNutritionalContribution.calories += shareOfCalories;
        totalNutritionalContribution.proteins += proteins;
        totalNutritionalContribution.carbs += carbs;
        totalNutritionalContribution.fats += fats;

        totalGramsNeeded[foodItem.foodName] = gramsNeeded.toFixed(2);

        let foodObject = {
          foodName: dbItem.name,
          brand: dbItem.brand,
          quantityGrams: parseFloat(totalGramsNeeded[foodItem.foodName]),
          totalCalories: totalNutritionalContribution.calories,
          foodNote: foodItem.note,
        };

        //  console.log("food object: ", foodObject);
        foodDetails.push(foodObject);
        //  console.log("food details: ", foodDetails);
      }
    });

    remainingCalories -= totalNutritionalContribution.calories;
    remainingProteins -= totalNutritionalContribution.proteins;
    remainingCarbs -= totalNutritionalContribution.carbs;
    remainingFats -= totalNutritionalContribution.fats;

    totalFoodCalories += totalNutritionalContribution.calories;

    updateDailyFeedLog(
      remainingCalories,
      remainingCarbs,
      remainingFats,
      remainingProteins,
      caloriesBurnedActivity,
      totalTreatCalories,
      totalFoodCalories,
      foodDetails,
      treatDetails,
      activitiesDetails
    );
  };

  const updateDailyFeedLog = async (
    remainingCalories,
    remainingCarbs,
    remainingFats,
    remainingProteins,
    caloriesBurnedActivity,
    totalTreatCalories,
    totalFoodCalories,
    foodDetails,
    treatDetails,
    activitiesDetails
  ) => {
    const userId = await SecureStore.getItemAsync("userId");
    const dogName = dogInfo.dogName;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const dailyLogRef = doc(
      db,
      `users/${userId}/dogs/${dogName}/dailyLogs/${formattedDate}`
    );
    const mealsPrepared = foodDetails?.length ? foodDetails : [];
    const treatsPrepared = treatDetails?.length ? treatDetails : [];
    const activitiesPrepared = activitiesDetails.length
      ? activitiesDetails
      : [];
    const workPrepared = {
      name: dogInfo.isWorkingDog ? dogInfo.workType : "No working",
      duration: 0,
      calories: 0,
    };

    const logContent = {
      remainingCalories,
      remainingProteinGrams: remainingProteins,
      remainingFatGrams: remainingFats,
      remainingCarbsGrams: remainingCarbs,
      activityCalories: caloriesBurnedActivity,
      workCalories: 0,
      treatsCalories: totalTreatCalories,
      mealsCalories: totalFoodCalories,
      meals: mealsPrepared,
      treats: treatsPrepared,
      activities: activitiesPrepared,
      work: workPrepared,
    };

    const isValidData = (data) =>
      !Object.values(data).some((value) => value === undefined);

    try {
      if (isValidData(logContent)) {
        await updateDoc(dailyLogRef, logContent, { merge: true });
        // console.log(
        //   "Daily feed log updated successfully for",
        //   dogName,
        //   "on",
        //   formattedDate
        // );

        setFeedLogs({
          remainingCalories: logContent.remainingCalories,
          remainingProteinGrams: logContent.remainingProteinGrams,
          remainingFatGrams: logContent.remainingFatGrams,
          remainingCarbsGrams: logContent.remainingCarbsGrams,
          activityCalories: logContent.activityCalories,
          workCalories: logContent.workCalories,
          treatsCalories: logContent.treatsCalories,
          mealsCalories: logContent.mealsCalories,
          meals: logContent.meals,
          treats: logContent.treats,
          activities: logContent.activities,
          work: logContent.work,
        });

        setIsLoading(false);
        if (logContent.remainingCalories !== 0) {
          setIsAiFail(true);
          setAiFailMessage(
            "The AI made a mistake in generating the best diet for the dog. This is an experimental version of the app, so mistakes can happen. PLEASE TRY AGAIN"
          );
        }
      } else {
        console.error("Invalid data detected", logContent);
        setIsLoading(false);
        setIsAiFail(true);
        setAiFailMessage(
          "The AI made a mistake in generating the best diet for the dog. This is an experimental version of the app, so mistakes can happen. PLEASE TRY AGAIN"
        );
      }
    } catch (error) {
      console.error("Error updating daily feed log:", error);
      setIsLoading(false);
      setIsAiFail(true);
      setAiFailMessage(
        "There was an error of communication between the System and the Database. PLEASE TRY AGAIN"
      );
    }
  };

  const removeMeal = async (index) => {
    const removedMeal = feedLogs.meals[index];
    let removedMealCalories = 0;

    const dbItem =
      dogCommercialFoodData.find(
        (item) =>
          item.name === removedMeal.foodName && item.brand === removedMeal.brand
      ) ||
      dogHomemadeFoodData.find(
        (item) =>
          item.name === removedMeal.foodName && item.brand === removedMeal.brand
      );

    if (dbItem) {
      removedMealCalories =
        removedMeal.quantityGrams * dbItem.nutritionalInfo.caloriesPerGram;
    }

    const newMeals = feedLogs.meals.filter((_, i) => i !== index);
    setFeedLogs((prevLogs) => ({
      ...prevLogs,
      meals: newMeals,
      remainingCalories: prevLogs.remainingCalories + removedMealCalories,
      mealsCalories: prevLogs.mealsCalories - removedMealCalories,
    }));

    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const dailyLogRef = doc(
      db,
      `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
    );

    await updateDoc(dailyLogRef, {
      meals: newMeals,
      remainingCalories: increment(removedMealCalories),
      mealsCalories: increment(-removedMealCalories),
    });
  };

  const removeTreat = async (index) => {
    const removedTreat = feedLogs.treats[index];
    let removedTreatCalories = 0;

    const dbItem = dogTreatsData.find(
      (item) =>
        item.name === removedTreat.treatName &&
        item.brand === removedTreat.brand
    );

    if (dbItem) {
      removedTreatCalories +=
        removedTreat.numberOfTreatsPerDay *
        dbItem.nutritionalInfo.caloriesPerPiece;
    }

    const newTreats = feedLogs.treats.filter((_, i) => i !== index);
    setFeedLogs((prevLogs) => ({
      ...prevLogs,
      treats: newTreats,
      remainingCalories: prevLogs.remainingCalories + removedTreatCalories,
      treatsCalories: prevLogs.treatsCalories - removedTreatCalories,
    }));

    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const dailyLogRef = doc(
      db,
      `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
    );

    const updatedRemainingCalories =
      feedLogs.remainingCalories + removedTreatCalories;
    const updatedTreatsCalories =
      feedLogs.treatsCalories - removedTreatCalories;

    // Update in database
    await updateDoc(dailyLogRef, {
      treats: newTreats,
      remainingCalories: updatedRemainingCalories,
      treatsCalories: updatedTreatsCalories,
    });
  };

  const handleNotePress = (meal) => {
    setSelectedMeal(meal);
    setIsNoteVisible(true);
  };

  const handleOpenAddFoodModal = () => {
    setAddFoodModalVisible(true);
  };

  const handleOpenAddTreatModal = () => {
    setAddTreatModalVisible(true);
  };

  const handleCloseAddFoodModal = () => {
    setAddFoodModalVisible(false);
  };

  const handleCloseAddTreatModal = () => {
    setAddTreatModalVisible(false);
  };

  const handleAddSelectedFood = async (foodItem, quantity) => {
    const numericQuantity = Number(quantity);
    const calories = numericQuantity * foodItem.nutritionalInfo.caloriesPerGram;
    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      const newMeal = {
        foodName: foodItem.name,
        brand: foodItem.brand,
        quantityGrams: numericQuantity,
        totalCalories: calories.toFixed(0),
        foodNote:
          "This food was personally selected by you and appears to be a great choice for your dog, potentially enriching its diet with valuable nutrients and energy.",
      };

      setFeedLogs((prevLogs) => ({
        ...prevLogs,
        meals: [...prevLogs.meals, newMeal],
        mealsCalories: prevLogs.mealsCalories + calories,
        remainingCalories: prevLogs.remainingCalories - calories,
        // Adjust remainingCalories accordingly
      }));

      const dailyLogRef = doc(
        db,
        `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
      );

      await updateDoc(dailyLogRef, {
        meals: arrayUnion(newMeal),
        mealsCalories: increment(calories),
        remainingCalories: increment(-calories),
      });
    } catch (error) {
      console.log("Error adding food: ", error);
      setIsAiFail(true);
      setAiFailMessage(
        "There was an error of communication between the System and the Database. PLEASE TRY AGAIN"
      );
    }
  };

  const handleAddSelectedTreat = async (foodItem, quantity) => {
    const numericQuantity = Number(quantity);
    const calories =
      numericQuantity * foodItem.nutritionalInfo.caloriesPerPiece;
    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      const newTreat = {
        treatName: foodItem.name,
        brand: foodItem.brand,
        numberOfTreatsPerDay: numericQuantity,
        totalCalories: calories,
      };

      setFeedLogs((prevLogs) => ({
        ...prevLogs,
        treats: [...prevLogs.treats, newTreat],
        treatsCalories: prevLogs.treatsCalories + calories,
        remainingCalories: prevLogs.remainingCalories - calories,
      }));

      const dailyLogRef = doc(
        db,
        `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
      );

      await updateDoc(dailyLogRef, {
        treats: arrayUnion(newTreat),
        treatsCalories: increment(calories),
        remainingCalories: increment(-calories),
        // Make sure to adjust remainingCalories accordingly
      });
    } catch (error) {
      console.log("Error adding food: ", error);
      setIsAiFail(true);
      setAiFailMessage(
        "There was an error of communication between the System and the Database. PLEASE TRY AGAIN"
      );
    }
  };

  const removeActivity = async (index) => {
    const removedActivity = feedLogs.activities[index];
    let removedActivityCalories = removedActivity.caloriesBurned;

    const newActivity = feedLogs.activities.filter((_, i) => i !== index);
    setFeedLogs((prevLogs) => ({
      ...prevLogs,
      activities: newActivity,
      remainingCalories: prevLogs.remainingCalories - removedActivityCalories,
      activityCalories: prevLogs.activityCalories - removedActivityCalories,
    }));

    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const dailyLogRef = doc(
      db,
      `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
    );

    const updatedRemainingCalories =
      feedLogs.remainingCalories - removedActivityCalories;
    const updatedActivityCalories =
      feedLogs.activityCalories - removedActivityCalories;

    await updateDoc(dailyLogRef, {
      activities: newActivity,
      remainingCalories: updatedRemainingCalories,
      activityCalories: updatedActivityCalories,
    });
  };

  const handleOpenActivityModal = () => {
    setAddActivityModalVisible(true);
  };

  const handleCloseActivityModal = () => {
    setAddActivityModalVisible(false);
  };

  const handleAddSelectedActivity = async (
    selectedActivity,
    duration,
    caloriesBurned
  ) => {
    const numericDuration = Number(duration);
    const calories = Math.round(Number(caloriesBurned));

    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      const newActivity = {
        name: selectedActivity,
        duration: numericDuration,
        caloriesBurned: calories,
      };

      setFeedLogs((prevLogs) => ({
        ...prevLogs,
        activities: [...prevLogs.activities, newActivity],
        activityCalories: prevLogs.activityCalories + calories,
        remainingCalories: prevLogs.remainingCalories + calories,
      }));

      const dailyLogRef = doc(
        db,
        `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
      );

      await updateDoc(dailyLogRef, {
        activities: arrayUnion(newActivity),
        activityCalories: increment(calories),
        remainingCalories: increment(calories),
      });
    } catch (error) {
      console.log("Error adding food: ", error);
      setIsAiFail(true);
      setAiFailMessage(
        "There was an error of communication between the System and the Database. PLEASE TRY AGAIN"
      );
    }
  };

  const handleStop = async (elapsedTimeInSeconds) => {
    const durationInHours = elapsedTimeInSeconds / 3600;
    const metValue = workMetValues[dogInfo.workType];

    let caloriesBurned = metValue * dogInfo.dogWeight * Number(durationInHours);
    caloriesBurned =
      isNaN(caloriesBurned) || caloriesBurned < 1
        ? 0
        : caloriesBurned.toFixed(0);

    const workUpdate = {
      name: dogInfo.workType,
      duration: durationInHours.toFixed(2),
      calories: Number(caloriesBurned),
      time: elapsedTime,
    };

    setFeedLogs((prevLogs) => ({
      ...prevLogs,
      work: workUpdate,
      remainingCalories: prevLogs.remainingCalories + Number(caloriesBurned),
      workCalories: Number(caloriesBurned),
    }));

    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(new Date(), "yyyy-MM-dd");
    const dailyLogRef = doc(
      db,
      `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
    );

    try {
      await updateDoc(dailyLogRef, {
        work: workUpdate,
        remainingCalories: feedLogs.remainingCalories + Number(caloriesBurned),
        workCalories: Number(caloriesBurned),
      });
      setManualDuration(0);
      console.log("Work log updated successfully");
    } catch (error) {
      console.error("Error updating work log:", error);
    }
  };

  const handleReset = async () => {
    const workUpdate = {
      name: dogInfo.workType,
      duration: 0,
      calories: 0,
    };

    setFeedLogs((prevLogs) => ({
      ...prevLogs,
      work: workUpdate,
      remainingCalories: prevLogs.remainingCalories - prevLogs.work.calories,
      workCalories: 0,
    }));

    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const formattedDate = format(new Date(), "yyyy-MM-dd");
    const dailyLogRef = doc(
      db,
      `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
    );

    try {
      await updateDoc(dailyLogRef, {
        work: workUpdate,
        remainingCalories: feedLogs.remainingCalories - feedLogs.work.calories,
        workCalories: 0,
      });
      setElapsedTime(0);
      console.log("Work log updated successfully");
    } catch (error) {
      console.error("Error updating work log:", error);
    }
  };

  const handleSetManualTime = () => {
    const durationInSeconds = parseFloat(manualDuration) * 3600;
    if (!isNaN(durationInSeconds) && durationInSeconds > 0) {
      setSetDuration(durationInSeconds);
      setElapsedTime(durationInSeconds);
      handleStop(durationInSeconds);
    } else {
      setManualDuration(0);
      setSetDuration(0);
    }
  };

  const closeDailyLog = async () => {
    setIsResultLoading(true);

    try {
      const dailyResult = dailyLogResultPrompt(dogInfo, healthGoals, feedLogs);
      const aiResponseString = await fetchAISuggestions(dailyResult);
      console.log("AI Response: ", aiResponseString);

      const aiResponse = JSON.parse(aiResponseString);

      if (aiResponse.rate >= 3) {
        setShowConfetti(true);
      }

      setDailyResultAI(aiResponse);
      setIsResultLoading(false);
      setShowResult(true);
    } catch (error) {
      console.error("Error generating daily log with AI:", error);
      setIsResultLoading(false);
      setIsAiFail(true);
      setShowConfetti(false);
      setShowResult(false);
      setAiFailMessage(
        "There was a connection error between the AI and the System. PLEASE TRY AGAIN"
      );
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setShowConfetti(false);
  };

  return (
    <>
      {feedLogs && dogInfo && healthGoals && (
        <>
          <View style={styles.mainContainer}>
            <View style={styles.contentContainer}>
              <View style={styles.navBar}>
                <Text style={styles.navText}> Feed Log</Text>
                <TouchableOpacity>
                  <Image source={images.pie_white} style={styles.navImg} />
                </TouchableOpacity>
              </View>
              <View style={styles.dateNavigation}>
                <TouchableOpacity onPress={handlePrevDay}>
                  <Entypo name="chevron-left" size={27} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.dateText}>
                  {isSameDay(selectedDate, todayDate)
                    ? "Today"
                    : format(selectedDate, "PPP")}
                </Text>
                <TouchableOpacity onPress={handleNextDay}>
                  <Entypo name="chevron-right" size={27} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.caloriesRemainingContainer}>
                <Text style={styles.caloriesTitle}>Calories Remaining</Text>
                <View style={styles.caloriesWrapper}>
                  <View style={styles.textWrapper}>
                    <Text style={styles.calText1}>
                      {parseFloat(healthGoals.dailyCalories).toFixed(0)}
                    </Text>
                    <Text style={styles.calText2}>Goal</Text>
                  </View>
                  <Text style={styles.calText1}>-</Text>
                  <View style={styles.textWrapper}>
                    <Text style={styles.calText1}>
                      {parseFloat(feedLogs.mealsCalories || 0).toFixed(0)}
                    </Text>
                    <Text style={styles.calText2}>Meals</Text>
                  </View>
                  <Text style={styles.calText1}>-</Text>
                  <View style={styles.textWrapper}>
                    <Text style={styles.calText1}>
                      {parseFloat(feedLogs.treatsCalories || 0).toFixed(0)}
                    </Text>
                    <Text style={styles.calText2}>Treats</Text>
                  </View>
                  <Text style={styles.calText1}>+</Text>
                  <View style={styles.textWrapper}>
                    <Text style={styles.calText1}>
                      {(
                        feedLogs.activityCalories + feedLogs.workCalories
                      ).toFixed(0) || 0}
                    </Text>
                    <Text style={styles.calText2}>Burned</Text>
                  </View>

                  <Text style={styles.calText1}>=</Text>
                  <View style={styles.textWrapper}>
                    <Text
                      style={[
                        styles.calText1,
                        {
                          color:
                            healthGoals.dailyCalories -
                              feedLogs.mealsCalories -
                              feedLogs.treatsCalories +
                              (feedLogs.activityCalories +
                                feedLogs.workCalories) <
                            0
                              ? "#bb2124"
                              : healthGoals.dailyCalories -
                                  feedLogs.mealsCalories -
                                  feedLogs.treatsCalories +
                                  (feedLogs.activityCalories +
                                    feedLogs.workCalories) <
                                1
                              ? "#22bb33"
                              : "#000000",
                        },
                      ]}
                    >
                      {(
                        parseFloat(healthGoals.dailyCalories).toFixed(0) -
                        parseFloat(feedLogs.mealsCalories).toFixed(0) -
                        parseFloat(feedLogs.treatsCalories).toFixed(0) +
                        feedLogs.activityCalories +
                        feedLogs.workCalories
                      ).toFixed(0)}
                    </Text>
                    <Text style={styles.calText2}>Remaining</Text>
                  </View>
                </View>
              </View>
              <ScrollView style={styles.scrollContainer}>
                <View style={styles.logContainer}>
                  <View style={{ width: "100%", paddingHorizontal: 10 }}>
                    <ButtonLarge
                      buttonName="Generate Daily Log with AI"
                      onPress={generateDailyLogWithAI}
                    />

                    <View style={styles.mealContainer}>
                      <View style={styles.mealTitleWrapper}>
                        <Text style={styles.mealTitle}>Meals</Text>
                        <View style={styles.mealTitleLine}></View>
                      </View>
                      {feedLogs.meals && feedLogs.meals.length > 1 && (
                        <View style={styles.aiSuggestionContainer}>
                          <Image
                            source={
                              parseFloat(healthGoals.dailyCalories).toFixed(0) -
                                parseFloat(feedLogs.mealsCalories).toFixed(0) -
                                parseFloat(feedLogs.treatsCalories).toFixed(0) +
                                feedLogs.activityCalories +
                                feedLogs.workCalories >=
                              0
                                ? images.chat
                                : images.warning
                            }
                            style={styles.aiSuggestionImg}
                          />
                          <Text
                            style={[
                              styles.aiSuggestionText,
                              {
                                color:
                                  parseFloat(healthGoals.dailyCalories).toFixed(
                                    0
                                  ) -
                                    parseFloat(feedLogs.mealsCalories).toFixed(
                                      0
                                    ) -
                                    parseFloat(feedLogs.treatsCalories).toFixed(
                                      0
                                    ) +
                                    feedLogs.activityCalories +
                                    feedLogs.workCalories >=
                                  0
                                    ? "#fff"
                                    : "red",
                              },
                            ]}
                          >
                            {feedLogs.meals.length < 3 &&
                            parseFloat(healthGoals.dailyCalories).toFixed(0) -
                              parseFloat(feedLogs.mealsCalories).toFixed(0) -
                              parseFloat(feedLogs.treatsCalories).toFixed(0) +
                              feedLogs.activityCalories +
                              feedLogs.workCalories >=
                              0
                              ? `Divide the food in 2 meals per day`
                              : feedLogs.meals.length > 3 &&
                                parseFloat(healthGoals.dailyCalories).toFixed(
                                  0
                                ) -
                                  parseFloat(feedLogs.mealsCalories).toFixed(
                                    0
                                  ) -
                                  parseFloat(feedLogs.treatsCalories).toFixed(
                                    0
                                  ) +
                                  feedLogs.activityCalories +
                                  feedLogs.workCalories >=
                                  0
                              ? `Divide the food in 3 or 4 meals per day`
                              : `Calories exceed daily limit. Please adjust food intake.`}
                          </Text>
                        </View>
                      )}
                      {feedLogs.meals && feedLogs.meals.length > 0 ? (
                        feedLogs.meals.map((meal, index) => (
                          <View key={index} style={styles.loggedItemsContainer}>
                            <View style={styles.loggedItemsPrimary}>
                              <Text style={styles.loggedTextPrimary}>
                                {meal.foodName}
                              </Text>
                              <View style={styles.itemsButtons}>
                                <TouchableOpacity
                                  onPress={() => removeMeal(index)}
                                >
                                  <FontAwesome
                                    name="remove"
                                    color="#bb2124"
                                    size={25}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleNotePress(meal)}
                                >
                                  <AntDesign
                                    name="questioncircleo"
                                    color="#273176"
                                    size={20}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>

                            <View style={styles.loggedItemsSecondary}>
                              <Text style={styles.loggedTextSecondary}>
                                {meal.brand},
                              </Text>
                              <Text style={styles.loggedTextSecondary}>
                                {parseFloat(meal.quantityGrams).toFixed(0)}g
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text>No meals recorded.</Text>
                      )}
                      <TouchableOpacity
                        style={styles.buttonLog}
                        onPress={handleOpenAddFoodModal}
                      >
                        <Text style={styles.buttonLogText}>Add Food</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.mealContainer}>
                      <View style={styles.mealTitleWrapper}>
                        <Text style={styles.mealTitle}>Treats</Text>
                        <View style={styles.mealTitleLine}></View>
                      </View>
                      {feedLogs.treats && feedLogs.treats.length > 0 && (
                        <View style={styles.aiSuggestionContainer}>
                          <Image
                            source={
                              parseFloat(healthGoals.dailyCalories).toFixed(0) -
                                parseFloat(feedLogs.mealsCalories).toFixed(0) -
                                parseFloat(feedLogs.treatsCalories).toFixed(0) +
                                feedLogs.activityCalories +
                                feedLogs.workCalories >=
                              0
                                ? images.chat
                                : images.warning
                            }
                            style={styles.aiSuggestionImg}
                          />
                          <Text
                            style={[
                              styles.aiSuggestionText,
                              {
                                color:
                                  parseFloat(healthGoals.dailyCalories).toFixed(
                                    0
                                  ) -
                                    parseFloat(feedLogs.mealsCalories).toFixed(
                                      0
                                    ) -
                                    parseFloat(feedLogs.treatsCalories).toFixed(
                                      0
                                    ) +
                                    feedLogs.activityCalories +
                                    feedLogs.workCalories >=
                                  0
                                    ? "#fff"
                                    : "red",
                              },
                            ]}
                          >
                            {feedLogs.treats.length >= 0 &&
                            parseFloat(healthGoals.dailyCalories).toFixed(0) -
                              parseFloat(feedLogs.mealsCalories).toFixed(0) -
                              parseFloat(feedLogs.treatsCalories).toFixed(0) +
                              feedLogs.activityCalories +
                              feedLogs.workCalories >=
                              0
                              ? `Keep the treats for playing and training time`
                              : `Calories exceed daily limit. Please adjust food intake.`}
                          </Text>
                        </View>
                      )}
                      {feedLogs.treats && feedLogs.treats.length > 0 ? (
                        feedLogs.treats.map((treat, index) => (
                          <View key={index} style={styles.loggedItemsContainer}>
                            <View style={styles.loggedItemsPrimary}>
                              <Text style={styles.loggedTextPrimary}>
                                {treat.treatName}
                              </Text>
                              <View style={styles.itemsButtons}>
                                <TouchableOpacity
                                  onPress={() => removeTreat(index)}
                                >
                                  <FontAwesome
                                    name="remove"
                                    color="#bb2124"
                                    size={25}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>

                            <View style={styles.loggedItemsSecondary}>
                              <Text style={styles.loggedTextSecondary}>
                                {treat.brand},
                              </Text>
                              <Text style={styles.loggedTextSecondary}>
                                qty:{" "}
                                {parseFloat(treat.numberOfTreatsPerDay).toFixed(
                                  0
                                )}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text>No treats recorded.</Text>
                      )}
                      <TouchableOpacity
                        style={styles.buttonLog}
                        onPress={handleOpenAddTreatModal}
                      >
                        <Text style={styles.buttonLogText}>Add Treat</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.mealContainer}>
                      <View style={styles.mealTitleWrapper}>
                        <Text style={styles.mealTitle}>Activities</Text>
                        <View style={styles.mealTitleLine}></View>
                      </View>
                      {feedLogs.activities &&
                        feedLogs.activities.length > 0 && (
                          <View style={styles.aiSuggestionContainer}>
                            <Image
                              source={images.chat}
                              style={styles.aiSuggestionImg}
                            />
                            <Text
                              style={[
                                styles.aiSuggestionText,
                                {
                                  color: "#fff",
                                },
                              ]}
                            >
                              {`Exercise keeps your dog healthy and happy!`}
                            </Text>
                          </View>
                        )}
                      {feedLogs.activities && feedLogs.activities.length > 0 ? (
                        feedLogs.activities.map((act, index) => (
                          <View key={index} style={styles.loggedItemsContainer}>
                            <View style={styles.loggedItemsPrimary}>
                              <Text style={styles.loggedTextPrimary}>
                                {act.name}
                              </Text>
                              <View style={styles.itemsButtons}>
                                <TouchableOpacity
                                  onPress={() => removeActivity(index)}
                                >
                                  <FontAwesome
                                    name="remove"
                                    color="#bb2124"
                                    size={25}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>

                            <View style={styles.loggedItemsSecondary}>
                              <Text style={styles.loggedTextSecondary}>
                                Duration: {act.duration} minutes,
                              </Text>
                              <Text style={styles.loggedTextSecondary}>
                                calories burned: {act.caloriesBurned.toFixed(0)}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text>No activities recorded.</Text>
                      )}
                      <TouchableOpacity
                        style={styles.buttonLog}
                        onPress={handleOpenActivityModal}
                      >
                        <Text style={styles.buttonLogText}>Add Activity</Text>
                      </TouchableOpacity>
                    </View>

                    {dogInfo.isWorkingDog && (
                      <View style={styles.mealContainer}>
                        <View style={styles.mealTitleWrapper}>
                          <Text style={styles.mealTitle}>
                            Work: {dogInfo.workType}
                          </Text>
                          <View style={styles.mealTitleLine}></View>
                        </View>

                        <Stopwatch
                          elapsedTime={elapsedTime}
                          setElapsedTime={setElapsedTime}
                          manualTimeInSeconds={setDuration}
                          handleStop={handleStop}
                          handleReset={handleReset}
                          onTimeUpdate={setWorkDuration}
                        />

                        <View style={styles.durationInputContainer}>
                          <TextInput
                            style={styles.durationInput}
                            placeholder="Enter duration in hours"
                            keyboardType="numeric"
                            onChangeText={(text) => setManualDuration(text)}
                            value={manualDuration.toString()}
                          />
                          <TouchableOpacity
                            style={styles.addWorkButton}
                            onPress={handleSetManualTime}
                          >
                            <Text style={styles.buttonText}>Set Time</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.caloriesDisplay}>
                          {feedLogs && feedLogs.work && (
                            <Text style={styles.caloriesText}>
                              Calories Burned: {feedLogs.work.calories}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    <ButtonLarge
                      isThereArrow={true}
                      buttonName="Close Daily Log"
                      onPress={closeDailyLog}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          {dogInfo && healthGoals && (
            <BasicLoadingModal
              visible={isLoading}
              customTitle="Please Wait"
              customMessage={`The AI is generating a personalised daily log for ${dogInfo.dogName}`}
            />
          )}

          {dogInfo && healthGoals && feedLogs && (
            <BasicLoadingModal
              visible={isResultLoading}
              customTitle="Please Wait"
              customMessage={`The AI is creating the daily log result for ${dogInfo.dogName}`}
            />
          )}

          <AIFailsModal
            isFail={isAiFail}
            onPress={() => {
              setIsAiFail(false);
            }}
            text={aiFailMessage}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={isNoteVisible}
            onRequestClose={() => {
              setIsNoteVisible(!isNoteVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>The AI Says...</Text>
                <Text style={styles.modalText}>{selectedMeal?.foodNote}</Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setIsNoteVisible(!isNoteVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <AddFoodModal
            visible={addFoodModalVisible}
            onClose={handleCloseAddFoodModal}
            data={combinedFoodData}
            onSelect={(selectedItem) => {
              console.log("Selected item:", selectedItem);
            }}
            onAddFood={handleAddSelectedFood}
          />

          <AddTreatModal
            visible={addTreatModalVisible}
            onClose={handleCloseAddTreatModal}
            data={dogTreatsData}
            onSelect={(selectedItem) => {
              console.log("Selected item:", selectedItem);
            }}
            onAddFood={handleAddSelectedTreat}
          />

          <AddActivityModal
            visible={addActivityModalVisible}
            onClose={handleCloseActivityModal}
            data={dogExercises} //
            onSelect={(selectedItem) => {
              console.log("Selected item:", selectedItem);
            }}
            onAddActivity={handleAddSelectedActivity}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={showResult}
            onRequestClose={handleCloseResult}
            style={styles.modalResult}
          >
            <View style={styles.centeredViewResult}>
              <View style={styles.modalViewResult}>
                <View style={styles.resultProfile}>
                  <Image
                    source={{ uri: dogInfo.profilePicture }}
                    style={styles.resultProfileImg}
                  />
                  <View style={styles.resultProfileTitleContainer}>
                    <Text style={styles.resultProfileTitle1}>
                      {dogInfo.dogName}
                    </Text>
                    <Text style={styles.resultProfileTitle2}>
                      {dogInfo.tagLine}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modalTitleDate}>{formattedDate}</Text>
                <View style={styles.starsContainer}>
                  <AntDesign
                    name="star"
                    size={35}
                    color={dailyResultAI.rate >= 1 ? "#ffff00" : "#494e70"}
                  />
                  <AntDesign
                    name="star"
                    size={35}
                    color={dailyResultAI.rate >= 2 ? "#ffff00" : "#494e70"}
                  />
                  <AntDesign
                    name="star"
                    size={35}
                    color={dailyResultAI.rate >= 3 ? "#ffff00" : "#494e70"}
                  />
                  <AntDesign
                    name="star"
                    size={35}
                    color={dailyResultAI.rate >= 4 ? "#ffff00" : "#494e70"}
                  />
                  <AntDesign
                    name="star"
                    size={35}
                    color={dailyResultAI.rate >= 5 ? "#ffff00" : "#494e70"}
                  />
                </View>

                <View style={styles.resultChatContainer}>
                  <View style={styles.resultChatSubContainer}>
                    <Image
                      source={images.logo_icon}
                      style={styles.resultChatImg}
                    />
                  </View>
                </View>

                <View style={styles.resultWrapper}>
                  <View style={styles.triangle} />
                  <View style={styles.bubble}>
                    <Text style={styles.textResult}>
                      {dailyResultAI.feedback}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleCloseResult}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showConfetti && (
              <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
            )}
          </Modal>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#E6ECFC",
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    height: 70,
    backgroundColor: "#181C39",
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  navText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 20,
    fontFamily: "MerriweatherSans-Bold",
    color: "#ffffff",
  },
  navImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  dateNavigation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#273176",
  },
  dateText: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 15,
    color: "#fff",
  },
  caloriesRemainingContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "#D2DAF0",
  },
  caloriesTitle: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#273176",
    marginBottom: 6,
  },
  caloriesWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  textWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  calText1: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#000000",
  },
  calText2: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 11,
    color: "#7D7D7D",
  },
  scrollContainer: {
    width: "100%",
    marginBottom: 50,
  },
  logContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  mealsWrapper: {
    width: "100%",
    backgroundColor: "#D2DAF0",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
  },
  mealContainer: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    marginBottom: 15,
  },
  mealTitleWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  mealTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#7D7D7D",
  },
  mealTitle: {
    alignSelf: "center",
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 16,
    color: "#273176",
    marginBottom: 6,
  },
  loggedItemsContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    borderColor: "#7D7D7D",
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  loggedItemsPrimary: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  loggedItemsSecondary: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  loggedTextPrimary: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 14,
    color: "#000000",
  },
  loggedTextSecondary: {
    fontFamily: "MerriweatherSans-Italic",
    fontSize: 12,
    color: "#7D7D7D",
  },
  buttonLog: {
    marginTop: 12,
    marginBottom: 5,
    backgroundColor: "#273176",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  buttonLogText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 14,
    color: "#fff",
    marginBottom: 2,
  },
  aiSuggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181C39",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 25,
    gap: 5,
  },
  aiSuggestionImg: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  aiSuggestionText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 12,

    marginBottom: 2,
  },
  itemsButtons: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 11,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#273176",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 20,
    color: "#273176",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 14,
  },
  workContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  workHeader: {
    marginBottom: 20,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#273176",
    marginBottom: 5,
  },
  workType: {
    fontSize: 16,
    color: "#333",
  },
  durationInput: {
    height: 50,
    fontSize: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    borderRadius: 0,
    padding: 10,
    backgroundColor: "#fff",
  },
  caloriesDisplay: {
    marginTop: 20,
  },
  caloriesText: {
    fontSize: 16,
    color: "#273176",
    fontWeight: "bold",
  },
  addWorkButton: {
    height: 50,
    backgroundColor: "#273176",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stopwatchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stopwatchButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  stopwatchText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedItemContainer: {
    backgroundColor: "#eaeaea",
  },
  selectedText: {
    color: "#273176",
  },
  flatList: {
    maxHeight: 200,
    marginTop: 10,
  },
  durationInputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  modalResult: {
    width: "100%",
    height: "100%",
  },
  centeredViewResult: {
    width: "100%",
    height: "100%",
    backgroundColor: "#181C39",
    paddingHorizzontal: 10,
    paddingVertical: 25,
    alignItems: "center",
  },
  modalViewResult: {
    margin: 10,
    alignItems: "center",
  },
  resultProfile: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  resultProfileImg: {
    width: 100,
    height: 100,
    borderWidth: 5,
    borderColor: "#fff",
    resizeMode: "cover",
    borderRadius: 100,
  },
  resultProfileTitleContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  resultProfileTitle1: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 20,
    color: "#fff",
  },
  resultProfileTitle2: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 14,
    color: "#fff",
  },
  modalTitleDate: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 20,
    color: "#fff",
    marginVertical: 15,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  resultChatContainer: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  resultChatSubContainer: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#181C39",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  resultChatImg: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
    transform: [{ rotateZ: "-36deg" }],
  },
  resultWrapper: {
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    // maxWidth: "80%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  textResult: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 13,
    color: "#000000",
  },
});

export default FeedLogScreen;
