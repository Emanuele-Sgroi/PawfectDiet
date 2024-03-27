/*
  Discover
  --------
  Simple 2‑column grid of WIP tiles. Tap → placeholder onPress handler from
  parent. Replace static array when backend delivers real content.
*/

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { images } from "../../constants";

const items = [
  {
    img: images.recipe,
    title: "Dog Recipes",
    desc: "Nutritious meals for your dog’s health.",
  },
  {
    img: images.app_white,
    title: "Sync Other Apps",
    desc: "Combine your favourite pet apps.",
  },
  {
    img: images.train,
    title: "Training",
    desc: "Pro tips for behaviour and skills.",
  },
  {
    img: images.vet,
    title: "Vets Near You",
    desc: "Book appointments with local vets.",
  },
  {
    img: images.friends,
    title: "Friends",
    desc: "Connect and share with dog owners.",
  },
  {
    img: images.community,
    title: "Community",
    desc: "Exchange advice and join events.",
  },
];

const Discover = ({ onPress }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Discover</Text>
    <View style={styles.gridContainer}>
      {items.map(({ img, title, desc }) => (
        <TouchableOpacity key={title} style={styles.box} onPress={onPress}>
          <View style={styles.imgCircle}>
            <Image source={img} style={styles.img} />
          </View>
          <Text style={styles.h1}>{title}</Text>
          <Text style={styles.h2}>{desc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// styles unchanged ↓
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6ECFC",
    padding: 20,
  },
  gridContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  header: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#273176",
    marginBottom: 5,
    textAlign: "center",
  },
  box: {
    width: "45%",
    height: 200,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imgCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#273176",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  img: { width: 40, height: 40, resizeMode: "contain" },
  h1: {
    fontSize: 18,
    fontFamily: "MerriweatherSans-Bold",
    color: "#273176",
    marginBottom: 5,
    textAlign: "center",
  },
  h2: {
    fontSize: 14,
    fontFamily: "MerriweatherSans-Regular",
    color: "#7D7D7D",
    textAlign: "center",
    paddingHorizontal: 5,
  },
});

export default React.memo(Discover);
