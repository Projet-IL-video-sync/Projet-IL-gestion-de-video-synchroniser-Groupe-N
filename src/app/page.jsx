export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">
        Watch Party
      </h1>
      <p>Plateforme de visionnage synchronisé</p>
      
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">
      
        <div className="border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-200 mb-2 text-center">Rejoins un salon existant</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Code du salon (ex: ABC-123)"
              className="flex-1 p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded font-semibold text-sm transition">
              Rejoindre
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-gray-200 mb-2 text-center">Créer ton propre Salon</p>
          <input
            type="text"
            placeholder="Pseudo"
            className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"/>
          <input
            type="text"
            placeholder="Nom du Salon"
            className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"/>

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2.5 rounded font-semibold text-sm transition">
            Créer un salon privé
          </button>
        </div>
      </div>

    </main>
  )
}
