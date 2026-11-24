const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


const salonManager = require("./salon");

const app = express();
app.use(cors());

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`[CONNEXION] Utilisateur connecté : ${socket.id}`);


  socket.on("creer_salon", (data) => {
    console.log("[SERVEUR] Requête 'creer_salon' reçue :", data);
    
    const nomDuSalon = (data && data.nom) ? data.nom : "Salon sans nom";


    const nouveauSalon = salonManager.creerSalon(nomDuSalon, socket.id);


    socket.join(nouveauSalon.code);


    socket.emit("salon_cree", {
      succes: true,
      salon: nouveauSalon
    });
  });


  socket.on("rejoindre_salon", (data) => {
    console.log("[SERVEUR] Requête 'rejoindre_salon' reçue :", data);

    if (!data || !data.code) {
      return socket.emit("erreur_salon", { message: "Code du salon manquant." });
    }

    const resultat = salonManager.rejoindreSalon(data.code, socket.id);

    if (resultat.succes) {

      socket.join(resultat.salon.code);


      io.to(resultat.salon.code).emit("mise_a_jour_salon", resultat.salon);
    } 
    else 
    {
      socket.emit("erreur_salon", { message: resultat.message });
    }
  });

  
  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté : ${socket.id}`);

    const salonMisAJour = salonManager.quitterSalon(socket.id);
    if (salonMisAJour && salonMisAJour.participants.length > 0) 
    {
      io.to(salonMisAJour.code).emit("mise_a_jour_salon", salonMisAJour);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur Socket.IO démarré sur le port ${PORT}`);
});