import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const AutocompleteSearch = ({
  data,
  selectedItems,
  setSelectedItems,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const results = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, data]);

  const addSelectedItem = (item) => {
    console.log(item.name);
    if (
      !selectedItems.find(
        (selectedItem) =>
          selectedItem.brand === item.brand && selectedItem.name === item.name
      )
    ) {
      setSelectedItems([
        ...selectedItems,
        { brand: item.brand, name: item.name },
      ]);
    }
    setSearchQuery("");
  };

  const removeSelectedItem = (itemToRemove) => {
    setSelectedItems(
      selectedItems.filter(
        (item) =>
          item.brand !== itemToRemove.brand || item.name !== itemToRemove.name
      )
    );
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInputStyle}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.searchScrollContainer} scrollEnabled={true}>
        <View style={styles.searchContainer}>
          {filteredResults.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => addSelectedItem(item)}
            >
              <Text style={styles.item}>
                {item.brand} - {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.selectedItemsContainer}>
        {selectedItems.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{`${item.brand} - ${item.name}`}</Text>
            <TouchableOpacity onPress={() => removeSelectedItem(item)}>
              <Text style={{ color: "#273176" }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: 32,
    borderRadius: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    zIndex: 2,
  },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "MerriweatherSans-Regular",
  },
  searchScrollContainer: {
    width: "100%",
    height: "auto",
    maxHeight: 180,
    borderRadius: 0,
    marginBottom: 10,
    backgroundColor: "white",
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    borderRadius: 0,
    paddingHorizontal: 10,
  },
  item: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 14,
    color: "#000000",
    marginVertical: 4,
  },
  selectedItemsContainer: {
    height: "auto",
  },
  tag: {
    backgroundColor: "white",
    borderColor: "#273176",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagText: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 13,
    color: "#273176",
  },
});

export default AutocompleteSearch;
