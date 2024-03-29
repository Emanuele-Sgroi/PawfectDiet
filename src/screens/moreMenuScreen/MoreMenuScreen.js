import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { images } from "../../constants/index";
import * as SecureStore from "expo-secure-store";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../../firebaseConfig";
import {
  InfoModalTemoButton,
  ButtonLarge,
  LoggingOutModal,
} from "../../components/index";
import Toast from "react-native-toast-message";
import { CommonActions, useFocusEffect } from "@react-navigation/native";

const MoreMenuScreen = ({ navigation }) => {
  const [dogProfile, setDogProfile] = useState({
    name: "",
    photoUrl:
      "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083",
    tag: "",
  });
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchActiveDogProfile() {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogName = await SecureStore.getItemAsync(
          "activeDogProfile"
        );

        try {
          if (userId && activeDogName) {
            const dogRef = doc(db, `users/${userId}/dogs`, activeDogName);
            const dogDoc = await getDoc(dogRef);

            if (dogDoc.exists()) {
              const dogData = dogDoc.data();
              setDogProfile({
                name: dogData.dogName,
                photoUrl: dogData.profilePicture,
                tag: dogData.tagLine,
              });
            } else {
              console.log("No such dog profile!");
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      fetchActiveDogProfile();
    }, [])
  );

  const profilePadding =
    dogProfile.photoUrl ===
    "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083"
      ? 10
      : 0;

  const handleLogout = async () => {
    try {
      await signOut(auth);

      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("activeDogProfile");

      onToastSuccess("You have been logged out");

      setIsLoggingOut(false);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
      onToastError("Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const onToastError = (message) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const onToastSuccess = (message) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.activeDogContainer}>
            <View style={[styles.imgContainer, { padding: profilePadding }]}>
              <Image
                style={styles.profilePicture}
                source={{ uri: dogProfile.photoUrl }}
              />
            </View>
            <View style={styles.verticalLine}></View>
            <View style={styles.dogTextContainer}>
              <Text style={styles.dogName}>{dogProfile.name}</Text>
              <Text style={styles.dogTag}>{dogProfile.tag}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          >
            <Image source={images.dashboard_black} style={styles.icon} />
            <Text style={styles.linkText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => {
              navigation.navigate("Feed Log", { refresh: true });
            }}
          >
            <Image source={images.feed_log_black} style={styles.icon} />
            <Text style={styles.linkText}>Feed Log</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => {
              navigation.navigate("Vet Care");
            }}
          >
            <Image source={images.vet_care_black} style={styles.icon} />
            <Text style={styles.linkText}>Vet Care</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => {
              navigation.navigate("Saved Food");
            }}
          >
            <Image source={images.saved_food_black} style={styles.icon} />
            <Text style={styles.linkText}>Saved Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => {
              navigation.navigate("HealthGoals");
            }}
          >
            <Image source={images.flag_black} style={styles.icon} />
            <Text style={styles.linkText}>Health Goals</Text>
          </TouchableOpacity>

          <View style={styles.linkLine}></View>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.user_black} style={styles.icon} />
            <Text style={styles.linkText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.dog_profile_black} style={styles.icon} />
            <Text style={styles.linkText}>Dog Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate("SwitchDog", { refresh: true })}
          >
            <Image source={images.switch_dog_black} style={styles.icon} />
            <Text style={styles.linkText}>Switch Dog Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.reminder_black} style={styles.icon} />
            <Text style={styles.linkText}>Reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.notification_black} style={styles.icon} />
            <Text style={styles.linkText}>Notification</Text>
          </TouchableOpacity>

          <View style={styles.linkLine}></View>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.privacy_black} style={styles.icon} />
            <Text style={styles.linkText}>Privacy Center</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.question_black} style={styles.icon} />
            <Text style={styles.linkText}>Help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setIsInfoOpen(true)}
          >
            <Image source={images.settings_black} style={styles.icon} />
            <Text style={styles.linkText}>Settings</Text>
          </TouchableOpacity>
          <View style={{ width: "90%", alignSelf: "center" }}>
            <ButtonLarge
              isThereArrow={true}
              buttonName="LOG OUT"
              onPress={() => setIsLoggingOut(true)}
            />
          </View>
        </View>
      </ScrollView>

      {isInfoOpen && (
        <InfoModalTemoButton
          title="Coming Soon"
          message="This section is under development."
          onOkPress={() => setIsInfoOpen(false)}
        />
      )}

      {isLoggingOut && (
        <LoggingOutModal
          title="Are you sure?"
          onNoPress={() => setIsLoggingOut(false)}
          onYesPress={handleLogout}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#E6ECFC",
    width: "100%",
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 15,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
    paddingRight: 20,
    paddingLeft: 45,
  },
  icon: {
    width: 25,
    height: 25,
    marginEnd: 10,
  },
  linkText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 20,
    color: "#273176",
    marginBottom: 2,
  },
  linkLine: {
    width: "60%",
    height: 1,
    backgroundColor: "#000000",
    marginBottom: 7,
  },
  activeDogContainer: {
    width: "100%",
    backgroundColor: "#273176",
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  imgContainer: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 32.5,
    overflow: "hidden",
    marginTop: 20,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    resizeMode: "cover",
  },
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 20,
  },
  dogTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
  },
  dogName: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 20,
    color: "#fff",
  },
  dogTag: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 13,
    color: "#fff",
    opacity: 0.7,
  },
});

export default MoreMenuScreen;
