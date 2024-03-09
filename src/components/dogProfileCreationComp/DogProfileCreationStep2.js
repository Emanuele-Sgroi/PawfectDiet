/*
  Step 2 – Health & Lifestyle
  ---------------------------
  Here we ask about work/sport status, daily activity, weight, meds,
  allergies, and a few gender‑specific bits. Everything gets checked
  locally before we advance.
*/

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

import InputWithIcon from "../inputFields/InputWithIcon";
import ButtonLarge from "../buttons/ButtonLarge";
import Dropdown from "../dropDown/Dropdown";

const DogProfileCreationStep2 = ({ onSubmit, name, profileData }) => {
  // ── local state pulled from the incoming profile (if any) ──
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

  // ── dropdown lists ──
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

  // ── convenience ──
  const errorToast = () =>
    Toast.show({ type: "error", text1: "Please fill all the information" });

  // ── radio handlers ──
  const handleWorkSelection = (yes) => {
    setIsWorkingDog(yes);
    if (!yes) {
      setWorkType("");
      setWorkDogOtherActivities("");
    }
  };
  const handleRecentHealthChanges = (yes) => {
    setIsRecentHealthChange(yes);
    if (!yes) setRecentHealthChange("");
  };
  const handleAllergies = (yes) => {
    setIsAllergic(yes);
    if (!yes) setAllergies("");
  };
  const handleIsPregnant = (yes) => {
    // males can’t be pregnant
    if (profileData.gender.toLowerCase() === "male")
      return setIsPregnant(false);
    setIsPregnant(yes);
    if (!yes) {
      setPregnancyDurationMonths("0");
      setPregnancyDurationWeeks("0");
    }
  };
  const handleBreastFeeding = (yes) => {
    if (profileData.gender.toLowerCase() === "male")
      return setIsBreastfeeding(false);
    setIsBreastfeeding(yes);
  };

  // ── validation + submit ──
  const handleNext = () => {
    const payload = {
      isWorkingDog,
      workType,
      workDogOtherActivities,
      activityType,
      activityLevel,
      dogWeight,
      regularMedication,
      recentHealthChange,
      allergies,
      neuteredSpayed,
      isPregnant,
      pregnancyDurationMonths,
      pregnancyDurationWeeks,
      isBreastfeeding,
    };

    // quick sanity checks (could be tightened up later)
    const missingWork = isWorkingDog && (!workType || !workDogOtherActivities);
    const missingActivity = !isWorkingDog && !activityType;
    const missingWeightOrLevel =
      !activityLevel || !dogWeight || !regularMedication;
    const missingHealth = isRecentHealthChange && !recentHealthChange;
    const missingAllergy = isAllergic && !allergies;
    const missingPregnancy =
      isPregnant && (!pregnancyDurationMonths || !pregnancyDurationWeeks);

    if (
      missingWork ||
      missingActivity ||
      missingWeightOrLevel ||
      missingHealth ||
      missingAllergy ||
      missingPregnancy
    ) {
      return errorToast();
    }

    onSubmit(payload);
  };

  // ── UI ──
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* heading */}
        <View style={styles.titleContainer}>
          <Text style={styles.h1}>Health & Lifestyle</Text>
          <Text style={styles.h2}>
            Tell us about the general health and daily activities of {name}
          </Text>
        </View>

        {/* working dog? */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Is {name} a working/sporting dog?</Text>
          <View style={styles.radioContainer}>
            {[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ].map(({ label, value }) => (
              <TouchableOpacity
                key={label}
                style={styles.radioSubContainer}
                onPress={() => handleWorkSelection(value)}
              >
                <View
                  style={[
                    styles.outerCircle,
                    isWorkingDog === value && styles.selectedOuterCircle,
                  ]}
                >
                  {isWorkingDog === value && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
                <Text style={styles.radioText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* work‑type / activities */}
        {isWorkingDog ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Type of working/sporting dog</Text>
              <Dropdown
                data={workOptions}
                onSelect={setWorkType}
                selectedValue={workType}
                placeholder="Select Work Type"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Other activities</Text>
              <InputWithIcon
                iconName="tennisball-outline"
                iconType="Ionicons"
                placeholder="e.g. Walking"
                onChangeText={setWorkDogOtherActivities}
                value={workDogOtherActivities}
              />
            </View>
          </>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Activity type</Text>
            <InputWithIcon
              iconName="tennisball-outline"
              iconType="Ionicons"
              placeholder="e.g. Walking"
              onChangeText={setActivityType}
              value={activityType}
            />
          </View>
        )}

        {/* activity level */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Activity level</Text>
          <Dropdown
            data={activityLevelOptions}
            onSelect={setActivityLevel}
            selectedValue={activityLevel}
            placeholder="Select intensity"
          />
        </View>

        {/* weight */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Weight</Text>
          <View style={styles.inputSubContainer}>
            <View style={styles.inputWrapper}>
              <InputWithIcon
                iconName="scale-outline"
                iconType="Ionicons"
                placeholder="Enter weight"
                keyboardType="numeric"
                onChangeText={(w) => setDogWeight(isKg ? w : w * 0.45359237)}
                value={dogWeight}
              />
            </View>
            <View style={styles.inputButtonsWrapper}>
              {[
                { label: "Kg", val: true },
                { label: "Lbs", val: false },
              ].map(({ label, val }) => (
                <TouchableOpacity
                  key={label}
                  style={[styles.unitBtn, isKg === val && styles.unitBtnActive]}
                  onPress={() => setIsKg(val)}
                >
                  <Text
                    style={[
                      styles.unitText,
                      isKg === val && styles.unitTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* medication */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Regular medication?</Text>
          <Dropdown
            data={regularMedicationOptions}
            onSelect={setRegularMedication}
            selectedValue={regularMedication}
            placeholder="Select"
          />
        </View>

        {/* major health change? */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>
            Any major health changes we should know about?
          </Text>
          <View style={styles.radioContainer}>
            {[
              { label: "Yes", val: true },
              { label: "No", val: false },
            ].map(({ label, val }) => (
              <TouchableOpacity
                key={label}
                style={styles.radioSubContainer}
                onPress={() => handleRecentHealthChanges(val)}
              >
                <View
                  style={[
                    styles.outerCircle,
                    isRecentHealthChange === val && styles.selectedOuterCircle,
                  ]}
                >
                  {isRecentHealthChange === val && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
                <Text style={styles.radioText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {isRecentHealthChange && (
            <InputWithIcon
              iconName="health-and-safety"
              iconType="MaterialIcons"
              placeholder="Please specify"
              onChangeText={setRecentHealthChange}
              value={recentHealthChange}
            />
          )}
        </View>

        {/* allergies */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>Is {name} allergic to something?</Text>
          <View style={styles.radioContainer}>
            {[
              { label: "Yes", val: true },
              { label: "No", val: false },
            ].map(({ label, val }) => (
              <TouchableOpacity
                key={label}
                style={styles.radioSubContainer}
                onPress={() => handleAllergies(val)}
              >
                <View
                  style={[
                    styles.outerCircle,
                    isAllergic === val && styles.selectedOuterCircle,
                  ]}
                >
                  {isAllergic === val && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {isAllergic && (
            <InputWithIcon
              iconName="peanut-off-outline"
              iconType="MaterialCommunityIcons"
              placeholder="Enter allergy"
              onChangeText={setAllergies}
              value={allergies}
            />
          )}
        </View>

        {/* neutered/spayed */}
        <View style={styles.inputContainer}>
          <Text style={styles.h3}>
            Is {name}{" "}
            {profileData.gender.toLowerCase() === "female"
              ? "spayed"
              : "neutered"}
            ?
          </Text>
          <View style={styles.radioContainer}>
            {[
              { label: "Yes", val: true },
              { label: "No", val: false },
            ].map(({ label, val }) => (
              <TouchableOpacity
                key={label}
                style={styles.radioSubContainer}
                onPress={() => setNeuteredSpayed(val)}
              >
                <View
                  style={[
                    styles.outerCircle,
                    neuteredSpayed === val && styles.selectedOuterCircle,
                  ]}
                >
                  {neuteredSpayed === val && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
                <Text style={styles.radioText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* pregnancy + breastfeeding (females only) */}
        {profileData.gender.toLowerCase() === "female" && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Is {name} pregnant?</Text>
              <View style={styles.radioContainer}>
                {[
                  { label: "Yes", val: true },
                  { label: "No", val: false },
                ].map(({ label, val }) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.radioSubContainer}
                    onPress={() => handleIsPregnant(val)}
                  >
                    <View
                      style={[
                        styles.outerCircle,
                        isPregnant === val && styles.selectedOuterCircle,
                      ]}
                    >
                      {isPregnant === val && (
                        <View style={styles.innerCircle} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {isPregnant && (
              <View style={styles.inputContainer}>
                <Text style={styles.h3}>Duration of pregnancy</Text>
                <View style={styles.inputSubContainer}>
                  <Text style={styles.h4}>Months</Text>
                  <View style={styles.inputPregnancyDurationWrapper}>
                    <InputWithIcon
                      iconName="arrow-forward-ios"
                      iconType="MaterialIcons"
                      placeholder="Months"
                      keyboardType="numeric"
                      onChangeText={setPregnancyDurationMonths}
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
                      onChangeText={setPregnancyDurationWeeks}
                      value={pregnancyDurationWeeks}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Is {name} breastfeeding?</Text>
              <View style={styles.radioContainer}>
                {[
                  { label: "Yes", val: true },
                  { label: "No", val: false },
                ].map(({ label, val }) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.radioSubContainer}
                    onPress={() => handleBreastFeeding(val)}
                  >
                    <View
                      style={[
                        styles.outerCircle,
                        isBreastfeeding === val && styles.selectedOuterCircle,
                      ]}
                    >
                      {isBreastfeeding === val && (
                        <View style={styles.innerCircle} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* next */}
        <View style={styles.buttonContainer}>
          <ButtonLarge buttonName="Next" isThereArrow onPress={handleNext} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#E6ECFC", width: "100%", paddingVertical: 10 },
  contentContainer: { flex: 1, width: "100%", paddingBottom: 15 },
  titleContainer: { marginBottom: 10, paddingHorizontal: 15 },
  inputContainer: {
    backgroundColor: "#D2DAF0",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  inputSubContainer: { flexDirection: "row", alignItems: "center" },
  inputWrapper: { width: "50%" },
  inputPregnancyDurationWrapper: { flex: 1, marginHorizontal: 5 },
  inputButtonsWrapper: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  unitBtn: { padding: 10, borderWidth: 1, borderColor: "#181C39" },
  unitBtnActive: { backgroundColor: "#181C39" },
  unitText: { fontFamily: "MerriweatherSans-Bold", color: "#181C39" },
  unitTextActive: { color: "#FFFFFF" },
  buttonContainer: { width: "100%", paddingHorizontal: 20 },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  selectedOuterCircle: { borderColor: "#181C39" },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#181C39",
  },
  // text
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
  radioText: { fontFamily: "MerriweatherSans-Bold", fontSize: 18 },
});

export default React.memo(DogProfileCreationStep2);
