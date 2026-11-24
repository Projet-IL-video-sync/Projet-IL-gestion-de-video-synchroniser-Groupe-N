import Link from 'next/link';
import {loginUser} from '@/app/actions/auth';

export default function LoginPage() {
    return (
        <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-gray-800">
            <h1 className="text-xl font-bold mb-4 text-gray-900">Connexion</h1>

            <form action={loginUser} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">E-mail ou Pseudo</label>
                    <input name="identifier" type="text" required
                           className="w-full border border-gray-300 p-2 rounded text-gray-900"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input name="password" type="password" required
                           className="w-full border border-gray-300 p-2 rounded text-gray-900"/>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Se connecter
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-blue-600 underline">
                    S'inscrire
                </Link>
            </p>
        </main>
    );
}