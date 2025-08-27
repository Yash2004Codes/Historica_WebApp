import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// General function to generate a reply
async function generateReply(personaName, userPrompt, history = [], topic = null) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Combine history and new message for the prompt
    const chatHistoryText = history.map(
      (msg) => `${msg.sender}: ${msg.text}`
    ).join("\n");

    // Create a clear and comprehensive prompt
    const prompt = `
You are a ${personaName} roleplaying bot.
- Your goal is to reply with a response that ${personaName} would say.
- Stay in character with their tone, beliefs, and knowledge.
- Avoid modern references.

${topic ? `The debate topic is: ${topic}` : ""}

Conversation so far:
${chatHistoryText}

User: ${userPrompt}

Your reply as ${personaName}:
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText.trim()) {
      throw new Error("Empty response received from API.");
    }

    return responseText;

  } catch (err) {
    console.error("Gemini Error:", err);
    return `${personaName} has no response right now.`;
  }
}

// For chat
export async function getPersonaReply(personaName, userPrompt, history) {
  return generateReply(personaName, userPrompt, history);
}

// For debates
export async function getDebateReply(personaName, topic, history) {
  // Use a different userPrompt for debates to kick off a new argument
  const debatePrompt = `Provide a new argument for your side of the debate.`;
  return generateReply(personaName, debatePrompt, history, topic);
}