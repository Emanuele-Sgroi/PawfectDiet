import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, Image } from "react-native";
import {
  LoginScreen,
  WelcomeScreen,
  SignupScreen,
  DogProfileCreationScreen,
  BreedRecognitionScreen,
  DashboardScreen,
  FeedLogScreen,
  VetCareScreen,
  SavedFoodScreen,
  MoreMenuScreen,
  SwitchDogProfileScreen,
  HealthGoalsScreen,
} from "./src/screens/index";
import Toast from "react-native-toast-message";
import { images } from "./src/constants/index";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "MerriweatherSans-Regular": require("./src/assets/fonts/MerriweatherSans-Regular.ttf"),
        "MerriweatherSans-Bold": require("./src/assets/fonts/MerriweatherSans-Bold.ttf"),
        "MerriweatherSans-BoldItalic": require("./src/assets/fonts/MerriweatherSans-BoldItalic.ttf"),
        "MerriweatherSans-ExtraBold": require("./src/assets/fonts/MerriweatherSans-ExtraBold.ttf"),
        "MerriweatherSans-ExtraBoldItalic": require("./src/assets/fonts/MerriweatherSans-ExtraBoldItalic.ttf"),
        "MerriweatherSans-Italic": require("./src/assets/fonts/MerriweatherSans-Italic.ttf"),
        "MerriweatherSans-Light": require("./src/assets/fonts/MerriweatherSans-Light.ttf"),
        "MerriweatherSans-LightItalic": require("./src/assets/fonts/MerriweatherSans-LightItalic.ttf"),
        "MerriweatherSans-Medium": require("./src/assets/fonts/MerriweatherSans-Medium.ttf"),
        "MerriweatherSans-MediumItalic": require("./src/assets/fonts/MerriweatherSans-MediumItalic.ttf"),
        "MerriweatherSans-SemiBold": require("./src/assets/fonts/MerriweatherSans-SemiBold.ttf"),
        "MerriweatherSans-SemiBoldItalic": require("./src/assets/fonts/MerriweatherSans-SemiBoldItalic.ttf"),
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

  const MainScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let imageSource;

            if (route.name === "Dashboard") {
              imageSource = focused ? images.dashboard : images.dashboard_un;
            } else if (route.name === "Feed Log") {
              imageSource = focused ? images.feed_log : images.feed_log_un;
            } else if (route.name === "Vet Care") {
              imageSource = focused ? images.vet_care : images.vet_care_un;
            } else if (route.name === "Saved Food") {
              imageSource = focused ? images.saved_food : images.saved_food_un;
            } else if (route.name === "More") {
              imageSource = focused ? images.menu_more : images.menu_more_un;
            }

            // Return an Image component with the selected source
            return (
              <Image
                source={imageSource}
                style={{ width: 25, height: 25, resizeMode: "contain" }}
              />
            );
          },
          tabBarActiveTintColor: "#FFFFFF", // Optional: Used for label color
          tabBarInactiveTintColor: "#898C9D", // Optional: Used for label color
          tabBarLabelStyle: { paddingBottom: 5, fontSize: 11 }, // Optional: Style for the label
          tabBarStyle: {
            padding: 10,
            height: 70,
            backgroundColor: "#273176",
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Feed Log"
          component={FeedLogScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Vet Care"
          component={VetCareScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Saved Food"
          component={SavedFoodScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="More"
          component={MoreMenuScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator name="Root" initialRouteName="Welcome">
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
          <Stack.Screen
            name="SwitchDog"
            component={SwitchDogProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HealthGoals"
            component={HealthGoalsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
