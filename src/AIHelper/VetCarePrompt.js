/**
 * Craft a prompt for the Vet‑care chatbot.
 *
 * The model receives a quick summary of the dog + today’s intake and either:
 *   • answers a specific user query; or
 *   • offers general tips when no query is given.
 *
 * @param {object} dogInfo      – includes dogName, breed, gender, isWorkingDog,
 *                                workType, etc.
 * @param {object} healthGoals  – macro %s, dailyCalories, age {age,unit}, …
 * @param {object} feedLogs     – today’s calories + activities
 * @param {string} [userQuery]  – what the user asked (optional)
 * @returns {string}            – prompt ready for OpenAI chat‑completion
 */
export const promptVetCare = (
  dogInfo,
  healthGoals,
  feedLogs,
  userQuery = ""
) => {
  // Macro grams from %
  const toGrams = (pct, kcal, kcalPerG) => (kcal * pct) / 100 / kcalPerG;
  const proteinG = toGrams(
    healthGoals.dailyProtein,
    healthGoals.dailyCalories,
    4
  ).toFixed(0);
  const carbsG = toGrams(
    healthGoals.dailyCarbs,
    healthGoals.dailyCalories,
    4
  ).toFixed(0);
  const fatG = toGrams(
    healthGoals.dailyFat,
    healthGoals.dailyCalories,
    9
  ).toFixed(0);

  /* ---------- summary lines ---------- */
  const summary = [
    "Quick Summary:",
    `- Dog's Name: ${dogInfo.dogName} (Breed: ${dogInfo.breed}, Age: ${healthGoals.age.age} ${healthGoals.age.unit}, Gender: ${dogInfo.gender}, Current Weight: ${healthGoals.currentWeight} kg)`,
    `- Working Dog: ${
      dogInfo.isWorkingDog ? `Yes (Type: ${dogInfo.workType})` : "No"
    }`,
    `- Daily Goals: ${healthGoals.dailyCalories} kcal (Protein ${proteinG} g, Carbs ${carbsG} g, Fat ${fatG} g) — ${healthGoals.mealsPerDay} meals/day`,
    `- Today's Intake: ${
      feedLogs.mealsCalories + feedLogs.treatsCalories
    } kcal from food & treats`,
    `- Physical Activity: ${
      feedLogs.activityCalories + feedLogs.workCalories
    } kcal burned`,
    "",
  ].join("\n");

  /* ---------- instructions ---------- */
  const instructions = [
    "You are **Vet‑BOT**, an AI veterinary assistant. Provide concise, helpful advice based on the summary above.",
    "If asked about topics unrelated to canine health / nutrition / care, politely decline as you are specialised.",
    "",
  ];

  /* ---------- user query handling ---------- */
  if (userQuery.trim()) {
    instructions.push(
      `User's Query: \"${userQuery}\"`,
      "Answer directly, citing relevant figures from the summary (e.g. calorie totals, macro goals).",
      ""
    );
  } else {
    instructions.push(
      "Offer general advice or tips tailored to this dog's profile and goals.",
      ""
    );
  }

  instructions.push(
    "Remember: Your guidance is general and does not replace professional veterinary diagnosis or treatment."
  );

  return [
    "You are Vet BOT, an AI veterinarian assistant.",
    summary,
    ...instructions,
  ]
    .join("\n")
    .trim();
};
