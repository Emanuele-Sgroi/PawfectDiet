import React, { useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../../firebaseConfig";
import * as SecureStore from "expo-secure-store";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { images } from "../../constants/index";
import { ButtonLarge } from "../../components/index";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";

const SwitchDogProfileScreen = ({ navigation }) => {
  const [dogs, setDogs] = useState([]);
  const route = useRoute();

  const handleBackPress = async () => {
    if (route.params?.cameFromLogin || route.params?.cameFromSignup) {
      try {
        await signOut(auth);
        await SecureStore.deleteItemAsync("userId");
        await SecureStore.deleteItemAsync("activeDogProfile");
        navigation.replace("Login");
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    } else {
      if (!navigation.canGoBack()) {
        navigation.replace("Main");
      } else {
        navigation.goBack();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchDogs = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        if (userId) {
          const dogsRef = collection(db, `users/${userId}/dogs`);
          try {
            const snapshot = await getDocs(dogsRef);
            const dogsArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDogs(dogsArray);
          } catch (error) {
            console.log("Error fetching dogs:", error);
          }
        }
      };

      fetchDogs();
    }, [])
  );

  const profilePaddingPreview =
    dogs.profilePicture ===
    "https://firebasestorage.googleapis.com/v0/b/pawfect-diet.appspot.com/o/General%2Fdefault_profile_picture.png?alt=media&token=0d78caf4-f675-41b1-b8d4-a8c0e5a6a083"
      ? 10
      : 0;

  const handleDogSelection = async (dog) => {
    await SecureStore.setItemAsync("activeDogProfile", dog);
    onToastSuccess(`All Rigth!!!`, `Let's give ${dog} the best diet!`);
    navigation.navigate("Main", { refresh: true });
  };

  const handleAddNewDog = () => {
    navigation.navigate("DogProfileCreation");
  };

  const onToastSuccess = (title, message) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
    });
  };

  return (
    <ScrollView style={styles.ScrollContainer}>
      <View style={styles.contentContainer}>
        <ImageBackground source={images.park} style={styles.parkContainer}>
          <Image source={images.dog_sit} style={styles.dogImg} />
          <Image source={images.logo_icon} style={styles.logoImg} />
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="caret-back-sharp" size={32} color="#181C39" />
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.bottomContentContainer}>
          <Text style={styles.h1}>Select Your Paw Partner</Text>
          <View style={styles.line}></View>
          <ScrollView style={styles.scrollDogSelectionContainer}>
            <View style={styles.dogSelectionContainer}>
              {dogs.map((dog, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.previewActual}
                    onPress={() => handleDogSelection(dog.dogName)}
                  >
                    <View
                      style={[
                        styles.previewImgContainer,
                        { padding: profilePaddingPreview },
                      ]}
                    >
                      <Image
                        style={styles.previewProfilePicture}
                        source={{ uri: dog.profilePicture }}
                      />
                    </View>
                    <View style={styles.previewLine}></View>
                    <View style={styles.previewTextContainer}>
                      <Text style={styles.previewName}>{dog.dogName}</Text>
                      <Text style={styles.previewTag}>{dog.tagLine}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <ButtonLarge
            isThereArrow={false}
            buttonName="Add a new companion"
            onPress={handleAddNewDog}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ScrollContainer: {
    backgroundColor: "#E6ECFC",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  parkContainer: {
    width: "100%",
    height: 200,
  },
  dogImg: {
    width: 80,
    height: 100,
    position: "absolute",
    left: 40,
    bottom: 25,
  },
  logoImg: {
    position: "absolute",
    width: 70,
    height: 70,
    top: 30,
    right: 20,
    transform: [{ rotateZ: "-36deg" }],
  },
  backButton: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "absolute",
    padding: 1,
    top: 25,
    left: 18,
    zIndex: 999,
  },
  bottomContentContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  h1: {
    fontSize: 25,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
  },
  line: {
    width: 150,
    height: 1,
    backgroundColor: "#273176",
    marginVertical: 10,
  },
  scrollDogSelectionContainer: {
    width: "100%",
    height: 390,
    backgroundColor: "#fff",
    padding: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 5,
    marginBottom: 15,
  },
  dogSelectionContainer: {
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingBottom: 15,
  },
  previewActual: {
    width: "100%",
    backgroundColor: "#273176",
    padding: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 15,
  },
  previewImgContainer: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 32.5,
    overflow: "hidden",
  },
  previewProfilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    resizeMode: "cover",
  },
  previewLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 15,
  },
  previewTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  previewName: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 20,
    color: "#fff",
  },
  previewTag: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 13,
    color: "#fff",
    opacity: 0.7,
  },
});

export default SwitchDogProfileScreen;