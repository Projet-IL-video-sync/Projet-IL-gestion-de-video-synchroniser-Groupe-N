const { randomUUID } = require("crypto");
const { contientEmoji } = require("../src/lib/emoji");

const DEFAULT_MAX_PARTICIPANTS = 10;
const ABSOLUTE_MAX_PARTICIPANTS = 50;
const EMPTY_ROOM_GRACE_MS = 10000;
const HOST_RECONNECT_GRACE_MS = 8000;
const MAX_CHAT_HISTORY = 200;
const MAX_MESSAGE_LENGTH = 500;

function normaliserCode(code) {
  return String(code || "").trim().toUpperCase();
}

class SalonManager {
  constructor() {
    this.salons = new Map();
    this.socketToRoom = new Map();
  }

  getCodePourSocket(socketId) {
    return this.socketToRoom.get(socketId) || null;
  }

  genererCodeSalon() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    do {
      let suffixe = "";
      for (let i = 0; i < 4; i += 1) {
        suffixe += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      code = `ROOM-${suffixe}`;
    } while (this.salons.has(code));
    return code;
  }

  genererPseudoInvite(salon) {
    const pseudosExistants = new Set();
    if (salon) {
      for (const participant of salon.participants.values()) {
        pseudosExistants.add(participant.pseudo);
      }
    }

    let pseudo = "";
    do {
      const numero = Math.floor(1000 + Math.random() * 9000);
      pseudo = `Invité_${numero}`;
    } while (pseudosExistants.has(pseudo));

    return pseudo;
  }

  resoudreClientId(clientId, userId, fallbackSocketId) {
    if (userId) {
      return `user-${String(userId).trim()}`;
    }
    if (clientId && String(clientId).trim()) {
      return String(clientId).trim();
    }
    return `socket-${fallbackSocketId}`;
  }

  serialiserParticipant(participant) {
    return {
      clientId: participant.clientId,
      pseudo: participant.pseudo,
      isAdmin: Boolean(participant.isAdmin),
    };
  }

  serialiserSalon(salon) {
    return {
      code: salon.code,
      nom: salon.nom,
      maxParticipants: salon.maxParticipants,
      hostClientId: salon.hostClientId,
      participants: Array.from(salon.participants.values()).map((p) =>
        this.serialiserParticipant(p)
      ),
      messages: salon.messages,
      videoState: salon.videoState,
      playlist: salon.playlist,
    };
  }

  creerSalon({ nom, maxParticipants, clientId, userId, pseudo, socketId }) {
    const nomNettoye = String(nom || "").trim().slice(0, 100);
    if (!nomNettoye) {
      return {
        succes: false,
        codeErreur: "MISSING_NAME",
        message: "Le nom du salon est obligatoire.",
      };
    }

    const code = this.genererCodeSalon();
    const effectiveClientId = this.resoudreClientId(clientId, userId, socketId);

    const capaciteDemandee = Number.parseInt(maxParticipants, 10);
    const capaciteInitiale = Number.isFinite(capaciteDemandee)
      ? Math.min(ABSOLUTE_MAX_PARTICIPANTS, Math.max(DEFAULT_MAX_PARTICIPANTS, capaciteDemandee))
      : DEFAULT_MAX_PARTICIPANTS;

    const pseudoCompte = userId ? String(pseudo || "").trim().slice(0, 30) : "";
    const effectivePseudo = pseudoCompte || this.genererPseudoInvite(null);

    const participant = {
      clientId: effectiveClientId,
      socketIds: new Set([socketId]),
      userId: userId ? String(userId) : null,
      pseudo: effectivePseudo,
      isAdmin: true,
      joinedAt: Date.now(),
    };

    const nouveauSalon = {
      code,
      nom: nomNettoye,
      maxParticipants: capaciteInitiale,
      hostClientId: effectiveClientId,
      participants: new Map([[effectiveClientId, participant]]),
      timers: { vide: null, hote: null },
      messages: [],
      videoState: {
        videoId: null,
        isPlaying: false,
        currentTime: 0,
        updatedAt: Date.now(),
      },
      playlist: [],
    };

    this.salons.set(code, nouveauSalon);
    this.socketToRoom.set(socketId, code);
    console.log(`[SalonManager] Salon créé : ${nomNettoye} (${code}) par ${effectivePseudo} [${effectiveClientId}]`);

    return {
      succes: true,
      salon: this.serialiserSalon(nouveauSalon),
      participant: this.serialiserParticipant(participant),
    };
  }

  rejoindreSalon({ code, clientId, userId, pseudo, socketId }) {
    const codeNormalise = normaliserCode(code);
    const salon = this.salons.get(codeNormalise);

    if (!salon) {
      return {
        succes: false,
        codeErreur: "NOT_FOUND",
        message: "Salon introuvable ou expiré.",
      };
    }

    const effectiveClientId = this.resoudreClientId(clientId, userId, socketId);

    if (salon.timers.vide) {
      clearTimeout(salon.timers.vide);
      salon.timers.vide = null;
    }
    if (salon.hostClientId === effectiveClientId && salon.timers.hote) {
      clearTimeout(salon.timers.hote);
      salon.timers.hote = null;
    }

    const pseudoDemande = String(pseudo || "").trim().slice(0, 30);
    const existant = salon.participants.get(effectiveClientId);

    if (existant) {
      existant.socketIds.add(socketId);
      this.socketToRoom.set(socketId, codeNormalise);
      if (userId) existant.userId = String(userId);
      if (pseudoDemande) existant.pseudo = pseudoDemande;
      existant.isAdmin = salon.hostClientId === effectiveClientId;

      return {
        succes: true,
        salon: this.serialiserSalon(salon),
        participant: this.serialiserParticipant(existant),
      };
    }

    if (salon.participants.size >= salon.maxParticipants) {
      return {
        succes: false,
        codeErreur: "FULL",
        message: `Le salon est complet (${salon.participants.size}/${salon.maxParticipants}).`,
      };
    }

    const effectivePseudo = pseudoDemande || this.genererPseudoInvite(salon);
    const participant = {
      clientId: effectiveClientId,
      socketIds: new Set([socketId]),
      userId: userId ? String(userId) : null,
      pseudo: effectivePseudo,
      isAdmin: salon.hostClientId === effectiveClientId,
      joinedAt: Date.now(),
    };

    salon.participants.set(effectiveClientId, participant);
    this.socketToRoom.set(socketId, codeNormalise);
    console.log(`[SalonManager] ${effectivePseudo} a rejoint ${codeNormalise} (${salon.participants.size}/${salon.maxParticipants})`);

    return {
      succes: true,
      salon: this.serialiserSalon(salon),
      participant: this.serialiserParticipant(participant),
    };
  }

  trouverParticipantParSocket(salon, socketId) {
    for (const participant of salon.participants.values()) {
      if (participant.socketIds.has(socketId)) {
        return participant;
      }
    }
    return null;
  }

  transfererHoteAuPlusAncien(salon) {
    if (salon.participants.size === 0) return null;

    for (const participant of salon.participants.values()) {
      participant.isAdmin = false;
    }

    const plusAncien = salon.participants.values().next().value;
    plusAncien.isAdmin = true;
    salon.hostClientId = plusAncien.clientId;
    console.log(`[SalonManager] Nouvel hôte pour ${salon.code} : ${plusAncien.pseudo}`);
    return plusAncien;
  }

  quitterSalon(socketId, { volontaire = false, onHostTransferred = null, onRoomDeleted = null } = {}) {
    const code = this.socketToRoom.get(socketId);
    if (!code) return null;

    this.socketToRoom.delete(socketId);

    const salon = this.salons.get(code);
    if (!salon) return null;

    const participant = this.trouverParticipantParSocket(salon, socketId);
    if (!participant) return null;

    participant.socketIds.delete(socketId);

    //si l'utilisateur a encore un autre socket ouvert dans ce salon il reste present
    if (participant.socketIds.size > 0) {
      return {
        code,
        participant: this.serialiserParticipant(participant),
        salon: this.serialiserSalon(salon),
        estVide: false,
        resteConnecte: true,
      };
    }

    salon.participants.delete(participant.clientId);
    console.log(`[SalonManager] ${participant.pseudo} a quitté ${code} (volontaire=${volontaire})`);

    const etaitHote = salon.hostClientId === participant.clientId;

    if (etaitHote && salon.participants.size > 0) {
      if (salon.timers.hote) {
        clearTimeout(salon.timers.hote);
        salon.timers.hote = null;
      }

      if (volontaire) {
        this.transfererHoteAuPlusAncien(salon);
      } else {
        salon.timers.hote = setTimeout(() => {
          salon.timers.hote = null;
          const salonCourant = this.salons.get(code);
          if (!salonCourant || salonCourant.participants.size === 0) return;

          if (!salonCourant.participants.has(salonCourant.hostClientId)) {
            this.transfererHoteAuPlusAncien(salonCourant);
            if (typeof onHostTransferred === "function") {
              onHostTransferred(this.serialiserSalon(salonCourant));
            }
          }
        }, HOST_RECONNECT_GRACE_MS);
      }
    }

    if (salon.participants.size === 0) {
      console.log(`[SalonManager] Salon ${code} vide. Suppression dans ${EMPTY_ROOM_GRACE_MS / 1000}s si personne ne revient.`);
      if (salon.timers.vide) clearTimeout(salon.timers.vide);

      salon.timers.vide = setTimeout(() => {
        salon.timers.vide = null;
        const salonCourant = this.salons.get(code);
        if (salonCourant && salonCourant.participants.size === 0) {
          if (salonCourant.timers.hote) clearTimeout(salonCourant.timers.hote);
          this.salons.delete(code);
          console.log(`[SalonManager] Salon ${code} supprimé de la mémoire.`);
          if (typeof onRoomDeleted === "function") {
            onRoomDeleted(code);
          }
        }
      }, EMPTY_ROOM_GRACE_MS);
    }

    return {
      code,
      participant: this.serialiserParticipant(participant),
      salon: this.serialiserSalon(salon),
      estVide: salon.participants.size === 0,
      resteConnecte: false,
    };
  }

  envoyerMessage({ code, socketId, texte }) {
    const codeNormalise = normaliserCode(code);
    const salon = this.salons.get(codeNormalise);
    if (!salon) {
      return { succes: false, message: "Salon introuvable." };
    }

    const participant = this.trouverParticipantParSocket(salon, socketId);
    if (!participant) {
      return { succes: false, message: "Vous n'êtes pas membre de ce salon." };
    }

    const texteNettoye = String(texte || "").trim();
    if (!texteNettoye) {
      return { succes: false, message: "Le message ne peut pas être vide." };
    }

    if (texteNettoye.length > MAX_MESSAGE_LENGTH) {
      return {
        succes: false,
        message: `Le message dépasse la limite de ${MAX_MESSAGE_LENGTH} caractères.`,
      };
    }

    if (contientEmoji(texteNettoye)) {
      return {
        succes: false,
        message: "Les emojis ne sont pas autorisés dans le chat.",
      };
    }

    const maintenant = Date.now();
    const messageObjet = {
      id: randomUUID(),
      clientId: participant.clientId,
      pseudo: participant.pseudo,
      texte: texteNettoye,
      heure: new Date(maintenant).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: maintenant,
    };

    salon.messages.push(messageObjet);
    if (salon.messages.length > MAX_CHAT_HISTORY) {
      salon.messages.shift();
    }

    return {
      succes: true,
      code: codeNormalise,
      message: messageObjet,
    };
  }
}

module.exports = new SalonManager();
module.exports.contientEmoji = contientEmoji;
module.exports.normaliserCode = normaliserCode;
module.exports.DEFAULT_MAX_PARTICIPANTS = DEFAULT_MAX_PARTICIPANTS;
module.exports.ABSOLUTE_MAX_PARTICIPANTS = ABSOLUTE_MAX_PARTICIPANTS;
