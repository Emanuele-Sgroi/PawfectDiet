/**
 * Build a prompt that asks the LLM to estimate calories burned for a dog
 * during an activity.
 *
 * @param {string} selectedActivity  e.g. "Jogging"
 * @param {number} durationInHours   e.g. 0.5  →  30 minutes
 * @param {{name:string, breed:string, weight:number}} dogInfo
 * @param {object}  [healthGoals]    — unused for now but kept for API parity
 * @returns {string} OpenAI‑ready prompt
 */
export const dogCaloriesBurnedCalculation = (
  selectedActivity,
  durationInHours,
  dogInfo,
  healthGoals // kept for future use
) => {
  const minutes = durationInHours * 60;

  return `Given the detailed information about the dog, the type of physical activity, and the duration, calculate the calories burned. Dogs typically burn **5‑20 calories per minute** depending on intensity.

Use this guideline formula and adjust the MET value to suit the intensity:

    Calories Burned = (MET × Weight_kg × Time_hours) × 3.5

* Moderate activities → MET ≈ 3‑6  ·  Vigorous → MET ≈ 6‑9.
* Return the result as JSON with keys **activityName**, **duration**, **caloriesBurned**.

Dog Info:
- Name: ${dogInfo.name}
- Breed: ${dogInfo.breed}
- Weight: ${dogInfo.weight} kg
- Activity: ${selectedActivity}
- Duration: ${durationInHours} hours (${minutes} minutes)

Example output (values are illustrative):
{
  "activityName": "${selectedActivity}",
  "duration": "${minutes} minutes",
  "caloriesBurned": 123
}

Please provide a realistic calculation based on the given formula and MET guideline.`;
};
