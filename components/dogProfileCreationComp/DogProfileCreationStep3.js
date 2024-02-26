import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";

const DogProfileCreationStep3 = ({ onSubmit }) => {
  // const [currentStep, setCurrentStep] = useState(1);

  return (
    <View style={styles.container}>
      <Text>Step 3</Text>
      <Button
        onPress={onSubmit}
        title="Next"
        color="#841584"
        accessibilityLabel="Go next step"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
});

export default DogProfileCreationStep3;
