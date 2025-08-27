// src/pages/Home.jsx
import React from "react";
import { PERSONAS } from "../data/personas";
import { Link } from "react-router-dom";

export default function Home() {
  // Group personas by category
  const groupedPersonas = PERSONAS.reduce((acc, persona) => {
    if (!acc[persona.category]) acc[persona.category] = [];
    acc[persona.category].push(persona);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        Explore Historical Figures
      </h1>

      {Object.entries(groupedPersonas).map(([category, figures]) => (
        <div key={category} className="mb-16">
          {/* Big Category Header */}
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 border-b-4 border-slate-800 pb-2">
            {category}
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            {category === "Politics" &&
              "Debate leaders who shaped nations and freedom movements."}
            {category === "Science" &&
              "Great minds who discovered the laws of nature and created innovations."}
            {category === "Philosophy" &&
              "Thinkers who searched for the meaning of life and existence."}
          </p>

          {/* Figures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {figures.map((persona) => (
              <Link
                to={`/chat/${persona.id}`}
                key={persona.id}
                className="rounded-xl shadow-md bg-white hover:shadow-xl transition cursor-pointer p-6 flex flex-col items-center border border-slate-200 hover:border-slate-800"
              >
                <img
                  src={persona.image}
                  alt={persona.name}
                  className="w-20 h-20 rounded-full object-cover border mb-4"
                />
                <h3 className="text-lg font-semibold text-slate-800">
                  {persona.name}
                </h3>
                <p className="text-sm text-slate-500 text-center mt-1">
                  {persona.style}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
