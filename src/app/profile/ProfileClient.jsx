"use client";

import {useState} from "react";
import {updateProfile, deleteProfile} from "@/app/actions/user";

export default function ProfileClient({user}) {
    const [message, setMessage] = useState("");

    async function handleUpdate(formData) {
        setMessage("Mise à jour en cours...");
        const res = await updateProfile(formData);

        if (res?.success) {
            setMessage("Profil mis à jour avec succès !");
        } else {
            setMessage(`Erreur : ${res?.error || "Échec"}`);
        }
    }

    async function handleDelete() {
        const isConfirmed = window.confirm(
            "Confirmer la suppression définitive du compte ?"
        );
        if (!isConfirmed) return;

        setMessage("Suppression en cours...");
        const res = await deleteProfile();

        if (res?.success) {
            alert("Compte supprimé ! Redirection...");
            window.location.href = "/login";
        } else {
            setMessage(`Erreur suppression : ${res?.error || "Échec"}`);
        }
    }

    return (
        <div>
            {message && <p>{message}</p>}

            <form action={handleUpdate}>
                <div>
                    <label htmlFor="username">Pseudo :</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={user?.username || ""}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user?.email || ""}
                    />
                </div>

                <fieldset>
                    <legend>Changer de mot de passe (optionnel)</legend>
                    <div>
                        <label htmlFor="currentPassword">Mot de passe actuel :</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword">Nouveau mot de passe :</label>
                        <input type="password" id="newPassword" name="newPassword"/>
                    </div>
                </fieldset>

                <button type="submit">Enregistrer les modifications</button>
            </form>

            <hr/>

            <div>
                <h3>Zone de danger</h3>
                <button type="button" onClick={handleDelete}>
                    Supprimer définitivement mon compte
                </button>
            </div>
        </div>
    );
}
