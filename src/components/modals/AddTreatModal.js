import React, { useEffect, useMemo, useState } from "react";
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
import { doc, getDoc } from "firebase/firestore";

/**
 * List of activities shown to the user. If you need to add/remove activities,
 * simply edit the array – no other code needs to change.
 */
const EXERCISES = [
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

/**
 * Metabolic‑equivalent (MET) values used to estimate caloric burn.
 * Source: comparative canine‑exercise studies.
 */
const MET_VALUES = {
  Walking: 3,
  Running: 8,
  Fetch: 4,
  Swimming: 10,
  "Agility Training": 5,
  "Ball Games": 4,
  Frisbee: 4,
  Hiking: 7,
  "Hide and Seek": 3,
  "Obstacle Course": 5,
};

const AddActivityModal = ({ visible, onClose, onAddActivity }) => {
  const [dogWeightKg, setDogWeightKg] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [durationMin, setDurationMin] = useState("");
  const [calories, setCalories] = useState(null);

  /** Fetch the active dog's weight once when the modal mounts */
  useEffect(() => {
    const fetchDogWeight = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDog = await SecureStore.getItemAsync("activeDogProfile");
        if (!userId || !activeDog) return;

        const snap = await getDoc(doc(db, `users/${userId}/dogs/${activeDog}`));
        if (snap.exists()) setDogWeightKg(Number(snap.data().dogWeight));
      } catch (err) {
        console.error("Failed to fetch dog info", err);
      }
    };

    fetchDogWeight();
  }, []);

  /*** -------- Handlers -------------------------------------------------- */
  const handleSelect = (activity) => {
    setSelectedActivity(activity);
    setCalories(null);
    setDurationMin("");
  };

  const handleClose = () => {
    setQuery("");
    setSelectedActivity(null);
    setDurationMin("");
    setCalories(null);
    onClose();
  };

  const handleCalculate = () => {
    if (!dogWeightKg || !selectedActivity || !durationMin) return;
    const met = MET_VALUES[selectedActivity] || 0;
    const hours = Number(durationMin) / 60;
    const burned = met * dogWeightKg * hours;
    setCalories(burned);
  };

  const handleAdd = () => {
    if (!calories) return;
    onAddActivity(selectedActivity, Number(durationMin), calories);
    handleClose();
  };

  /*** -------- Derived values ------------------------------------------- */
  const filteredExercises = useMemo(() => {
    if (!query.trim()) return EXERCISES;
    return EXERCISES.filter((e) =>
      e.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  /*** -------- UI -------------------------------------------------------- */
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.wrapper}>
        {/* Search */}
        <TextInput
          placeholder="Search activities…"
          value={query}
          onChangeText={setQuery}
          style={s.search}
        />

        {/* Activity list */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item}
          style={s.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={[s.row, item === selectedActivity && s.rowSelected]}
            >
              <Text
                style={[s.rowText, item === selectedActivity && s.rowTextSel]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Duration + calorie calc */}
        {selectedActivity && (
          <>
            <TextInput
              placeholder="Duration (minutes)"
              keyboardType="numeric"
              value={durationMin}
              onChangeText={setDurationMin}
              style={s.input}
            />

            {!calories ? (
              <TouchableOpacity style={s.btn} onPress={handleCalculate}>
                <Text style={s.btnText}>Calculate calories</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={s.calories}>≈ {calories.toFixed(0)} kcal</Text>
                <TouchableOpacity style={s.btn} onPress={handleAdd}>
                  <Text style={s.btnText}>Add activity</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        <TouchableOpacity style={[s.btn, s.close]} onPress={handleClose}>
          <Text style={s.btnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  list: {
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 240,
    marginBottom: 10,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowSelected: {
    backgroundColor: "#273176",
  },
  rowText: {
    fontSize: 16,
  },
  rowTextSel: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  calories: {
    fontSize: 16,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#273176",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontFamily: "MerriweatherSans-Bold",
  },
  close: {
    backgroundColor: "#bb2124",
  },
});

export default AddActivityModal;
