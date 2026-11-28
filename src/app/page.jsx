import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { logoutUser } from '@/actions/auth';
import HomeForms from '@/components/HomeForms';

export default async function Page() {
  const user = await getCurrentUser();
  const safeUser = user ? { id: user.id, username: user.username } : null;

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-4">
        <h1 className="text-3xl font-bold mb-6">
          Watch Party
        </h1>
        <div className="absolute top-6 right-6 flex items-center gap-3">
          {safeUser ? (
              <>
      <span className="text-sm text-gray-300">
        {safeUser.username}
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

        <HomeForms currentUser={safeUser} />
      </main>
  );
}
