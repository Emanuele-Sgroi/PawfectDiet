export const dogCaloriesBurnedCalculation = (
  selectedActivity,
  durationInHours,
  dogInfo,
  healthGoals
) => {
  let prompt = "";

  prompt +=
    "Given the detailed information about the dog, the type of physical activity, and the duration of the physical activity, calculate the calories burned. Ensure the calculation reflects realistic energy expenditure for dogs, considering the dog's weight and the activity's intensity. For most activities, a dog burns between 5 to 20 calories per minute depending on intensity. Use the following formula as a guideline, adjusting the MET value based on the activity's intensity:\n\n";

  prompt += "Calories Burned = (METs x Weight (kg) x Time (hours)) x 3.5\n\n";
  prompt +=
    "Where METs for moderate activities range from 3 to 6, and vigorous activities range from 6 to 9. Use the lower end for less intense activities and the higher end for more intense activities. Provide the calories burned as a JSON object with keys 'activityName', 'duration', and 'caloriesBurned'.\n\n";

  prompt += "Dog Info:\n";
  prompt += `- Name: ${dogInfo.name}\n`;
  prompt += `- Breed: ${dogInfo.breed}\n`;
  prompt += `- Weight: ${dogInfo.weight} kg\n`;
  prompt += `- Activity: ${selectedActivity}\n`;
  prompt += `- Duration: ${durationInHours} hours\n\n`;
  0;
  prompt +=
    "Based on the dog's weight and the specified activity and duration, generate a realistic calculation for calories burned.\n";

  prompt += "Example of expected output (JSON format):\n";
  prompt += `{\n  "activityName": "${selectedActivity}",\n  "duration": "${durationInHours} minutes",\n  "caloriesBurned": "Estimated calories"\n}\n\n`;

  prompt +=
    "Note: The provided example is for illustration only. Please generate a realistic calculation based on the given formula and METs guideline.";

  return prompt;
};
