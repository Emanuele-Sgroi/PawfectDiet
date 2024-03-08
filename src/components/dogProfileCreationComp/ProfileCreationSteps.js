/*
  ProfileCreationSteps
  --------------------
  • Shows four little paw icons – one for each step in the dog‑profile wizard.
  • Highlights the current step in white.
  • Gives the user a “Go Previous Step” link and an info button explaining
    why we need so much data.
*/

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

/**
 * @param {object} props
 * @param {() => void} props.onPress   Callback for the “previous” link
 * @param {1|2|3|4}   props.currentStep Current wizard step (1‑4)
 */
const ProfileCreationSteps = ({ onPress, currentStep }) => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      {/* ── Main bar ── */}
      <View style={styles.container}>
        {/* Paw icons */}
        <View style={styles.stepsContainer}>
          {[1, 2, 3, 4].map((n) => (
            <FontAwesome
              key={n}
              name="paw"
              size={24}
              color={currentStep >= n ? "#FFFFFF" : "#181C39"}
              style={styles.icon}
            />
          ))}
        </View>

        {/* Previous link */}
        {currentStep > 1 ? (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.linkActive}>Go Previous Step</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.linkDisabled}>Go Previous Step</Text>
        )}

        {/* Info icon */}
        <TouchableOpacity
          onPress={() => setInfoOpen(true)}
          style={styles.infoBtn}
        >
          <Feather name="info" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Info modal ── */}
      {infoOpen && (
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.h1}>Why do we need this info?</Text>
            <Text style={styles.p}>
              We know it’s a lot, but the more you share, the better the AI can
              personalise your dog’s plan.
            </Text>
            <TouchableOpacity
              onPress={() => setInfoOpen(false)}
              style={styles.okBtn}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#273176",
    padding: 10,
    width: "100%",
    height: 70,
    position: "relative",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    transform: [{ rotateZ: "90deg" }],
    marginHorizontal: 10,
  },
  /* Previous link */
  linkActive: {
    marginTop: 5,
    textDecorationLine: "underline",
    color: "#F14336",
  },
  linkDisabled: {
    marginTop: 5,
    textDecorationLine: "underline",
    color: "#7D7D7D",
  },
  /* Info icon */
  infoBtn: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  /* Modal */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000040",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 800,
  },
  modalCard: {
    padding: 20,
    backgroundColor: "#181C39",
    borderRadius: 15,
    maxWidth: 300,
  },
  h1: {
    color: "#FFFFFF",
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  p: {
    color: "#FFFFFF",
    fontFamily: "MerriweatherSans-Light",
    marginBottom: 10,
  },
  okBtn: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
  okText: {
    fontFamily: "MerriweatherSans-Bold",
    color: "#181C39",
  },
});

export default React.memo(ProfileCreationSteps);
