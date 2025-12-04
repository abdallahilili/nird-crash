# 🎮 NIRD-Crash - Jeu Éducatif de Mots

Jeu éducatif inspiré de "Mots Crash" avec thématique NIRD (Nouvel Institut de Recherche Digitale). Un jeu de recherche de mots interactif avec animations, combos, et système de progression.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF.svg)](https://vitejs.dev/)

---

## ✨ Fonctionnalités

- 🎯 **12 niveaux** avec thématiques variées (Microsoft, Google, Apple, etc.)
- 🎨 **Animations fluides** avec Framer Motion
- 🔥 **Système de combos** pour récompenser la rapidité
- 🎊 **Effets de particules** lors de réussite
- ⭐ **Système de progression** avec étoiles et badges
- 📱 **Responsive** - Jouable sur desktop et mobile
- 🎵 **Effets sonores** (optionnel)

---

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Setup

```bash
# Cloner le repository
git clone https://github.com/votre-org/nird-crash.git
cd nird-crash

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

Le jeu sera accessible sur `http://localhost:5173`

---

## 📁 Structure du Projet

```
nird-crash/
├── src/
│   ├── components/
│   │   ├── game/          # Composants de jeu
│   │   ├── ui/            # Composants UI
│   │   └── effects/       # Effets visuels
│   ├── data/              # Données JSON (niveaux, badges)
│   ├── store/             # State management (Zustand)
│   ├── hooks/             # Custom hooks
│   └── styles/            # Styles globaux
├── docs/                  # Documentation
├── public/                # Assets statiques
└── tests/                 # Tests
```

---

## 🎮 Comment Jouer

1. **Sélectionner un niveau** dans l'écran d'accueil
2. **Former des mots** en sélectionnant les lettres adjacentes
3. **Valider** le mot (minimum 3 lettres)
4. **Réussir** en trouvant le nombre requis de mots
5. **Gagner des étoiles** selon votre performance
6. **Débloquer des badges** en complétant des objectifs

### Système de Combos 🔥

Trouvez plusieurs mots en moins de 5 secondes pour activer le combo et multiplier vos points !

---

## 🛠️ Développement

### Scripts Disponibles

```bash
# Développement
npm run dev             # Serveur de dev avec hot reload

# Production
npm run build           # Build pour production
npm run preview         # Preview du build

# Qualité
npm run lint            # Vérifier le code
npm run lint:fix        # Corriger automatiquement
npm run format          # Formatter avec Prettier

# Tests
npm run test            # Lancer les tests
npm run test:ui         # Tests avec UI
npm run test:coverage   # Coverage
```

### Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.2.5 | Build tool |
| **Framer Motion** | 12.23.25 | Animations |
| **Zustand** | 5.0.9 | State management |
| **React Hot Toast** | 2.6.0 | Notifications |

---

## 👥 Contribuer

Nous accueillons les contributions ! 🎉

### Pour Démarrer

1. Lisez le [guide de contribution](./docs/CONTRIBUTING.md)
2. Consultez le [workflow Git](./docs/GIT_WORKFLOW.md)
3. Regardez les [issues ouvertes](https://github.com/votre-org/nird-crash/issues)
4. Créez votre branche : `git checkout -b feature/ma-feature`
5. Commitez : `git commit -m 'feat: add amazing feature'`
6. Pushez : `git push origin feature/ma-feature`
7. Ouvrez une Pull Request

### Ressources

- 📖 [Architecture](./docs/ARCHITECTURE.md)
- 🔧 [Conventions](./docs/CONVENTIONS.md)
- 🧪 [Tests](./docs/TESTING.md)
- 📦 [Composants](./docs/COMPONENTS.md)

---

## 🏗️ Architecture

Le projet suit une architecture **modulaire par features** :

- **Séparation des responsabilités** : Chaque feature est isolée
- **Composants réutilisables** : UI partagée dans `components/shared`
- **Custom hooks** : Logique réutilisable extraite
- **State centralisé** : Zustand pour l'état global
- **Conventions strictes** : ESLint + Prettier

Voir [architecture-plan.md](./docs/architecture-plan.md) pour plus de détails.

---

## 🧪 Tests

```bash
# Lancer tous les tests
npm run test

# Mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

Nous visons 80%+ de coverage sur les fonctions critiques (utils, hooks, store).

---

## 📦 Build & Déploiement

### Build Local

```bash
npm run build
npm run preview
```

### Déploiement

Le projet peut être déployé sur :
- **Vercel** (recommandé)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

```bash
# Exemple Vercel
npm install -g vercel
vercel
```

---

## 🐛 Signaler un Bug

Trouvé un bug ? [Créez une issue](https://github.com/votre-org/nird-crash/issues/new?template=bug_report.md) !

---

## 💡 Proposer une Fonctionnalité

Une idée ? [Proposez-la](https://github.com/votre-org/nird-crash/issues/new?template=feature_request.md) !

---

## 📝 Roadmap

- [ ] Système de sons complet
- [ ] Mode multijoueur
- [ ] Éditeur de niveaux
- [ ] Thème sombre
- [ ] Support i18n (langues)
- [ ] Progressive Web App (PWA)
- [ ] Leaderboard

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- Design inspiré de "Mots Crash"
- Animations par [Framer Motion](https://www.framer.com/motion/)
- Icons par [React Icons](https://react-icons.github.io/react-icons/)
- Fonts par [Google Fonts](https://fonts.google.com/)

---

## 📞 Contact

- **Issues** : [GitHub Issues](https://github.com/votre-org/nird-crash/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-org/nird-crash/discussions)
- **Email** : votre-email@example.com

---

Made with ❤️ by the NIRD Team

*⭐ N'oubliez pas de star le repo si vous aimez le projet !*
