/*
  MoreMenuScreen
  --------------
  Hamburger‑style menu: shows active dog header, then a list of nav links,
  plus account/dog profile actions and a logout confirmation modal.

  Static links have been moved into an array so the JSX stays tidy.
*/

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";

import { images } from "../../constants";
import { db, auth } from "../../../firebaseConfig";
import {
  InfoModalTemoButton,
  ButtonLarge,
  LoggingOutModal,
} from "../../components";

const NAV_LINKS = [
  { icon: images.dashboard_black, label: "Dashboard", screen: "Dashboard" },
  {
    icon: images.feed_log_black,
    label: "Feed Log",
    screen: "Feed Log",
    params: { refresh: true },
  },
  { icon: images.vet_care_black, label: "Vet Care", screen: "Vet Care" },
  { icon: images.saved_food_black, label: "Saved Food", screen: "Saved Food" },
  { icon: images.flag_black, label: "Health Goals", screen: "HealthGoals" },
  // divider
  { icon: images.user_black, label: "Account", soon: true },
  { icon: images.dog_profile_black, label: "Dog Profile", soon: true },
  {
    icon: images.switch_dog_black,
    label: "Switch Dog Profile",
    screen: "SwitchDog",
    params: { refresh: true },
  },
  { icon: images.reminder_black, label: "Reminders", soon: true },
  { icon: images.notification_black, label: "Notification", soon: true },
  // divider
  { icon: images.privacy_black, label: "Privacy Center", soon: true },
  { icon: images.question_black, label: "Help", soon: true },
  { icon: images.settings_black, label: "Settings", soon: true },
];

const defaultPic =
  images.default_profile_picture ??
  "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083";

const MoreMenuScreen = ({ navigation }) => {
  const [dogProfile, setDogProfile] = useState({
    name: "",
    photoUrl: defaultPic,
    tag: "",
  });
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // fetch active dog on focus
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const uid = await SecureStore.getItemAsync("userId");
          const dogName = await SecureStore.getItemAsync("activeDogProfile");
          if (!uid || !dogName) return;
          const snap = await getDoc(doc(db, `users/${uid}/dogs/${dogName}`));
          if (snap.exists()) {
            const d = snap.data();
            setDogProfile({
              name: d.dogName,
              photoUrl: d.profilePicture,
              tag: d.tagLine,
            });
          }
        } catch (e) {
          console.warn(e);
        }
      })();
    }, [])
  );

  const profilePadding = dogProfile.photoUrl === defaultPic ? 10 : 0;

  // ─── actions ────────────────────────────────────────────────
  const toast = (type, msg) => Toast.show({ type, text1: msg });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("activeDogProfile");
      toast("success", "You have been logged out");
      setIsLoggingOut(false);
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } catch (e) {
      console.error(e);
      toast("error", "Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const openSoon = () => setIsInfoOpen(true);

  // ─── render ────────────────────────────────────────────────
  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Active dog header */}
          <View style={styles.activeDogContainer}>
            <View style={[styles.imgContainer, { padding: profilePadding }]}>
              {" "}
              <Image
                style={styles.profilePicture}
                source={{ uri: dogProfile.photoUrl }}
              />{" "}
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.dogTextContainer}>
              <Text style={styles.dogName}>{dogProfile.name}</Text>
              <Text style={styles.dogTag}>{dogProfile.tag}</Text>
            </View>
          </View>

          {/* Nav links */}
          {NAV_LINKS.map(({ icon, label, screen, params, soon }, i) => (
            <React.Fragment key={label}>
              {i === 5 || i === 10 ? <View style={styles.linkLine} /> : null}
              <TouchableOpacity
                style={styles.linkContainer}
                onPress={
                  soon ? openSoon : () => navigation.navigate(screen, params)
                }
              >
                <Image source={icon} style={styles.icon} />
                <Text style={styles.linkText}>{label}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}

          {/* Logout button */}
          <View style={{ width: "90%", alignSelf: "center" }}>
            <ButtonLarge
              buttonName="LOG OUT"
              isThereArrow={true}
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

// styles unchanged ↓
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
