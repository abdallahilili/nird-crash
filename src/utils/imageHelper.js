/**
 * Helper pour convertir les URLs d'images en chemins locaux
 * Utilise les images depuis src/assets/images/
 */

/**
 * Convertit une URL externe en chemin local
 * @param {string} url - URL de l'image (Unsplash, Cloudinary, etc.)
 * @param {string} type - Type d'image: 'level' ou 'word'
 * @param {string} identifier - Identifiant unique (levelId ou word)
 * @returns {string} - Chemin local
 */
export const convertToLocalPath = (url, type = 'word', identifier = '') => {
  // Si c'est déjà un chemin local, le retourner
  if (!url || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }
  
  // Si c'est une URL externe, retourner un chemin local par défaut
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (type === 'level') {
      return `/src/assets/images/levels/level-${identifier}.png`;
    } else {
      const wordSlug = identifier.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return `/src/assets/images/words/${wordSlug}.png`;
    }
  }
  
  return url;
};

/**
 * Obtient le chemin d'une image avec fallback
 * @param {string} imagePath - Chemin de l'image
 * @param {string} fallback - Chemin de fallback
 * @returns {string} - Chemin final
 */
export const getImageWithFallback = (imagePath, fallback = '/src/assets/images/placeholder.png') => {
  if (!imagePath) return fallback;
  
  // Si c'est une URL externe, utiliser le fallback
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return fallback;
  }
  
  return imagePath;
};

