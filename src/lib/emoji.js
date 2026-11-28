// Détecte les emojis Unicode (y compris drapeaux et séquences keycap) sans bloquer les chiffres ni les accents
const EMOJI_REGEX = /(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{20E3})/u;

function contientEmoji(texte) {
  return EMOJI_REGEX.test(String(texte || ""));
}

module.exports = {
  EMOJI_REGEX,
  contientEmoji,
};
