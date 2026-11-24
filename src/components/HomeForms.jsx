"use client";

// 1. Composant Client : src/components/HomeForms.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeForms({}) {
    // 1. Déclaration de l'état pour mémoriser la saisie et du routeur
    const [id, setId] = useState("");
    const router = useRouter();

    // 2. Fonction déclenchée au clic sur le bouton Rejoindre
    function joinSalon() {
    if (!id.trim()) return;
        router.push(`/room/${id.trim()}`);
    }

  return (
    <div className="flex gap-2">
    <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Code du salon (ex: ABC-123)"
        className="flex-1 p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
    />

    <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded font-semibold text-sm transition"
    onClick={joinSalon} >
    Rejoindre
    </button>
</div>
  );
}