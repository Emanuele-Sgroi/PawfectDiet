import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Info from "react-native-vector-icons/Feather";

const ProfileCreationSteps = ({ onPress, currentStep }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.stepsContainer}>
          <TouchableOpacity>
            <Icon
              name="paw"
              size={24}
              color={currentStep >= 1 ? "#ffffff" : "#181C39"}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="paw"
              size={24}
              color={currentStep >= 2 ? "#ffffff" : "#181C39"}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="paw"
              size={24}
              color={currentStep >= 3 ? "#ffffff" : "#181C39"}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="paw"
              size={24}
              color={currentStep === 4 ? "#ffffff" : "#181C39"}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {currentStep > 1 ? (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.h2}>Go Previous Step</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.h2NoActive}>Go Previous Step</Text>
        )}

        <TouchableOpacity
          onPress={() => setIsInfoOpen(true)}
          style={styles.info}
        >
          <Info name="info" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      {isInfoOpen && (
        <View style={styles.infoContainer}>
          <View style={styles.infoModal}>
            <Text style={styles.h1}>Why do we need these info?</Text>
            <Text style={styles.p}>
              We know it's a lot, but the more information you give us, the more
              the AI will be accurate!
            </Text>
            <TouchableOpacity
              onPress={() => setIsInfoOpen(false)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "columns",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    height: 70,
    backgroundColor: "#273176",
    position: "relative",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  icon: {
    transform: [{ rotateZ: "90deg" }],
    marginHorizontal: 10,
  },
  info: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  infoContainer: {
    backgroundColor: "#00000040",
    height: "100%",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  infoModal: {
    padding: 20,
    zIndex: 901,
    backgroundColor: "#181C39",
    borderRadius: 15,
  },
  h1: {
    zIndex: 902,
    color: "#fff",
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  h2: {
    marginTop: 5,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    color: "#F14336",
  },
  h2NoActive: {
    marginTop: 5,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    color: "#7D7D7D",
  },
  p: {
    zIndex: 902,
    color: "#fff",
    fontFamily: "MerriweatherSans-Light",
    marginBottom: 10,
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: "MerriweatherSans-Bold",
    color: "#181C39",
  },
});

export default ProfileCreationSteps;
