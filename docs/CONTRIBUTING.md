# Guide de Contribution - NIRD-Crash

## 🤝 Bienvenue !

Merci de contribuer au projet NIRD-Crash ! Ce guide vous aidera à bien démarrer.

---

## 📋 Avant de Commencer

### Prérequis
- Node.js 18+ installé
- Git configuré
- Connaissance de React et JavaScript

### Setup Initial
```bash
# 1. Cloner le repo
git clone https://github.com/votre-org/nird-crash.git
cd nird-crash

# 2. Installer les dépendances
npm install

# 3. Copier .env.example vers .env
cp .env.example .env

# 4. Lancer le serveur de dev
npm run dev
```

---

## 🔄 Workflow Git

### 1. Créer une Branche

```bash
# Toujours partir de develop à jour
git checkout develop
git pull origin develop

# Créer votre branche feature
git checkout -b feature/VOTRENOM-description-courte

# Exemples:
# feature/john-level-modal
# bugfix/marie-css-import
# refactor/paul-game-logic
```

### 2. Développer

- **Commits fréquents** : Commitez régulièrement votre travail
- **Messages clairs** : Suivez la convention (voir ci-dessous)
- **Tests** : Testez vos modifications manuellement

```bash
# Ajouter vos fichiers
git add src/components/ui/LevelModal.jsx

# Commit avec message conventionnel
git commit -m "feat(modal): add level complete animation"

# Push régulier (backup cloud)
git push origin feature/VOTRENOM-description-courte
```

### 3. Pull Request

1. **Pushez votre branche** sur GitHub
2. **Créez une PR** vers `develop`
3. **Remplissez le template** (description, type, tests)
4. **Demandez une review** à un collègue
5. **Corrigez** si nécessaire
6. **Merge** après approbation

---

## 📝 Conventions de Code

### Naming

| Type | Convention | Exemple |
|------|-----------|---------|
| **Composants** | PascalCase | `LetterGrid.jsx` |
| **Hooks** | camelCase + `use` | `useGameLogic.js` |
| **Utils** | camelCase | `wordValidator.js` |
| **CSS classes** | kebab-case | `letter-grid__cell` |

### Messages de Commit

Format: `<type>(<scope>): <description>`

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `style`: Changement visuel/CSS
- `refactor`: Refactoring code
- `docs`: Documentation
- `test`: Ajout tests
- `chore`: Maintenance (deps, config)

**Exemples:**
```bash
feat(game): add combo system
fix(grid): correct cell selection bug
style(modal): improve button hover effect
refactor(hooks): extract game logic to useGameLogic
docs(readme): update installation steps
```

### Structure de Composant

```javascript
// 1. Imports
import { useState } from 'react';
import './MonComposant.css';

// 2. Constants (hors composant)
const MAX_ITEMS = 10;

// 3. Composant
const MonComposant = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => { };
  
  // Render
  return <div className="mon-composant">{/* JSX */}</div>;
};

// 4. Export
export default MonComposant;
```

---

## 🧪 Tests

### Lancer les Tests

```bash
# Tous les tests
npm run test

# Mode watch
npm run test:watch

# Avec UI
npm run test:ui

# Coverage
npm run test:coverage
```

### Écrire un Test

```javascript
// MonComposant.test.jsx
import { render, screen } from '@testing-library/react';
import MonComposant from './MonComposant';

describe('MonComposant', () => {
  it('renders correctly', () => {
    render(<MonComposant />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## 📚 Documentation

### Commenter le Code

```javascript
/**
 * Valide si un mot existe dans la liste
 * @param {string} word - Mot à valider
 * @param {string[]} wordList - Liste de mots valides
 * @returns {boolean} True si le mot est valide
 */
function validateWord(word, wordList) {
  return wordList.includes(word.toUpperCase());
}
```

### Mettre à Jour la Doc

Si vous ajoutez une fonctionnalité majeure:
1. Mettez à jour `README.md`
2. Ajoutez dans `docs/COMPONENTS.md` si nouveau composant
3. Créez un exemple d'utilisation

---

## ⚠️ Choses à Éviter

### ❌ Ne PAS Faire

1. **Commit direct sur `main` ou `develop`**
   - Toujours passer par une PR

2. **Push de fichiers sensibles**
   ```bash
   # Ne JAMAIS commiter:
   - .env
   - node_modules/
   - dist/
   - Mots de passe ou tokens
   ```

3. **Gros commits monolithiques**
   - Préférez plusieurs petits commits clairs

4. **console.log() en production**
   - Retirez avant de commit

5. **Modifier le code d'un autre sans accord**
   - Communiquez d'abord !

###  ✅ Bonnes Pratiques

1. **Pull souvent depuis develop**
   ```bash
   git checkout develop
   git pull
   git checkout votre-branche
   git merge develop
   ```

2. **Résolvez les conflits rapidement**
   - Ne laissez pas traîner

3. **Testez avant de push**
   - `npm run dev` et vérifiez manuellement
   - `npm run lint`

4. **Demandez de l'aide si bloqué**
   - Équipe > Performance individuelle

5. **Code review constructif**
   - Soyez poli et spécifique
   - Proposez des solutions

---

## 🐛 Signaler un Bug

### Via GitHub Issues

1. Allez sur GitHub Issues
2. Cliquez "New Issue"
3. Choisissez template "Bug Report"
4. Remplissez:
   - **Titre clair** : "Grid ne réagit pas au clic sur mobile"
   - **Description** : Étapes pour reproduire
   - **Attendu vs Réel**
   - **Screenshots** si applicable
   - **Environnement** : Navigateur, OS

---

## 💡 Proposer une Fonctionnalité

### Via GitHub Issues

1. Template "Feature Request"
2. Décrivez:
   - **Problème** : Quel besoin ?
   - **Solution** : Votre idée
   - **Alternatives** : Avez-vous considéré autre chose ?
   - **Impact** : Qui bénéficie ?

---

## 📞 Communication

### Channels

- **Discord/Slack** : Questions rapides
- **GitHub Issues** : Bugs, features
- **Pull Requests** : Code review
- **Daily Standup** : Sync quotidien (15 min)

### Daily Standup

Chaque jour, partagez:
1. ✅ **Hier** : Ce que j'ai terminé
2. 🎯 **Aujourd'hui** : Ce que je vais faire
3. 🚧 **Bloqueurs** : Mes obstacles

---

## 🎓 Ressources

### Documentation Projet
- [Architecture](./ARCHITECTURE.md)
- [Conventions](./CONVENTIONS.md)
- [Git Workflow](./GIT_WORKFLOW.md)
- [Composants](./COMPONENTS.md)

### Liens Externes
- [React Docs](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev/)

---

## ❓ Questions Fréquentes

### "Ma branche a des conflits avec develop"

```bash
git checkout develop
git pull
git checkout ma-branche
git merge develop
# Résolvez conflits dans l'éditeur
git add .
git commit -m "merge: resolve conflicts with develop"
git push
```

### "J'ai oublié de pull avant de commencer"

```bash
git stash              # Sauvegarde temporaire
git checkout develop
git pull
git checkout ma-branche
git rebase develop     # Ou: git merge develop
git stash pop          # Récupère vos changements
```

### "J'ai commit sur develop par erreur"

```bash
# NE PAS PUSH !
git reset HEAD~1       # Annule dernier commit (garde changements)
git checkout -b feature/ma-correction
git add .
git commit -m "feat: mon changement"
```

---

## ✨ Merci !

Votre contribution rend NIRD-Crash meilleur pour tous. En cas de doute, n'hésitez pas à demander de l'aide ! 🚀

*Mis à jour le 4 décembre 2025*
