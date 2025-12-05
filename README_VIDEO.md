# Configuration de la Vidéo YouTube

## Comment ajouter votre vidéo YouTube

1. Ouvrez le fichier `src/config/video.js`

2. Remplacez la ligne suivante :
   ```javascript
   export const YOUTUBE_VIDEO_URL = '';
   ```

3. Par l'URL de votre vidéo YouTube. Vous pouvez utiliser :
   - URL complète : `https://www.youtube.com/watch?v=VIDEO_ID`
   - URL courte : `https://youtu.be/VIDEO_ID`
   - Seulement l'ID : `VIDEO_ID`

### Exemple

```javascript
export const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
```

ou

```javascript
export const YOUTUBE_VIDEO_URL = 'https://youtu.be/dQw4w9WgXcQ';
```

## Où trouver l'ID de votre vidéo YouTube ?

L'ID de la vidéo se trouve dans l'URL de la vidéo YouTube :
- `https://www.youtube.com/watch?v=**VIDEO_ID**`
- `https://youtu.be/**VIDEO_ID**`

## Note

La vidéo sera automatiquement intégrée dans la page d'accueil une fois l'URL configurée.

