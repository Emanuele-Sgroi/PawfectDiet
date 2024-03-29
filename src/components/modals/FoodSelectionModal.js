// FoodSelectionModal.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { images } from "../../constants/index";

const FoodSelectionModal = ({
  visible,
  onClose,
  data,
  onSelect,
  confirmationMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grams = 100;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        {!showDetails ? (
          <>
            <TextInput
              placeholder="Search for food..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
            />
            {showInfo && (
              <Text style={{ textAlign: "center" }}>
                This feature is under development. Please select an item from
                the list below or use the search bar.
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
              data={filteredData}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setShowDetails(true);
                    setSelectedItemDetails(item);
                  }}
                  style={styles.itemContainer}
                >
                  <Text style={styles.itemText}>
                    {item.brand} - {item.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.addContainer}
                    onPress={() => onSelect(item)}
                  >
                    <Text style={styles.add}>Add</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsGoBack}>
                <Text
                  style={styles.goBack}
                  onPress={() => {
                    setShowDetails(false);
                  }}
                >
                  Go Back
                </Text>
              </View>
              <View style={styles.detailsText}>
                <Text style={styles.brand}>Brand:</Text>
                <Text style={styles.name}>{selectedItemDetails.brand}</Text>
              </View>
              <View style={styles.detailsText}>
                <Text style={styles.brand}>Name:</Text>
                <Text style={styles.name}>{selectedItemDetails.name}</Text>
              </View>
              <View style={styles.detailsMacrosTitle}>
                <Text style={styles.macrosTitle}>Product Macros</Text>
                <Text style={styles.macrosTitle2}>(100g)</Text>
              </View>

              <View style={styles.macrosTextContainer}>
                <Text style={styles.macrosText}>Proteins</Text>
                <Text style={styles.macrosText}>
                  {Math.round(
                    (selectedItemDetails.nutritionalInfo.protein / 100) * grams
                  ) + "g"}
                </Text>
              </View>

              <View style={styles.macrosBarContainer}>
                <View
                  style={[
                    styles.macrosBar,
                    {
                      width: `${
                        (selectedItemDetails.nutritionalInfo.protein / 100) *
                        grams
                      }%`,
                      backgroundColor: "#ADFF00",
                    },
                  ]}
                ></View>
              </View>

              <View style={styles.macrosTextContainer}>
                <Text style={styles.macrosText}>Carbohydrates</Text>
                <Text style={styles.macrosText}>
                  {Math.round(
                    (selectedItemDetails.nutritionalInfo.carb / 100) * grams
                  ) + "g"}
                </Text>
              </View>

              <View style={styles.macrosBarContainer}>
                <View
                  style={[
                    styles.macrosBar,
                    {
                      width: `${
                        (selectedItemDetails.nutritionalInfo.carb / 100) * grams
                      }%`,
                      backgroundColor: "#FF9900",
                    },
                  ]}
                ></View>
              </View>

              <View style={styles.macrosTextContainer}>
                <Text style={styles.macrosText}>Fat</Text>
                <Text style={styles.macrosText}>
                  {Math.round(
                    (selectedItemDetails.nutritionalInfo.fat / 100) * grams
                  ) + "g"}
                </Text>
              </View>

              <View style={styles.macrosBarContainer}>
                <View
                  style={[
                    styles.macrosBar,
                    {
                      width: `${
                        (selectedItemDetails.nutritionalInfo.fat / 100) * grams
                      }%`,
                      backgroundColor: "#00A3FF",
                    },
                  ]}
                ></View>
              </View>

              <View style={styles.detailsCalories}>
                <Text style={styles.macrosTitle}>
                  {Math.round(
                    selectedItemDetails.nutritionalInfo.caloriesPerGram * grams
                  )}{" "}
                  Calories
                </Text>
                <Text style={styles.macrosTitle2}>(For 100g of product)</Text>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      {confirmationMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastMessage}>{confirmationMessage}</Text>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchBar: {
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  itemContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    maxWidth: "80%",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#273176",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
  addContainer: {
    padding: 5,
    backgroundColor: "#273176",
    borderRadius: 5,
  },
  add: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 12,
    color: "#fff",
  },
  toastContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#5EDD60",
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  toastMessage: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 14,
    color: "#fff",
  },
  detailsContainer: {
    width: "100%",
  },
  detailsGoBack: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  goBack: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#273176",
    textDecorationLine: "underline",
  },
  detailsText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  brand: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 16,
    color: "#000000",
    marginRight: 5,
  },
  name: {
    fontFamily: "MerriweatherSans-Regular",
    fontSize: 16,
    color: "#000000",
  },
  detailsMacrosTitle: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  macrosTitle: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 20,
    color: "#273176",
    marginRight: 5,
  },
  macrosTitle2: {
    fontFamily: "MerriweatherSans-Light",
    fontSize: 15,
    color: "#000000",
    marginRight: 5,
  },
  macrosTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  macrosText: {
    fontFamily: "MerriweatherSans-Bold",
    fontSize: 16,
    color: "#000000",
  },
  macrosBarContainer: {
    width: "100%",
    height: 5,
    backgroundColor: "#7C7C7C",
    marginBottom: 30,
  },
  macrosBar: {
    height: 5,
  },
  detailsCalories: {
    marginBottom: 30,
  },
});

export default FoodSelectionModal;
