import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { images } from "../../constants/index";
import {
  NavigationContainer,
  createNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAutoLogin = async () => {
      const isLoggedIn = await SecureStore.getItemAsync("isLoggedIn");
      const userId = await SecureStore.getItemAsync("userId");

      if (isLoggedIn === "true" && userId) {
        try {
          const currentUserDoc = await getDoc(doc(db, "users", userId));
          if (currentUserDoc.exists()) {
            const currentUser = currentUserDoc.data();
            const dogNumber = currentUser.dogNumber;

            let nextScreen = "DogProfileCreation"; // Default to DogProfileCreation
            if (dogNumber === 1) {
              nextScreen = "Main";
            } else if (dogNumber > 1) {
              nextScreen = "DogProfileSelection";
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
    }, 3000); // Adjust the delay as needed
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
    width: screenWidth * 0.95, // 95% of the screen width
    height: screenWidth * 0.95, // Make the height equal to the width for square aspect ratio
    // If your logo is not square, you might need to adjust the height to maintain the aspect ratio
    maxWidth: 600, // Maximum width to prevent the logo from being too large on tablets or large devices
    maxHeight: 600, // Maximum height to match the maximum width
  },
  welcomeText: {
    position: "absolute", // Position the text absolutely to place it at the bottom
    bottom: 20, // Distance from the bottom of the screen
    fontSize: 18,
    //fontWeight: "bold",
    color: "#ffffff", // Adjust the text color to ensure it's visible on the background
  },
});

export default WelcomeScreen;
