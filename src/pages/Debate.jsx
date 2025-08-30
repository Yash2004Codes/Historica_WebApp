// src/pages/Debate.jsx
import React, { useState, useEffect } from "react";
import { PERSONAS } from "../data/personas";
import { getDebateReply } from "../api/gemini";
import { auth } from "../firebase";
import LoginModal from "../components/LoginModal";


export default function Debate() {
  // --- Auth hooks
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Debate state hooks
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [topic, setTopic] = useState("");
  const [debateStarted, setDebateStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [turn, setTurn] = useState(0);

  // --- Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // --- Debate progression
  useEffect(() => {
    if (!debateStarted || !left || !right || !topic) return;

    const fetchNextReply = async () => {
      const isLeftTurn = turn % 2 === 0;
      const currentSpeakerId = isLeftTurn ? left : right;
      const persona = PERSONAS.find((p) => p.id === currentSpeakerId);
      if (!persona) return;

      // Show thinking
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, speaker: "system", text: `${persona.name} is thinking...` },
      ]);

      try {
        const debateHistory = messages.filter((m) => m.speaker !== "system");
        const reply = await getDebateReply(persona.name, topic, debateHistory);

        setMessages((prev) => {
          const withoutLoading = prev.slice(0, -1);
          return [...withoutLoading, { id: withoutLoading.length + 1, speaker: currentSpeakerId, text: reply }];
        });

        // Next turn after 2s
        setTimeout(() => setTurn((prev) => prev + 1), 2000);
      } catch (error) {
        console.error(error);
        setMessages((prev) => {
          const withoutLoading = prev.slice(0, -1);
          return [...withoutLoading, { id: withoutLoading.length + 1, speaker: "system", text: `${persona.name} failed to respond.` }];
        });
      }
    };

    // Trigger next reply only if last message is not system
    if (debateStarted && (turn === 0 || messages[messages.length - 1]?.speaker !== "system")) {
      fetchNextReply();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, debateStarted, left, right, topic]);

  // --- Start / End debate
  const startDebate = () => {
    if (left && right && topic.trim()) {
      setMessages([{ id: 0, speaker: "system", text: `Topic: ${topic}` }]);
      setDebateStarted(true);
      setTurn(0);
    }
  };

  const endDebate = () => {
    setDebateStarted(false);
    setTurn(0);
    setMessages([]);
  };

  // --- Conditional rendering
  if (loading) return <div className="p-8 text-center">Checking authentication...</div>;
  if (!user) return <LoginModal onLogin={(u) => setUser(u)} />;

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
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Select Left Speaker</h2>
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => setLeft(e.target.value)}
            value={left || ""}
          >
            <option value="">-- Choose a personality --</option>
            {PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Select Right Speaker</h2>
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => setRight(e.target.value)}
            value={right || ""}
          >
            <option value="">-- Choose a personality --</option>
            {PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
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
          <div className="bg-white rounded-xl p-6 border border-slate-200 h-96 overflow-auto">
            {messages.map((msg, i) => {
              if (msg.speaker === "system") {
                return (
                  <div key={i} className="text-center text-indigo-600 font-bold mb-4">
                    {msg.text}
                  </div>
                );
              }

              const isLeft = msg.speaker === left;
              const persona = PERSONAS.find((p) => p.id.toString() === msg.speaker);

              return (
                <div key={i} className={`flex mb-4 ${isLeft ? "justify-start" : "justify-end"}`}>
                  {isLeft && <img src={persona?.image} alt={persona?.name} className="w-10 h-10 rounded-full mr-3" />}
                  <div className={`px-4 py-2 rounded-2xl max-w-sm ${isLeft ? "bg-indigo-100 text-indigo-900" : "bg-rose-100 text-rose-900"}`}>
                    <span className="block font-semibold text-sm mb-1">{persona?.name}</span>
                    {msg.text}
                  </div>
                  {!isLeft && <img src={persona?.image} alt={persona?.name} className="w-10 h-10 rounded-full ml-3" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
