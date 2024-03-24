/*
  WeigthMonitoring (yes, still spelled that way to avoid ripple renames)
  ------------------------------------------------------
  Static demo data → line chart + “Add New Weight” CTA. When the real
  endpoint is ready we’ll swap out the hard‑coded records.
*/

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

import ButtonLarge from "../buttons/ButtonLarge";

const WeigthMonitoring = ({ onPress }) => {
  // placeholder monthly weights (kg)
  const hist = [34, 34.5, 34.8, 35, 35, 35, 35.2, 35.4, 35.6, 35.1, 35, 34.6];
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = { labels, datasets: [{ data: hist }] };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 1,
    color: (o = 1) => `rgba(0,0,0,${o})`,
    labelColor: (o = 1) => `rgba(0,0,0,${o})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Weight Monitoring</Text>
      <View style={styles.info}>
        <Text style={styles.h2}>⦿ Starting Weight: 34</Text>
        <Text style={styles.h2}>⦿ Goal Weight: 34</Text>
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
        <ButtonLarge buttonName="Add New Weight" onPress={onPress} />
      </View>
    </View>
  );
};

// styles block unchanged ↓
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
  h2: { fontSize: 15, fontFamily: "MerriweatherSans-Italic", color: "#000000" },
});

export default React.memo(WeigthMonitoring);
