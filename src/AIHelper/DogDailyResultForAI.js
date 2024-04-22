/**
 * Build an OpenAI prompt that asks the model to evaluate the day’s feed log
 * against a dog’s health goals and return a JSON report with a 1‑5 rating and
 * feedback.
 *
 * @param {object} dogInfo      – name, breed, gender, activityLevel, etc.
 * @param {object} healthGoals  – goal macro %s, daily cals, age, weights …
 * @param {object} feedLogs     – what the dog ate & did today
 * @returns {string}            – ready‑to‑feed prompt
 */
export const dailyLogResultPrompt = (dogInfo, healthGoals, feedLogs) => {
  const L = [];

  // Intro
  L.push(
    "Given the detailed information about a dog, its health goals, and today's feed log, generate a daily log result that includes a rating from 1 to 5 and constructive feedback. Evaluate nutritional intake vs. needs, considering activities performed and overall goals."
  );

  // Dog / goals summary
  L.push("", "Dog Info and Health Goals:");
  L.push(`- Name: ${dogInfo.dogName}`);
  L.push(`- Breed: ${dogInfo.breed}`);
  L.push(`- Age: ${healthGoals.age} years`);
  L.push(`- Gender: ${dogInfo.gender}`);
  L.push(`- Current Weight: ${healthGoals.currentWeight} kg`);
  L.push(`- Goal Weight: ${healthGoals.goalWeight} kg`);
  L.push(`- Overall Goal: ${healthGoals.overallGoal}`);
  L.push(`- Activity Level: ${dogInfo.activityLevel}`);
  L.push(`- Goal Daily Calories: ${healthGoals.dailyCalories} kcal`);
  L.push(`- Goal Daily Proteins: ${healthGoals.dailyProtein}%`);
  L.push(`- Goal Daily Carbs: ${healthGoals.dailyCarbs}%`);
  L.push(`- Goal Daily Fat: ${healthGoals.dailyFat}%`);

  // Feed‑log headline stats
  L.push("", "Today's Feed Log:");
  L.push(`- Remaining Calories: ${feedLogs.remainingCalories}`);
  L.push(`- Calories from Meals: ${feedLogs.mealsCalories}`);
  L.push(`- Calories from Treats: ${feedLogs.treatsCalories}`);
  L.push(`- Calories Burned from Activities: ${feedLogs.activityCalories}`);
  if (dogInfo.isWorkingDog)
    L.push(`- Calories Burned from Work: ${feedLogs.workCalories}`);

  // Helper to render detail arrays
  const renderList = (arr, fmt) =>
    arr.length ? arr.map(fmt).join("\n") : "- None";

  L.push("", "Meals Consumed Today:");
  L.push(
    renderList(
      feedLogs.meals,
      (m) => `- ${m.foodName} (${m.brand}): ${m.quantityGrams} g`
    )
  );

  L.push("", "Treats Consumed Today:");
  L.push(
    renderList(
      feedLogs.treats,
      (t) => `- ${t.foodName} (${t.brand}): ${t.quantityGrams} pcs`
    )
  );

  L.push("", "Physical Activities Today:");
  L.push(
    renderList(
      feedLogs.activities,
      (a) => `- ${a.name}: ${a.duration} min, Calories: ${a.calories}`
    )
  );

  if (dogInfo.isWorkingDog) {
    L.push("", "Work Activities Today:");
    if (feedLogs.work?.calories > 0) {
      L.push(
        `- ${dogInfo.workType}: ${feedLogs.work.duration} h, Calories: ${feedLogs.work.calories}`
      );
    } else {
      L.push("- No work activities recorded.");
    }
  }

  // Analysis instructions
  L.push(
    "\nAnalyze the feed log against the goals. Comment on remaining calories, macro balance, and adequacy of physical/work activities.",
    "\nRate today's log from 1 (poor) to 5 (excellent) and give actionable feedback (positives + improvements).",
    "\nReturn the result in JSON with keys 'rate' and 'feedback'.",
    '\nExample output:\n{\n  "rate": 4,\n  "feedback": "The feed log for today shows a good effort …"\n}'
  );

  return L.join("\n").trim();
};
