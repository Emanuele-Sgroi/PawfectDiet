import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { images } from "../../constants/index";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAutoLogin = async () => {
      const isLoggedIn = await SecureStore.getItemAsync("isLoggedIn");
      const userId = await SecureStore.getItemAsync("userId");
      const activeDogProfile = await SecureStore.getItemAsync(
        "activeDogProfile"
      );

      if (isLoggedIn === "true" && userId) {
        try {
          const currentUserDoc = await getDoc(doc(db, "users", userId));
          if (currentUserDoc.exists()) {
            const currentUser = currentUserDoc.data();
            const dogNumber = currentUser.dogNumber;

            let nextScreen = "DogProfileCreation"; // Default to DogProfileCreation
            if (dogNumber === 1) {
              if (activeDogProfile) {
                nextScreen = "Main";
              }
            } else if (dogNumber > 1) {
              nextScreen = "SwitchDog";
            }

            // Navigate to the next screen based on dogNumber
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: nextScreen }],
              })
            );
          } else {
            // Handle the case where the document does not exist
            navigateToLogin();
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          navigateToLogin();
        }
      } else {
        navigateToLogin();
      }
    };

    setTimeout(() => {
      checkAutoLogin();
    }, 3000);
  }, [navigation]);

  const navigateToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.welcomeText}>Powered by AI</Text>
    </View>
  );
};

// Get the full width of the screen
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181C39",
    padding: 10,
  },
  logo: {
    width: screenWidth * 0.95,
    height: screenWidth * 0.95,

    maxWidth: 600,
    maxHeight: 600,
  },
  welcomeText: {
    position: "absolute",
    bottom: 20,
    fontSize: 18,

    color: "#ffffff",
  },
});

export default WelcomeScreen;
