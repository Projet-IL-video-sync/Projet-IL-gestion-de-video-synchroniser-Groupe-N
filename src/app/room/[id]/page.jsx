// Fichier parent des composants : src/app/room/[id]/page.jsx
import { getCurrentUser } from "@/lib/auth";
import RoomClient from "@/components/RoomClient";

export default async function RoomPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const safeUser = user ? { id: user.id, username: user.username } : null;

  return <RoomClient roomCode={id} currentUser={safeUser} />;
}
