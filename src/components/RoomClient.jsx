"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPanel from "@/components/ChatPanel";
import MemberList from "@/components/MemberList";
import PlaylistManager from "@/components/PlaylistManager";
import VideoPlayer from "@/components/VideoPlayer";
import {
  buildClientIdentity,
  getSocket,
  saveGuestPseudo,
} from "@/lib/socket";

export default function RoomClient({ roomCode, currentUser = null }) {
  const router = useRouter();

  const [salon, setSalon] = useState(null);
  const [myClientId, setMyClientId] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    let ignore = false;
    const socket = getSocket();

    const emitJoin = () => {
      const identity = buildClientIdentity(currentUser);
      socket.emit(
        "rejoindre_salon",
        {
          code: roomCode,
          ...identity,
        },
        (reponse) => {
          if (ignore) return;
          if (!reponse || !reponse.succes) {
            setStatus("error");
            setErrorMessage(reponse?.message || "Impossible de rejoindre ce salon.");
            return;
          }

          if (!currentUser && reponse.participant?.pseudo) {
            saveGuestPseudo(reponse.participant.pseudo);
          }

          setMyClientId(identity.clientId);
          setSalon(reponse.salon);
          setStatus("ready");
          setErrorMessage("");
        }
      );
    };

    const onMiseAJourSalon = (salonMisAJour) => {
      if (ignore) return;
      setSalon(salonMisAJour);
    };

    const onNouveauMessage = (msg) => {
      if (ignore) return;
      setChatError("");
      setSalon((prev) => {
        if (!prev) return prev;
        if (prev.messages.some((m) => m.id === msg.id)) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, msg],
        };
      });
    };

    const onErreurChat = (err) => {
      if (ignore) return;
      setChatError(err?.message || "Erreur lors de l'envoi du message.");
    };

    const onSalonFerme = (payload) => {
      if (ignore) return;
      setStatus("error");
      setErrorMessage(payload?.message || "Le salon a été fermé.");
    };

    const onConnect = () => {
      if (!ignore) emitJoin();
    };

    const onConnectError = () => {
      if (!ignore) {
        setStatus("error");
        setErrorMessage(
          "Connexion au serveur temps réel impossible. Vérifiez que le serveur Node.js est démarré sur le port 4000."
        );
      }
    };

    socket.on("mise_a_jour_salon", onMiseAJourSalon);
    socket.on("nouveau_message", onNouveauMessage);
    socket.on("erreur_chat", onErreurChat);
    socket.on("salon_ferme", onSalonFerme);
    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);

    if (socket.connected) {
      Promise.resolve().then(() => {
        if (!ignore) emitJoin();
      });
    } else {
      socket.connect();
    }

    return () => {
      ignore = true;
      socket.off("mise_a_jour_salon", onMiseAJourSalon);
      socket.off("nouveau_message", onNouveauMessage);
      socket.off("erreur_chat", onErreurChat);
      socket.off("salon_ferme", onSalonFerme);
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
    };
  }, [roomCode, currentUser]);

  function handleSendMessage(texte) {
    setChatError("");
    const socket = getSocket();
    socket.emit(
      "envoyer_message",
      { code: salon?.code || roomCode, texte },
      (reponse) => {
        if (reponse && !reponse.succes) {
          setChatError(reponse.message);
        }
      }
    );
  }

  function handleLeaveRoom() {
    const socket = getSocket();
    socket.emit("quitter_salon", () => {
      router.push("/");
    });
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center space-y-2">
          <p className="text-sm font-semibold">Connexion au salon {roomCode}...</p>
          <p className="text-xs text-gray-400">Synchronisation avec le serveur en cours</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !salon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-900/60 rounded-lg p-6 text-center space-y-4">
          <h1 className="text-lg font-bold text-red-400">Accès au salon impossible</h1>
          <p className="text-sm text-gray-300">{errorMessage}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const currentParticipant = salon.participants.find(
    (p) => p.clientId === myClientId
  );
  const isAdmin = Boolean(currentParticipant?.isAdmin);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-white">
      {/* Zone principale : En-tête + Vidéo + Playlist */}
      <main className="flex-1 flex flex-col p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold">{salon.nom}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300 font-mono">
                {salon.code}
              </span>
              {isAdmin && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                  Hôte du salon
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleLeaveRoom}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
            >
              Quitter le salon
            </button>
          </div>
        </div>

        <VideoPlayer videoId={salon.videoState?.videoId || null} />
        <PlaylistManager items={salon.playlist || []} />
      </main>

      {/* Barre latérale : Membres + Chat */}
      <aside className="w-full md:w-80 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 p-4 flex flex-col">
        <MemberList
          members={salon.participants}
          maxParticipants={salon.maxParticipants}
          currentClientId={myClientId}
        />

        <ChatPanel
          messages={salon.messages}
          currentClientId={myClientId}
          chatError={chatError}
          onSendMessage={handleSendMessage}
        />
      </aside>
    </div>
  );
}
