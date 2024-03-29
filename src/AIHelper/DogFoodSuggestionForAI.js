import {
  dogCommercialFoodData,
  dogTreatsData,
  dogHomemadeFoodData,
} from "../../dogFoodData";

export const dailyLogAIPrompt = (dogInfo, healthGoals, feedLogs) => {
  const protein =
    (healthGoals.dailyCalories * healthGoals.dailyProtein) / 100 / 4;
  const carbs = (healthGoals.dailyCalories * healthGoals.dailyCarbs) / 100 / 4;
  const fat = (healthGoals.dailyCalories * healthGoals.dailyFat) / 100 / 9;

  let prompt = "";

  prompt +=
    "Given the information about the dog, the available food and treats and the available physical activities listed below, generate a daily meal plan as a JSON object with keys 'food', 'treats', 'activities', 'work', considering also any subKey as showed in the example below. \n";

  prompt += `\n Dog Info:\n`;
  prompt += `- Name: ${dogInfo.dogName}\n`;
  prompt += `- Breed: ${dogInfo.breed}\n`;
  prompt += `- Age: ${healthGoals.age.age} ${healthGoals.age.unit}\n`;
  prompt += `- Gender: ${dogInfo.gender}\n`;
  prompt += `- Current Weight: ${healthGoals.currentWeight}\n`;
  prompt += `- Goal Weight: ${healthGoals.goalWeight}\n`;
  prompt += `- Overall Goal: ${healthGoals.overallGoal}`;
  if (dogInfo.isWorkingDog) {
    prompt += `- is this dog a working/sporting dog?: Yes`;
    prompt += `- Type of working/sporting: ${dogInfo.workType}`;
  }
  prompt += `- Activity Level: ${dogInfo.activityLevel}\n`;
  prompt += `- Goal Daily Calories: ${healthGoals.dailyCalories}`;
  prompt += `- Goal Daily Proteins: ${protein} g`;
  prompt += `- Goal Daily Carbs: ${carbs} g`;
  prompt += `- Goal Daily Fat: ${fat} g`;
  prompt += `- Suggested meals per day: ${healthGoals.mealsPerDay} meals per day`;

  // food available

  let foodDetails = [];

  if (!dogInfo.opennessToNewFoods) {
    // Retrieve details for preferred foods only
    const preferredCommercialFoods = dogInfo.commercialFoodPreferences.map(
      ({ brand, name }) => ({ brand, name })
    );
    const preferredHomemadeFoods = dogInfo.homemadeFoodPreferences.map(
      ({ brand, name }) => ({ brand, name })
    );

    const matchedCommercialFoods = dogCommercialFoodData.filter((food) =>
      preferredCommercialFoods.some(
        ({ brand: preferredBrand, name: preferredName }) =>
          food.brand === preferredBrand && food.name === preferredName
      )
    );

    const matchedHomemadeFoods = dogHomemadeFoodData.filter((food) =>
      preferredHomemadeFoods.some(
        ({ brand: preferredBrand, name: preferredName }) =>
          food.brand === preferredBrand && food.name === preferredName
      )
    );

    foodDetails = [...matchedCommercialFoods, ...matchedHomemadeFoods];
  } else {
    // Retrieve all food data
    foodDetails = [...dogCommercialFoodData, ...dogHomemadeFoodData];
  }

  prompt += `\n List of food available:\n`;

  foodDetails.forEach((food) => {
    const nutritionalInfo = `Nutritional Info: (Protein: ${food.nutritionalInfo.protein}%, Carbs: ${food.nutritionalInfo.carb}%, Fat: ${food.nutritionalInfo.fat}%)`;
    prompt += `${food.brand} - ${food.name}, ${nutritionalInfo}\n`;
  });

  let treatsDetails = [];

  if (!dogInfo.opennessToNewFoods) {
    // Retrieve details for preferred foods only
    const preferredTreats = dogInfo.treatPreferences.map(({ brand, name }) => ({
      brand,
      name,
    }));

    const matchedTreats = dogTreatsData.filter((treat) =>
      preferredTreats.some(
        ({ brand: preferredBrand, name: preferredName }) =>
          treat.brand === preferredBrand && treat.name === preferredName
      )
    );

    treatsDetails = [...matchedTreats];
  } else {
    // Retrieve all food data
    treatsDetails = [...dogTreatsData];
  }

  prompt += `\n List of treats available:\n`;

  treatsDetails.forEach((treat) => {
    const nutritionalInfo = `Nutritional Info: (Calories Per Piece:${treat.nutritionalInfo.caloriesPerPiece}, Protein: ${treat.nutritionalInfo.protein}%, Carbs: ${treat.nutritionalInfo.carb}%, Fat: ${treat.nutritionalInfo.fat}%, Piece weight:${treat.nutritionalInfo.pieceWeight} g)`;
    prompt += `${treat.brand} - ${treat.name}, ${nutritionalInfo}\n`;
  });

  prompt += "Suggest maximum 4 treats\n";

  prompt += `List of physical activities available: "Walking", "Running","Fetch","Swimming","Agility Training","Ball Games","Frisbee","Hiking","Hide and Seek","Obstacle Course"\n`;

  prompt += "Suggest maximum 2 activities\n";

  //example of JASON output
  prompt += `\n Example of output (note: leave work as empty array if the dog is not a working dog):\n`;
  prompt += `food: [{foodBrand: Tesco, foodName: Chicken Breast, note: Explain why you selected this food}, {{foodBrand: Forthglade, foodName: Turkey with Sweet potatoes, note: Explain why you selected this food}}]\n`;
  prompt += `treats: [{treatBrand: Beta, treatName: Meat Sticks, numberOfTreatPerDay: 2}, {etc...}]\n`;
  prompt += `activities: [activity1: {name: Running, durationInMinutes: 30 }, activity2: {etc..}]\n`;
  prompt += `work: [{workType: service, shiftLengthHours: 2, workIntensity: Light, caloriesConsumed: 60}]\n`;

  prompt += `Note: The provided example is for illustration only. Adjust the meal plan and serving sizes to fit the actual available food and treats, considering the dog's specific dietary needs and preferences.\n`;

  return prompt;
};
