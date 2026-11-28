const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const salonManager = require("./salonManager");

const app = express();
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    salonsActifs: salonManager.salons.size,
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function diffuserQuitter(socket, volontaire) {
  const sortie = salonManager.quitterSalon(socket.id, {
    volontaire,
    onHostTransferred: (salonMisAJour) => {
      io.to(salonMisAJour.code).emit("mise_a_jour_salon", salonMisAJour);
    },
    onRoomDeleted: (code) => {
      io.to(code).emit("salon_ferme", {
        code,
        message: "Le salon a été fermé suite à l'inactivité.",
      });
    },
  });

  if (!sortie) return;

  socket.leave(sortie.code);
  if (!sortie.estVide && !sortie.resteConnecte) {
    io.to(sortie.code).emit("mise_a_jour_salon", sortie.salon);
  }
}

io.on("connection", (socket) => {

  
  console.log(`[Socket.IO] Connexion : ${socket.id}`);

  socket.on("creer_salon", (data, ack) => {
    if (!String(data?.nom || "").trim()) {
      const erreur = {
        succes: false,
        codeErreur: "MISSING_NAME",
        message: "Le nom du salon est obligatoire.",
      };
      if (typeof ack === "function") ack(erreur);
      return socket.emit("erreur_salon", erreur);
    }

    diffuserQuitter(socket, true);

    const resultat = salonManager.creerSalon({
      nom: data?.nom,
      maxParticipants: data?.maxParticipants,
      clientId: data?.clientId,
      userId: data?.userId,
      pseudo: data?.pseudo,
      socketId: socket.id,
    });

    if (!resultat.succes) {
      if (typeof ack === "function") ack(resultat);
      return socket.emit("erreur_salon", {
        codeErreur: resultat.codeErreur,
        message: resultat.message,
      });
    }

    socket.join(resultat.salon.code);

    if (typeof ack === "function") {
      ack({
        succes: true,
        salon: resultat.salon,
        participant: resultat.participant,
      });
    }
  });



  socket.on("rejoindre_salon", (data, ack) => {
    if (!data || !data.code) {
      const erreur = {
        succes: false,
        codeErreur: "MISSING_CODE",
        message: "Code du salon manquant.",
      };
      if (typeof ack === "function") ack(erreur);
      return socket.emit("erreur_salon", erreur);
    }

    const codeDemande = salonManager.normaliserCode(data.code);
    const codeCourant = salonManager.getCodePourSocket(socket.id);
    if (codeCourant && codeCourant !== codeDemande) {
      diffuserQuitter(socket, true);
    }

    const resultat = salonManager.rejoindreSalon({
      code: codeDemande,
      clientId: data.clientId,
      userId: data.userId,
      pseudo: data.pseudo,
      socketId: socket.id,
    });

    if (!resultat.succes) {
      if (typeof ack === "function") ack(resultat);
      return socket.emit("erreur_salon", {
        codeErreur: resultat.codeErreur,
        message: resultat.message,
      });
    }

    socket.join(resultat.salon.code);
    io.to(resultat.salon.code).emit("mise_a_jour_salon", resultat.salon);

    if (typeof ack === "function") {
      ack({
        succes: true,
        salon: resultat.salon,
        participant: resultat.participant,
      });
    }
  });

  socket.on("quitter_salon", (ack) => {
    diffuserQuitter(socket, true);
    if (typeof ack === "function") {
      ack({ succes: true });
    }
  });

  socket.on("envoyer_message", (data, ack) => {
    const texte = typeof data === "string" ? data : data?.texte;
    const code = data?.code || salonManager.getCodePourSocket(socket.id);

    if (!code) {
      const erreur = { succes: false, message: "Vous n'êtes dans aucun salon." };
      if (typeof ack === "function") ack(erreur);
      return socket.emit("erreur_chat", erreur);
    }

    const resultat = salonManager.envoyerMessage({
      code,
      socketId: socket.id,
      texte,
    });

    if (!resultat.succes) {
      if (typeof ack === "function") ack(resultat);
      return socket.emit("erreur_chat", { message: resultat.message });
    }

    io.to(resultat.code).emit("nouveau_message", resultat.message);
    if (typeof ack === "function") {
      ack({ succes: true, message: resultat.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Déconnexion : ${socket.id}`);
    diffuserQuitter(socket, false);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur Socket.IO démarré sur le port ${PORT}`);
});
