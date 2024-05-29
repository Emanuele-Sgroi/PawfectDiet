/*
  Stopwatch.js
  ------------
  Simple HH:MM:SS stopwatch used in the *Work* section
  of the Feed‑Log screen.

  Props
  -----
  • elapsedTime (number)           – current elapsed time in **seconds**  
  • setElapsedTime (fn)            – setter from parent so we keep single source‑of‑truth  
  • manualTimeInSeconds (number)   – optional preset (e.g. “set time” workflow)  
  • handleStop (fn)                – called when user pauses; parent receives final seconds  
  • handleReset (fn)               – resets parent‑state & kcal calculations
*/

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"; // play
import FontAwesome from "react-native-vector-icons/FontAwesome"; // pause‑circle
import Ionicons from "react-native-vector-icons/Ionicons"; // refresh‑circle

const Stopwatch = ({
  elapsedTime,
  setElapsedTime,
  manualTimeInSeconds,
  handleStop,
  handleReset,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  /* ---------------------------------------------------------------- sync preset */
  useEffect(() => {
    if (manualTimeInSeconds !== null) {
      setElapsedTime(manualTimeInSeconds);
    }
  }, [manualTimeInSeconds, setElapsedTime]);

  /* ---------------------------------------------------------------- tick interval */
  useEffect(() => {
    let id;
    if (isRunning) {
      id = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(id);
  }, [isRunning, setElapsedTime]);

  /* ---------------------------------------------------------------- handlers */
  const toggleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      handleStop(elapsedTime);
    } else {
      setIsRunning(true);
    }
  };

  const format = (sec) => {
    const h = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  /* ---------------------------------------------------------------- render */
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleRun}>
          {isRunning ? (
            <FontAwesome name="pause-circle" size={28} color="#273176" />
          ) : (
            <AntDesign name="play" size={28} color="#273176" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReset}>
          <Ionicons name="refresh-circle" size={30} color="#273176" />
        </TouchableOpacity>
      </View>

      <Text style={styles.time}>{format(elapsedTime)}</Text>
    </View>
  );
};

/* ---------------------------------------------------------------- styles */
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  controls: {
    flexDirection: "row",
    gap: 25,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default Stopwatch;
