"use client";


// 1. Fichier enfant : src/components/MemberList.jsx
export default function MemberList({members}) {
  return (
    /* Liste des participants */
    <div className="pb-4 border-b border-gray-800">
        <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
        Participants (2)
        </h2>
        <ul className="space-y-1 text-sm">
        <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Nassim <span className="text-xs text-blue-400">(Admin)</span></span>
        </li>
        <li className="flex items-center gap-2 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Invité_42</span>
        </li>
        </ul>
    </div>
  );
}