import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import ButtonLarge from "../buttons/ButtonLarge";
import {
  dogCommercialFoodData,
  dogTreatsData,
  dogHomemadeFoodData,
} from "../../../dogFoodData";
import FoodSelectionModal from "../modals/FoodSelectionModal";

const DogProfileCreationStep3 = ({ name, onSubmit, profileData }) => {
  const [commercialFoodPreferences, setCommercialFoodPreferences] = useState(
    profileData.commercialFoodPreferences || []
  );
  const [homemadeFoodPreferences, setHomemadeFoodPreferences] = useState(
    profileData.homemadeFoodPreferences || []
  );
  const [treatPreferences, setTreatPreferences] = useState(
    profileData.treatPreferences || []
  );
  const [opennessToNewFoods, setOpennessToNewFoods] = useState(
    profileData.opennessToNewFoods
  );

  const [modalDataType, setModalDataType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const goToNextStep = () => {
    const step3Data = {
      commercialFoodPreferences: commercialFoodPreferences,
      homemadeFoodPreferences: homemadeFoodPreferences,
      treatPreferences: treatPreferences,
      opennessToNewFoods: opennessToNewFoods,
    };

    onSubmit(step3Data);
  };

  const handleOptionSelection = (selection) => {
    setOpennessToNewFoods(selection == "Yes");
  };

  const handleFoodSelect = (item) => {
    if (modalDataType === "commercial") {
      setCommercialFoodPreferences([
        ...commercialFoodPreferences,
        { brand: item.brand, name: item.name },
      ]);
    } else if (modalDataType === "homemade") {
      setHomemadeFoodPreferences([
        ...homemadeFoodPreferences,
        { brand: item.brand, name: item.name },
      ]);
    } else if (modalDataType === "treats") {
      setTreatPreferences([
        ...treatPreferences,
        { brand: item.brand, name: item.name },
      ]);
    }
    setConfirmationMessage("Food Added");
    setTimeout(() => {
      setConfirmationMessage("");
    }, 2000);
  };

  const removeSelectedItem = (item, type) => {
    if (type === "commercial") {
      setCommercialFoodPreferences(
        commercialFoodPreferences.filter(
          (i) => i.name !== item.name && i.brand !== item.brand
        )
      );
    } else if (type === "homemade") {
      setHomemadeFoodPreferences(
        homemadeFoodPreferences.filter(
          (i) => i.name !== item.name && i.brand !== item.brand
        )
      );
    } else if (type === "treats") {
      setTreatPreferences(
        treatPreferences.filter(
          (i) => i.name !== item.name && i.brand !== item.brand
        )
      );
    }
  };

  const openModalWithDataType = (type) => {
    setModalDataType(type);
    setIsModalVisible(true);
  };

  const renderTags = (items, type) => (
    <View style={styles.tagsContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{`${item.brand} - ${item.name}`}</Text>
          <TouchableOpacity onPress={() => removeSelectedItem(item, type)}>
            <Text style={styles.removeTagText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} scrollEnabled={true}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.h1}>Let's Tailor {name}'s Diet!</Text>
            <Text style={styles.h2}>
              In this step, we'll gather some details about the current diet of{" "}
              {name} to help us tailor nutrition and meal recommendations.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.h3}>
              Which commercial dog foods does {name} enjoy?
            </Text>
            <ButtonLarge
              buttonName="Add Commercial Food"
              onPress={() => openModalWithDataType("commercial")}
            />
            {renderTags(commercialFoodPreferences, "commercial")}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.h3}>
              What human foods do you share with {name}?
            </Text>
            <ButtonLarge
              buttonName="Add Homemade Food"
              onPress={() => openModalWithDataType("homemade")}
            />
            {renderTags(homemadeFoodPreferences, "homemade")}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.h3}>What treats do you give to {name}?</Text>
            <ButtonLarge
              buttonName="Add Treats"
              onPress={() => openModalWithDataType("treats")}
            />
            {renderTags(treatPreferences, "treats")}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.h3}>
              Would you like to explore new option or stick with your selection?
            </Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioSubContainer}
                onPress={() => handleOptionSelection("Yes")}
              >
                <View
                  style={[
                    styles.outerCircle,
                    opennessToNewFoods && styles.selectedOuterCircle,
                  ]}
                >
                  {opennessToNewFoods && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioText}>
                  Yes, I would like to explore new options
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioSubContainer}
                onPress={() => handleOptionSelection("No")}
              >
                <View
                  style={[
                    styles.outerCircle,
                    !opennessToNewFoods && styles.selectedOuterCircle,
                  ]}
                >
                  {!opennessToNewFoods && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioText}>
                  No, I want to stick wiht my selection
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <ButtonLarge
              buttonName="Next"
              isThereArrow={true}
              onPress={goToNextStep}
            />
          </View>
        </View>
      </ScrollView>
      {isModalVisible && (
        <FoodSelectionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          data={
            modalDataType === "commercial"
              ? dogCommercialFoodData
              : modalDataType === "homemade"
              ? dogHomemadeFoodData
              : dogTreatsData
          }
          onSelect={handleFoodSelect}
          confirmationMessage={confirmationMessage}
        />
      )}
    </>
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
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: "#D2DAF0",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
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
    color: "#7D7D7D",
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
  selectedOuterCircle: {
    borderColor: "#181C39",
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#181C39",
  },
  radioText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "#273176",
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    marginRight: 10,
  },
  removeTagText: {
    color: "#FF0000",
  },
});

export default DogProfileCreationStep3;
