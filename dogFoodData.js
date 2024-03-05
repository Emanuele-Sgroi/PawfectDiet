/* This file acts like a database.
The following data come from realistic products however it might presents some inaccuracy. Please take this as an example only */

export const dogCommercialFoodData = [
  // wet food entry 1
  {
    brand: "Forthglade",
    name: "Chicken Delight",
    type: "commercial",
    foodType: "wet",
    servingSize: {
      puppy: 60,
      small: 100, // grams
      medium: 200,
      large: 400,
    },
    nutritionalInfo: {
      protein: 11,
      carb: 5,
      fat: 4,
      caloriesPerGram: 1.5,
    },
    ingredients: [
      {
        IngredientType: "chicken",
        amount: 50, // percentage
      },
      {
        IngredientType: "sweet potatoes",
        amount: 40, // percentage
      },
      {
        IngredientType: "carrots",
        amount: 5, // percentage
      },
      {
        IngredientType: "peas",
        amount: 5, // percentage
      },
    ],
  },
  // wet food entry 2
  {
    brand: "Purina ONE",
    name: "True Instinct Turkey & Lentils Stew",
    type: "commercial",
    foodType: "wet",
    servingSize: {
      puppy: 50,
      small: 85, // grams
      medium: 170,
      large: 340,
    },
    nutritionalInfo: {
      protein: 11, // percentage
      carb: 5,
      fat: 4,
      caloriesPerGram: 1.5,
    },
    ingredients: [
      {
        IngredientType: "turkey",
        amount: 70, // percentage
      },
      {
        IngredientType: "lentils",
        amount: 15, // percentage
      },
      {
        IngredientType: "chicken",
        amount: 10, // percentage
      },
      {
        IngredientType: "carrots",
        amount: 2.5, // percentage
      },
      {
        IngredientType: "green beans",
        amount: 2.5, // percentage
      },
    ],
  },
  // wet food entry 3
  {
    brand: "Orlando",
    name: "Salmon & Chicken Recipe Pate",
    type: "commercial",
    foodType: "wet",
    servingSize: {
      puppy: 45,
      small: 75, // grams
      medium: 150,
      large: 300,
    },
    nutritionalInfo: {
      protein: 11,
      carb: 5,
      fat: 4,
      caloriesPerGram: 1.5,
    },
    ingredients: [
      {
        IngredientType: "salmon",
        amount: 70, // percentage
      },
      {
        IngredientType: "chicken",
        amount: 20, // percentage
      },
      {
        IngredientType: "sweet potato",
        amount: 8, // percentage
      },
      {
        IngredientType: "fish oil",
        amount: 2, // percentage
      },
    ],
  },
  // wet food entry 4
  {
    brand: "Pedigree",
    name: "Beef Recipe Stew",
    type: "commercial",
    foodType: "wet",
    servingSize: {
      puppy: 50,
      small: 90, // grams
      medium: 180,
      large: 360,
    },
    nutritionalInfo: {
      protein: 11,
      carb: 5,
      fat: 4,
      caloriesPerGram: 1.5,
    },
    ingredients: [
      {
        IngredientType: "beef",
        amount: 50, // percentage
      },
      {
        IngredientType: "barley",
        amount: 20, // percentage
      },
      {
        IngredientType: "oatmeal",
        amount: 15, // percentage
      },
      {
        IngredientType: "carrots",
        amount: 10, // percentage
      },
      {
        IngredientType: "blueberries",
        amount: 5, // percentage
      },
    ],
  },
  // wet food entry 5
  {
    brand: "Beta",
    name: "Venison and Pork",
    type: "commercial",
    foodType: "wet",
    servingSize: {
      puppy: 40,
      small: 100, // grams
      medium: 210,
      large: 320,
    },
    nutritionalInfo: {
      protein: 11,
      carb: 5,
      fat: 4,
      caloriesPerGram: 1.5,
    },
    ingredients: [
      {
        IngredientType: "venison",
        amount: 40, // percentage
      },
      {
        IngredientType: "pork",
        amount: 40, // percentage
      },
      {
        IngredientType: "potatoes",
        amount: 15, // percentage
      },
      {
        IngredientType: "peas",
        amount: 5, // percentage
      },
    ],
  },
  // dry food entry 1
  {
    brand: "Iams ProActive Health",
    name: "Chicken & Rice Recipe Kibble",
    type: "commercial",
    foodType: "dry",
    servingSize: {
      puppy: 25,
      small: 50, // grams
      medium: 90,
      large: 120,
    },
    nutritionalInfo: {
      protein: 27,
      carb: 45,
      fat: 14,
      caloriesPerGram: 3.6,
    },
    ingredients: [
      {
        IngredientType: "chicken Meal",
        amount: 50, // percentage
      },
      {
        IngredientType: "whole grain corn",
        amount: 30, // percentage
      },
      {
        IngredientType: "oatmeal",
        amount: 15, // percentage
      },
      {
        IngredientType: "chicken fat",
        amount: 5, // percentage
      },
    ],
  },
  // dry food entry 2
  {
    brand: "Orlando",
    name: "Mixed meat and rice",
    type: "commercial",
    foodType: "dry",
    servingSize: {
      puppy: 35,
      small: 80, // grams
      medium: 110,
      large: 140,
    },
    nutritionalInfo: {
      protein: 27,
      carb: 45,
      fat: 14,
      caloriesPerGram: 3.6,
    },
    ingredients: [
      {
        IngredientType: "salmon",
        amount: 45, // percentage
      },
      {
        IngredientType: "rice",
        amount: 25, // percentage
      },
      {
        IngredientType: "oat bran",
        amount: 15, // percentage
      },
      {
        IngredientType: "chicken",
        amount: 15, // percentage
      },
    ],
  },
  // dry food entry 3
  {
    brand: "Forthglade",
    name: "Turkey with Sweet potatoes",
    type: "commercial",
    foodType: "dry",
    servingSize: {
      puppy: 30,
      small: 60, // grams
      medium: 100,
      large: 140,
    },
    nutritionalInfo: {
      protein: 27,
      carb: 45,
      fat: 14,
      caloriesPerGram: 3.6,
    },
    ingredients: [
      {
        IngredientType: "turkey",
        amount: 50, // percentage
      },
      {
        IngredientType: "sweet potatoes",
        amount: 30, // percentage
      },
      {
        IngredientType: "rice",
        amount: 10, // percentage
      },
      {
        IngredientType: "corn",
        amount: 5, // percentage
      },
      {
        IngredientType: "chicken fat",
        amount: 5, // percentage
      },
    ],
  },
  // dry food entry 4
  {
    brand: "Purina Pro",
    name: "Salmon & Rice Formula",
    type: "commercial",
    foodType: "dry",
    servingSize: {
      puppy: 30,
      small: 60, // grams
      medium: 100,
      large: 140,
    },
    nutritionalInfo: {
      protein: 27,
      carb: 45,
      fat: 14,
      caloriesPerGram: 3.6,
    },
    ingredients: [
      {
        IngredientType: "salmon",
        amount: 55, // percentage
      },
      {
        IngredientType: "rice",
        amount: 30, // percentage
      },
      {
        IngredientType: "oat meal",
        amount: 10, // percentage
      },
      {
        IngredientType: "fish oil",
        amount: 5, // percentage
      },
    ],
  },
  // dry food entry 5
  {
    brand: "Pedigree",
    name: "High Protein Beef & Vegetables",
    type: "commercial",
    foodType: "dry",
    servingSize: {
      puppy: 30,
      small: 60, // grams
      medium: 100,
      large: 140,
    },
    nutritionalInfo: {
      protein: 27,
      carb: 45,
      fat: 14,
      caloriesPerGram: 3.6,
    },
    ingredients: [
      {
        IngredientType: "beef",
        amount: 70, // percentage
      },
      {
        IngredientType: "carrots",
        amount: 10, // percentage
      },
      {
        IngredientType: "peas",
        amount: 5, // percentage
      },
      {
        IngredientType: "broccoli",
        amount: 5, // percentage
      },
      {
        IngredientType: "spinach",
        amount: 5, // percentage
      },
      {
        IngredientType: "green beans",
        amount: 5, // percentage
      },
    ],
  },
];

export const dogTreatsData = [
  // treat entry 1
  {
    brand: "Orlando",
    name: "Beef Bones",
    type: "treats",
    maxPiecesPerDay: {
      puppy: 1,
      small: 3, // max pieces per day
      medium: 5,
      large: 8,
    },
    nutritionalInfo: {
      protein: 24,
      carb: 15,
      fat: 6,
      caloriesPerPiece: 5,
      pieceWeight: 1.4,
    },
    ingredients: [
      {
        IngredientType: "chicken",
        amount: 50, // percentage
      },
      {
        IngredientType: "sweet potatoes",
        amount: 40, // percentage
      },
      {
        IngredientType: "carrots",
        amount: 5, // percentage
      },
      {
        IngredientType: "peas",
        amount: 5, // percentage
      },
    ],
  },
  // treat entry 2
  {
    brand: "Pedigree",
    name: "Mini Bites - Chicken and Peanut Butter",
    type: "treats",
    maxPiecesPerDay: {
      puppy: 2,
      small: 5,
      medium: 8,
      large: 10,
    },
    nutritionalInfo: {
      protein: 24,
      carb: 15,
      fat: 6,
      caloriesPerPiece: 5,
      pieceWeight: 1.4,
    },
    ingredients: [
      {
        IngredientType: "chicken",
        amount: 70, // percentage
      },
      {
        IngredientType: "peanut butter",
        amount: 30, // percentage
      },
    ],
  },
  // treat entry 3
  {
    brand: "Orlando",
    name: "Salmon treats",
    type: "treats",
    maxPiecesPerDay: {
      puppy: 1,
      small: 2,
      medium: 3,
      large: 4,
    },
    nutritionalInfo: {
      protein: 24,
      carb: 15,
      fat: 6,
      caloriesPerPiece: 5,
      pieceWeight: 1.4,
    },
    ingredients: [
      {
        IngredientType: "salmon",
        amount: 80,
      },
      {
        IngredientType: "chicken",
        amount: 18,
      },

      {
        IngredientType: "fish oil",
        amount: 2,
      },
    ],
  },
  // treat entry 4
  {
    brand: "Pedigree",
    name: "Beef Mini Rolls",
    type: "treats",
    maxPiecesPerDay: {
      puppy: 1,
      small: 2,
      medium: 3,
      large: 4,
    },
    nutritionalInfo: {
      protein: 24,
      carb: 15,
      fat: 6,
      caloriesPerPiece: 5,
      pieceWeight: 1.4,
    },
    ingredients: [
      {
        IngredientType: "beef",
        amount: 50, // percentage
      },
      {
        IngredientType: "barley",
        amount: 20, // percentage
      },
      {
        IngredientType: "oatmeal",
        amount: 15, // percentage
      },
      {
        IngredientType: "carrots",
        amount: 10, // percentage
      },
      {
        IngredientType: "blueberries",
        amount: 5, // percentage
      },
    ],
  },
  // treat entry 5
  {
    brand: "Beta",
    name: "Meat Sticks",
    type: "treats",
    maxPiecesPerDay: {
      puppy: 1,
      small: 1,
      medium: 1,
      large: 1,
    },
    nutritionalInfo: {
      protein: 24,
      carb: 15,
      fat: 6,
      caloriesPerPiece: 5,
      pieceWeight: 1.4,
    },
    ingredients: [
      {
        IngredientType: "venison",
        amount: 40, // percentage
      },
      {
        IngredientType: "pork",
        amount: 40, // percentage
      },
      {
        IngredientType: "potatoes",
        amount: 15, // percentage
      },
      {
        IngredientType: "peas",
        amount: 5, // percentage
      },
    ],
  },
];

export const dogHomemadeFoodData = [
  // food entry 1
  {
    brand: "Tesco",
    name: "Chicken Breast",
    type: "homemade",
    servingSize: {
      puppy: 60,
      small: 100,
      medium: 200,
      large: 400,
    },
    nutritionalInfo: {
      protein: 31,
      carb: 0,
      fat: 3,
      caloriesPerGram: 1.8,
    },
    ingredients: [
      {
        IngredientType: "chicken",
        amount: 100, // percentage
      },
    ],
  },

  // food entry 2
  {
    brand: "Tilda",
    name: "Brown Rice",
    type: "homemade",
    servingSize: {
      puppy: 50,
      small: 75,
      medium: 100,
      large: 150,
    },
    nutritionalInfo: {
      protein: 8,
      carb: 70,
      fat: 2,
      caloriesPerGram: 1.3,
    },
    ingredients: [
      {
        IngredientType: "brown rice",
        amount: 100,
      },
    ],
  },
  // food entry 3
  {
    brand: "Ocado",
    name: "Salmon Fillet",
    type: "homemade",
    servingSize: {
      puppy: 30,
      small: 60,
      medium: 90,
      large: 120,
    },
    nutritionalInfo: {
      protein: 20,
      carb: 0,
      fat: 12,
      caloriesPerGram: 2.0,
    },
    ingredients: [
      {
        IngredientType: "salmon",
        amount: 100,
      },
    ],
  },
];

export const dogDangerousFoodData = [
  {
    name: "Chocolate",
    reason:
      "Contains theobromine, which is toxic to dogs and can lead to various health issues including heart problems, seizures, and in severe cases, death.",
    symptoms: [
      "Vomiting",
      "Diarrhea",
      "Rapid breathing",
      "Increased heart rate",
      "Seizures",
    ],
  },
  {
    name: "Grapes and Raisins",
    reason: "Can cause kidney failure in dogs, even in small amounts.",
    symptoms: [
      "Vomiting",
      "Lethargy",
      "Depression",
      "Abdominal pain",
      "Increased thirst",
      "Increased urination",
    ],
  },
  {
    name: "Onions",
    reason:
      "Contain compounds that can cause damage to red blood cells in dogs, leading to anemia.",
    symptoms: [
      "Weakness",
      "Vomiting",
      "Breathlessness",
      "Lethargy",
      "Pale gums",
    ],
  },
  {
    name: "Garlic",
    reason:
      "Contain compounds that can cause damage to red blood cells in dogs, leading to anemia.",
    symptoms: [
      "Weakness",
      "Vomiting",
      "Breathlessness",
      "Lethargy",
      "Pale gums",
    ],
  },
  {
    name: "Xylitol",
    reason:
      "A sugar substitute found in many sugar-free products, xylitol can lead to insulin release and hypoglycemia in dogs, along with liver failure.",
    symptoms: [
      "Vomiting",
      "Weakness",
      "Lack of coordination",
      "Seizures",
      "Jaundice",
    ],
  },
  {
    name: "Macadamia Nuts",
    reason:
      "Toxic to dogs and can cause lethargy, vomiting, hyperthermia, and tremors.",
    symptoms: ["Weakness", "Swelling", "Panting", "Tremors", "Hyperthermia"],
  },
  {
    name: "Avocado",
    reasons:
      "Contains persin, a fungicidal toxin, which can cause vomiting and diarrhea in dogs. The large seed also poses a choking hazard and can cause intestinal blockage.",
    symptoms: ["Vomiting", "diarrhea", "myocardial damage"],
  },
];
