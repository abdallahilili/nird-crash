# Guide d'intégration Cloudinary pour NIRD Crash

Ce guide vous explique comment configurer et utiliser Cloudinary pour héberger les images du jeu.

## 🌐 Qu'est-ce que Cloudinary ?

Cloudinary est une plateforme cloud pour la gestion d'images et de vidéos. Elle offre:
- Hébergement gratuit jusqu'à 25GB
- Optimization automatique des images
- CDN pour chargement rapide
- Transformations d'images à la volée

## 📝 Étape 1: Créer un compte Cloudinary

1. Allez sur [https://cloudinary.com](https://cloudinary.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Free Plan"** (gratuit)
4. Remplissez le formulaire:
   - Email
   - Mot de passe
   - Nom de votre "cloud" (ex: nird-game)
5. Vérifiez votre email
6. Connectez-vous à votre dashboard

## 🔑 Étape 2: Obtenir vos credentials

Une fois connecté au dashboard Cloudinary:

1. **Cloud Name**:
   - Visible en haut à gauche du dashboard
   - Format: `dxxxxxxxxxxxxxx` ou votre nom personnalisé
   - Notez-le quelque part

2. **Upload Preset** (pour upload sans authentification):
   - Allez dans **Settings** > **Upload**
   - Cliquez sur **"Add upload preset"**
   - Configurez:
     - **Preset name**: `nird-game-images`
     - **Signing Mode**: Sélectionnez **"Unsigned"**
     - **Folder**: `nird-game`
     - **Tags**: `nird, game, educational`
   - Cliquez sur **"Save"**

3. **API Key** (optionnel pour dashboard):
   - Disponible dans **Settings** > **Security**
   - Copier l'**API Key**

## ⚙️ Étape 3: Configuration du projet

1. Créez un fichier `.env` à la racine du projet (copier `.env.example`):

```bash
cp .env.example .env
```

2. Éditez le fichier `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=votre_cloud_name_ici
VITE_CLOUDINARY_UPLOAD_PRESET=nird-game-images
VITE_CLOUDINARY_API_KEY=votre_api_key_optionnelle
```

3. Remplacez `votre_cloud_name_ici` par votre Cloud Name

## 📁 Étape 4: Structure des dossiers Cloudinary

Organisez vos images dans Cloudinary en utilisant cette structure:

```
nird-game/
├── levels/              # Illustrations des 12 niveaux
│   ├── innovation.png
│   ├── collaboration.png
│   ├── participation.png
│   └── ...
├── badges/              # Images des 8 badges
│   ├── innovateur.png
│   ├── createur.png
│   ├── contributeur.png
│   └── ...
├── words/               # Images associées aux mots
│   ├── innovation.png
│   ├── creativite.png
│   ├── idee.png
│   └── ...
└── backgrounds/         # Fonds d'écran optionnels
    └── ...
```

## 📤 Étape 5: Uploader les images

### Méthode 1: Via le Dashboard Cloudinary

1. Connectez-vous au dashboard
2. Allez dans **Media Library**
3. Cliquez sur **"Upload"**
4. Sélectionnez vos images ou glissez-déposez
5. Organisez dans les dossiers appropriés

### Méthode 2: Via le code (composant ImageUploader)

Le projet inclut un composant `ImageUploader` (à créer) pour uploader depuis l'application:

```jsx
import { useState } from 'react';

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  const uploadImage = async (file) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'nird-game/levels');
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      setImageUrl(data.secure_url);
      console.log('Image uploadée:', data.secure_url);
    } catch (error) {
      console.error('Erreur upload:', error);
    }
    
    setUploading(false);
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => uploadImage(e.target.files[0])}
      />
      {uploading && <p>Upload en cours...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};
```

## 🖼️ Étape 6: Utiliser les images dans le jeu

### Format des URLs Cloudinary

```
https://res.cloudinary.com/<cloud_name>/image/upload/<path>/<filename>
```

Exemple:
```
https://res.cloudinary.com/nird-game/image/upload/v1234567890/nird-game/levels/innovation.png
```

### Dans levels.json

Remplacez les chemins locaux par les URLs Cloudinary:

```json
{
  "id": 1,
  "theme": "Innovation",
  "image": "https://res.cloudinary.com/votre_cloud/image/upload/nird-game/levels/innovation.png",
  "words": [
    {
      "word": "INNOVATION",
      "image": "https://res.cloudinary.com/votre_cloud/image/upload/nird-game/words/innovation.png"
    }
  ]
}
```

## 🎯 Optimisation des images

Cloudinary permet des transformations à la volée. Ajoutez des paramètres à l'URL:

### Redimensionner
```
/w_400,h_300,c_fill/image.png
```

### Qualité
```
/q_auto:good/image.png
```

### Format auto
```
/f_auto/image.png
```

### Combiné (recommandé)
```
https://res.cloudinary.com/nird-game/image/upload/w_400,h_300,c_fill,q_auto,f_auto/nird-game/levels/innovation.png
```

## 📋 Liste des images nécessaires

### Niveaux (12 images)
- `levels/innovation.png`
- `levels/collaboration.png`
- `levels/participation.png`
- `levels/projets.png`
- `levels/durable.png`
- `levels/biodiversite.png`
- `levels/inclusion.png`
- `levels/idees.png`
- `levels/communaute.png`
- `levels/creativite.png`
- `levels/open-source.png`
- `levels/environnement.png`

### Badges (8 images)
- `badges/innovateur.png`
- `badges/createur.png`
- `badges/contributeur.png`
- `badges/resolveur.png`
- `badges/expert.png`
- `badges/ecologiste.png`
- `badges/communautaire.png`
- `badges/maitre.png`

### Mots (~70 images)
Voir `IMAGE_PROMPTS.md` pour la liste complète

## 🔒 Sécurité

### Pour la production

1. **Utiliser signed uploads**:
   - Changez le preset en "Signed"
   - Implémentez un backend pour signer les requêtes

2. **Restreindre les uploads**:
   - Settings > Security > Restrict media types
   - Limiter aux images uniquement

3. **Configurer les limites**:
   - Max file size: 5MB recommandé
   - Allowed formats: PNG, JPG, WEBP

## 🐛 Dépannage

### Erreur: "Upload preset must be provided"
- Vérifiez que le preset est bien créé et configuré en "Unsigned"

### Erreur: "Invalid cloud name"
- Vérifiez le VITE_CLOUDINARY_CLOUD_NAME dans .env
- Redémarrez le serveur de dev après modification

### Images ne se chargent pas
- Vérifiez les URLs dans la console du navigateur
- Testez l'URL directement dans le navigateur
- Vérifiez que les images sont publiques

## 📚 Ressources

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [React SDK](https://cloudinary.com/documentation/react_integration)

---

**Avec Cloudinary configuré, toutes vos images seront hébergées professionnellement et optimisées automatiquement ! 🚀**
