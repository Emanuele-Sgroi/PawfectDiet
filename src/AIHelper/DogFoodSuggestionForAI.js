/**
 * Build a prompt for OpenAI that asks the model to create a daily meal &
 * activity plan for a dog, taking into account health‑goal macros and the
 * foods/activities we have on hand.
 *
 * • We return **one big string** for chat‑completion requests.
 * • Feed‑log argument kept for future tweaks (protein already consumed etc.).
 */
import {
  dogCommercialFoodData,
  dogTreatsData,
  dogHomemadeFoodData,
} from "../../dogFoodData";

export const dailyLogAIPrompt = (dogInfo, healthGoals, feedLogs) => {
  // ── helper values ────────────────────────────────────────────────
  const gFromPct = (pct, cals, kcalPerG) => (cals * pct) / 100 / kcalPerG;
  const proteinG = gFromPct(
    healthGoals.dailyProtein,
    healthGoals.dailyCalories,
    4
  ).toFixed(0);
  const carbsG = gFromPct(
    healthGoals.dailyCarbs,
    healthGoals.dailyCalories,
    4
  ).toFixed(0);
  const fatG = gFromPct(
    healthGoals.dailyFat,
    healthGoals.dailyCalories,
    9
  ).toFixed(0);

  const age =
    typeof healthGoals.age === "object"
      ? `${healthGoals.age.age} ${healthGoals.age.unit}`
      : healthGoals.age;

  // ── build dog‑summary lines ─────────────────────────────────────
  const header = [
    "Dog Info:",
    `- Name: ${dogInfo.dogName}`,
    `- Breed: ${dogInfo.breed}`,
    `- Age: ${age}`,
    `- Gender: ${dogInfo.gender}`,
    `- Current Weight: ${healthGoals.currentWeight} kg`,
    `- Goal Weight: ${healthGoals.goalWeight} kg`,
    `- Overall Goal: ${healthGoals.overallGoal}`,
    dogInfo.isWorkingDog
      ? `- Working/Sporting Dog: Yes`
      : `- Working/Sporting Dog: No`,
    dogInfo.isWorkingDog ? `- Work Type: ${dogInfo.workType}` : null,
    `- Activity Level: ${dogInfo.activityLevel}`,
    `- Goal Daily Calories: ${healthGoals.dailyCalories} kcal`,
    `- Goal Daily Proteins: ${proteinG} g`,
    `- Goal Daily Carbs: ${carbsG} g`,
    `- Goal Daily Fat: ${fatG} g`,
    `- Suggested meals per day: ${healthGoals.mealsPerDay}`,
  ]
    .filter(Boolean)
    .join("\n");

  // ── filter available food & treats ──────────────────────────────
  const prefersKnown = !dogInfo.opennessToNewFoods;

  const matchPref = (prefArr, { brand, name }) =>
    prefArr.some((p) => p.brand === brand && p.name === name);

  const foodChoices = prefersKnown
    ? [
        ...dogCommercialFoodData.filter((f) =>
          matchPref(dogInfo.commercialFoodPreferences, f)
        ),
        ...dogHomemadeFoodData.filter((f) =>
          matchPref(dogInfo.homemadeFoodPreferences, f)
        ),
      ]
    : [...dogCommercialFoodData, ...dogHomemadeFoodData];

  const treatChoices = prefersKnown
    ? dogTreatsData.filter((t) => matchPref(dogInfo.treatPreferences, t))
    : dogTreatsData;

  const fmtFood = (f) =>
    `${f.brand} - ${f.name}, Nutritional Info: (Protein ${f.nutritionalInfo.protein}%, Carbs ${f.nutritionalInfo.carb}%, Fat ${f.nutritionalInfo.fat}%)`;
  const fmtTreat = (t) =>
    `${t.brand} - ${t.name}, Nutritional Info: (Calories ${t.nutritionalInfo.caloriesPerPiece} kcal per piece, Protein ${t.nutritionalInfo.protein}%, Carbs ${t.nutritionalInfo.carb}%, Fat ${t.nutritionalInfo.fat}%, Piece weight ${t.nutritionalInfo.pieceWeight} g)`;

  const foodList = foodChoices.map(fmtFood).join("\n");
  const treatList = treatChoices.map(fmtTreat).join("\n");

  // ── static activities list ─────────────────────────────────────
  const activities = [
    "Walking",
    "Running",
    "Fetch",
    "Swimming",
    "Agility Training",
    "Ball Games",
    "Frisbee",
    "Hiking",
    "Hide and Seek",
    "Obstacle Course",
  ].join(", ");

  // ── assemble prompt ────────────────────────────────────────────
  const P = [];
  P.push(
    "Generate a daily plan (JSON) with keys 'food', 'treats', 'activities', 'work'.",
    "Consider the dog's goals and the inventory below. Return max 4 treats and max 2 activities.",
    header,
    "\nList of food available:",
    foodList || "- None",
    "\nList of treats available:",
    treatList || "- None",
    `\nList of physical activities available: ${activities}`,
    "\nExample output (illustrative):",
    "food: [ { foodBrand: 'Tesco', foodName: 'Chicken Breast', note: 'Reason …' } ],",
    "treats: [ { treatBrand: 'Beta', treatName: 'Meat Sticks', numberOfTreatPerDay: 2 } ],",
    "activities: [ { name: 'Running', durationInMinutes: 30 } ],",
    "work: [ { workType: 'service', shiftLengthHours: 2, workIntensity: 'Light', caloriesConsumed: 60 } ]",
    "\nAdjust servings and rationale to meet the dog's needs."
  );

  return P.join("\n").trim();
};
