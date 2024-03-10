/*
  Step 3 – Food Diary
  -------------------
  Quick capture of {name}’s favourite commercial food, homemade noms,
  treats, and whether you’re open to new suggestions. We keep the UI simple:
  add buttons open a modal picker, chips show the selections, X removes.
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

import ButtonLarge from "../buttons/ButtonLarge";
import FoodSelectionModal from "../modals/FoodSelectionModal";
import {
  dogCommercialFoodData,
  dogTreatsData,
  dogHomemadeFoodData,
} from "../../../dogFoodData";

const DogProfileCreationStep3 = ({ name, onSubmit, profileData }) => {
  // ── local state ──
  const [commercialFoodPreferences, setCommercial] = useState(
    profileData.commercialFoodPreferences || []
  );
  const [homemadeFoodPreferences, setHomemade] = useState(
    profileData.homemadeFoodPreferences || []
  );
  const [treatPreferences, setTreats] = useState(
    profileData.treatPreferences || []
  );
  const [opennessToNewFoods, setOpen] = useState(
    profileData.opennessToNewFoods
  );

  const [modalType, setModalType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [flashMsg, setFlashMsg] = useState("");

  // ── helpers ──
  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleFoodSelect = (item) => {
    const add = (stateSetter) =>
      stateSetter((prev) => [...prev, { brand: item.brand, name: item.name }]);
    if (modalType === "commercial") add(setCommercial);
    if (modalType === "homemade") add(setHomemade);
    if (modalType === "treats") add(setTreats);
    setFlashMsg("Food Added");
    setTimeout(() => setFlashMsg(""), 2000);
  };

  const removeItem = (item, type) => {
    const rm = (stateSetter, list) =>
      stateSetter(
        list.filter((i) => i.name !== item.name || i.brand !== item.brand)
      );
    if (type === "commercial") rm(setCommercial, commercialFoodPreferences);
    if (type === "homemade") rm(setHomemade, homemadeFoodPreferences);
    if (type === "treats") rm(setTreats, treatPreferences);
  };

  const handleNext = () =>
    onSubmit({
      commercialFoodPreferences,
      homemadeFoodPreferences,
      treatPreferences,
      opennessToNewFoods,
    });

  const renderTags = (items, type) => (
    <View style={styles.tagsContainer}>
      {items.map((item) => (
        <View key={`${item.brand}-${item.name}`} style={styles.tag}>
          <Text style={styles.tagText}>{`${item.brand} - ${item.name}`}</Text>
          <TouchableOpacity onPress={() => removeItem(item, type)}>
            <Text style={styles.removeTagText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const radio = (checked, set) => (
    <TouchableOpacity
      style={styles.radioSubContainer}
      onPress={() => set(!checked)}
    >
      <View style={[styles.outerCircle, checked && styles.selectedOuterCircle]}>
        {checked && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.radioText}>{checked ? "Yes" : "No"}</Text>
    </TouchableOpacity>
  );

  // ── render ──
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          {/* heading */}
          <View style={styles.titleContainer}>
            <Text style={styles.h1}>Let's tailor {name}'s diet!</Text>
            <Text style={styles.h2}>
              Tell us what {name} currently eats so we can personalise
              suggestions.
            </Text>
          </View>

          {/* commercial food */}
          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Commercial food {name} enjoys</Text>
            <ButtonLarge
              buttonName="Add Commercial Food"
              onPress={() => openModal("commercial")}
            />
            {renderTags(commercialFoodPreferences, "commercial")}
          </View>

          {/* homemade */}
          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Human food you share with {name}</Text>
            <ButtonLarge
              buttonName="Add Homemade Food"
              onPress={() => openModal("homemade")}
            />
            {renderTags(homemadeFoodPreferences, "homemade")}
          </View>

          {/* treats */}
          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Treats you give to {name}</Text>
            <ButtonLarge
              buttonName="Add Treats"
              onPress={() => openModal("treats")}
            />
            {renderTags(treatPreferences, "treats")}
          </View>

          {/* openness */}
          <View style={styles.inputContainer}>
            <Text style={styles.h3}>Open to new food suggestions?</Text>
            <View style={styles.radioContainer}>
              {[
                { val: true, txt: "Yes, show me new options" },
                { val: false, txt: "No, stick with my picks" },
              ].map(({ val, txt }) => (
                <TouchableOpacity
                  key={val.toString()}
                  style={styles.radioSubContainer}
                  onPress={() => setOpen(val)}
                >
                  <View
                    style={[
                      styles.outerCircle,
                      opennessToNewFoods === val && styles.selectedOuterCircle,
                    ]}
                  >
                    {opennessToNewFoods === val && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                  <Text style={styles.radioText}>{txt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* next */}
          <View style={styles.buttonContainer}>
            <ButtonLarge buttonName="Next" isThereArrow onPress={handleNext} />
          </View>
        </View>
      </ScrollView>

      {/* modal picker */}
      {modalVisible && (
        <FoodSelectionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={
            modalType === "commercial"
              ? dogCommercialFoodData
              : modalType === "homemade"
              ? dogHomemadeFoodData
              : dogTreatsData
          }
          onSelect={handleFoodSelect}
          confirmationMessage={flashMsg}
        />
      )}
    </>
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
  buttonContainer: { width: "100%", paddingHorizontal: 20 },
  // tags
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  tag: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderColor: "#273176",
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: { marginRight: 10 },
  removeTagText: { color: "#FF0000" },
  // radios
  radioContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 5,
  },
  radioSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
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
  radioText: { fontFamily: "MerriweatherSans-Bold", fontSize: 14 },
  // headings
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
    color: "#7D7D7D",
    marginBottom: 5,
  },
});

export default React.memo(DogProfileCreationStep3);
