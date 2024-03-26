/*
  QuickEntries
  ------------
  Three tappable cards (Food • Treats • Activities) plus an "OR" divider and
  a “Trust AI” button. Everything still WIP → every tap fires the same
  onPress handler passed from Dashboard.
*/

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { images } from "../../constants";
import ButtonLarge from "../buttons/ButtonLarge";

const QuickEntries = ({ onPress }) => (
  <View style={styles.container}>
    <Text style={styles.h1}>Quick Entries</Text>

    {/* cards */}
    <View style={styles.contentContainer}>
      {[
        { title: "Add Food", cals: "0 Calories", grams: "0 Grams" },
        { title: "Add Treats", cals: "0 Calories", grams: "0 Grams" },
        { title: "Add Activities", cals: "0 Cal Burned", grams: "00:00" },
      ].map(({ title, cals, grams }) => (
        <TouchableOpacity
          key={title}
          style={styles.itemContainer}
          onPress={onPress}
        >
          <Text style={styles.h2}>{title}</Text>
          <View style={styles.line} />
          <Text style={styles.h3}>0 Entries</Text>
          <View style={styles.summary}>
            <Image source={images.calories} style={styles.img} />
            <Text style={styles.h4}>{cals}</Text>
          </View>
          <View style={styles.summary}>
            <Image
              source={title === "Add Activities" ? images.time : images.grams}
              style={styles.img}
            />
            <Text style={styles.h4}>{grams}</Text>
          </View>
          <Text style={styles.add}>+</Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* OR divider */}
    <View style={styles.orContainer}>
      <View style={styles.orLine} />
      <Text style={styles.or}>OR</Text>
      <View style={styles.orLine} />
    </View>

    {/* AI button */}
    <View style={{ width: "70%", marginTop: -15 }}>
      <ButtonLarge buttonName="Trust AI" onPress={onPress} />
    </View>

    <TouchableOpacity onPress={onPress}>
      <Text style={styles.find}>Find out more</Text>
    </TouchableOpacity>
  </View>
);

// styles unchanged ↓
const styles = StyleSheet.create({
  /* original styles block */
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#D2DAF0",
  },
  h1: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    gap: 20,
  },
  itemContainer: {
    backgroundColor: "#273176",
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 50,
    borderRadius: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  h2: {
    fontSize: 18,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  line: { width: 40, height: 1, backgroundColor: "#FFFFFF", marginBottom: 5 },
  h3: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Regular",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  summary: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  h4: {
    fontSize: 14,
    fontFamily: "MerriweatherSans-Regular",
    color: "#7D7D7D",
    marginBottom: 2,
  },
  img: { width: 20, height: 20, resizeMode: "contain", marginRight: 10 },
  add: {
    fontSize: 30,
    fontFamily: "MerriweatherSans-Regular",
    color: "#FFFFFF",
    position: "absolute",
    right: 20,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },
  orLine: { width: 100, height: 1, backgroundColor: "#7D7D7D" },
  or: {
    fontSize: 18,
    fontFamily: "MerriweatherSans-Regular",
    color: "#7D7D7D",
    marginHorizontal: 1,
  },
  find: {
    fontSize: 16,
    fontFamily: "MerriweatherSans-Regular",
    color: "#273176",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});

export default React.memo(QuickEntries);
