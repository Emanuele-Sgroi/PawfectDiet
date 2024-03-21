/*
  AIHelper
  --------
  Two small wrappers for OpenAI completions + chat completions. Adds a quick
  guard for missing API key and centralises the headers object.
*/

import { OPENAI_API_KEY } from "@env";

const baseHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

function checkKey() {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set in env.");
}

export const fetchAISuggestions = async (promptText) => {
  checkKey();
  const res = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt: promptText,
      temperature: 0.5,
      max_tokens: 1000,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "OpenAI error");
  return json.choices?.[0]?.text ?? "";
};

export const fetchVetAdvice = async (conversationHistory) => {
  checkKey();
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      model: "gpt-3.5-turbo-1106",
      messages: conversationHistory,
      temperature: 0.9,
      max_tokens: 200,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "OpenAI error");
  return json.choices?.at(-1)?.message?.content.trim() ?? "";
};
