/*
  DashboardScreen
  ---------------
  Home hub: top nav + a stack of dashboard widgets. Each WIP tile opens the
  placeholder info modal until we flesh them out.
*/

import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TopNav,
  InfoModalTemoButton,
  CaloriesSummary,
  QuickEntries,
  WeigthMonitoring,
  VetTips,
  Discover,
} from "../../components";

const DashboardScreen = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const openInfo = () => setInfoOpen(true);

  return (
    <>
      <View style={styles.container}>
        <TopNav isInfoOpen={infoOpen} onPress={openInfo} />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <CaloriesSummary />
            <QuickEntries onPress={openInfo} />
            <WeigthMonitoring onPress={openInfo} />
            <VetTips />
            <Discover onPress={openInfo} />
          </View>
        </ScrollView>
      </View>

      {infoOpen && (
        <InfoModalTemoButton
          title="Coming Soon"
          message="This section is under development."
          onOkPress={() => setInfoOpen(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6ECFC", alignItems: "center" },
  scrollContainer: { width: "100%" },
  contentContainer: { flex: 1, alignItems: "center" },
});

export default React.memo(DashboardScreen);
