import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

export default function RegisterPage() {
    return (
        <main className="max-w-md mx-auto mt-12 p-6 bg-white border rounded shadow-sm text-gray-800">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Inscription</h1>

            <form action={registerUser} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Pseudo</label>
                    <input name="username" type="text" required className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">E-mail</label>
                    <input name="email" type="email" required className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
                    <input name="password" type="password" required className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                    S'inscrire
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                Déjà un compte ? <Link href="/login" className="text-blue-600 underline">Se connecter</Link>
            </p>
        </main>
    );
}