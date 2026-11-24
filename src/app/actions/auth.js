'use server';

import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';

export async function registerUser(formData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!username || !email || !password) {
        throw new Error('Tous les champs sont obligatoires.');
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: email},
                    {username: username},
                ],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new Error('Cet e-mail est déjà utilisé.');
            }
            if (existingUser.username === username) {
                throw new Error('Ce pseudo est déjà pris.');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // Optionnel : Connecter l'utilisateur directement après son inscription
        const cookieStore = await cookies();
        cookieStore.set('session_user_id', newUser.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

    } catch (error) {
        // Laisser passer la redirection Next.js
        if (error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Erreur lors de l’inscription :', error);
        throw new Error(error.message || 'Impossible de créer le compte.');
    }

    // Redirection en dehors du try/catch
    redirect('/');
}

export async function loginUser(formData) {
    const identifier = formData.get('identifier');
    const password = formData.get('password');

    if (!identifier || !password) {
        throw new Error('Tous les champs sont obligatoires.');
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: identifier},
                    {username: identifier},
                ],
            },
        });

        if (!user) {
            throw new Error('Identifiant ou mot de passe incorrect.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Identifiant ou mot de passe incorrect.');
        }

        const cookieStore = await cookies();
        cookieStore.set('session_user_id', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

    } catch (error) {
        if (error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Erreur lors de la connexion :', error);
        throw new Error(error.message || 'Impossible de se connecter.');
    }

    redirect('/');
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('session_user_id');
    redirect('/login');
}