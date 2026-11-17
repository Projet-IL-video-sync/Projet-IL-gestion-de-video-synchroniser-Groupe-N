// 1. Déclaration globale de la variable du lecteur
let player;

// 2. Chargement dynamique du script de l'API YouTube IFrame
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. Fonction appelée automatiquement par l'API lorsqu'elle est prête
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: 'M7lc1UVf-VE', // ID de la vidéo initiale YouTube
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'disablekb': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

// 4. Événement déclenché quand le lecteur est prêt
function onPlayerReady(event) {
    console.log("Le lecteur YouTube est prêt !");
}

// 5. Événement déclenché à chaque changement d'état
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        console.log("Vidéo en lecture à la position :", player.getCurrentTime());
    } else if (event.data == YT.PlayerState.PAUSED) {
        console.log("Vidéo mise en pause à la position :", player.getCurrentTime());
    }
}

// --- GESTION DU CHANGEMENT DE VIDÉO ---

// On s'assure que le DOM est complètement chargé avant de récupérer les éléments
document.addEventListener("DOMContentLoaded", () => {
    const urlNewVid = document.getElementById("urlNouvelleVideo");
    const boutonChangeVid = document.getElementById("boutonChangerVideo");

    if (boutonChangeVid && urlNewVid) {
        boutonChangeVid.addEventListener("click", () => {
            const idVid = getYouTubeId(urlNewVid.value.trim());
            if (idVid) {
                changerVideo(idVid);
            } else {
                alert("Veuillez entrer un ID YouTube valide !");
            }
        });
    }
});

// 3. Notre fonction
function changerVideo(videoId) {
    if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
        // CORRECTION : Ajout de 'log' après console
        console.log("Changement vers la vidéo :", videoId);
    } else {
        console.error("Le lecteur YouTube n'est pas encore initialisé.");
    }
}


function getYouTubeId(url) {
    try {
        const parsedUrl = new URL(url);
        
        // Cas des liens courts : https://youtu.be/VIDEO_ID
        if (parsedUrl.hostname === 'youtu.be') {
            return parsedUrl.pathname.slice(1);
        }
        
        // Cas des liens youtube.com
        if (parsedUrl.hostname.includes('youtube.com')) {
            // Formats /embed/ID ou /shorts/ID
            if (parsedUrl.pathname.startsWith('/embed/') || parsedUrl.pathname.startsWith('/shorts/')) {
                return parsedUrl.pathname.split('/')[2];
            }
            // Format standard : /watch?v=VIDEO_ID
            return parsedUrl.searchParams.get('v');
        }
    } catch (e) {
        // En cas d'URL invalide
        return null;
    }
    return null;
}
