"use server";

import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";
import {cookies} from "next/headers";

export async function updateProfile(formData) {
    const user = await getCurrentUser();

    if (!user || !user.id) {
        return {success: false, error: "Non autorisé. Veuillez vous connecter."};
    }

    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim().toLowerCase();
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    try {
        const currentUser = await prisma.user.findUnique({
            where: {id: user.id},
        });

        if (!currentUser) {
            return {success: false, error: "Utilisateur introuvable"};
        }

        if (username && username !== currentUser.username) {
            const existingUsername = await prisma.user.findUnique({
                where: {username},
            });
            if (existingUsername) {
                return {success: false, error: "Pseudo déjà utilisé"};
            }
        }

        if (email && email !== currentUser.email) {
            const existingEmail = await prisma.user.findUnique({
                where: {email},
            });
            if (existingEmail) {
                return {success: false, error: "Email déjà utilisé"};
            }
        }

        const dataToUpdate = {};
        if (username) dataToUpdate.username = username;
        if (email) dataToUpdate.email = email;

        if (newPassword) {
            if (!currentPassword) {
                return {
                    success: false,
                    error: "Le mot de passe actuel est requis pour le modifier",
                };
            }

            const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
            if (!isMatch) {
                return {success: false, error: "Le mot de passe actuel est incorrect"};
            }

            const saltRounds = 10;
            dataToUpdate.password = await bcrypt.hash(newPassword, saltRounds);
        }

        const updatedUser = await prisma.user.update({
            where: {id: user.id},
            data: dataToUpdate,
            select: {id: true, username: true, email: true},
        });

        return {success: true, user: updatedUser};
    } catch (error) {
        console.error("Erreur updateProfile :", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la mise à jour.",
        };
    }
}

export async function deleteProfile() {
    const user = await getCurrentUser();

    if (!user?.id) {
        return {success: false, error: "Non autorisé"};
    }

    try {
        await prisma.user.delete({
            where: {id: user.id},
        });

        const cookieStore = await cookies();
        cookieStore.delete("session_user_id");

        return {success: true};
    } catch (error) {
        console.error("Erreur deleteAccount :", error);
        return {
            success: false,
            error: "Erreur lors de la suppression définitive du compte",
        };
    }
}
