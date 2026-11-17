export default async function RoomPage({ params }) {
  const { id } = await params;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-white">
      {/* Zone principale : En-tête + Vidéo */}
      <main className="flex-1 flex flex-col p-4">
        <div className="mb-4">
          <h1 className="text-lg font-bold">Salon : {id}</h1>
        </div>

        <div className="w-full aspect-video bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Emplacement lecteur YouTube</p>
        </div>
      </main>

      {/* Barre latérale : Membres + Chat */}
      <aside className="w-full md:w-80 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 p-4 flex flex-col">
        {/* Liste des participants */}
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
      </aside>
    </div>
  );
}