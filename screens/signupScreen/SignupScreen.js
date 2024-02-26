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
  ButtonBackAuth,
  BasicLoadingModal,
} from "../../components/index";
import Icon from "react-native-vector-icons/AntDesign";
import Toast from "react-native-toast-message";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = ({ navigation }) => {
  const [orientation, setOrientation] = useState("portrait");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const requirements = [
    { text: "• Minimum 8 characters", isValid: (pwd) => pwd.length >= 8 },
    {
      text: "• Must include a uppercase letter",
      isValid: (pwd) => /[A-Z]/.test(pwd),
    },
    { text: "• Must include a number", isValid: (pwd) => /\d/.test(pwd) },
    {
      text: "• Must include a special character",
      isValid: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

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
    orientation === "portrait" ? { height: 160 } : { height: 350 }, // Adjust these values as needed
  ]);

  const validateInputs = () => {
    // Basic validation checkstest
    if (!username || !email || !password || !repeatPassword) {
      onSignupError("Impossible to proceed", "Please fill in all fields.");
      return false;
    }
    // Check password requirements
    const validPassword = requirements.every((req) => req.isValid(password));
    if (!validPassword) {
      onSignupError(
        "Impossible to proceed",
        "Password does not meet requirements."
      );
      return false;
    }

    //check username
    if (username.length < 3) {
      onSignupError(
        "Impossible to proceed",
        "The username must be minimum 3 characters."
      );
      return false;
    }

    //check email
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validEmail)) {
      onSignupError("Impossible to proceed", "The email is invalid.");
      return false;
    }

    if (password !== repeatPassword) {
      onSignupError("Impossible to proceed", "Passwords do not match.");
      return false;
    }

    return true;
  };

  // Example function that triggers a toast on success
  const onSignupSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Signup Successful",
      text2: "You have successfully created your account.",
    });
  };

  // Example function that triggers a toast on error
  const onSignupError = (errorTitle, errorMessage) => {
    Toast.show({
      type: "error",
      text1: errorTitle,
      text2: errorMessage,
    });
  };

  const handleSignup = async () => {
    if (!validateInputs()) return; // Stop if validation fails

    setIsLoading(true); // Show loading modal

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Prepare user details
      const userDetails = {
        username: username,
        email: email, // This is redundant as it's already stored in the auth user object, but can be useful for queries.
        uid: user.uid, // Firebase automatically assigns a unique ID to each user.
        dateCreated: new Date().toISOString(), // ISO string includes both date and time
        lastLogin: new Date().toISOString(), // Initially, lastLogin can be the creation date
        dogNumber: 0,
      };

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), userDetails);
      setIsLoading(false); // Hide loading modal
      onSignupSuccess(); // Show success toast
      await AsyncStorage.setItem("isLoggedIn", "true"); // store that user is logged in
      navigation.navigate("DogProfileCreation");
    } catch (error) {
      setIsLoading(false); // Hide loading modal
      let errorTitle = "Failed to create an account";
      let errorMessage = error.message;

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "The email address is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The password is too weak.";
      } else {
        errorMessage = "Sorry. Try again please.";
      }

      onSignupError(errorTitle, errorMessage);
      console.log("error -->", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
      <ImageBackground
        source={require("../../assets/park2.png")}
        style={topStyle}
        resizeMode="cover"
      >
        <View style={styles.buttonBackContainer}>
          <ButtonBackAuth
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <Image
          source={images.dog_butterfly}
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
        <Text style={[styles.text, styles.h1]}>Join PawfectDiet!</Text>
        <Text style={[styles.text, styles.h2]}>
          Let's start your journey to happier, healthier companion...
        </Text>
        <InputWithIcon
          iconName="user"
          iconType="AntDesign"
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
        />
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
        <View style={styles.requirementsList}>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text
                style={[
                  styles.requirementText,
                  req.isValid(password)
                    ? { color: "#3dc43f" }
                    : { color: "black" },
                ]}
              >
                {req.text}
              </Text>
              {req.isValid(password) && (
                <Icon name="check" size={20} color="#3dc43f" />
              )}
            </View>
          ))}
        </View>
        <InputPassword
          placeholder="Repeat Password"
          isPassword={true}
          onChangeText={(text) => setRepeatPassword(text)}
        />
        <ButtonLarge
          buttonName="SIGN UP"
          isThereArrow={true}
          onPress={handleSignup}
        />

        <View style={styles.orContainer}>
          <View style={styles.orLine}></View>
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine}></View>
        </View>
        <ButtonGoogle
          buttonType="Sign Up"
          onPress={() => {
            onSignupError(
              "Google isn't set up yet",
              "Please use email and password instead"
            );
          }}
        />
        <View style={styles.loginContainer}>
          <Text style={[styles.text, styles.h4]}>Already a member?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={[styles.text, styles.h5]}>Login to your account!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BasicLoadingModal
        visible={isLoading}
        customTitle={"We are creating your account"}
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
  buttonBackContainer: {
    position: "absolute",
    top: 35,
    left: 20,
  },
  dog: {
    position: "absolute",
    width: 200,
    height: 200,
    bottom: -50,
    left: 50,
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
    fontSize: 30,
    fontFamily: "MerriweatherSans-ExtraBold",
  },
  h2: {
    fontSize: 20,
    marginBottom: 10,
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
  requirementsList: {
    marginTop: 2,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  requirementText: {
    // Define base styles here, without conditional logic
    fontSize: 15, // Example base font size
    // Other base styles
  },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: -15,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default SignupScreen;
