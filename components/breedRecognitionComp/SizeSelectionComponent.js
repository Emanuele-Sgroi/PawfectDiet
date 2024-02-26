import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { images } from "../../constants/index";

const SizeSelectionComponent = ({ onSizeSelection }) => {
  const [selectedSize, setSelectedSize] = useState("");

  const sizes = [
    { type: "Small", kg: "4 - 10 kg", lbs: "(9 - 22 lbs)" },
    { type: "Medium", kg: "11 - 25 kg", lbs: "(24 - 55 lbs)" },
    { type: "Large", kg: "26 kg +", lbs: "(57 lbs +)" },
  ];

  const selectSize = (size) => {
    setSelectedSize(size);
    onSizeSelection(size);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Your Dog Adult Size (or expected)</Text>
      <View style={styles.topRadioContainer}>
        <TouchableOpacity
          style={styles.radioContainer}
          onPress={() => selectSize("N/A")}
        >
          <View
            style={[
              styles.outerCircle,
              selectedSize === "N/A" && styles.selectedOuterCircle,
            ]}
          >
            {selectedSize === "N/A" && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioText}>I'm not sure</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sizeSelectionContainer}>
        {sizes.map((size, index) => (
          <Pressable
            key={index}
            style={styles.sizeContainer}
            onPress={() => selectSize(size.type)}
          >
            <View
              style={[
                styles.sizeBox,
                {
                  backgroundColor: `${
                    selectedSize === size.type ? "#273176" : "#ffffff"
                  }`,
                },
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  {
                    color: `${
                      selectedSize === size.type ? "#ffffff" : "#000000"
                    }`,
                  },
                ]}
              >
                {size.type}
              </Text>
              <Image
                source={
                  selectedSize === size.type
                    ? images.dog_full_body_white
                    : images.dog_full_body_black
                }
                style={[
                  {
                    height: (index + 1) * 25,
                    width: `${(index + 1) * 25}%`,
                  },
                  styles.dogImage,
                ]}
              />
            </View>
            <Text style={styles.h2}>{size.kg}</Text>
            <Text style={styles.h3}>{size.lbs}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D2DAF0",
    marginTop: 15,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  topRadioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#181C39",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedOuterCircle: {
    borderColor: "#181C39",
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#181C39",
  },
  radioText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
    marginBottom: 3,
  },
  sizeSelectionContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 5,
  },
  sizeContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeBox: {
    width: "100%",
    height: 100,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },
  dogImage: {
    minWidth: 35,
    minHeight: 35,
  },
  sizeText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 15,
  },
  h1: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 18,
    color: "#273176",
    marginBottom: 5,
  },
  h2: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 13,
    color: "#000000",
  },
  h3: {
    fontFamily: "MerriweatherSans-Light",
    fontSize: 13,
    color: "#000000",
  },
});

export default SizeSelectionComponent;
