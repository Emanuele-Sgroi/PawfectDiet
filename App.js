import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useRef } from "react";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  LoginScreen,
  WelcomeScreen,
  SignupScreen,
  DogProfileCreationScreen,
  MainScreen,
  BreedRecognitionScreen,
} from "./screens/index";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "MerriweatherSans-Regular": require("./assets/fonts/MerriweatherSans-Regular.ttf"),
        "MerriweatherSans-Bold": require("./assets/fonts/MerriweatherSans-Bold.ttf"),
        "MerriweatherSans-BoldItalic": require("./assets/fonts/MerriweatherSans-BoldItalic.ttf"),
        "MerriweatherSans-ExtraBold": require("./assets/fonts/MerriweatherSans-ExtraBold.ttf"),
        "MerriweatherSans-ExtraBoldItalic": require("./assets/fonts/MerriweatherSans-ExtraBoldItalic.ttf"),
        "MerriweatherSans-Italic": require("./assets/fonts/MerriweatherSans-Italic.ttf"),
        "MerriweatherSans-Light": require("./assets/fonts/MerriweatherSans-Light.ttf"),
        "MerriweatherSans-LightItalic": require("./assets/fonts/MerriweatherSans-LightItalic.ttf"),
        "MerriweatherSans-Medium": require("./assets/fonts/MerriweatherSans-Medium.ttf"),
        "MerriweatherSans-MediumItalic": require("./assets/fonts/MerriweatherSans-MediumItalic.ttf"),
        "MerriweatherSans-SemiBold": require("./assets/fonts/MerriweatherSans-SemiBold.ttf"),
        "MerriweatherSans-SemiBoldItalic": require("./assets/fonts/MerriweatherSans-SemiBoldItalic.ttf"),
      });
      setFontLoaded(true);
    };

    loadFonts().catch(console.error);
  }, []);

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DogProfileCreation"
            component={DogProfileCreationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BreedRecognition"
            component={BreedRecognitionScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
      <Toast />
    </>
  );
}
