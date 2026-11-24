"use client";

// 1. Fichier enfant : src/components/ChatPanel.jsx
export default function ChatPanel({messages}) {
  return (
     /* Bloc Chat */
    <div className="flex-1 flex flex-col pt-4">
      <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
        Chat
      </h2>
      {/* Zone d'affichage des messages fictifs */}
    <div className="flex-1 space-y-2 overflow-y-auto text-sm">
      <p><span className="font-semibold text-blue-400">Nassim :</span> Salut tout le monde !</p>
      <p><span className="font-semibold text-green-400">Invité_42 :</span> Je suis prêt pour la vidéo</p>
    </div>
      {/* Barre d'envoi statique en bas */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Écrire un message..."
          className="flex-1 p-2 text-sm rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-semibold">
          Envoyer
        </button>
      </div>
    </div>
    
  );
}