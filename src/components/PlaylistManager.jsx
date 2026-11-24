// 1. Fichier enfant : src/components/PlaylistManager.jsx
"use client";

export default function PlaylistManager({items}) {
  return (
            /* Encart Playlist collaborative */
        <div className="mt-4 bg-gray-900 rounded-lg border border-gray-800 p-4">
          <h2 className="text-xs font-semibold uppercase text-gray-400 mb-3">
            Titre Playlist
          </h2>

          {/* Barre d'ajout d'une URL YouTube */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="lien-youtube"
              className="flex-1 p-2 text-sm rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-semibold">
              Ajouter la Vidéo dans la playlist
            </button>
          </div>

          {/* Liste des vidéos en attente */}
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <span>1. vidéo 1</span>
              <button className="text-xs text-red-600 hover:text-red-300">
                supprimer la vidéo
              </button>
            </li>
            <li className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <span>1. vidéo 2</span>
              <button className="text-xs text-red-600 hover:text-red-300">
                supprimer la vidéo
              </button>
            </li>
          </ul>
        </div>
  );
}