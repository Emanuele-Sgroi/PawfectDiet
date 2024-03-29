import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TitleOnlyNavbar,
  ProfileCreationSteps,
  DogProfileCreationStep1,
  DogProfileCreationStep2,
  DogProfileCreationStep3,
  DogProfileCreationStep4,
  BasicLoadingModal,
} from "../../components/index";
import {
  doc,
  setDoc,
  runTransaction,
  collection,
  addDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../../firebaseConfig";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { generateHealthGoals } from "../../AIHelper/DogDataFormatterForAI";

const DogProfileCreationScreen = ({ navigation }) => {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // from step 1
    dogName: "",
    breed: "",
    dateOfBirth: "",
    gender: "",
    // from step 2
    isWorkingDog: false,
    workType: "",
    workDogOtherActivities: "",
    activityType: "",
    activityLevel: "",
    dogWeigth: "",
    regularMedication: "",
    recentHealthChange: "",
    allergies: "",
    neuteredSpayed: false,
    isPregnant: false,
    pregnancyDurationMonths: "",
    pregnancyDurationWeeks: "",
    isBreastfeeding: false,
    // from step 3
    commercialFoodPreferences: [],
    treatPreferences: [],
    homemadeFoodPreferences: [],
    opennessToNewFoods: true,
    // from step 4
    profilePicture:
      "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083",
    tagLine: "The Treats Detective",
    createdAt: new Date(),
  });

  const patterns = {
    age: /Age: (\d+ years)/,
    category: /Category: (Adult|Puppy|Senior)/,
    breed: /Breed: ([\w\s]+)/,
    startingWeight: /Starting Weight: ([\d.]+ kg)/,
    currentWeight: /Current Weight: ([\d.]+ kg)/,
    safeWeightZone: /Safe Weight Zone: ([\d-]+ kg)/,
    goalWeight: /Goal Weight: ([\d.]+ kg)/,
    overallGoal: /Overall Goal: ([\w\s]+)/,
    dailyCalories:
      /Daily Calories:.*?(?:\d{1,3}(?:,\d{3})*-)?(\d{1,3}(?:,\d{3})*)\s*calories/,
    dailyProtein: /Daily Protein: ([\d-%]+ of total calories)/,
    dailyCarbs: /Daily Carbs: ([\d-%]+ of total calories)/,
    dailyFat: /Daily Fat: ([\d-%]+ of total calories)/,
    mealsPerDay: /Meals per day: (\d+ meals)/,
    suggestedActivities: /Suggested Activities: ([\w\s,()]+)$/, // Matches various activity formats
  };

  const resetDocuments = () => {
    setCurrentStep(1);
    setProfileData({
      // from step 1
      dogName: "",
      breed: "",
      dateOfBirth: "",
      gender: "",
      // from step 2
      isWorkingDog: false,
      workType: "",
      workDogOtherActivities: "",
      activityType: "",
      activityLevel: "",
      dogWeigth: "",
      regularMedication: "",
      recentHealthChange: "",
      allergies: "",
      neuteredSpayed: false,
      isPregnant: false,
      pregnancyDurationMonths: "",
      pregnancyDurationWeeks: "",
      isBreastfeeding: false,
      // from step 3
      commercialFoodPreferences: [],
      treatPreferences: [],
      homemadeFoodPreferences: [],
      opennessToNewFoods: true,
      // from step 4
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083",
      tagLine: "The Treats Detective",
      createdAt: new Date(),
    });
  };

  const goToNextStep = (dataFromCurrentStep) => {
    console.log("Received in goToNextStep:", dataFromCurrentStep);
    setProfileData((prevData) => ({ ...prevData, ...dataFromCurrentStep }));
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishProfileCreation = (dataFromLastStep) => {
    setLoading(true);
    setProfileData((prevData) => {
      const updatedProfileData = { ...prevData, ...dataFromLastStep };
      saveDogProfileToFirestore(updatedProfileData);
      return updatedProfileData;
    });
  };

  const saveDogProfileToFirestore = async (updatedProfileData) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const dogName = updatedProfileData.dogName;
      const docRef = doc(db, `users/${userId}/dogs`, dogName);
      await setDoc(docRef, updatedProfileData);
      await updateDogNumber(userId);
      await SecureStore.setItemAsync("activeDogProfile", dogName);
      const createdHealthGoals = generateHealthGoals(updatedProfileData);
      await saveAiInfo(createdHealthGoals, docRef);
    } catch (error) {
      onToastError("Profile creation failed");
      setLoading(false);
    } finally {
      setLoading(false);
      navigation.navigate("Main", { refresh: true });
      onToastSuccess(
        "Profile Created!",
        `Let's give ${updatedProfileData.dogName} the best diet!`
      );
      resetDocuments();
    }
  };

  const saveAiInfo = async (goals, dogRef) => {
    // console.log("saveAiInfo called with goals:", goals);
    try {
      const goalsCollectionRef = collection(dogRef, "healthGoals");
      await addDoc(goalsCollectionRef, {
        ...goals,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error fetching AI --> ", error);
    }
  };

  function extractHealthGoalsFromAIResponse(aiResponse) {
    const healthGoals = {};

    Object.keys(patterns).forEach((key) => {
      const match = aiResponse.match(patterns[key]);
      healthGoals[key] = match ? match[1] : "Not Specified";
    });

    const activitiesMatch = aiResponse.match(/Suggested Activities: (.*)$/);
    if (activitiesMatch) {
      healthGoals.suggestedActivities = activitiesMatch[1].trim();
    } else {
      healthGoals.suggestedActivities = "Not specified";
    }

    return healthGoals;
  }

  const updateDogNumber = async (userId) => {
    const userRef = doc(db, "users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw "User document does not exist!";
        }

        const currentDogNumber = userDoc.data().dogNumber || 0;
        transaction.update(userRef, { dogNumber: currentDogNumber + 1 });
      });
    } catch (error) {
      onToastError("Profile creation failed");
      setLoading(false);
    }
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DogProfileCreationStep1
            onSubmit={goToNextStep}
            profileData={profileData}
            navigation={navigation}
          />
        );
      case 2:
        return (
          <DogProfileCreationStep2
            onSubmit={goToNextStep}
            profileData={profileData}
            name={profileData.dogName}
          />
        );
      case 3:
        return (
          <DogProfileCreationStep3
            onSubmit={goToNextStep}
            profileData={profileData}
            name={profileData.dogName}
          />
        );
      case 4:
        return (
          <DogProfileCreationStep4
            onSubmit={handleFinishProfileCreation}
            profileData={profileData}
            name={profileData.dogName}
          />
        );
    }
  };

  const isLoggedIn = async () => {
    const value = await AsyncStorage.getItem("isLoggedIn");
    return value === "true";
  };

  useEffect(() => {
    const checkLogin = async () => {
      const userLogged = await isLoggedIn();
      console.log("User logged in:", userLogged); // Log login status

      if (!userLogged) {
        navigation.dispatch(
          CommonActions.navigate({
            name: "Login",
          })
        );
      }
    };

    checkLogin();
  }, []);

  const handleBackPress = async () => {
    const cameFromLogin = route?.params?.cameFromLogin;

    if (cameFromLogin) {
      try {
        await signOut(auth);
        await SecureStore.deleteItemAsync("userId");
        await SecureStore.deleteItemAsync("activeDogProfile");
        navigation.navigate("Login");
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    } else {
      if (!navigation.goBack()) {
        navigation.navigate("SwitchDog");
      }
    }
  };

  const onToastError = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const onToastSuccess = (title, message) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
    });
  };

  return (
    <View style={styles.container}>
      <TitleOnlyNavbar
        onBackPress={handleBackPress}
        title="Let's Meet Your Furry Friend"
      />
      <ProfileCreationSteps
        onPress={goToPreviousStep}
        currentStep={currentStep}
      />
      {renderStepComponent()}
      <BasicLoadingModal
        visible={loading}
        customTitle={`We are creation ${profileData.dogName}'s profile`}
        customMessage={"This won't take long"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
    width: "100%",
  },
});

export default DogProfileCreationScreen;
