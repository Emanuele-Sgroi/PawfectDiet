import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Button,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { ButtonLarge, InputWithImage } from "../index";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { images } from "../../constants/index";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

const DogProfileCreationStep1 = ({ onSubmit, profileData, navigation }) => {
  const [dogName, setDogName] = useState(profileData.dogName);
  const [breed, setBreed] = useState(profileData.breed);
  const [selectedGender, setSelectedGender] = useState(profileData.gender);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(profileData.dateOfBirth);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    // CODE FOR IOS NOT DONE YET
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(currentDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };

  const genders = ["Male", "Female"];

  const selectGender = (gender) => {
    setSelectedGender(gender);
  };

  const onToastError = () => {
    Toast.show({
      type: "error",
      text1: "Please fill all the information",
    });
  };

  const handleSubmit = () => {
    const step1Data = {
      dogName: dogName,
      breed: breed,
      dateOfBirth: dateOfBirth,
      gender: selectedGender,
    };

    if (
      dogName.length > 0 &&
      breed.length > 0 &&
      dateOfBirth.length > 0 &&
      selectedGender.length > 0
    ) {
      onSubmit(step1Data);
    } else {
      onToastError();
    }
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={true}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.h1}>Basic Details</Text>
          <Text style={styles.h2}>
            Start by sharing the basic about your furry friend.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Dog's Name</Text>
          <InputWithImage
            placeholder="Enter your dog's name"
            imageName={images.dog_id}
            onChangeText={(e) => setDogName(e)}
            value={dogName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Breed</Text>
          <InputWithImage
            placeholder="Enter your dog's Breed"
            imageName={images.dog}
            value={breed}
            onChangeText={(e) => {
              setBreed(e);
            }}
          />
          <View style={styles.underTextContainer}>
            <Text style={styles.h4}>Not sure? Use the </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("BreedRecognition");
              }}
            >
              <Text style={[styles.h4, styles.h4Special]}>
                Breed Recognition
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
              onChangeText={setDateOfBirth}
              value={dateOfBirth}
            />
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>What is your dog gender?</Text>
          <View style={styles.genderContainer}>
            {genders.map((gender, index) => (
              <TouchableOpacity
                key={index}
                style={styles.radioContainer}
                onPress={() => selectGender(gender)}
              >
                <View
                  style={[
                    styles.outerCircle,
                    selectedGender === gender && styles.selectedOuterCircle,
                  ]}
                >
                  {selectedGender === gender && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
                <Text style={styles.radioText}>{gender}</Text>
                <Image
                  source={index === 0 ? images.male : images.female}
                  style={styles.genderImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ButtonLarge
            buttonName="Next"
            isThereArrow={false}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6ECFC",
    width: "100%",
    paddingVertical: 10,
    // paddingHorizontal: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  titleContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  inputContainer: {
    backgroundColor: "#D2DAF0",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  underTextContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
    backgroundColor: "white",
    width: "100%",
    height: 32,
    borderRadius: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
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
  selectedOuterCircle: {
    borderColor: "#181C39",
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#181C39",
  },
  genderImage: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
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
  h4: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 15,
    color: "#000000",
  },
  h4Special: {
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#F14336",
    textDecorationLine: "underline",
  },
  radioText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
  },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "MerriweatherSans-Regular",
    color: "#000000",
  },
});

export default DogProfileCreationStep1;
