export const dailyLogResultPrompt = (dogInfo, healthGoals, feedLogs) => {
  let prompt =
    "Given the detailed information about a dog, its health goals, and today's feed log, generate a daily log result that includes a rating from 1 to 5 and detailed feedback. Evaluate the dog's nutritional needs against the food and treats consumed, considering the activities performed and how these elements contribute to or detract from the overall health goals.";

  prompt += `\n\nDog Info and Health Goals:\n- Name: ${dogInfo.dogName}\n- Breed: ${dogInfo.breed}\n- Age: ${healthGoals.age} years\n- Gender: ${dogInfo.gender}\n- Current Weight: ${healthGoals.currentWeight} kg\n- Goal Weight: ${healthGoals.goalWeight} kg\n- Overall Goal: ${healthGoals.overallGoal}\n- Activity Level: ${dogInfo.activityLevel}\n- Goal Daily Calories: ${healthGoals.dailyCalories} kcal\n- Goal Daily Proteins: ${healthGoals.dailyProtein}%\n- Goal Daily Carbs: ${healthGoals.dailyCarbs}%\n- Goal Daily Fat: ${healthGoals.dailyFat}%`;

  prompt += "\n\nToday's Feed Log:";
  prompt += `\n- Remaining Calories: ${feedLogs.remainingCalories}\n- Calories from Meals: ${feedLogs.mealsCalories}\n- Calories from Treats: ${feedLogs.treatsCalories}\n- Calories Burned from Activities: ${feedLogs.activityCalories}`;
  if (dogInfo.isWorkingDog) {
    prompt += `\n- Calories Burned from Work: ${feedLogs.workCalories}`;
  }

  const mealsDetail =
    feedLogs.meals.length > 0
      ? feedLogs.meals
          .map(
            (meal) =>
              `- ${meal.foodName} (${meal.brand}): ${meal.quantityGrams} grams`
          )
          .join("\n")
      : "- None";
  const treatsDetail =
    feedLogs.treats.length > 0
      ? feedLogs.treats
          .map(
            (treat) =>
              `- ${treat.foodName} (${treat.brand}): ${treat.quantityGrams} pieces`
          )
          .join("\n")
      : "- None";
  const activitiesDetail =
    feedLogs.activities.length > 0
      ? feedLogs.activities
          .map(
            (activity) =>
              `- ${activity.name}: ${activity.duration} minutes, Calories Burned: ${activity.calories}`
          )
          .join("\n")
      : "- None";

  prompt += `\n\nMeals Consumed Today:\n${mealsDetail}\n\nTreats Consumed Today:\n${treatsDetail}\n\nPhysical Activities Today:\n${activitiesDetail}`;

  if (dogInfo.isWorkingDog) {
    const workDetail =
      feedLogs.work.calories > 0
        ? `- ${dogInfo.workType}: ${feedLogs.work.duration} hours, Calories Burned: ${feedLogs.work.calories}`
        : "- No work activities recorded.";
    prompt += `\n\nWork Activities Today:\n${workDetail}`;
  }

  prompt +=
    "\n\nAnalyze the provided feed log against the dog's health goals. Consider if the dietary intake and activities adequately support the health goals or if there are areas for improvement. Specifically, assess if the remaining calories are appropriate, if the balance of nutrients from meals and treats is aligned with dietary needs, and if the amount of physical and work activities is sufficient.";

  prompt +=
    "\n\nRate today's feed log from 1 to 5 based on how well it aligns with the health goals. Provide detailed feedback that includes both positive aspects and areas for improvement. Your feedback should offer constructive suggestions on how to better meet the dog's nutritional and activity needs.";

  prompt +=
    "\n\nIt is crucial to assess the feed log critically, especially if there is a significant discrepancy between the remaining calories and the goal. Adequate measures should be taken to align the daily intake more closely with the health objectives.";

  prompt +=
    "\n\nProvide the result in JSON format with 'rate' and 'feedback' keys, as shown in the example below:";
  prompt += "\n\nExample of Output:";
  prompt +=
    '\n{\n  "rate": 4,\n  "feedback": "The feed log for today shows a good effort. [further detailed feedback]"\n}';

  const cleanPrompt = prompt.trim();

  return cleanPrompt;
};
