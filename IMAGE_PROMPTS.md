# Prompts de Génération d'Images - NIRD Crash

Ce document contient tous les prompts pour générer les images nécessaires au jeu avec DALL·E, MidJourney, Stable Diffusion ou l'outil `generate_image`.

## 🎨 Style Général

**Base pour tous les prompts**:
```
Educational illustration, cartoon style, vibrant colors, flat design, vector art, friendly and approachable, bright and cheerful, simple shapes, clean lines, suitable for game, playful
```

---

## 📚 Niveaux (12 images - 400x300px)

### 1. Innovation
```
A vibrant lightbulb glowing with colorful gears, circuits and sparkles inside, surrounded by stars and innovation symbols, cartoon style, educational, bright colors, flat design, orange and yellow gradient background
```

### 2. Collaboration
```
Diverse hands of different colors coming together in a circle forming a star shape, colorful team spirit, warm colors, friendly illustration, community feeling, flat design, turquoise background
```

### 3. Participation Citoyenne
```
Cartoon people raising hands in democratic assembly, voting symbols, ballot box, civic engagement illustration, purple and pink colors, inclusive diverse crowd, flat design, educational style
```

### 4. Projets Locaux
```
Colorful neighborhood street scene with local shops, community garden, people collaborating outdoors, urban setting, warm orange tones, friendly cartoon style, flat design illustration
```

### 5. Développement Durable
```
Earth with green plants growing from it, recycling symbols, renewable energy icons like windmills and solar panels, sustainable development, eco-friendly green colors, hopeful cartoon style, flat design
```

### 6. Biodiversité
```
Vibrant ecosystem with diverse animals and plants together, butterfly, birds, flowers, trees, fish, biodiversity celebration, bright nature colors, lively cartoon style, educational flat design
```

### 7. Inclusion
```
Diverse group of people of different abilities, ages, colors holding hands in circle, wheelchair accessible ramp, rainbow colors, warm welcoming atmosphere, inclusive cartoon style, educational flat design
```

### 8. Idées
```
Brain with colorful thought bubbles floating around, lightbulbs, sparkles, creative ideas visualization, imagination concept, yellow and gold colors, vibrant cartoon style, inspirational flat design
```

### 9. Communauté
```
Connected people forming network circle, diverse group holding hands, unity symbol, community spirit, blue and turquoise colors, togetherness theme, friendly cartoon style, flat design
```

### 10. Créativité
```
Artist palette with brushes, musical notes, theater masks, creative tools collage, colorful and dynamic, purple and pink gradient, cultural diversity, joyful cartoon illustration, flat design
```

### 11. Solutions Ouvertes
```
Open book with digital symbols, code brackets, sharing icons, open source concept, connectivity network, cyan and blue colors, modern tech-friendly cartoon style, educational flat design
```

### 12. Environnement
```
Clean beautiful planet Earth with fresh blue water, trees, clean air symbols, environmental protection, green and blue nature colors, hopeful peaceful illustration, cartoon eco-friendly style, flat design
```

---

## 🏆 Badges (8 images - 200x200px)

### 1. Badge Innovateur 🚀
```
Golden circular badge medal with glowing lightbulb icon in center, shiny metallic gold, stars around border, achievement award style, 3D effect but flat design, prestigious look, game badge
```

### 2. Badge Créateur 🎨
```
Colorful artistic badge with painter palette and creative brush icon, vibrant red and orange colors, artistic achievement medal, rainbow paint splashes, cartoon style, game badge flat design
```

### 3. Badge Contributeur 🤝
```
Badge with two hands shaking in center, turquoise and blue colors, teamwork symbol, community contribution icon, warm friendly feeling, cartoon achievement medal, flat design game badge
```

### 4. Badge Résolveur 🧩
```
Puzzle pieces coming together badge, brain with gears icon, teal and green colors smart clever symbol, problem-solving achievement, intelligent design, cartoon style game badge, flat design
```

### 5. Badge Expert NIRD 🌟
```
Premium purple and gold star badge, triple stars symbol, master level achievement, prestigious royal colors, expert certification medal, shiny gradient, cartoon game badge, flat design
```

### 6. Badge Écologiste 🌱
```
Green nature badge with plant leaf and Earth icon, eco-friendly symbol, fresh green colors, environmental protection achievement, organic natural style, cartoon game badge, flat design
```

### 7. Badge Communautaire 💙
```
Blue heart-shaped community badge, connected people icons, social network symbol, warm blue colors, togetherness achievement, friendly loving design, cartoon game badge, flat design
```

### 8. Badge Maître des Mots 👑
```
Royal crown badge in pink and gold, word book icon, legendary achievement symbol, prestigious master level, elegant but playful, ultimate award, cartoon game badge, flat design
```

---

## 💬 Mots Illustrés (exemples - 300x200px)

### Innovation
```
Lightbulb moment, bright idea illustration, innovation spark, glowing bulb, yellow and orange, simple cartoon icon, flat design
```

### Collaboration / Équipe
```
Group of people working together around table, teamwork illustration, collaboration concept, diverse team, friendly cartoon, flat design
```

### Environnement / Nature
```
Beautiful green tree with birds and flowers, nature scene, environmental protection, eco-friendly, bright green colors, cartoon illustration
```

### Créativité / Art
```
Artist creating colorful painting, creative expression, art tools, imagination at work, vibrant colors, joyful cartoon style
```

### Communauté / Lien
```
People connected by lines forming network, community bonds, social connection, warm colors, unity illustration, cartoon flat design
```

### Innovation / Technologie
```
Modern technology devices, digital innovation, futuristic concepts, blue and purple tech colors, sleek cartoon illustration
```

### Inclusion
```
Diverse people together all smiling, inclusive society, everyone welcome, rainbow diversity, warm friendly cartoon illustration
```

### Partage
```
Hands passing gift or resource, sharing concept, generosity illustration, warm colors, kind gesture, friendly cartoon style
```

---

## 🎯 Conseils de Génération

### Avec DALL·E (OpenAI)
1. Utilisez les prompts tels quels
2. Sélectionnez "Standard" quality
3. Format: Square (1024x1024) puis recadrez
4. Générez 2-3 variantes et choisissez la meilleure

### Avec MidJourney
1. Ajoutez `--style raw --v 6` à la fin du prompt
2. Utilisez `--ar 4:3` pour les niveaux
3. Utilisez `--ar 1:1` pour les badges
4. Exemple: `votre_prompt --style raw --v 6 --ar 4:3`

### Avec Stable Diffusion
1. Modèle recommandé: SDXL 1.0
2. Steps: 30-40
3. CFG Scale: 7-9
4. Ajoutez "negative prompt": `realistic, photographic, dark, scary, complex, detailed`

### Avec generate_image (outil interne)
1. Utilisez les prompts directement
2. L'outil optimise automatiquement pour le style cartoon
3. Sauvegardez avec noms descriptifs

---

## 📋 Liste Complète des Images Requises

### Priorité 1 (Minimum fonctionnel)
- [ ] 12 images de niveaux
- [ ] 8 images de badges

### Priorité 2 (Amélioration visuelle)
- [ ] 20-30 images de mots les plus importants
- [ ] Images de fond d'écran

### Priorité 3 (Polish final)
- [ ] Toutes les images de mots (~70)
- [ ] Icônes UI additionnelles
- [ ] Animations/particules

---

## 🔄 Workflow Recommandé

1. **Génération**:
   - Générer toutes les images de badges d'abord
   - Puis les 12 images de niveaux
   - Enfin les images de mots (par batch de 10)

2. **Optimisation**:
   - Redimensionner à la taille appropriée
   - Compresser (PNG ou WebP)
   - Nommer de façon cohérente

3. **Upload**:
   - Uploader sur Cloudinary (voir CLOUDINARY_GUIDE.md)
   - Organiser dans les dossiers appropriés
   - Copier les URLs

4. **Intégration**:
   - Mettre à jour `levels.json`
   - Mettre à jour `badges.json`
   - Tester le chargement

---

## 🎨 Palette de Couleurs à Utiliser

```
Primaire:    #FF6B6B (Rouge vibrant)
Secondaire:  #4ECDC4 (Turquoise)
Accent:      #FFD93D (Jaune doré)
Succès:      #6BCF7F (Vert)
Violet:      #9B59B6
Rose:        #E91E63
Bleu:        #3498DB
Orange:      #F39C12
Vert nature: #2ECC71
Cyan:        #00BCD4
```

---

## 📝 Notes Importantes

- **Cohérence visuelle**: Gardez le même style cartoon/flat pour toutes les images
- **Couleurs vives**: Le jeu se veut joyeux et énergique
- **Simplicité**: Évitez les détails trop complexes
- **Éducatif**: Les images doivent être claires et compréhensibles
- **Inclusivité**: Représentez la diversité dans les personnages

---

**Avec ces prompts, vous pouvez générer un set complet d'images professionnelles pour NIRD Crash ! 🎨🚀**
