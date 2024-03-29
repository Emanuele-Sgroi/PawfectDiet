import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"; //play
import FontAwesome from "react-native-vector-icons/FontAwesome"; //stop-circle - pause-circle
import Ionicons from "react-native-vector-icons/Ionicons"; //refresh-circle

const Stopwatch = ({
  elapsedTime,
  setElapsedTime,
  manualTimeInSeconds,
  handleStop,
  handleReset,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (manualTimeInSeconds !== null) {
      setElapsedTime(manualTimeInSeconds);
    }
  }, [manualTimeInSeconds, setElapsedTime]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, setElapsedTime]);

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      handleStop(elapsedTime);
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.stopwatchContainer}>
      <View style={styles.buttonsContainer}>
        {isRunning ? (
          <TouchableOpacity onPress={handleStartStop}>
            <FontAwesome name="pause-circle" size={28} color="#273176" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStartStop}>
            <AntDesign name="play" size={28} color="#273176" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleReset}>
          <Ionicons name="refresh-circle" size={30} color="#273176" />
        </TouchableOpacity>
      </View>

      <Text style={styles.stopwatchText}>{formatTime(elapsedTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stopwatchContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  stopwatchText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    width: "100%",
  },
});

export default Stopwatch;
