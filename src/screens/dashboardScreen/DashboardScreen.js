import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TopNav,
  StandardInfoModal,
  InfoModalTemoButton,
  CaloriesSummary,
  QuickEntries,
  WeigthMonitoring,
  VetTips,
  Discover,
} from "../../components/index";

const DashboardScreen = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <TopNav isInfoOpen={isInfoOpen} onPress={() => setIsInfoOpen(true)} />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <CaloriesSummary />
            <QuickEntries onPress={() => setIsInfoOpen(true)} />
            <WeigthMonitoring onPress={() => setIsInfoOpen(true)} />
            <VetTips />
            <Discover onPress={() => setIsInfoOpen(true)} />
          </View>
        </ScrollView>
      </View>

      {isInfoOpen && (
        <InfoModalTemoButton
          title="Coming Soon"
          message="This section is under development."
          onOkPress={() => setIsInfoOpen(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
  scrollContainer: {
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DashboardScreen;
