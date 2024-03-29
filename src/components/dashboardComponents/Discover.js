import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { images } from "../../constants/index";

const Discover = ({ onPress }) => {
  const discoveryItems = [
    {
      img: images.recipe,
      title: "Dog Recipes",
      description: "Nutritious meals for your dog’s health.",
    },
    {
      img: images.app_white,
      title: "Sync Other Apps",
      description: "Combine your favorite pet apps.",
    },
    {
      img: images.train,
      title: "Training",
      description: "Pro tips for behavior and skills.",
    },
    {
      img: images.vet,
      title: "Vets Near You",
      description: "Book appointments with local vets.",
    },
    {
      img: images.friends,
      title: "Friends",
      description: "Connect and share with dog owners.",
    },
    {
      img: images.community,
      title: "Community",
      description: "Exchange advice and join events.",
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Discover</Text>
        <View style={styles.gridContainer}>
          {discoveryItems.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.box}
              >
                <View style={styles.imgCircle}>
                  <Image source={item.img} style={styles.img} />
                </View>
                <Text style={styles.h1}>{item.title}</Text>
                <Text style={styles.h2}>{item.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6ECFC",
    padding: 20,
  },
  gridContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
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
    backgroundColor: "#fff",
    shadowColor: "#000",
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  img: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
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

export default Discover;
