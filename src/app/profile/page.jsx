import {getCurrentUser} from "@/lib/auth";
import {redirect} from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (<main>
            <div>
                <div>
                    <h1>Paramètres du compte</h1>
                    <p>
                        Gérez vos informations personnelles et les préférences de sécurité de votre compte.
                    </p>
                </div>

                <ProfileClient user={user}/>
            </div>
        </main>);
}
