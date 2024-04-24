//The following functions were used for testing purposes only
//Functions not fired in production

export const generateHealthGoals = (profileData) => {
  //  console.log("generateHealthGoals called", profileData);
  try {
    profileData.breed = normalizeBreedName(profileData.breed);
    const ageDog = calculateAge(profileData.dateOfBirth);

    let dailyCalories,
      mealsPerDay,
      proteinPercentage,
      carbsPercentage,
      fatPercentage,
      suggestedActivities;

    if (
      profileData.breed === "German Shepherd" ||
      profileData.breed === "German Sheperd"
    ) {
      dailyCalories = calculateComprehensiveCalories(profileData);
      mealsPerDay = 3;
      proteinPercentage = 35;
      carbsPercentage = 40;
      fatPercentage = 25;
      suggestedActivities = [
        { nameActivity: "Daily walks", duration: "30 minutes" },
        { nameActivity: "Fetch games", duration: "20 minutes" },
        { nameActivity: "Active play", duration: "20 minutes" },
        { nameActivity: "Agility training", duration: "30 minutes" },
        { nameActivity: "Tracking games", duration: "30 minutes" },
        { nameActivity: "Weight pulling", duration: "15 minutes" },
        { nameActivity: "Obedience training", duration: "20 minutes" },
      ];
    } else if (
      profileData.breed === "Jack Russell Terrier" ||
      profileData.breed === "Jack Russell"
    ) {
      dailyCalories = calculateComprehensiveCalories(profileData);
      mealsPerDay = 2;
      proteinPercentage = 35;
      carbsPercentage = 40;
      fatPercentage = 25;
      suggestedActivities = [
        { nameActivity: "Daily walks", duration: "30 minutes" },
        { nameActivity: "Fetch games", duration: "20 minutes" },
        { nameActivity: "Active play", duration: "20 minutes" },
        { nameActivity: "Agility training", duration: "30 minutes" },
        { nameActivity: "Tracking games", duration: "30 minutes" },
        { nameActivity: "Weight pulling", duration: "15 minutes" },
        { nameActivity: "Obedience training", duration: "20 minutes" },
      ];
    } else {
      // Default or unknown breed
      dailyCalories = 0;
      mealsPerDay = 0;
      proteinPercentage = 0;
      carbsPercentage = 0;
      fatPercentage = 0;
      suggestedActivities = [{ nameActivity: "Not specified", duration: "" }];
    }

    const { goalWeight, overallGoal } =
      determineOverallGoalAndWeight(profileData);

    const healthGoals = {
      age: ageDog,
      breed: profileData.breed,
      gender: profileData.gender,
      startingWeight: profileData.dogWeight,
      currentWeight: profileData.dogWeight,
      goalWeight: goalWeight,
      overallGoal: overallGoal,
      dailyCalories: dailyCalories,
      dailyProtein: proteinPercentage,
      dailyCarbs: carbsPercentage,
      dailyFat: fatPercentage,
      mealsPerDay: mealsPerDay,
      suggestedActivities: suggestedActivities,
    };

    //console.log("finally health goals", healthGoals);

    return healthGoals;
  } catch (error) {
    console.log("Error generating goals --->: ", error);
    return null;
  }
};

const calculateAge = (dateOfBirth) => {
  const dobDate = new Date(dateOfBirth);
  const timeDiff = Date.now() - dobDate.getTime();
  const ageInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  if (ageInDays < 365) {
    return { age: Math.ceil(ageInDays / 30), unit: "months" };
  }
  return { age: Math.floor(ageInDays / 365), unit: "years" };
};

function normalizeBreedName(breed) {
  const normalizedBreed = breed.toLowerCase().trim();
  if (
    normalizedBreed.includes("german shepherd") ||
    normalizedBreed.includes("german sheperd")
  ) {
    return "German Shepherd";
  } else if (normalizedBreed.includes("jack russell")) {
    return "Jack Russell Terrier";
  }
  return breed;
}

function determineOverallGoalAndWeight(profileData) {
  const { breed, dogWeight } = profileData;
  const currentWeight = dogWeight;

  // Example ideal weight ranges and target weight for simplicity
  const breedInfo = {
    "German Shepherd": { idealRange: [22, 40], target: 35 },
    "Jack Russell Terrier": { idealRange: [5, 8], target: 6.5 },
  };

  const info = breedInfo[breed];
  let goal;
  let goalWeight = currentWeight;

  if (currentWeight < info.idealRange[0]) {
    goal = "Gaining weight";
    goalWeight = Math.max(info.target, currentWeight + 1);
  } else if (currentWeight > info.idealRange[1]) {
    goal = "Losing weight";
    goalWeight = Math.min(info.target, currentWeight - 1);
  } else {
    goal = "Maintaining weight";
    goalWeight = currentWeight;
  }

  goalWeight = Math.max(
    info.idealRange[0],
    Math.min(goalWeight, info.idealRange[1])
  );

  return {
    overallGoal: goal,
    goalWeight: goalWeight,
  };
}

function calculateComprehensiveCalories(profileData) {
  // Breed-specific average requirements and ideal weight ranges
  const breedInfo = {
    "German Shepherd": {
      avgCalories: 1600,
      idealWeightRange: [27, 40],
      growthFactor: 1.2,
    },
    "Jack Russell Terrier": {
      avgCalories: 550,
      idealWeightRange: [5, 7],
      growthFactor: 1.05,
    },
  };

  const { breed, dogWeight, activityLevel, isWorkingDog, isPregnant, age } =
    profileData;
  const weight = parseFloat(dogWeight);
  const info = breedInfo[breed];
  let calories = info.avgCalories;

  // Adjust for age (puppies and seniors might have different needs)
  if (age < 1) {
    calories *= info.growthFactor; // Puppies need more calories for growth
  } else if (age > 7) {
    calories *= 0.95; // Seniors may need fewer calories due to lower metabolism
  }

  // Adjust for activity level
  let activityMultiplier = 1; // Base for sedentary
  if (activityLevel === "High") activityMultiplier = 1.2;
  else if (activityLevel === "Medium") activityMultiplier = 1.1;
  calories *= activityMultiplier;

  // Additional factors
  if (isWorkingDog) calories *= 1.2; // Working dogs have higher energy needs
  if (isPregnant) calories *= 1.25; // Pregnant dogs need more energy

  // Weight management adjustment
  const isOverweight = weight > info.idealWeightRange[1];
  const isUnderweight = weight < info.idealWeightRange[0];
  if (isOverweight) {
    calories *= 0.9; // Reduce for weight loss
  } else if (isUnderweight) {
    calories *= 1.1; // Increase for weight gain
  }

  return Math.round(calories);
}
