import React from "react";
import { Link } from "react-router-dom";

export default function PersonCard({ id, name, image, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 flex flex-col items-center">
      <img 
        src={image} 
        alt={name} 
        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
      />
      <h3 className="mt-4 text-lg font-bold text-slate-800">{name}</h3>
      <p className="text-sm text-slate-500 text-center mt-2">{description}</p>
      
      {/* Chat Button */}
      <Link
        to={`/chat/${id}`}
        className="mt-4 w-full bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
      >
        Chat with {name}
      </Link>
    </div>
  );
}
