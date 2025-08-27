import React, { useState, useEffect } from "react";
import { PERSONAS } from "../data/personas";
import { getDebateReply } from "../api/gemini.js";


export default function Debate() {
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [topic, setTopic] = useState("");
  const [debateStarted, setDebateStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [turn, setTurn] = useState(0);

  // Handle debate progression
  useEffect(() => {
    // Only start fetching replies if the debate is active
    if (!debateStarted || !left || !right || !topic) return;

    const fetchNextReply = async () => {
      // Determine the current speaker and the other debater
      const isLeftTurn = turn % 2 === 0;
      const currentSpeakerId = isLeftTurn ? left : right;
      const persona = PERSONAS.find((p) => p.id === currentSpeakerId);

      if (!persona) return;

      // Create a loading message while waiting for the AI response
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          speaker: "system",
          text: `${persona.name} is thinking...`,
        },
      ]);

      try {
        // Use the conversation history, excluding the system messages
        const debateHistory = messages.filter((m) => m.speaker !== "system");

        // Get the response from the Gemini API
        const reply = await getDebateReply(
          persona.name,
          topic,
          debateHistory
        );

        // Remove the "thinking" message and add the new message
        setMessages((prev) => {
          const messagesWithoutLoading = prev.slice(0, -1);
          const newMessage = {
            id: messagesWithoutLoading.length + 1,
            speaker: currentSpeakerId,
            text: reply,
          };
          return [...messagesWithoutLoading, newMessage];
        });

        // Advance to the next turn after a 2-second delay to simulate conversation flow
        setTimeout(() => setTurn((prev) => prev + 1), 2000);

      } catch (error) {
        console.error("Gemini API Error:", error);
        // Remove the loading message and add an error message
        setMessages((prev) => {
          const messagesWithoutLoading = prev.slice(0, -1);
          const errorMessage = {
            id: messagesWithoutLoading.length + 1,
            speaker: "system",
            text: `Error: ${persona.name} failed to respond.`,
          };
          return [...messagesWithoutLoading, errorMessage];
        });
      }
    };

    // Start the first turn or continue the debate
    if (debateStarted && turn === 0) {
      // Start the first turn immediately after the topic is set
      fetchNextReply();
    } else if (debateStarted && turn > 0) {
      // Only fetch a new reply if a message was just added
      // This prevents infinite loops
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.speaker !== "system") {
        fetchNextReply();
      }
    }

  }, [turn, debateStarted, left, right, topic, messages]);

  // Start debate
  const startDebate = () => {
    if (left && right && topic.trim()) {
      setMessages([
        {
          id: 0,
          speaker: "system",
          text: `Topic: ${topic}`,
        },
      ]);
      setDebateStarted(true);
      setTurn(0);
    }
  };

  // End debate
  const endDebate = () => {
    setDebateStarted(false);
    setTurn(0);
    setMessages([]);
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Debate Arena</h1>

      {/* Topic Input */}
      <div className="w-full max-w-3xl mb-6">
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Enter Debate Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Is technology improving human life?"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Personality Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Select Left Speaker
          </h2>
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => setLeft(e.target.value)}
          >
            <option value="">-- Choose a personality --</option>
            {PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Select Right Speaker
          </h2>
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => setRight(e.target.value)}
          >
            <option value="">-- Choose a personality --</option>
            {PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={startDebate}
          disabled={!left || !right || !topic.trim()}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            left && right && topic.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Start Debate
        </button>

        {debateStarted && (
          <button
            onClick={endDebate}
            className="px-6 py-3 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700"
          >
            End Debate
          </button>
        )}
      </div>

      {/* Debate Stage */}
      {debateStarted && (
        <div className="w-full max-w-5xl bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl shadow-xl p-6">
          {/* Debate Chat */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 h-96 overflow-auto">
            {messages.map((msg, i) => {
              if (msg.speaker === "system") {
                return (
                  <div
                    key={i}
                    className="text-center text-indigo-600 font-bold mb-4"
                  >
                    {msg.text}
                  </div>
                );
              }

              const isLeft = msg.speaker === left;
              const persona = PERSONAS.find(
                (p) => p.id.toString() === msg.speaker
              );

              return (
                <div
                  key={i}
                  className={`flex mb-4 ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  {isLeft && (
                    <img
                      src={persona?.image}
                      alt={persona?.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-sm ${
                      isLeft
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-rose-100 text-rose-900"
                    }`}
                  >
                    <span className="block font-semibold text-sm mb-1">
                      {persona?.name}
                    </span>
                    {msg.text}
                  </div>
                  {!isLeft && (
                    <img
                      src={persona?.image}
                      alt={persona?.name}
                      className="w-10 h-10 rounded-full ml-3"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}