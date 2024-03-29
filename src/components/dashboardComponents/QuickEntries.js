import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { images } from "../../constants/index";
import ButtonLarge from "../buttons/ButtonLarge";

const QuickEntries = ({ onPress }) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.h1}>Quick Entries</Text>
        <View style={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
              <Text style={styles.h2}>Add Food</Text>
              <View style={styles.line} />
              <Text style={styles.h3}>0 Entries</Text>
              <View style={styles.summary}>
                <Image source={images.calories} style={styles.img} />
                <Text style={styles.h4}>0 Calories</Text>
              </View>
              <View style={styles.summary}>
                <Image source={images.grams} style={styles.img} />
                <Text style={styles.h4}>0 Grams</Text>
              </View>
              <Text style={styles.add}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
              <Text style={styles.h2}>Add Treats</Text>
              <View style={styles.line} />
              <Text style={styles.h3}>0 Entries</Text>
              <View style={styles.summary}>
                <Image source={images.calories} style={styles.img} />
                <Text style={styles.h4}>0 Calories</Text>
              </View>
              <View style={styles.summary}>
                <Image source={images.grams} style={styles.img} />
                <Text style={styles.h4}>0 Grams</Text>
              </View>
              <Text style={styles.add}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
              <Text style={styles.h2}>Add Activities</Text>
              <View style={styles.line} />
              <Text style={styles.h3}>0 Entries</Text>
              <View style={styles.summary}>
                <Image source={images.calories} style={styles.img} />
                <Text style={styles.h4}>0 Cal Burned</Text>
              </View>
              <View style={styles.summary}>
                <Image source={images.time} style={styles.img} />
                <Text style={styles.h4}>00:00</Text>
              </View>
              <Text style={styles.add}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.orLine} />
        </View>
        <View style={{ width: "70%", marginTop: -15 }}>
          <ButtonLarge
            isThereArrow={false}
            buttonName="Trust AI"
            onPress={onPress}
          />
        </View>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.find}>Find out more</Text>
        </TouchableOpacity>
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
    backgroundColor: "#D2DAF0",
  },
  h1: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
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
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  h2: {
    fontSize: 18,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#fff",
    marginBottom: 5,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  h3: {
    fontSize: 15,
    fontFamily: "MerriweatherSans-Regular",
    color: "#fff",
    marginBottom: 10,
  },
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 5,
  },
  h4: {
    fontSize: 14,
    fontFamily: "MerriweatherSans-Regular",
    color: "#7D7D7D",
    marginBottom: 2,
  },
  img: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 10,
  },
  add: {
    fontSize: 30,
    fontFamily: "MerriweatherSans-Regular",
    color: "#fff",
    position: "absolute",
    right: 20,
  },
  orContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  orLine: {
    width: 100,
    height: 1,
    backgroundColor: "#7D7D7D",
  },
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

export default QuickEntries;
