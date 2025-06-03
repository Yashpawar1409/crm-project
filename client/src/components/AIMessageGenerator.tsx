// src/components/AIMessageGenerator.tsx
"use client";
import { useState } from "react";

export default function AIMessageGenerator() {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          objective, 
          audienceDescription: audience 
        }),
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">AI Message Generator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Campaign Objective</label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., 'bring back inactive users'"
          />
        </div>
        
        <div>
          <label className="block mb-1">Target Audience</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., 'customers who haven't purchased in 3 months'"
          />
        </div>
        
        <button
          onClick={generateMessages}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Messages"}
        </button>
        
        {messages.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Suggested Messages:</h3>
            <ul className="space-y-2">
              {messages.map((msg, i) => (
                <li key={i} className="p-2 bg-gray-50 rounded">
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}