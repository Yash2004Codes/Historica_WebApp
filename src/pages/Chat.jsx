import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PERSONAS } from "../data/personas";

export default function Chat() {
  const { id } = useParams();
  const persona = PERSONAS.find((p) => p.id === id);

  const [messages, setMessages] = useState([
    { sender: "system", text: persona ? `You are now chatting with ${persona.name}.` : "" },
  ]);
  const [input, setInput] = useState("");

  if (!persona) {
    return (
      <div className="p-8 text-center text-slate-500">
        Personality not found.
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const botMessage = {
      sender: persona.name,
      text: `(${persona.name} would respond here in their style)`,
    };
    setMessages((prev) => [...prev, userMessage, botMessage]);

    setInput("");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Persona Header */}
      <div className="flex items-center justify-between gap-6 mb-8 p-6 rounded-xl shadow-md border border-slate-200 bg-white">
        {/* Left: Persona Info */}
        <div className="flex items-center gap-6">
          <img
            src={persona.image}
            alt={persona.name}
            className="w-20 h-20 rounded-full border border-slate-300 shadow-sm object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{persona.name}</h1>
            <p className="text-sm text-slate-500">{persona.category}</p>
            <p className="text-xs text-slate-400 italic">Conversations Through Time</p>
          </div>
        </div>

        {/* Right: Back Button */}
        <Link
          to="/"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Chat Box */}
      <div className="flex flex-col h-[65vh] border border-slate-200 rounded-xl shadow-md overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-slate-800 text-white"
                    : msg.sender === "system"
                    ? "bg-slate-200 text-slate-700 italic"
                    : "bg-white border border-slate-200 text-slate-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-3 flex items-center bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Chat with ${persona.name}...`}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            onClick={handleSend}
            className="ml-3 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
