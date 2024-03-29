import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { images } from "../../constants/index";
import * as SecureStore from "expo-secure-store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const TopNav = ({ onPress }) => {
  const [dogProfile, setDogProfile] = useState({
    name: "",
    photoUrl:
      "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083",
    tag: "",
  });

  useFocusEffect(
    useCallback(() => {
      const fetchActiveDogProfile = async () => {
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
      };

      fetchActiveDogProfile();
    }, [])
  );

  const profilePadding =
    dogProfile.photoUrl ===
    "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083"
      ? 10
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.imgContainer, { padding: profilePadding }]}>
            <Image
              style={styles.profilePicture}
              source={{ uri: dogProfile.photoUrl }}
            />
          </View>
        </TouchableOpacity>

        <Image source={images.logo_white} style={styles.logo} />

        <TouchableOpacity onPress={onPress}>
          <Image source={images.bell_white} style={styles.bell} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#181C39",
  },
  container: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#181C39",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 25,
  },
  imgContainer: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 32.5,
    overflow: "hidden",
    marginTop: 10,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    resizeMode: "cover",
  },
  logo: {
    width: 130,
    height: 40,
    resizeMode: "contain",
    marginTop: 10,
  },
  bell: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginTop: 10,
  },
});

export default TopNav;
