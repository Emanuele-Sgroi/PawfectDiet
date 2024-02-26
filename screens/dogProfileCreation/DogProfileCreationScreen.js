import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { images } from "../../constants/index";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TitleOnlyNavbar,
  ProfileCreationSteps,
  DogProfileCreationStep1,
  DogProfileCreationStep2,
  DogProfileCreationStep3,
  DogProfileCreationStep4,
} from "../../components/index";

const DogProfileCreationScreen = ({ navigation }) => {
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
    foodType: "",
  });

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
          />
        );
      case 4:
        return (
          <DogProfileCreationStep4
            onSubmit={goToNextStep}
            profileData={profileData}
          />
        );
    }
  };

  // Function to check if user is logged in
  const isLoggedIn = async () => {
    const value = await AsyncStorage.getItem("isLoggedIn");
    return value === "true";
  };

  // Use useEffect to check login status on component mount
  useEffect(() => {
    const checkLogin = async () => {
      const userLogged = await isLoggedIn();
      console.log("User logged in:", userLogged); // Log login status

      // Redirect to login if not logged in
      if (!userLogged) {
        navigation.dispatch(
          CommonActions.navigate({
            name: "Login",
          })
        );
      }
    };

    checkLogin();
  }, []); // Dependency array to run only once on mount

  return (
    <View style={styles.container}>
      <TitleOnlyNavbar
        onBackPress={() => console.log("Back pressed")}
        title="Let's Meet Your Furry Friend"
      />
      <ProfileCreationSteps
        onPress={goToPreviousStep}
        currentStep={currentStep}
      />
      {renderStepComponent()}
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
