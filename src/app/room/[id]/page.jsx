"use client";

// Fichier parent des composants : src/app/room/[id]/page.jsx
import ChatPanel from "@/components/ChatPanel";
import MemberList from "@/components/MemberList";
import PlaylistManager from "@/components/PlaylistManager";
import VideoPlayer from "@/components/VideoPlayer";



export default async function RoomPage({ params }) {
  const { id } = await params;
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-white">
      {/* Zone principale : En-tête + Vidéo */}
      <main className="flex-1 flex flex-col p-4">
        <div className="mb-4">
          <h1 className="text-lg font-bold">Salon : {id}</h1>
        </div>
        <VideoPlayer videoId={null} />
        {/* Encart Playlist collaborative */}
        <PlaylistManager items={[]} />
      </main>

      {/* Barre latérale : Membres + Chat */}
      <aside className="w-full md:w-80 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 p-4 flex flex-col">
        {/* Liste des participants */}
        <MemberList members={[]} />
        {/* Bloc Chat */}
        <ChatPanel messages={[]} />
      </aside>
    </div>
  );
}