import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ButtonLarge from "../buttons/ButtonLarge";
import { LineChart } from "react-native-chart-kit";

const WeigthMonitoring = ({ onPress }) => {
  const weightRecords = [
    { date: "Jan", weight: 34 },
    { date: "Feb", weight: 34.5 },
    { date: "Mar", weight: 34.8 },
    { date: "Apr", weight: 35 },
    { date: "May", weight: 35 },
    { date: "Jun", weight: 35 },
    { date: "Jul", weight: 35.2 },
    { date: "Aug", weight: 35.4 },
    { date: "Sep", weight: 35.6 },
    { date: "Oct", weight: 35.1 },
    { date: "Nov", weight: 35 },
    { date: "Dec", weight: 34.6 },
  ];

  const labels = weightRecords.map((record) => record.date);
  const data = weightRecords.map((record) => record.weight);

  const chartData = {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.h1}>Weight Monitoring</Text>
        <View style={styles.info}>
          <Text style={styles.h2}>⦿ Starting Weight: 34</Text>
          <Text style={styles.h2}>⦿ Goal Weight: 34</Text>
        </View>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 16}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
        <View style={{ width: "60%" }}>
          <ButtonLarge
            isThereArrow={false}
            buttonName="Add New Weight"
            onPress={onPress}
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#E6ECFC",
    paddingHorizontal: 15,
  },
  info: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  h1: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
    marginBottom: 10,
  },
  h2: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Italic",
    color: "#000000",
  },
});

export default WeigthMonitoring;
