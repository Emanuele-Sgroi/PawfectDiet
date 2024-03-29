import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import InputWithIcon from "../inputFields/InputWithIcon";
import ButtonLarge from "../buttons/ButtonLarge";
import Dropdown from "../dropDown/Dropdown";
import Toast from "react-native-toast-message";

const DogProfileCreationStep2 = ({ onSubmit, name, profileData }) => {
  const [isWorkingDog, setIsWorkingDog] = useState(profileData.isWorkingDog);
  const [workType, setWorkType] = useState(profileData.workType);
  const [workDogOtherActivities, setWorkDogOtherActivities] = useState(
    profileData.workDogOtherActivities
  );
  const [activityType, setActivityType] = useState(profileData.activityType);
  const [activityLevel, setActivityLevel] = useState(profileData.activityLevel);
  const [isKg, setIsKg] = useState(true);
  const [dogWeight, setDogWeight] = useState(profileData.dogWeight);
  const [regularMedication, setRegularMedication] = useState(
    profileData.regularMedication
  );
  const [recentHealthChange, setRecentHealthChange] = useState(
    profileData.recentHealthChange
  );
  const [isRecentHealthChange, setIsRecentHealthChange] = useState(false);
  const [allergies, setAllergies] = useState(profileData.allergies);
  const [isAllergic, setIsAllergic] = useState(false);
  const [neuteredSpayed, setNeuteredSpayed] = useState(
    profileData.neuteredSpayed
  );
  const [isPregnant, setIsPregnant] = useState(profileData.isPregnant);
  const [pregnancyDurationMonths, setPregnancyDurationMonths] = useState(
    profileData.pregnancyDurationMonths
  );
  const [pregnancyDurationWeeks, setPregnancyDurationWeeks] = useState(
    profileData.pregnancyDurationWeeks
  );
  const [isBreastfeeding, setIsBreastfeeding] = useState(
    profileData.isBreastfeeding
  );

  const workOptions = [
    "Athletic and Agility Competitions",
    "Search and Rescue",
    "Service Dog",
    "Herding",
    "Therapy Work",
  ];
  const activityLevelOptions = ["Light", "Moderate", "Intense"];
  const regularMedicationOptions = [
    "Flea and Tick Preventatives",
    "Heartworm Preventatives",
    "Anti-inflammatory Medications",
    "Allergy Medications",
    "Anxiety Medications",
    "Thyroid Medications",
    "Worm Treatment",
    "Not Under Regular Medication",
  ];

  const handleWorkSelection = (selection) => {
    setIsWorkingDog(selection == "Yes");
    if (!isWorkingDog) {
      setWorkType("");
      setWorkDogOtherActivities("");
    }

    if (isWorkingDog) {
      setActivityType("");
    }
  };

  const handleWorkTypeSelect = (selectedWorkType) => {
    setWorkType(selectedWorkType);
  };

  const handleActivityLevelSelect = (selectedActivityLevel) => {
    setActivityLevel(selectedActivityLevel);
  };

  const handleRegularMedicationSelect = (selectedRegularMedication) => {
    setRegularMedication(selectedRegularMedication);
  };

  const handleRecentHealthChanges = (selection) => {
    setIsRecentHealthChange(selection == "Yes");
    if (!isRecentHealthChange) {
      setRecentHealthChange("");
    }
  };

  const handleAllergies = (selection) => {
    setIsAllergic(selection == "Yes");
    if (!isAllergic) {
      setAllergies("");
    }
  };

  const handleNeuteredSpayedSelection = (selection) => {
    setNeuteredSpayed(selection == "Yes");
  };

  const handleIsPregnant = (selection) => {
    setIsPregnant(selection == "Yes");

    if (profileData.gender.toLowerCase() === "male") {
      setIsPregnant(false);
    }

    if (!isPregnant) {
      setPregnancyDurationMonths(parseInt(0).toString());
      setPregnancyDurationWeeks(parseInt(0).toString());
    }
  };

  const handleBreastFeeding = (selection) => {
    setIsBreastfeeding(selection == "Yes");

    if (profileData.gender.toLowerCase() === "male") {
      setIsBreastfeeding(false);
    }
  };

  const onToastError = () => {
    Toast.show({
      type: "error",
      text1: "Please fill all the information",
    });
  };

  const goToNextStep = () => {
    const step2Data = {
      isWorkingDog: isWorkingDog,
      workType: workType,
      workDogOtherActivities: workDogOtherActivities,
      activityType: activityType,
      activityLevel: activityLevel,
      dogWeight: dogWeight,
      regularMedication: regularMedication,
      recentHealthChange: recentHealthChange,
      allergies: allergies,
      neuteredSpayed: neuteredSpayed,
      isPregnant: isPregnant,
      pregnancyDurationMonths: pregnancyDurationMonths,
      pregnancyDurationWeeks: pregnancyDurationWeeks,
      isBreastfeeding: isBreastfeeding,
    };

    if (
      isWorkingDog &&
      (!workType ||
        !workDogOtherActivities ||
        !activityLevel ||
        !dogWeight ||
        !regularMedication)
    ) {
      onToastError();
    } else if (
      !isWorkingDog &&
      (!activityType || !activityLevel || !dogWeight || !regularMedication)
    ) {
      onToastError();
    } else if (isRecentHealthChange && !recentHealthChange) {
      onToastError();
    } else if (isAllergic && !allergies) {
      onToastError();
    } else if (
      isPregnant &&
      (!pregnancyDurationMonths || !pregnancyDurationWeeks)
    ) {
      onToastError();
    } else {
      onSubmit(step2Data);
    }
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={true}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.h1}>Health & Lifestyle</Text>
          <Text style={styles.h2}>
            Tell us about the general health and daily activities of {name}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Is {name} a working/sporting dog?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleWorkSelection("Yes")}
            >
              <View
                style={[
                  styles.outerCircle,
                  isWorkingDog && styles.selectedOuterCircle,
                ]}
              >
                {isWorkingDog && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleWorkSelection("No")}
            >
              <View
                style={[
                  styles.outerCircle,
                  !isWorkingDog && styles.selectedOuterCircle,
                ]}
              >
                {!isWorkingDog && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isWorkingDog && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Type of working/sporting dog</Text>
              <Dropdown
                data={workOptions}
                onSelect={handleWorkTypeSelect}
                selectedValue={profileData.workType}
                placeholder="Select Work Type"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Other Activities</Text>
              <InputWithIcon
                iconName="tennisball-outline"
                iconType="Ionicons"
                placeholder="Eg. Walking"
                onChangeText={(e) => {
                  setWorkDogOtherActivities(e);
                }}
                value={workDogOtherActivities}
              />
            </View>
          </>
        )}

        {!isWorkingDog && (
          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Activity Type</Text>
            <InputWithIcon
              iconName="tennisball-outline"
              iconType="Ionicons"
              placeholder="Eg. Walking"
              onChangeText={(e) => {
                setActivityType(e);
              }}
              value={activityType}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Activity Level</Text>
          <Dropdown
            data={activityLevelOptions}
            onSelect={handleActivityLevelSelect}
            selectedValue={profileData.activityLevel}
            placeholder="Select the Intensity"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Weight</Text>
          <View style={styles.inputSubContainer}>
            <View style={styles.inputWrapper}>
              <InputWithIcon
                iconName="scale-outline"
                iconType="Ionicons"
                placeholder="Enter weigth"
                keyboardType="numeric"
                onChangeText={(enteredWeight) => {
                  const weigthInKg = isKg
                    ? enteredWeight
                    : enteredWeight * 0.45359237;
                  setDogWeight(weigthInKg);
                }}
                value={dogWeight}
              />
            </View>
            <View style={styles.inputButtonsWrapper}>
              <TouchableOpacity
                style={[
                  styles.kg,
                  { backgroundColor: isKg ? "#181C39" : "#181c3900" },
                ]}
                onPress={() => setIsKg(true)}
              >
                <Text
                  style={[
                    styles.kgText,
                    { color: isKg ? "#ffffff" : "#181c39" },
                  ]}
                >
                  Kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.lbs,
                  { backgroundColor: !isKg ? "#181C39" : "#181c3900" },
                ]}
                onPress={() => setIsKg(false)}
              >
                <Text
                  style={[
                    styles.lbsText,
                    { color: !isKg ? "#ffffff" : "#181c39" },
                  ]}
                >
                  Lbs
                </Text>
              </TouchableOpacity>
              <Text style={styles.weightValueText}>{isKg ? "Kg" : "Lbs"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>
            Is {name} currently taking any regular medication?
          </Text>
          <Dropdown
            data={regularMedicationOptions}
            onSelect={handleRegularMedicationSelect}
            selectedValue={profileData.regularMedication}
            placeholder="Select Regular Medication"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>
            Are there any Major Health Changes that we should know about?
          </Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleRecentHealthChanges("Yes")}
            >
              <View
                style={[
                  styles.outerCircle,
                  isRecentHealthChange && styles.selectedOuterCircle,
                ]}
              >
                {isRecentHealthChange && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleRecentHealthChanges("No")}
            >
              <View
                style={[
                  styles.outerCircle,
                  !isRecentHealthChange && styles.selectedOuterCircle,
                ]}
              >
                {!isRecentHealthChange && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
          {isRecentHealthChange && (
            <InputWithIcon
              iconName="health-and-safety"
              iconType="MaterialIcons"
              placeholder="Please specify"
              onChangeText={
                isRecentHealthChange
                  ? (e) => {
                      setRecentHealthChange(e);
                    }
                  : "none"
              }
              value={recentHealthChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Is {name} allergic to something?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleAllergies("Yes")}
            >
              <View
                style={[
                  styles.outerCircle,
                  isAllergic && styles.selectedOuterCircle,
                ]}
              >
                {isAllergic && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleAllergies("No")}
            >
              <View
                style={[
                  styles.outerCircle,
                  !isAllergic && styles.selectedOuterCircle,
                ]}
              >
                {!isAllergic && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
          {isAllergic && (
            <InputWithIcon
              iconName="peanut-off-outline"
              iconType="MaterialCommunityIcons"
              placeholder="Enter allergy"
              onChangeText={
                isAllergic
                  ? (e) => {
                      setAllergies(e);
                    }
                  : "No Allergies"
              }
              value={allergies}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.h3}>
            Is {name}{" "}
            {profileData.gender.toLowerCase() === "female"
              ? "Spayed"
              : "Neutered"}
            ?
          </Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleNeuteredSpayedSelection("Yes")}
            >
              <View
                style={[
                  styles.outerCircle,
                  neuteredSpayed && styles.selectedOuterCircle,
                ]}
              >
                {neuteredSpayed && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioSubContainer}
              onPress={() => handleNeuteredSpayedSelection("No")}
            >
              <View
                style={[
                  styles.outerCircle,
                  !neuteredSpayed && styles.selectedOuterCircle,
                ]}
              >
                {!neuteredSpayed && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {profileData.gender.toLowerCase() === "female" && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Is {name} Pregnant?</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioSubContainer}
                  onPress={() => handleIsPregnant("Yes")}
                >
                  <View
                    style={[
                      styles.outerCircle,
                      isPregnant && styles.selectedOuterCircle,
                    ]}
                  >
                    {isPregnant && <View style={styles.innerCircle} />}
                  </View>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioSubContainer}
                  onPress={() => handleIsPregnant("No")}
                >
                  <View
                    style={[
                      styles.outerCircle,
                      !isPregnant && styles.selectedOuterCircle,
                    ]}
                  >
                    {!isPregnant && <View style={styles.innerCircle} />}
                  </View>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isPregnant && (
              <View style={styles.inputContainer}>
                <Text style={styles.h3}>Duration of Pregnancy</Text>
                <View style={styles.inputSubContainer}>
                  <Text style={styles.h4}>Months</Text>
                  <View style={styles.inputPregnancyDurationWrapper}>
                    <InputWithIcon
                      iconName="arrow-forward-ios"
                      iconType="MaterialIcons"
                      placeholder="Months"
                      keyboardType="numeric"
                      onChangeText={(enteredMonths) => {
                        setPregnancyDurationMonths(enteredMonths);
                      }}
                      value={pregnancyDurationMonths}
                    />
                  </View>
                  <Text style={styles.h4}>Weeks</Text>
                  <View style={styles.inputPregnancyDurationWrapper}>
                    <InputWithIcon
                      iconName="arrow-forward-ios"
                      iconType="MaterialIcons"
                      placeholder="Weeks"
                      keyboardType="numeric"
                      onChangeText={(enteredWeeks) => {
                        setPregnancyDurationWeeks(enteredWeeks);
                      }}
                      value={pregnancyDurationWeeks}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Is {name} Breastfeeding?</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioSubContainer}
                  onPress={() => handleBreastFeeding("Yes")}
                >
                  <View
                    style={[
                      styles.outerCircle,
                      isBreastfeeding && styles.selectedOuterCircle,
                    ]}
                  >
                    {isBreastfeeding && <View style={styles.innerCircle} />}
                  </View>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioSubContainer}
                  onPress={() => handleBreastFeeding("No")}
                >
                  <View
                    style={[
                      styles.outerCircle,
                      !isBreastfeeding && styles.selectedOuterCircle,
                    ]}
                  >
                    {!isBreastfeeding && <View style={styles.innerCircle} />}
                  </View>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <ButtonLarge
            buttonName="Next"
            isThereArrow={true}
            onPress={goToNextStep}
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
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 15,
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
  inputSubContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputWrapper: {
    width: "50%",
  },
  inputPregnancyDurationWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputButtonsWrapper: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 5,
  },
  radioSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
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
  kg: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "#181c39",
    borderWidth: 1,
  },
  kgText: {
    fontFamily: "MerriweatherSans-Bold",
  },
  lbs: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: "#181c39",
  },
  lbsText: {
    fontFamily: "MerriweatherSans-Bold",
  },
  weightValueText: {
    position: "absolute",
    left: 5,
    color: "#7D7D7D",
    fontFamily: "MerriweatherSans-Bold",
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
  radioText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
  },
});

export default DogProfileCreationStep2;
