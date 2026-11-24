import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { logoutUser } from '@/actions/auth';
import HomeForms from '@/components/HomeForms';

export default async function Page() {
  const user = await getCurrentUser();

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-4">
        <h1 className="text-3xl font-bold mb-6">
          Watch Party
        </h1>
        <div className="absolute top-6 right-6 flex items-center gap-3">
          {user ? (
              <>
      <span className="text-sm text-gray-300">
        {user.username}
      </span>

                <form action={logoutUser}>
                  <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                    Déconnexion
                  </button>
                </form>
              </>
          ) : (
              <>
                <Link
                    href="/login"
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
                >
                  Se connecter
                </Link>

                <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                >
                  S'inscrire
                </Link>
              </>
          )}
        </div>

        <p>Plateforme de visionnage synchronisé</p>

        <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">

          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs text-gray-200 mb-2 text-center">
              Rejoins un salon existant
            </p>
            {/* Rejoindre Salon*/}
            <HomeForms />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-200 mb-2 text-center">
              Créer ton propre Salon
            </p>

            <input
                type="text"
                placeholder="Pseudo"
                defaultValue={user?.username || ''}
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />

            <input
                type="text"
                placeholder="Nom du Salon"
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 p-2.5 rounded font-semibold text-sm transition">
              Créer un salon privé
            </button>
          </div>
        </div>
      </main>
  );
}