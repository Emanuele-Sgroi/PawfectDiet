/*
  Step 1 – Basic Details
  ----------------------
  • Name, breed, date of birth, gender.
  • Breed‑Recognition shortcut if the user isn’t sure.
  • Local validation – we only proceed when everything is filled in.
*/

import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

import InputWithImage from "../inputFields/InputWithImage";
import ButtonLarge from "../buttons/ButtonLarge";
import { images } from "../../constants";

const DogProfileCreationStep1 = ({ onSubmit, profileData, navigation }) => {
  // ────────────────────── state
  const [dogName, setDogName] = useState(profileData.dogName);
  const [breed, setBreed] = useState(profileData.breed);
  const [selectedGender, setSelectedGender] = useState(profileData.gender);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(profileData.dateOfBirth);

  const route = useRoute();

  // If we came back from the Breed‑Recognition screen, pre‑fill the breed
  useEffect(() => {
    if (route.params?.breed) setBreed(route.params.breed);
  }, [route.params]);

  // ────────────────────── helpers
  const genders = ["Male", "Female"];

  const toggleDatepicker = () => setShowPicker((v) => !v);

  const onDateChange = ({ type }, selectedDate) => {
    // TODO: fine‑tune for iOS later
    if (type === "set") {
      const d = selectedDate;
      setDate(d);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(d.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };

  const showError = () =>
    Toast.show({ type: "error", text1: "Please fill all the information" });

  const handleNext = () => {
    const filled = dogName && breed && dateOfBirth && selectedGender;
    if (!filled) return showError();
    onSubmit({ dogName, breed, dateOfBirth, gender: selectedGender });
  };

  // ────────────────────── render
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Heading */}
        <View style={styles.titleContainer}>
          <Text style={styles.h1}>Basic Details</Text>
          <Text style={styles.h2}>
            Start by sharing the basics about your furry friend.
          </Text>
        </View>

        {/* Dog name */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Dog's Name</Text>
          <InputWithImage
            placeholder="Enter your dog's name"
            imageName={images.dog_id}
            onChangeText={setDogName}
            value={dogName}
          />
        </View>

        {/* Breed */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Breed</Text>
          <InputWithImage
            placeholder="Enter your dog's breed"
            imageName={images.dog}
            value={breed}
            onChangeText={setBreed}
          />
          <View style={styles.underTextContainer}>
            <Text style={styles.h4}>Not sure? Use the </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("BreedRecognition")}
            >
              <Text style={[styles.h4, styles.h4Special]}>
                Breed Recognition
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date of birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>When was your dog born?</Text>
          <Pressable style={styles.dateContainer} onPress={toggleDatepicker}>
            <FontAwesome
              name="birthday-cake"
              size={22}
              color="#000"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.textInputStyle}
              placeholder="Select Date"
              placeholderTextColor="#7D7D7D"
              editable={false}
              value={dateOfBirth}
            />
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </Pressable>
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>What is your dog's gender?</Text>
          <View style={styles.genderContainer}>
            {genders.map((g, i) => (
              <TouchableOpacity
                key={g}
                style={styles.radioContainer}
                onPress={() => setSelectedGender(g)}
              >
                <View
                  style={[
                    styles.outerCircle,
                    selectedGender === g && styles.selectedOuterCircle,
                  ]}
                >
                  {selectedGender === g && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioText}>{g}</Text>
                <Image
                  source={i === 0 ? images.male : images.female}
                  style={styles.genderImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next button */}
        <View style={styles.buttonContainer}>
          <ButtonLarge buttonName="Next" isThereArrow onPress={handleNext} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#E6ECFC", width: "100%", paddingVertical: 10 },
  contentContainer: { flex: 1, alignItems: "flex-start", width: "100%" },
  titleContainer: { marginBottom: 10, paddingHorizontal: 15 },
  inputContainer: {
    backgroundColor: "#D2DAF0",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  underTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: { width: "100%", paddingHorizontal: 20 },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#181C39",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedOuterCircle: { borderColor: "#181C39" },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#181C39",
  },
  genderImage: { width: 24, height: 24, marginLeft: 5 },
  // Typography
  h1: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 20,
    color: "#273176",
    marginBottom: 5,
  },
  h2: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#273176",
  },
  h3: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 18,
    color: "#273176",
    marginBottom: 5,
  },
  h4: { fontFamily: "MerriweatherSans-Regular", fontSize: 15, color: "#000" },
  h4Special: {
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#F14336",
    textDecorationLine: "underline",
  },
  radioText: { fontFamily: "MerriweatherSans-Bold", fontSize: 18 },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "MerriweatherSans-Regular",
    color: "#000",
  },
});

export default React.memo(DogProfileCreationStep1);
