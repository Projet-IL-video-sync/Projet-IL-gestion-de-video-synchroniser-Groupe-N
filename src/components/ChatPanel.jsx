"use client";

import { useEffect, useRef, useState } from "react";
import { containsEmoji } from "@/lib/socket";

export default function ChatPanel({
  messages = [],
  currentClientId = null,
  chatError = "",
  onSendMessage,
}) {
  const [texte, setTexte] = useState("");
  const [localError, setLocalError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    const nettoye = texte.trim();
    if (!nettoye) return;

    if (containsEmoji(nettoye)) {
      setLocalError("Les emojis ne sont pas autorisés dans le chat.");
      return;
    }

    if (typeof onSendMessage === "function") {
      onSendMessage(nettoye);
    }
    setTexte("");
  }

  const erreurAffichee = localError || chatError;

  return (
    <div className="flex-1 flex flex-col pt-4 min-h-0">
      <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
        Chat en temps réel
      </h2>

      <div className="flex-1 space-y-2 overflow-y-auto text-sm min-h-[180px] max-h-[420px] pr-1">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            Aucun message pour le moment. Soyez le premier à écrire !
          </p>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.clientId === currentClientId;
            return (
              <div
                key={msg.id}
                className={`rounded px-2 py-1.5 ${
                  isSelf ? "bg-blue-950/40 border border-blue-900/40" : "bg-gray-800/50"
                }`}
              >
                <p className="break-words text-sm leading-snug">
                  <span className="text-[11px] text-gray-500 mr-1.5">
                    [{msg.heure}]
                  </span>
                  <span
                    className={`font-semibold ${
                      isSelf ? "text-blue-400" : "text-green-400"
                    }`}
                  >
                    {msg.pseudo} :
                  </span>{" "}
                  <span className="text-gray-100">{msg.texte}</span>
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {erreurAffichee && (
        <p className="mt-2 text-xs text-red-400">{erreurAffichee}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={texte}
          onChange={(e) => {
            setTexte(e.target.value);
            if (localError) setLocalError("");
          }}
          maxLength={500}
          placeholder="Écrire un message (sans emoji)..."
          className="flex-1 p-2 text-sm rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-semibold cursor-pointer"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
