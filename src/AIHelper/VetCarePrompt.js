export const promptVetCare = (
  dogInfo,
  healthGoals,
  feedLogs,
  userQuery = ""
) => {
  const protein =
    (healthGoals.dailyCalories * healthGoals.dailyProtein) / 100 / 4;
  const carbs = (healthGoals.dailyCalories * healthGoals.dailyCarbs) / 100 / 4;
  const fat = (healthGoals.dailyCalories * healthGoals.dailyFat) / 100 / 9;

  let prompt = `You are Vet BOT, an AI designed to behave like a vet and give advice based on the dog's profile, health goals, and daily intake information provided below. Answer the user's queries naturally and concisely, using the specific information when relevant.\n\n`;

  prompt += `Quick Summary:\n`;
  prompt += `- Dog's Name: ${dogInfo.dogName} (Breed: ${dogInfo.breed}, Age: ${healthGoals.age.age} ${healthGoals.age.unit}, Gender: ${dogInfo.gender}, Current Weight: ${healthGoals.currentWeight}kg)\n`;
  prompt += `- Working Dog: ${
    dogInfo.isWorkingDog ? `Yes (Type: ${dogInfo.workType})` : "No"
  }\n`;
  prompt += `- Daily Goals: ${healthGoals.dailyCalories} calories (Proteins: ${protein}g, Carbs: ${carbs}g, Fat: ${fat}g), ${healthGoals.mealsPerDay} meals per day\n`;
  prompt += `- Today's Intake: ${
    feedLogs.mealsCalories + feedLogs.treatsCalories
  } total calories from food and treats\n`;
  prompt += `- Physical Activity: Burned ${
    feedLogs.activityCalories + feedLogs.workCalories
  } calories from activities and work\n\n`;

  prompt += `If the user asks something unrelated to dog health, nutrition, or care, kindly inform them that you're designed specifically for advice on canine well-being and may not be able to provide assistance on other topics.\n\n`;

  if (userQuery.trim()) {
    prompt += `User's Query: "${userQuery}"\n\n`;
    prompt += `Using the summary above, answer the user's query as directly as possible. If the query is about today's calorie intake, reference the 'Today's Intake' and 'Physical Activity' sections. For queries about dietary goals, refer to the 'Daily Goals' section.\n\n`;
  } else {
    prompt += `Please provide general advice or tips related to the dog's profile and health goals mentioned above.\n\n`;
  }

  prompt += `Remember: Your responses should directly address the user's queries with specific information from the dog's profile, health goals, and daily intake. You are providing general guidance and not diagnosing or treating medical conditions.\n`;

  return prompt;
};
