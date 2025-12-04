# Git Workflow - NIRD-Crash

## 🌳 Structure des Branches

```
main (production)
  └── develop (développement)
       ├── feature/member1-task
       ├── feature/member2-task
       ├── bugfix/member3-fix
       └── refactor/member4-improvement
```

### Branches Principales

| Branche | Description | Protégée |
|---------|-------------|----------|
| `main` | Code production-ready | ✅ Oui |
| `develop` | Intégration des features | ✅ Oui |

### Branches de Travail

| Type | Préfixe | Exemple | Utilisation |
|------|---------|---------|-------------|
| Feature | `feature/` | `feature/john-modal` | Nouvelle fonctionnalité |
| Bugfix | `bugfix/` | `bugfix/marie-grid-bug` | Correction bug |
| Hotfix | `hotfix/` | `hotfix/critical-crash` | Urgent production |
| Refactor | `refactor/` | `refactor/paul-hooks` | Refactoring |

---

## 🔄 Workflow Quotidien

### 1. Démarrer une Nouvelle Tâche

```bash
# A. Basculer sur develop
git checkout develop

# B. Synchroniser avec le remote
git pull origin develop

# C. Créer votre branche feature
git checkout -b feature/VOTRENOM-description

# Exemple:
git checkout -b feature/john-level-complete-modal
```

**Naming de branche:**
```
feature/[nom]-[description-courte]
       ↓           ↓
     john    level-modal
```

### 2. Développer

#### Workflow de Commit

```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter les fichiers
git add src/components/ui/LevelModal.jsx
git add src/components/ui/LevelModal.css

# 3. Commit avec message conventionnel
git commit -m "feat(modal): add level complete animation"

# 4. Push régulièrement (backup)
git push origin feature/john-level-modal
```

#### Commits Fréquents

**Bon exemple (commits atomiques) :**
```bash
git commit -m "feat(modal): create LevelCompleteModal component"
git commit -m "style(modal): add CSS animations"
git commit -m "feat(modal): integrate confetti effect"
git commit -m "test(modal): add basic tests"
```

**Mauvais exemple (tout en un) :**
```bash
git commit -m "add modal and fix bugs and change css"  # ❌
```

### 3. Synchronisation avec Develop

**Cas 1 : Develop a avancé pendant votre travail**

```bash
# A. Sauvegarder votre travail en cours (optionnel)
git stash

# B. Basculer sur develop et pull
git checkout develop
git pull origin develop

# C. Retour sur votre branche
git checkout feature/john-level-modal

# D. Récupérer votre travail (si stash)
git stash pop

# E. Merger develop dans votre branche
git merge develop

# F. Résoudre conflits si nécessaire
# Éditer fichiers en conflit
git add fichiers-resolus
git commit -m "merge: resolve conflicts with develop"

# G. Push
git push origin feature/john-level-modal
```

**Cas 2 : Rebase (plus propre, mais avancé)**

```bash
git fetch origin
git rebase origin/develop

# Si conflits:
# 1. Résoudre
# 2. git add fichiers
# 3. git rebase --continue
```

---

## 📤 Pull Requests (PR)

### Créer une PR

1. **Pushez votre branche** sur GitHub
   ```bash
   git push origin feature/john-level-modal
   ```

2. **Sur GitHub:**
   - Allez dans "Pull requests"
   - Cliquez "New pull request"
   - Base: `develop` ← Compare: `feature/john-level-modal`

3. **Remplissez le template:**
   ```markdown
   ## Description
   Ajout du modal de fin de niveau avec animations de confettis
   
   ## Type
   - [x] Feature
   - [ ] Bugfix
   
   ## Tests
   - [x] Testé manuellement
   - [x] Lint passe
   - [ ] Tests unitaires ajoutés
   
   ## Screenshots
   [Capture d'écran du modal]
   ```

4. **Assignez des reviewers** (au moins 1 personne)

5. **Attendez l'approbation**

### Processus de Review

**Pour le créateur de la PR:**
- Répondez aux commentaires
- Faites les modifications demandées
- Pushez les corrections (la PR se met à jour auto)

**Pour le reviewer:**
- Regardez le code attentivement
- Testez localement si possible:
  ```bash
  git fetch origin
  git checkout feature/john-level-modal
  npm run dev
  ```
- Commentez de manière constructive
- Approuvez ou demandez des changements

### Merger la PR

**Après approbation:**
1. ✅ Un reviewer approve
2. ✅ Tous les checks passent (CI/CD)
3. ✅ Pas de conflits
4. **Merge** (préférence: "Squash and merge" pour garder history propre)

**Après merge:**
```bash
# Retour sur develop
git checkout develop
git pull origin develop

# Supprimer votre branche locale (optionnel)
git branch -d feature/john-level-modal

# La branche remote sera auto-supprimée par GitHub
```

---

## 🚨 Gestion des Conflits

### Comprendre un Conflit

```
<<<<<<< HEAD (votre code)
const MAX_COMBO = 5;
=======
const MAX_COMBO_TIME = 5000;
>>>>>>> develop (code de develop)
```

### Résoudre

```javascript
// 1. Choisir une version OU combiner
const MAX_COMBO = 5;
const MAX_COMBO_TIME = 5000;

// 2. Supprimer les marqueurs
// (enlever <<<<<<, =======, >>>>>>>)

// 3. Sauvegarder le fichier

// 4. Marquer comme résolu
git add fichier-avec-conflit.js

// 5. Continuer le merge
git commit -m "merge: resolve conflicts with develop"
```

---

## 🔥 Hotfix (Correction Urgente)

**Cas d'usage:** Bug critique en production

```bash
# 1. Partir de main
git checkout main
git pull origin main

# 2. Créer branche hotfix
git checkout -b hotfix/critical-game-crash

# 3. Corriger le bug
# ...modifications...

# 4. Commit et push
git add .
git commit -m "fix(game): prevent crash on word validation"
git push origin hotfix/critical-game-crash

# 5. PR vers main (urgent!)
# 6. Après merge sur main, merger aussi dans develop
git checkout develop
git merge main
git push origin develop
```

---

## 📊 Releases

### Workflow de Release

```bash
# 1. Créer branche release depuis develop
git checkout develop
git pull
git checkout -b release/v1.2.0

# 2. Bumper version dans package.json
# "version": "1.2.0"

# 3. Update CHANGELOG.md

# 4. Commit
git commit -am "chore(release): bump version to 1.2.0"

# 5. Merger dans main
# PR: release/v1.2.0 → main

# 6. Tag
git checkout main
git pull
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# 7. Merger dans develop
git checkout develop
git merge main
git push
```

---

## 🛠️ Commandes Utiles

### Informations

```bash
# Voir status
git status

# Voir historique
git log --oneline --graph

# Voir différences
git diff

# Voir branches
git branch -a
```

### Annulation

```bash
# Annuler dernier commit (garde modifications)
git reset HEAD~1

# Annuler dernier commit (supprime modifications) ⚠️
git reset --hard HEAD~1

# Annuler modifications d'un fichier
git checkout -- fichier.js

# Annuler push (DANGEREUX, coordonner avec équipe)
git revert <commit-hash>
git push
```

### Nettoyage

```bash
# Supprimer branches locales mergées
git branch --merged | grep -v "main\|develop" | xargs git branch -d

# Supprimer branche remote
git push origin --delete feature/ancienne-branche
```

---

## 🎯 Best Practices

### DO ✅

1. **Pull avant de travailler**
   ```bash
   git checkout develop && git pull
   ```

2. **Commits atomiques et fréquents**
   - 1 commit = 1 changement logique

3. **Messages descriptifs**
   ```bash
   feat(modal): add confetti animation on level complete
   ```

4. **Tester avant de push**
   ```bash
   npm run lint
   npm run dev  # Test manuel
   ```

5. **Garder branches à jour**
   ```bash
   git merge develop  # Régulièrement
   ```

### DON'T ❌

1. **Ne jamais push sur main/develop directement**
   - Toujours passer par PR

2. **Ne pas commettre avec conflits non résolus**
   ```bash
   # Vérifier qu'il n'y a pas de <<<<<<< dans le code
   ```

3. **Ne pas laisser branches pourrir**
   - Max 3-4 jours sans merge

4. **Ne pas committer node_modules ou .env**
   ```bash
   # Vérifier .gitignore
   ```

5. **Ne pas force push sur branche partagée** ⚠️
   ```bash
   git push --force  # Seulement sur VOS branches
   ```

---

## 📋 Checklist PR

Avant de créer une PR, vérifiez:

- [ ] Code lint passe : `npm run lint`
- [ ] Pas de `console.log()` oubliés
- [ ] Pas de fichiers sensibles (.env, etc.)
- [ ] Tests manuels effectués
- [ ] Documentation mise à jour si nécessaire
- [ ] Commits bien nommés
- [ ] Branche à jour avec develop
- [ ] Screenshots ajoutés si changement UI

---

## ❓ FAQ

**Q: J'ai oublié de créer une branche, j'ai modifié sur develop**

```bash
git stash
git checkout -b feature/ma-correction
git stash pop
git add .
git commit -m "feat: ma fonctionnalité"
```

**Q: Ma PR a trop de commits, comment nettoyer ?**

```bash
# Avant de merger, squash interactif
git rebase -i develop

# Marquer commits à squasher (s)
# Éditer message final
# Force push (OK sur votre branche)
git push --force origin ma-branche
```

**Q: J'ai commit sur la mauvaise branche**

```bash
# Copier le hash du commit
git log

# Revenir en arrière
git reset HEAD~1

# Basculer sur bonne branche et cherry-pick
git checkout bonne-branche
git cherry-pick <hash-du-commit>
```

---

**Bon Git ! 🚀**

*Mis à jour le 4 décembre 2025*
