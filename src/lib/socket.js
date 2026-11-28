"use client";

import { io } from "socket.io-client";
import { contientEmoji } from "@/lib/emoji";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
const GUEST_ID_KEY = "watchparty_guest_id";
const GUEST_PSEUDO_KEY = "watchparty_guest_pseudo";

let socketInstance = null;

//Retourne l'instance Socket.IO unique coté navigateur afin de conserverla connexion 

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }
  return socketInstance;
}

//Connecte le socket si nécessaire et résout une fois connecté
export function ensureSocketConnected() {
  const socket = getSocket();
  if (socket.connected) {
    return Promise.resolve(socket);
  }

  return new Promise((resolve, reject) => {
    const onConnect = () => {
      cleanup();
      resolve(socket);
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    socket.connect();
  });
}

function genererGuestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `guest-${crypto.randomUUID()}`;
  }
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

//Recupère ou crée l'identifiant stable de l'invité dans sessionStorage
 
export function getOrCreateGuestId() {
  if (typeof window === "undefined") return null;
  let guestId = window.sessionStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = genererGuestId();
    window.sessionStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

export function getSavedGuestPseudo() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(GUEST_PSEUDO_KEY) || "";
}

export function saveGuestPseudo(pseudo) {
  if (typeof window === "undefined") return;
  const nettoye = String(pseudo || "").trim().slice(0, 30);
  if (nettoye) {
    window.sessionStorage.setItem(GUEST_PSEUDO_KEY, nettoye);
  } else {
    window.sessionStorage.removeItem(GUEST_PSEUDO_KEY);
  }
}


//construit l'identité envoyée au serveur Socket.IO pour les invités et non
 
export function buildClientIdentity(currentUser) {
  if (currentUser && currentUser.id) {
    return {
      clientId: `user-${currentUser.id}`,
      userId: currentUser.id,
      pseudo: currentUser.username,
    };
  }

  return {
    clientId: getOrCreateGuestId(),
    userId: null,
    pseudo: getSavedGuestPseudo(),
  };
}

export function containsEmoji(texte) {
  return contientEmoji(texte);
}
