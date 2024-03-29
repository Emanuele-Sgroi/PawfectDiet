import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { images } from "../../constants/index";
import {
  InputWithIcon,
  InputPassword,
  ButtonLarge,
  ButtonGoogle,
  BasicLoadingModal,
  InfoModalTemoButton,
} from "../../components/index";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [orientation, setOrientation] = useState("portrait");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const width = Dimensions.get("window").width;
      const height = Dimensions.get("window").height;
      setOrientation(height > width ? "portrait" : "landscape");
    };

    const subscription = Dimensions.addEventListener("change", updateLayout);

    return () => {
      if (subscription.remove) {
        subscription.remove();
      } else {
        Dimensions.removeEventListener("change", updateLayout);
      }
    };
  }, []);

  const topStyle = StyleSheet.flatten([
    styles.top,
    orientation === "portrait" ? { height: 250 } : { height: 400 },
  ]);

  const onToastError = (errorTitle, errorMessage) => {
    Toast.show({
      type: "error",
      text1: errorTitle,
      text2: errorMessage,
    });
  };

  const onToastSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Welcome Back",
      text2: "Enjoy PawfectDiet!",
    });
  };

  const validateInputs = () => {
    if (!email || !password) {
      onToastError("Login Failed", "Please insert your credentials");
      return false;
    }
    //check email
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validEmail)) {
      onToastError("Login Failed", "The email is invalid.");
      return false;
    }
    return true;
  };

  const fetchAndSetActiveDogProfile = async (userId) => {
    const dogsRef = collection(db, `users/${userId}/dogs`);
    const snapshot = await getDocs(dogsRef);
    if (!snapshot.empty) {
      const dogId = snapshot.docs[0].id;
      await SecureStore.setItemAsync("activeDogProfile", dogId);
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await SecureStore.setItemAsync("isLoggedIn", "true");
      await SecureStore.setItemAsync("userId", user.uid);

      const currentUserDoc = await getDoc(doc(db, "users", user.uid));
      const currentUser = currentUserDoc.data();
      const dogNumber = currentUser.dogNumber;

      if (dogNumber === 1) {
        await fetchAndSetActiveDogProfile(user.uid);
        navigation.navigate("Main");
      } else if (dogNumber > 1) {
        navigation.navigate("SwitchDog", { cameFromLogin: true });
      } else {
        navigation.navigate("DogProfileCreation");
      }

      setIsLoading(false);
      onToastSuccess();
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.message;
      onToastError("Login Failed", "Invalid Credentials");
      console.error("Login error:", errorMessage);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
        <ImageBackground
          source={require("../../assets/park.png")}
          style={topStyle}
          resizeMode="cover"
        >
          <Image
            source={images.dog_eating}
            style={styles.dog}
            resizeMode="contain"
          ></Image>
          <Image
            source={images.logo_icon}
            style={styles.logo}
            resizeMode="contain"
          ></Image>
        </ImageBackground>
        <View style={styles.bottom}>
          <Text style={[styles.text, styles.h1]}>Hello.</Text>
          <Text style={[styles.text, styles.h2]}>Login to your account</Text>
          <InputWithIcon
            iconName="email"
            iconType="Fontisto"
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
          <InputPassword
            placeholder="Password"
            isPassword={true}
            onChangeText={(text) => setPassword(text)}
          />
          <ButtonLarge
            buttonName="LOGIN"
            isThereArrow={true}
            onPress={handleLogin}
          />
          <TouchableOpacity
            onPress={() => {
              setIsInfoOpen(true);
            }}
          >
            <Text style={[styles.text, styles.h3]}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine}></View>
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine}></View>
          </View>
          <ButtonGoogle
            buttonType="Login"
            onPress={() => {
              setIsInfoOpen(true);
            }}
          />
          <View style={styles.signUpContainer}>
            <Text style={[styles.text, styles.h4]}>
              Don't have an account yet?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Signup");
              }}
            >
              <Text style={[styles.text, styles.h5]}>Join PawfectDiet!</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BasicLoadingModal
          visible={isLoading}
          customTitle={"We are checking your account"}
          customMessage={"Please wait..."}
        />
      </ScrollView>
      {isInfoOpen && (
        <InfoModalTemoButton
          title="Coming Soon"
          message="This feature is under development."
          onOkPress={() => setIsInfoOpen(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
  top: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dog: {
    position: "absolute",
    width: 125,
    height: 125,
    bottom: 20,
    left: 10,
  },
  logo: {
    position: "absolute",
    width: 70,
    height: 70,
    top: 30,
    right: 20,
    transform: [{ rotateZ: "-36deg" }],
  },
  bottom: {
    flex: 7,
    width: "100%",
    backgroundColor: "#E6ECFC",
    justifyContent: "flex start",
    alignItems: "flex start",
    paddingHorizontal: 25,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    textAlign: "left",
    color: "#273176",
    fontFamily: "MerriweatherSans-Regular",
  },
  h1: {
    fontSize: 64,
    fontFamily: "MerriweatherSans-ExtraBold",
    marginBottom: -10,
  },
  h2: {
    fontSize: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  h4: {
    fontSize: 15,
    color: "#7d7d7d",
  },
  h5: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-ExtraBold",
    marginLeft: 5,
  },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  orLine: {
    flex: 1,
    height: 0.7,
    backgroundColor: "#7D7D7D",
  },
  orText: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Light",
    color: "#7D7D7D",
    marginHorizontal: 5,
    marginVertical: 20,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});

export default LoginScreen;
