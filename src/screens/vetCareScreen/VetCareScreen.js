/**
 * VetCareScreen
 * -------------
 *  • Chat interface (Gifted‑Chat) where the user can ask “VetBot” anything
 *    about their dog’s health, nutrition or training.
 *  • Pulls context (dog profile, latest health‑goals and today’s feed‑log)
 *    from Firestore and stores a rolling `conversationHistory` so the
 *    OpenAI endpoint can give contextual answers.
 *  • Detects simple “update weight” intents inside user messages, shows a
 *    confirmation modal, then updates both the dog profile and its latest
 *    health‑goal document (including re‑generating macros).
 *
 */

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
import Icon from "react-native-vector-icons/Ionicons";
import images from "../../constants/index"; // assets
import { fetchVetAdvice } from "../../../OpenAIService";
import { promptVetCare } from "../../AIHelper/VetCarePrompt";

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
import { useFocusEffect } from "@react-navigation/native";

/* ---------------------------------------------------------------- constants */
const initialFeedLogs = {
  meals: [],
  activities: [],
  work: { name: "Not working", duration: 0, calories: 0, time: 0 },
  mealsCalories: 0,
  treatsCalories: 0,
  activityCalories: 0,
  workCalories: 0,
  remainingCalories: 0,
};

/* ====================================================== component ========= */
const VetCareScreen = () => {
  /* --------------------------------------------------------------- state */
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isAITyping, setIsAITyping] = useState(false);

  const [selectedDate] = useState(new Date()); // today
  const [healthGoals, setHealthGoals] = useState(null);
  const [dogInfo, setDogInfo] = useState(null);
  const [feedLogs, setFeedLogs] = useState(initialFeedLogs);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  /* ------------------------------------------- Firestore: profile & goals */
  useFocusEffect(
    useCallback(() => {
      const fetchDogInfoAndGoals = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        if (!userId || !activeDogProfile) return console.log("Missing IDs");

        /* active dog profile ------------------------------------------ */
        const dogRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);
        const dogSnap = await getDoc(dogRef);
        if (!dogSnap.exists()) return console.log("Dog profile not found");
        const info = dogSnap.data();
        setDogInfo(info);

        /* latest health‑goals ----------------------------------------- */
        const goalsQuery = query(
          collection(dogRef, "healthGoals"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const goalsSnap = await getDocs(goalsQuery);
        if (goalsSnap.empty) return console.log("No health goals");
        setHealthGoals(goalsSnap.docs[0].data());
      };

      fetchDogInfoAndGoals();
    }, [])
  );

  /* ---------------------------------------- Firestore: today’s feed‑log */
  useFocusEffect(
    useCallback(() => {
      const fetchFeedLogs = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        if (!userId || !activeDogProfile || !dogInfo) return;

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const feedLogRef = doc(
          db,
          `users/${userId}/dogs/${activeDogProfile}/feedLog/${formattedDate}`
        );

        const snap = await getDoc(feedLogRef);
        setFeedLogs(snap.exists() ? snap.data().logs : []);
      };

      fetchFeedLogs();
    }, [selectedDate, dogInfo])
  );

  /* ------------------------------------------- Firestore: daily‑log doc */
  useFocusEffect(
    useCallback(() => {
      if (!dogInfo || !healthGoals) return;
      const initDailyLog = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        const activeDogProfile = await SecureStore.getItemAsync(
          "activeDogProfile"
        );
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const dailyLogRef = doc(
          db,
          `users/${userId}/dogs/${activeDogProfile}/dailyLogs/${formattedDate}`
        );
        const snap = await getDoc(dailyLogRef);

        if (!snap.exists()) {
          await setDoc(dailyLogRef, {
            ...initialFeedLogs,
            remainingCalories: healthGoals.dailyCalories.toFixed(0),
            remainingProteinGrams: (
              (healthGoals.dailyCalories * healthGoals.dailyProtein) /
              100 /
              4
            ).toFixed(0),
            remainingFatGrams: (
              (healthGoals.dailyCalories * healthGoals.dailyFat) /
              100 /
              9
            ).toFixed(0),
            remainingCarbsGrams: (
              (healthGoals.dailyCalories * healthGoals.dailyCarbs) /
              100 /
              4
            ).toFixed(0),
            work: {
              name: dogInfo.isWorkingDog ? dogInfo.workType : "Not working",
              duration: 0,
              calories: 0,
              time: 0,
            },
          });
        } else {
          setFeedLogs(snap.data());
        }
      };
      initDailyLog();
    }, [selectedDate, dogInfo, healthGoals])
  );

  /* ------------------------------------------------ initial bot greeting */
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! How can I assist you with your dog today?",
        createdAt: new Date(),
        user: { _id: 2, name: "VetBot", avatar: images.logo_icon2 },
      },
    ]);
  }, []);

  /* ---------------------------------------------------------- send logic */
  const onSend = useCallback(
    async (msgs = []) => {
      if (!dogInfo || !healthGoals) return;

      setIsAITyping(true); // UI “typing” indicator
      const userText = msgs[0].text;

      /* simple NLP – detect “update weight” --------------------------- */
      const intent = recogniseUpdateWeightIntent(userText);
      if (intent) {
        setPendingUpdate({ weight: intent.weight });
        setShowConfirmationModal(true);
      }

      /* build conversation context for OpenAI ------------------------ */
      const newUserMsg = { role: "user", content: userText };
      const history = conversationHistory.length
        ? [...conversationHistory, newUserMsg]
        : [
            {
              role: "system",
              content: promptVetCare(dogInfo, healthGoals, feedLogs, ""),
            },
            newUserMsg,
          ];

      /* 1) append user message locally ------------------------------- */
      setMessages((prev) => GiftedChat.append(prev, msgs));

      /* 2) fetch AI reply ------------------------------------------- */
      try {
        const aiText = await fetchVetAdvice(history);
        const aiMsg = {
          _id: Math.random().toString(36).substr(2, 9),
          text: aiText,
          createdAt: new Date(),
          user: { _id: 2, name: "VetBot", avatar: images.logo_icon2 },
        };
        setMessages((prev) => GiftedChat.append(prev, [aiMsg]));
        setConversationHistory([
          ...history,
          { role: "assistant", content: aiText },
        ]);
      } catch (err) {
        console.error("AI error:", err);
      } finally {
        setIsAITyping(false);
      }
    },
    [dogInfo, healthGoals, feedLogs, conversationHistory]
  );

  /* ------------------------------------------ weight update helpers */
  const recogniseUpdateWeightIntent = (text) => {
    const patterns = [
      /weight.*? to (\d+)\s*kg?/i,
      /dog.*? weighs? (\d+)\s*kg?/i,
      /is now (\d+)\s*kg?/i,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return { intent: "UPDATE_WEIGHT", weight: parseInt(m[1], 10) };
    }
    return null;
  };

  const handleUpdateWeight = async (newWeight) => {
    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    if (!userId || !activeDogProfile) return;

    /* optimistic chat feedback */
    appendBotMessage(
      `Ok, I am updating ${activeDogProfile}'s weight to ${newWeight} kg.`
    );

    try {
      await updateDogProfile(newWeight);
      appendBotMessage("The weight has been updated successfully!");
    } catch (err) {
      console.error("Update weight error:", err);
      appendBotMessage("Sorry, there was a problem updating the weight.");
    }
  };

  const appendBotMessage = (text) =>
    setMessages((prev) =>
      GiftedChat.append(prev, [
        {
          _id: Math.random().toString(36).substr(2, 9),
          text,
          createdAt: new Date(),
          user: { _id: 2, name: "VetBot", avatar: images.logo_icon2 },
        },
      ])
    );

  const updateDogProfile = async (newWeight) => {
    const userId = await SecureStore.getItemAsync("userId");
    const activeDogProfile = await SecureStore.getItemAsync("activeDogProfile");
    const profileRef = doc(db, `users/${userId}/dogs/${activeDogProfile}`);

    /* 1) update weight in profile ------------------------------------ */
    await updateDoc(profileRef, { dogWeight: newWeight });

    /* 2) update latest health‑goals doc ------------------------------ */
    const goalsSnap = await getDocs(collection(profileRef, "healthGoals"));
    if (goalsSnap.empty) return;
    const goalRef = goalsSnap.docs[0].ref;
    await updateDoc(goalRef, { currentWeight: newWeight });

    /* 3) re‑calculate derived targets (calories etc.) ---------------- */
    const updatedDogInfo = {
      ...(await getDoc(profileRef)).data(),
      dogWeight: newWeight,
    };
    await updateDoc(goalRef, generateHealthGoals(updatedDogInfo));
  };

  /* ------------------------------------------------------------------ UI */
  return (
    <>
      {/* ---------------- Chat Area ---------------- */}
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Vet Care Chat</Text>
        </View>

        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          isTyping={isAITyping}
          showAvatarForEveryMessage
          messagesContainerStyle={{ backgroundColor: "#E6ECFC" }}
          textInputStyle={{ backgroundColor: "#fff", borderRadius: 20 }}
          /* customise bubbles */
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: "#273176" },
                left: { backgroundColor: "#181C39" },
              }}
              textStyle={{ right: { color: "#fff" }, left: { color: "#fff" } }}
            />
          )}
          /* send button */
          renderSend={(props) => (
            <Send {...props}>
              <View style={{ marginRight: 10, marginBottom: 5 }}>
                <Icon name="send" size={30} color="#0084ff" />
              </View>
            </Send>
          )}
          /* custom avatar (only for VetBot) */
          renderAvatar={(props) => (
            <View style={styles.avatarContainer}>
              {props.currentMessage.user._id === 2 && (
                <Image source={images.logo_icon2} style={styles.avatarStyle} />
              )}
            </View>
          )}
        />
      </View>

      {/* -------- Weight‑update confirmation modal -------- */}
      <Modal
        visible={showConfirmationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.h1}>
              Update weight to {pendingUpdate?.weight} kg?
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
                onPress={() => setShowConfirmationModal(false)}
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

/* ---------------------------------------------------------------- styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6ECFC" },
  topBar: {
    height: 70,
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: "#181C39",
  },
  topBarText: {
    fontSize: 20,
    fontFamily: "MerriweatherSans-Bold",
    color: "#fff",
  },

  avatarContainer: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#181C39",
  },
  avatarStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    transform: [{ rotateZ: "36deg" }],
  },

  /* modal */
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonsContainer: { flexDirection: "row", gap: 30, marginTop: 40 },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#273176",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontFamily: "MerriweatherSans-ExtraBold",
    fontSize: 18,
    color: "#273176",
    textAlign: "center",
  },
  h2: { fontFamily: "MerriweatherSans-ExtraBold", fontSize: 18, color: "#fff" },
});

export default VetCareScreen;
