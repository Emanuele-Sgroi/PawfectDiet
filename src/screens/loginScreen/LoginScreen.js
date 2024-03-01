/**
 * LoginScreen
 * ------------
 * React‑Native screen that authenticates an existing user with Firebase
 * email + password credentials. On success it persists a minimal session
 * record in Expo SecureStore and routes the user depending on how many
 * dog profiles they have created.
 *
 */

// ──────────────────────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
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

// Assets & constants
import { images } from "../../constants/index";

// Shared UI components
import {
  InputWithIcon,
  InputPassword,
  ButtonLarge,
  ButtonGoogle,
  BasicLoadingModal,
  InfoModalTemoButton,
} from "../../components/index";

// External libs
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

// Firebase instances
import { auth, db } from "../../../firebaseConfig";

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} LoginScreenProps
 * @property {object} navigation – React‑Navigation prop passed by Stack
 */

/**
 * Main functional component.
 *
 * @param {LoginScreenProps} props – See typedef above
 * @returns {JSX.Element}
 */
const LoginScreen = ({ navigation }) => {
  // ────────────────────────────────
  // Local state
  // ────────────────────────────────
  const [orientation, setOrientation] = useState("portrait");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // ────────────────────────────────
  // Helpers
  // ────────────────────────────────

  /**
   * Displays a red Toast with a general‑purpose error title + message.
   *
   * @param {string} title   – Toast title (bold)
   * @param {string} message – Toast description
   */
  const toastError = useCallback((title, message) => {
    Toast.show({ type: "error", text1: title, text2: message });
  }, []);

  /**
   * Displays the green "Welcome Back" success toast.
   */
  const toastSuccess = useCallback(() => {
    Toast.show({
      type: "success",
      text1: "Welcome Back 👋",
      text2: "Enjoy PawfectDiet!",
    });
  }, []);

  /**
   * Simple client‑side form validation. Returns `true` if inputs pass.
   */
  const validateInputs = useCallback(() => {
    if (!email || !password) {
      toastError("Login Failed", "Please enter your credentials");
      return false;
    }

    const validEmail = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(?:\.[\w-]+)*$/;
    if (!validEmail.test(email)) {
      toastError("Login Failed", "The email address is invalid.");
      return false;
    }

    return true;
  }, [email, password, toastError]);

  /**
   * Fetches the first dog profile for a user and stores its ID locally so
   * the app can start with that dog selected.
   *
   * @param {string} userId – Firebase auth uid
   */
  const selectFirstDogProfile = async (userId) => {
    const dogsRef = collection(db, `users/${userId}/dogs`);
    const snapshot = await getDocs(dogsRef);

    // Safety: guard against users with 0 dog profiles
    if (!snapshot.empty) {
      const firstDogId = snapshot.docs[0].id;
      await SecureStore.setItemAsync("activeDogProfile", firstDogId);
    }
  };

  /**
   * Main login handler – triggered by the LOGIN button.
   */
  const handleLogin = async () => {
    if (!validateInputs()) return; // early escape on validation failure

    setIsLoading(true);

    try {
      // Firebase email|password authentication
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = credential;

      // Persist minimal session details locally
      await SecureStore.setItemAsync("isLoggedIn", "true");
      await SecureStore.setItemAsync("userId", user.uid);

      // Fetch user doc to check how many dogs they have created
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const { dogNumber } = userDoc.data();

      // Conditional navigation based on dog profile count
      if (dogNumber === 1) {
        await selectFirstDogProfile(user.uid);
        navigation.navigate("Main");
      } else if (dogNumber > 1) {
        navigation.navigate("SwitchDog", { cameFromLogin: true });
      } else {
        navigation.navigate("DogProfileCreation");
      }

      toastSuccess();
    } catch (err) {
      console.error("Login error:", err.message);
      toastError("Login Failed", "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────
  // Effects
  // ────────────────────────────────

  /**
   * Listens to orientation changes to update responsive hero height.
   */
  useEffect(() => {
    const onChange = () => {
      const { width, height } = Dimensions.get("window");
      setOrientation(height > width ? "portrait" : "landscape");
    };

    // Initial call + listener registration
    onChange();
    const sub = Dimensions.addEventListener("change", onChange);

    // Cleanup: remove listener
    return () => {
      sub?.remove?.();
    };
  }, []);

  // ────────────────────────────────
  // Derived styles (depends on orientation)
  // ────────────────────────────────
  const heroStyle = StyleSheet.flatten([
    styles.hero,
    orientation === "portrait" ? { height: 250 } : { height: 400 },
  ]);

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ───── Hero Section ───── */}
        <ImageBackground
          source={require("../../assets/park.png")}
          style={heroStyle}
          resizeMode="cover"
        >
          <Image
            source={images.dog_eating}
            style={styles.dog}
            resizeMode="contain"
          />
          <Image
            source={images.logo_icon}
            style={styles.logo}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* ───── Form Section ───── */}
        <View style={styles.formWrapper}>
          <Text style={[styles.text, styles.h1]}>Hello.</Text>
          <Text style={[styles.text, styles.h2]}>Login to your account</Text>

          <InputWithIcon
            iconName="email"
            iconType="Fontisto"
            placeholder="Email"
            onChangeText={setEmail}
          />

          <InputPassword
            placeholder="Password"
            isPassword
            onChangeText={setPassword}
          />

          <ButtonLarge buttonName="LOGIN" isThereArrow onPress={handleLogin} />

          {/* Forgot password – not implemented yet */}
          <TouchableOpacity onPress={() => setIsInfoOpen(true)}>
            <Text style={[styles.text, styles.h3]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Google OAuth – placeholder */}
          <ButtonGoogle
            buttonType="Login"
            onPress={() => setIsInfoOpen(true)}
          />

          {/* Sign‑up link */}
          <View style={styles.signUpContainer}>
            <Text style={[styles.text, styles.h4]}>
              Don't have an account yet?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={[styles.text, styles.h5]}>Join PawfectDiet!</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading modal – covers network latency */}
        <BasicLoadingModal
          visible={isLoading}
          customTitle="We are checking your account"
          customMessage="Please wait..."
        />
      </ScrollView>

      {/* Generic info modal (used for un‑implemented features) */}
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

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
  hero: {
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
  formWrapper: {
    flex: 7,
    width: "100%",
    backgroundColor: "#E6ECFC",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
  h2: { fontSize: 20, marginBottom: 10 },
  h3: {
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  h4: { fontSize: 15, color: "#7d7d7d" },
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
  orLine: { flex: 1, height: 0.7, backgroundColor: "#7D7D7D" },
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

// ──────────────────────────────────────────────────────────────────────────────
// Exports
// ──────────────────────────────────────────────────────────────────────────────
export default LoginScreen;
