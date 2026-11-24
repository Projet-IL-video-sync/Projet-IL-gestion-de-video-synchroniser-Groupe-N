class SalonManager 
{
    constructor() 
    {
      this.salons = new Map();
      //clé = id         valeur = obj salon
    }


    genererCodeSalon() 
    {
        return "ROOM-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    creerSalon(nom, createurSocketId) 
    {
        const code = this.genererCodeSalon();

        const nouveauSalon = 
        {
            code: code,
            nom: nom,
            hoteId: createurSocketId,
            participants: [createurSocketId],
            maxParticipants: 10 
        };

        this.salons.set(code, nouveauSalon);
        console.log(`[SalonManager] Salon créé : ${nom} (${code}) par ${createurSocketId}`);

        return nouveauSalon;
    }

    rejoindreSalon(code, socketId) 
    {
      const salonTrouve = this.salons.get(code);

      if (!salonTrouve) 
      {
        return { succes: false, message: "Salon pas trouvé" };
      }

      if (salonTrouve.participants.length >= salonTrouve.maxParticipants) 
      {
        return { succes: false, message: "Le salon est complet" }; 
      }

      if (salonTrouve.delaiGraceTimer) {
      clearTimeout(salonTrouve.delaiGraceTimer);
      salonTrouve.delaiGraceTimer = null;
      console.log(`utilisateur revenu dans le salon ${code}`);
    }

      
      if (!salonTrouve.participants.includes(socketId)) 
      {
        salonTrouve.participants.push(socketId);
      }

      if (!salonTrouve.participants.includes(salonTrouve.hoteId)) 
      {
      salonTrouve.hoteId = socketId;
      }

      return { succes: true, salon: salonTrouve };
  }


  quitterSalon(socketId) {
    
    for (const [code, salon] of this.salons.entries()) 
      {
      const index = salon.participants.indexOf(socketId);
      if (index !== -1) 
      {
    
        salon.participants.splice(index, 1);
        console.log(` ${socketId} s'est déconnecté du salon ${code}`);

        if (salon.hoteId === socketId && salon.participants.length > 0) 
        {
          salon.hoteId = salon.participants[0];
          console.log(` Nouvel hôte pour ${code} : ${salon.hoteId}`);
        }
        
        if (salon.participants.length === 0) 
          {
          console.log(` Salon ${code} vide. Délai démarré `);
          
          salon.delaiGraceTimer = setTimeout(() => 
          {
            this.salons.delete(code);
            console.log(`Salon ${code} supprimé de la mémoire.`);
          }, 5000);
        }

        return salon;
      }
    }
    return null;
  }
}


module.exports = new SalonManager();