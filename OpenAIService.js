import { OPENAI_API_KEY } from "@env";

export const fetchAISuggestions = async (promptText) => {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: promptText,
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.choices[0].text;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    throw error;
  }
};

export const fetchVetAdvice = async (conversationHistory) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        messages: conversationHistory,
        temperature: 0.9,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      const lastMessage =
        data.choices[data.choices.length - 1].message.content.trim();
      return lastMessage;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error fetching vet advice:", error);
    throw error;
  }
};
