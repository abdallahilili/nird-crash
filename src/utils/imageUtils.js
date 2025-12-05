/**
 * Utilitaires pour gérer les images locales
 * Toutes les images doivent être dans src/assets/images/
 */

/**
 * Obtient le chemin d'une image locale
 * @param {string} imagePath - Chemin relatif depuis assets/images (ex: "levels/innovation.png")
 * @returns {string} - Chemin complet pour l'import
 */
export const getImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  // Si c'est déjà un chemin local, le retourner tel quel
  if (imagePath.startsWith('/') || imagePath.startsWith('./') || imagePath.startsWith('../')) {
    return imagePath;
  }
  
  // Si c'est une URL externe, retourner null (sera remplacé par une image locale)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return null;
  }
  
  // Construire le chemin depuis assets/images
  return `/src/assets/images/${imagePath}`;
};

/**
 * Importe une image de manière dynamique
 * @param {string} imagePath - Chemin relatif depuis assets/images
 * @returns {Promise<string>} - URL de l'image
 */
export const importImage = async (imagePath) => {
  try {
    const image = await import(`../assets/images/${imagePath}`);
    return image.default;
  } catch (error) {
    console.warn(`Image non trouvée: ${imagePath}`, error);
    // Retourner une image placeholder par défaut
    return '/src/assets/images/placeholder.png';
  }
};

/**
 * Obtient l'image d'un niveau
 * @param {number} levelId - ID du niveau
 * @returns {string} - Chemin de l'image
 */
export const getLevelImage = (levelId) => {
  return `/src/assets/images/levels/level-${levelId}.png`;
};

/**
 * Obtient l'image d'un mot
 * @param {string} word - Le mot
 * @param {number} levelId - ID du niveau (optionnel)
 * @returns {string} - Chemin de l'image
 */
export const getWordImage = (word, levelId = null) => {
  const wordSlug = word.toLowerCase().replace(/\s+/g, '-');
  if (levelId) {
    return `/src/assets/images/words/level-${levelId}/${wordSlug}.png`;
  }
  return `/src/assets/images/words/${wordSlug}.png`;
};

