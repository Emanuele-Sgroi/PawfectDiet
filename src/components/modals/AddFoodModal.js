import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  dogCommercialFoodData,
  dogHomemadeFoodData,
} from "../../../dogFoodData";
import { images } from "../../constants/index";

const combinedFoodData = [...dogCommercialFoodData, ...dogHomemadeFoodData];

const AddFoodModal = ({ visible, onClose, onAddFood }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const filteredData =
    searchQuery.length > 0
      ? combinedFoodData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : combinedFoodData;

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(""); // Reset quantity when a new food is selected
    setSelectedItemId(food.name);
  };

  const handleClose = () => {
    // Reset state on close
    setSearchQuery("");
    setSelectedFood(null);
    setQuantity("");
    setShowInfo(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <TextInput
          placeholder="Search for food..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        {showInfo && (
          <Text style={{ textAlign: "center" }}>
            This feature is under development. Please select an item from the
            list below or use the search bar.
          </Text>
        )}
        <View style={styles.toolsContainer}>
          <TouchableOpacity
            style={styles.toolBox}
            onPress={() => setShowInfo(true)}
          >
            <Image
              source={images.barcode_white}
              style={{ width: 60, height: 60, resizeMode: "contain" }}
            />
            <Text style={styles.toolsText}>Scan Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolBox}
            onPress={() => setShowInfo(true)}
          >
            <Image
              source={images.manual_input_white}
              style={{ width: 60, height: 60, resizeMode: "contain" }}
            />
            <Text style={styles.toolsText}>Manual Entry</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.flatList}
          data={filteredData}
          keyExtractor={(item, index) => `${item.brand}-${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFood(item)}
              style={[
                styles.itemContainer,
                selectedFood !== null && item.name === selectedItemId
                  ? styles.selectedItemContainer
                  : {},
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedFood !== null && item.name === selectedItemId
                    ? styles.selectedText
                    : {},
                ]}
              >
                {item.brand} - {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
        {selectedFood && (
          <>
            <TextInput
              placeholder="Enter quantity in grams"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.quantityInput}
            />
            <View style={styles.caloriesAddContainer}>
              <Text style={styles.caloriesText}>
                Calories:{" "}
                {selectedFood && quantity
                  ? (
                      parseFloat(quantity) *
                      selectedFood.nutritionalInfo.caloriesPerGram
                    ).toFixed(0)
                  : "0"}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (selectedFood && quantity) {
                    onAddFood(selectedFood, quantity);
                    handleClose(); // Close modal after adding food
                  }
                }}
              >
                <Text style={styles.addText}>Add Food</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
  },
  searchBar: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  quantityInput: {
    width: "80%",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  caloriesText: {
    marginTop: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#273176",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityInput: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  caloriesText: {
    fontSize: 16,
    marginVertical: 10,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalView: {
    marginTop: 50,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "90%",
  },
  selectedItemContainer: {
    backgroundColor: "#273176",
  },
  selectedText: {
    color: "#fff",
  },
  flatList: {
    borderWidth: 1,
    borderColor: "#7D7D7D",
  },
  caloriesAddContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#273176",
    borderRadius: 20,
  },
  addText: {
    textAlign: "center",
    fontFamily: "MerriweatherSans-ExtraBold",
    color: "#fff",
    marginBottom: 2,
  },
  toolsContainer: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  toolBox: {
    minWidth: 120,
    padding: 10,
    backgroundColor: "#273176",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  toolsText: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 14,
    color: "#fff",
    marginVertical: 4,
  },
});

export default AddFoodModal;
