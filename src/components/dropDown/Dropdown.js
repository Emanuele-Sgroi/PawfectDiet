/*
  Dropdown
  --------
  Minimal picker built with a button + modal + FlatList. Tap the field,
  modal slides up, tap an item to select, we close and bubble the value
  back up.
*/

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";

const Dropdown = ({
  data,
  onSelect,
  placeholder = "Select",
  selectedValue,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(selectedValue || placeholder);

  const pick = (item) => {
    setSelected(item);
    setVisible(false);
    onSelect(item);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{selected}</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.sheet}>
            <FlatList
              data={data}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => pick(item)}>
                  <Text style={styles.item}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { fontFamily: "MerriweatherSans-Regular" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 5,
    width: "80%",
  },
  item: { padding: 10, textAlign: "center" },
});

export default React.memo(Dropdown);
