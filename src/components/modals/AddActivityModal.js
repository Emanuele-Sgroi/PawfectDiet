/*
  AddActivityModal.js
  -------------------
  A reusable modal that lets the user pick a dog activity, specify its
  duration, calculates the estimated calories burned (based on MET values
  + the dog’s weight) and passes the result back to the parent via
  `onAddActivity`
*/

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { db } from "../../../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";

const dogExercises = [
  "Walking",
  "Running",
  "Fetch",
  "Swimming",
  "Agility Training",
  "Ball Games",
  "Frisbee",
  "Hiking",
  "Hide and Seek",
  "Obstacle Course",
];

const MET_VALUES = {
  Walking: 3.0, // Moderate walking
  Running: 8.0, // Running at a moderate pace
  Fetch: 4.0, // Playing fetch, includes running and resting
  Swimming: 10.0, // Active swimming
  "Agility Training": 5.0, // Agility exercises
  "Ball Games": 4.0, // Playing with balls
  Frisbee: 4.0, // Playing frisbee
  Hiking: 7.0, // Hiking in rough terrain
  "Hide and Seek": 3.0, // Playing hide and seek
  "Obstacle Course": 5.0, // Navigating an obstacle course
};

const AddActivityModal = ({ visible, onClose, onAddActivity }) => {
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [caloriesCalculated, setCaloriesCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    const fetchDogInfoAndGoals = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      const activeDogProfile = await SecureStore.getItemAsync(
        "activeDogProfile"
      );
      if (!userId || !activeDogProfile) {
        console.log("User ID or active dog profile missing");
        return;
      }

      const dogRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);
      const dogSnap = await getDoc(dogRef);

      if (dogSnap.exists()) {
        setDogInfo(dogSnap.data());
      } else {
        console.log("No such document for dog info!");
        return;
      }

      const goalsQuery = query(
        collection(dogRef, "healthGoals"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const goalsSnap = await getDocs(goalsQuery);
      if (!goalsSnap.empty) {
        const goalsData = goalsSnap.docs[0].data();
        setHealthGoals(goalsData);
      } else {
        console.log("No health goals found");
      }
    };

    fetchDogInfoAndGoals();
  }, []);

  const filteredData =
    searchQuery.length > 0
      ? dogExercises.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : dogExercises;

  const handleSelectActivity = (act) => {
    setSelectedActivity(act);
    setDuration("");
    setSelectedItemId(act);
  };

  const handleClose = () => {
    // Reset state on close
    setSearchQuery("");
    setSelectedActivity(null);
    setDuration("");
    setIsCalculating(false);
    setCaloriesBurned(0);
    setCaloriesCalculated(false);
    onClose();
  };

  const calculateCaloriesBurned = async (
    selectedActivity,
    duration,
    dogInfo,
    healthGoals
  ) => {
    setIsCalculating(true);
    let caloriesBurned = 0;

    //formula
    const durationInHours = duration / 60;
    const metValue = MET_VALUES[selectedActivity] || 0;
    const weightKg = dogInfo.dogWeight;
    caloriesBurned = metValue * weightKg * durationInHours;

    setIsCalculating(false);
    setCaloriesBurned(caloriesBurned);
    setCaloriesCalculated(true);

    return caloriesBurned;
  };

  const handleCalculateCalories = () => {
    if (selectedActivity && duration) {
      calculateCaloriesBurned(selectedActivity, duration, dogInfo, healthGoals);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <TextInput
          placeholder="Search for activities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        <FlatList
          style={styles.flatList}
          data={filteredData}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectActivity(item)}
              style={[
                styles.itemContainer,
                selectedActivity !== null && item === selectedItemId
                  ? styles.selectedItemContainer
                  : {},
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedActivity !== null && item === selectedItemId
                    ? styles.selectedText
                    : {},
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        {selectedActivity && (
          <>
            <TextInput
              placeholder="Enter duration in minutes"
              value={duration}
              onChangeText={(text) => {
                setDuration(text);
                setCaloriesCalculated(false);
                setIsCalculating(false);
              }}
              keyboardType="numeric"
              style={styles.quantityInput}
            />

            <View style={styles.caloriesAddContainer}>
              {isCalculating ? (
                <Text style={styles.caloriesText}>Please wait...</Text>
              ) : (
                <>
                  {caloriesCalculated && (
                    <Text style={styles.caloriesText}>
                      Calories burned:{" "}
                      {caloriesCalculated ? caloriesBurned.toFixed(0) : "0"}
                    </Text>
                  )}

                  {!caloriesCalculated && (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleCalculateCalories}
                    >
                      <Text style={styles.addText}>
                        Calculate Calories Burned
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              {caloriesCalculated && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    if (selectedActivity && duration) {
                      onAddActivity(selectedActivity, duration, caloriesBurned);
                      handleClose();
                    }
                  }}
                >
                  <Text style={styles.addText}>Add Activity</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
  },
  searchBar: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  quantityInput: {
    width: "80%",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  caloriesText: {
    marginTop: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#273176",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityInput: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  caloriesText: {
    fontSize: 16,
    marginVertical: 10,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalView: {
    marginTop: 50,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "90%",
  },
  selectedItemContainer: {
    backgroundColor: "#273176",
  },
  selectedText: {
    color: "#fff",
  },
  flatList: {
    borderWidth: 1,
    borderColor: "#7D7D7D",
  },
  caloriesAddContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#273176",
    borderRadius: 20,
  },
  addText: {
    textAlign: "center",
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#fff",
    marginBottom: 2,
  },
  toolsContainer: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  toolBox: {
    minWidth: 120,
    padding: 10,
    backgroundColor: "#273176",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  toolsText: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 14,
    color: "#fff",
    marginVertical: 4,
  },
});

export default AddActivityModal;
