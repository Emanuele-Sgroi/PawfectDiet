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
} from "../../components/index";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [orientation, setOrientation] = useState("portrait");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const updateLayout = () => {
      const width = Dimensions.get("window").width;
      const height = Dimensions.get("window").height;
      setOrientation(height > width ? "portrait" : "landscape");
    };

    // Add event listener for orientation changes
    const subscription = Dimensions.addEventListener("change", updateLayout);

    // Return a cleanup function that removes the event listener
    return () => {
      // Check if subscription.remove exists for backward compatibility
      if (subscription.remove) {
        subscription.remove();
      } else {
        // For older versions of React Native without subscription model
        Dimensions.removeEventListener("change", updateLayout);
      }
    };
  }, []);

  // Dynamic style that adjusts height based on orientation
  const topStyle = StyleSheet.flatten([
    styles.top,
    orientation === "portrait" ? { height: 250 } : { height: 400 }, // Adjust these values as needed
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
    // Basic validation checkstest
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

  const handleLogin = async () => {
    if (!validateInputs()) return; // Stop if validation fails

    setIsLoading(true); // Show loading modal

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store login status securely
      await SecureStore.setItemAsync("isLoggedIn", "true");
      await SecureStore.setItemAsync("userId", user.uid); // Store user ID securely

      // Retrieve user data from Firestore to get the dogNumber
      const currentUserDoc = await getDoc(doc(db, "users", user.uid));
      const currentUser = currentUserDoc.data();
      const dogNumber = currentUser.dogNumber;

      // Redirection based on dogNumber
      if (dogNumber === 1) {
        navigation.navigate("Main"); // Redirect to Main if one dog profile
      } else if (dogNumber > 1) {
        navigation.navigate("DogProfileSelection"); // Redirect to selection if multiple
      } else {
        navigation.navigate("DogProfileCreation"); // Redirect to creation if zero
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
            console.log("forgot password");
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
            onToastError(
              "Google isn't set up yet",
              "Please use email and password instead"
            );
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
    flex: 7, // 70% in portrait mode, adjusts automatically in landscape
    width: "100%",
    backgroundColor: "#E6ECFC", // Just for visual separation
    justifyContent: "flex start",
    alignItems: "flex start",
    paddingHorizontal: 25,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android Shadow
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
    // width: "100%",
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
