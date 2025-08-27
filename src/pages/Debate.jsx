import React, { useState, useEffect } from "react";
import { PERSONAS } from "../data/personas";

export default function Debate() {
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [topic, setTopic] = useState("");
  const [debateStarted, setDebateStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [turn, setTurn] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Mock debate lines (can be replaced with AI later)
  const debateLines = [
    "The progress of a nation lies in its unity.",
    "True strength comes from individuality.",
    "Unity allows us to overcome greater challenges.",
    "Without diversity of thought, unity becomes stagnation.",
    "Balance between unity and diversity is the real key.",
    "History has shown us both unity and individuality shape societies.",
    "It’s the debate itself that fuels progress.",
  ];

  // Handle debate progression
  useEffect(() => {
    if (debateStarted && left && right) {
      const id = setInterval(() => {
        const speaker = turn % 2 === 0 ? left : right;
        const line = debateLines[turn % debateLines.length];

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            speaker,
            text: line,
          },
        ]);

        setTurn((prevTurn) => prevTurn + 1);
      }, 2000);

      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [debateStarted]);

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
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
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
