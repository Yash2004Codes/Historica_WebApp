import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// General function to generate a reply
async function generateReply(personaName, userPrompt, history = [], topic = null) {
  try {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format conversation history
    const conversation = history.map(
      (msg) => `${msg.speaker}: ${msg.text}`
    ).join("\n");

    // Strong system-style priming
    const baseInstruction = `
You are roleplaying as **${personaName}**, the famous historical personality.
- Always stay in character.
- Respond with the tone, style, beliefs, and knowledge of ${personaName}.
- Avoid modern references unless they existed in ${personaName}'s lifetime.
- Keep responses concise, but meaningful.

If it's a debate, respond as if you're on stage defending your point of view.
    `;

    const prompt = `
${baseInstruction}

${topic ? `Debate Topic: "${topic}"` : ""}

Conversation so far:
${conversation}

User: ${userPrompt}

${personaName}, your reply:
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
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
  return generateReply(personaName, "", history, topic);
}
