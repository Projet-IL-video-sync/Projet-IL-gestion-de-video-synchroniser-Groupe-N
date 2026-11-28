"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildClientIdentity,
  ensureSocketConnected,
  getSocket,
  saveGuestPseudo,
} from "@/lib/socket";

export default function HomeForms({ currentUser = null }) {
  const router = useRouter();

  const [joinInput, setJoinInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  
  useEffect(() => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("quitter_salon");
    }
  }, []);

  function handleJoin(e) {
    e.preventDefault();
    setError("");

    const code = joinInput.trim().toUpperCase();
    if (!code) {
      setError("Veuillez saisir un code de salon valide.");
      return;
    }

    router.push(`/room/${encodeURIComponent(code)}`);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    const nomNettoye = roomName.trim();
    if (!nomNettoye) {
      setError("Veuillez saisir un nom de salon.");
      return;
    }

    setIsCreating(true);

    try {
      const socket = await ensureSocketConnected();
      const identity = buildClientIdentity(currentUser);

      socket.emit(
        "creer_salon",
        {
          nom: nomNettoye,
          maxParticipants: Number(maxParticipants) || 10,
          ...identity,
        },
        (reponse) => {
          setIsCreating(false);

          if (!reponse || !reponse.succes) {
            setError(reponse?.message || "Impossible de créer le salon.");
            return;
          }

          if (!currentUser && reponse.participant?.pseudo) {
            saveGuestPseudo(reponse.participant.pseudo);
          }

          router.push(`/room/${encodeURIComponent(reponse.salon.code)}`);
        }
      );
    } catch {
      setIsCreating(false);
      setError(
        "Impossible de joindre le serveur temps réel (port 4000). Vérifiez qu'il est bien démarré."
      );
    }
  }

  return (
    <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-5 mt-4">
      {error && (
        <div className="p-3 rounded bg-red-950/70 border border-red-800 text-red-200 text-xs">
          {error}
        </div>
      )}

      {/* Rejoindre un salon existant */}
      <form onSubmit={handleJoin} className="space-y-2">
        <p className="text-xs text-gray-200 mb-2 text-center">
          Rejoins un salon existant
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            placeholder="Code du salon (ex: ROOM-A7K2)"
            className="flex-1 p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded font-semibold text-sm transition cursor-pointer"
          >
            Rejoindre
          </button>
        </div>
      </form>

      {/* Créer un nouveau salon */}
      <form onSubmit={handleCreate} className="space-y-2.5 border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-200 mb-2 text-center">
          Créer ton propre Salon
        </p>

        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
          maxLength={100}
          placeholder="Nom du Salon (obligatoire)"
          className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
        />

        <div className="flex items-center justify-between gap-3 text-xs text-gray-300">
          <label htmlFor="max-participants">Capacité max (10 à 50) :</label>
          <input
            id="max-participants"
            type="number"
            min={10}
            max={50}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className="w-20 p-1.5 rounded bg-gray-800 border border-gray-700 text-sm text-center focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-2.5 rounded font-semibold text-sm transition cursor-pointer"
        >
          {isCreating ? "Création en cours..." : "Créer un salon privé"}
        </button>
      </form>
    </div>
  );
}
