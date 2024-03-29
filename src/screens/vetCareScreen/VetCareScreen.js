import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { images } from "../../constants/index";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchVetAdvice } from "../../../OpenAIService";
import { promptVetCare } from "../../AIHelper/VetCarePrompt";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";
import { db } from "../../../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { generateHealthGoals } from "../../AIHelper/DogDataFormatterForAI";

const VetCareScreen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState([]);
  const initialFeedLogs = {
    meals: [],
    activities: [],
    work: {
      name: dogInfo.isWorkingDog ? dogInfo.workType : "Not working",
      duration: 0,
      calories: 0,
      time: 0,
    },
    mealsCalories: 0,
    treatsCalories: 0,
    activityCalories: 0,
    workCalories: 0,
    remainingCalories: 0,
  };
  const [feedLogs, setFeedLogs] = useState(initialFeedLogs);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchDogInfoAndGoals() {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        if (!userId || !activeDogProfile) {
          console.log("User ID or active dog profile missing");
          return;
        }

        const dogRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);
        const dogSnap = await getDoc(dogRef);

        if (dogSnap.exists()) {
          setDogInfo(dogSnap.data());
        } else {
          console.log("No such document for dog info!");
          return;
        }

        const goalsQuery = query(
          collection(dogRef, "healthGoals"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const goalsSnap = await getDocs(goalsQuery);
        if (!goalsSnap.empty) {
          const goalsData = goalsSnap.docs[0].data();
          setHealthGoals(goalsData);
        } else {
          console.log("No health goals found");
        }
      }

      fetchDogInfoAndGoals();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchFeedLogs() {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        if (!userId || !activeDogProfile) {
          console.log("User ID or active dog profile missing");
          return;
        }
        if (!dogInfo || !selectedDate || !healthGoals) return;

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const feedLogRef = doc(
          db,
          `users/${userId}/dogs/${activeDogProfile}/feedLog/${formattedDate}`
        );

        const feedLogSnap = await getDoc(feedLogRef);

        if (feedLogSnap.exists()) {
          setFeedLogs(feedLogSnap.data().logs || []);
        } else {
          console.log("No feed log found for the selected date");
          setFeedLogs([]);
        }
      }

      fetchFeedLogs();
    }, [selectedDate, dogInfo])
  );

  useFocusEffect(
    useCallback(() => {
      async function initializeOrFetchDailyLog() {
        if (dogInfo && healthGoals) {
          const initializeOrFetchDailyLog = async () => {
            const userId = await SecureStore.getItemAsync("userId");
            const activeDogProfile = await SecureStore.getItemAsync(
              "activeDogProfile"
            );
            const formattedDate = format(selectedDate, "yyyy-MM-dd");

            const dailyLogRef = doc(
              db,
              `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
            );

            const dailyLogSnap = await getDoc(dailyLogRef);

            if (!dailyLogSnap.exists()) {
              await setDoc(dailyLogRef, {
                remainingCalories: parseFloat(
                  healthGoals.dailyCalories
                ).toFixed(0),
                remainingProteinGrams: parseFloat(
                  (
                    (healthGoals.dailyCalories * healthGoals.dailyProtein) /
                    100 /
                    4
                  ).toFixed(0)
                ),
                remainingFatGrams: parseFloat(
                  (healthGoals.dailyCalories * healthGoals.dailyFat) / 100 / 9
                ).toFixed(0),
                remainingCarbsGrams: parseFloat(
                  (
                    (healthGoals.dailyCalories * healthGoals.dailyCarbs) /
                    100 /
                    4
                  ).toFixed(0)
                ),
                mealsCalories: 0,
                treatsCalories: 0,
                activityCalories: 0,
                workCalories: 0,
                meals: [],
                treats: [],
                activities: [],
                work: {
                  name: dogInfo.isWorkingDog ? dogInfo.workType : "Not working",
                  duration: 0,
                  calories: 0,
                  time: 0,
                },
              });
            } else {
              setFeedLogs(dailyLogSnap.data());
            }
          };

          initializeOrFetchDailyLog();
        }
      }

      initializeOrFetchDailyLog();
    }, [selectedDate, dogInfo, healthGoals])
  );

  //chat code from here

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! How can I assist you with your dog today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "VetBot",
          avatar: images.logo_icon2,
        },
      },
    ]);
  }, []);

  const onSend = useCallback(
    async (messages = []) => {
      if (!dogInfo || !healthGoals) {
        console.error("Dog info or health goals not loaded yet.");
        return;
      }

      setIsAITyping(true);

      const userMessageText = messages[0].text;
      const recognizedIntent = recognizeUpdateWeightIntent(userMessageText);

      if (recognizedIntent && recognizedIntent.intent === "UPDATE_WEIGHT") {
        setPendingUpdate({ weight: recognizedIntent.weight });
        setShowConfirmationModal(true);
      }

      const newUserMessage = {
        role: "user",
        content: messages[0].text,
      };

      let updatedConversationHistory = [...conversationHistory];
      if (conversationHistory.length === 0) {
        const dogContextMessage = {
          role: "system",
          content: promptVetCare(dogInfo, healthGoals, feedLogs, ""),
        };
        updatedConversationHistory.unshift(dogContextMessage);
      }

      updatedConversationHistory.push(newUserMessage);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      try {
        const aiResponse = await fetchVetAdvice(updatedConversationHistory);
        const aiMessage = {
          _id: Math.random().toString(36).substring(7),
          text: aiResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "VetBot",
            avatar: images.logo_icon2,
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [aiMessage])
        );
        setConversationHistory([
          ...updatedConversationHistory,
          { role: "assistant", content: aiResponse },
        ]);

        setIsAITyping(false);
      } catch (error) {
        console.error("Failed to fetch AI response:", error);
        setIsAITyping(false);
      }
    },
    [dogInfo, healthGoals, feedLogs, conversationHistory, setIsAITyping]
  );

  const recognizeUpdateWeightIntent = (message) => {
    const patterns = [
      /weight of the dog to (\d+)\s*(?:kg)?/i,
      /dog's weight to (\d+)\s*(?:kg)?/i,
      /dog weighs? (\d+)\s*(?:kg)?/i,
      /dog's weight? (\d+)\s*(?:kg)?/i,
      /dog is now (\d+)\s*(?:kg)?/i,
      /dog's weight changed.*? to (\d+)\s*(?:kg)?/i,
      /make the dog weigh (\d+)\s*(?:kg)?/i,
      /set the dog's weight to (\d+)\s*(?:kg)?/i,
      /update the dog's weight to (\d+)\s*(?:kg)?/i,
      /weight to (\d+)\s*/i,
      /weighs? (\d+)\s*/i,
      /weight? (\d+)\s*/i,
      /is now (\d+)\s*/i,
      /changed.*? to (\d+)\s*/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return {
          intent: "UPDATE_WEIGHT",
          weight: parseInt(match[1], 10),
        };
      }
    }

    return null;
  };

  const handleUpdateWeight = async (newWeight) => {
    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    try {
      const updatingMessage = {
        _id: Math.random().toString(36).substring(7),
        text: `Ok, I am updating ${activeDogProfile}'s weight to ${newWeight} kg.`,
        createdAt: new Date(),
        user: {
          _id: 2, // AI's ID
          name: "VetBot",
          avatar: images.logo_icon2,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [updatingMessage])
      );

      await updateDogProfile(newWeight);

      const successMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "The weight has been updated successfully!",
        createdAt: new Date(),
        user: {
          _id: 2, // AI's ID
          name: "VetBot",
          avatar: images.logo_icon2,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [successMessage])
      );
    } catch (error) {
      console.error("Error updating weight:", error);

      const errorMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "Sorry, there was a problem updating the weight. Please try again later.",
        createdAt: new Date(),
        user: {
          _id: 2, // AI's ID
          name: "VetBot",
          avatar: images.logo_icon2,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    }
  };

  const updateDogProfile = async (newWeight) => {
    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");

    if (!userId || !activeDogProfile) {
      console.error("User ID or dog profile is missing");
      return;
    }

    const dogProfileRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);

    const dogSnap = await getDoc(dogProfileRef);
    if (!dogSnap.exists()) {
      console.error("Dog profile not found");
      return;
    }
    const currentDogInfo = dogSnap.data();

    await updateDoc(dogProfileRef, {
      dogWeight: newWeight,
    });

    const healthGoalsCollectionRef = collection(dogProfileRef, "healthGoals");
    const querySnapshot = await getDocs(healthGoalsCollectionRef);
    if (querySnapshot.docs.length > 0) {
      const healthGoalDoc = querySnapshot.docs[0];
      await updateDoc(healthGoalDoc.ref, {
        currentWeight: newWeight,
      });

      const updatedDogInfo = { ...currentDogInfo, dogWeight: newWeight };

      const createdHealthGoals = generateHealthGoals(updatedDogInfo);

      await updateDoc(healthGoalDoc.ref, createdHealthGoals);
    } else {
      console.log("No health goals found for this dog");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Vet Care Chat</Text>
        </View>
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            showAvatarForEveryMessage={true}
            renderAvatar={(props) => (
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    props.currentMessage.user._id === 2
                      ? props.currentMessage.user.avatar
                      : undefined
                  }
                  style={styles.avatarStyle}
                />
              </View>
            )}
            messagesContainerStyle={{
              backgroundColor: "#E6ECFC",
            }}
            textInputStyle={{
              backgroundColor: "#fff",
              borderRadius: 20,
            }}
            renderBubble={(props) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: "#273176",
                  },
                  left: {
                    backgroundColor: "#181C39",
                  },
                }}
                textStyle={{
                  right: {
                    color: "#fff",
                  },
                  left: {
                    color: "#fff",
                  },
                }}
              />
            )}
            renderSend={(props) => (
              <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                  <Icon name="send" size={30} color="#0084ff" />
                </View>
              </Send>
            )}
            user={{
              _id: 1,
            }}
            isTyping={isAITyping}
          />
        </View>
      </View>

      <Modal
        visible={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.h1}>
              Do you want to update the weight to {pendingUpdate?.weight} kg?
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleUpdateWeight(pendingUpdate.weight);
                  setShowConfirmationModal(false);
                }}
              >
                <Text style={styles.h2}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setShowConfirmationModal(false);
                }}
              >
                <Text style={styles.h2}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#E6ECFC",
  },
  topBar: {
    padding: 10,
    width: "100%",
    height: 70,
    backgroundColor: "#181C39",
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: "#181C39",
  },
  topBarText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 20,
    fontFamily: "MerriweatherSans-Bold",
    color: "#ffffff",
  },
  chatContainer: {
    flex: 1,
    width: "100%",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181C39",
  },
  avatarStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    transform: [{ rotateZ: "36deg" }],
  },

  //modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
    elevation: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    marginTop: 40,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#273176",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 18,
    color: "#273176",
    textAlign: "center",
  },
  h2: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 2,
  },
});

export default VetCareScreen;
