import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Player Progress
      currentLevel: 1,
      unlockedLevels: [1],
      completedLevels: [],
      totalWordsFound: 0,
      totalScore: 0,
      riddlesSolved: [],
      
      // Current Game State
      foundWords: [],
      currentScore: 0,
      selectedLetters: [],
      currentWord: '',
      stars: 0,
      
      // Badges
      unlockedBadges: [],
      
      // Level Stats
      levelStats: {}, // { levelId: { wordsFound: [], score: 0, stars: 0, riddleSolved: false } }
      
      // Actions
      setCurrentLevel: (level) => {
        if (typeof level === 'number' && level > 0) {
          set({ currentLevel: level });
        }
      },
      
      unlockLevel: (levelId) => {
        if (typeof levelId !== 'number' || levelId <= 0) return;
        
        set((state) => {
          if (state.unlockedLevels.includes(levelId)) {
            return state; // Déjà débloqué
          }
          return {
            unlockedLevels: [...state.unlockedLevels, levelId].sort((a, b) => a - b)
          };
        });
      },
      
      completeLevel: (levelId, stats) => {
        if (!stats || typeof levelId !== 'number') return;
        
        set((state) => {
          // Vérifie si déjà complété
          if (state.completedLevels.includes(levelId)) {
            // Met à jour les stats si meilleur score
            const existingStats = state.levelStats[levelId];
            if (existingStats && stats.score > existingStats.score) {
              return {
                levelStats: {
                  ...state.levelStats,
                  [levelId]: stats
                },
                totalScore: state.totalScore - existingStats.score + stats.score
              };
            }
            return state;
          }
          
          const newCompletedLevels = [...state.completedLevels, levelId].sort((a, b) => a - b);
          const nextLevel = levelId + 1;
          
          // Met à jour les stats du niveau
          const newLevelStats = {
            ...state.levelStats,
            [levelId]: {
              ...stats,
              wordsFound: Array.isArray(stats.wordsFound) ? stats.wordsFound : []
            }
          };
          
          // Débloque le niveau suivant
          const newUnlockedLevels = [...state.unlockedLevels];
          if (nextLevel <= 12 && !newUnlockedLevels.includes(nextLevel)) {
            newUnlockedLevels.push(nextLevel);
            newUnlockedLevels.sort((a, b) => a - b);
          }
          
          return {
            completedLevels: newCompletedLevels,
            unlockedLevels: newUnlockedLevels,
            levelStats: newLevelStats,
            totalScore: state.totalScore + (stats.score || 0)
          };
        });
      },
      
      addFoundWord: (word, points) => {
        if (!word || typeof word !== 'string' || typeof points !== 'number') return;
        
        const normalizedWord = word.toUpperCase().trim();
        if (!normalizedWord) return;
        
        set((state) => {
          // Vérifie si le mot n'est pas déjà trouvé
          if (state.foundWords.includes(normalizedWord)) {
            return state;
          }
          
          return {
            foundWords: [...state.foundWords, normalizedWord],
            currentScore: state.currentScore + (points || 0),
            totalWordsFound: state.totalWordsFound + 1
          };
        });
      },
      
      solveRiddle: (levelId) => {
        if (typeof levelId !== 'number' || levelId <= 0) return;
        
        set((state) => {
          if (state.riddlesSolved.includes(levelId)) {
            return state; // Déjà résolu
          }
          return {
            riddlesSolved: [...state.riddlesSolved, levelId].sort((a, b) => a - b)
          };
        });
      },
      
      unlockBadge: (badgeId) => {
        if (!badgeId) return;
        
        set((state) => {
          if (state.unlockedBadges.includes(badgeId)) {
            return state; // Déjà débloqué
          }
          return {
            unlockedBadges: [...state.unlockedBadges, badgeId]
          };
        });
      },
      
      selectLetter: (letter, position) => {
        if (!letter || typeof letter !== 'string') return;
        
        set((state) => ({
          selectedLetters: [...state.selectedLetters, { letter, position }],
          currentWord: state.currentWord + letter
        }));
      },
      
      clearSelection: () => set({
        selectedLetters: [],
        currentWord: ''
      }),
      
      resetLevel: () => set({
        foundWords: [],
        currentScore: 0,
        selectedLetters: [],
        currentWord: '',
        stars: 0
      }),
      
      calculateStars: (wordsFound, totalWords) => {
        if (typeof wordsFound !== 'number' || typeof totalWords !== 'number' || totalWords === 0) {
          return 0;
        }
        
        const percentage = (wordsFound / totalWords) * 100;
        if (percentage >= 100) return 3;
        if (percentage >= 75) return 2;
        if (percentage >= 50) return 1;
        return 0;
      },
      
      // Vérifie les badges - optimisé
      checkBadges: (badges) => {
        if (!Array.isArray(badges)) return;
        
        const state = get();
        const newBadges = [];
        
        badges.forEach(badge => {
          if (!badge || !badge.id || !badge.requirement) return;
          if (state.unlockedBadges.includes(badge.id)) return;
          
          let unlocked = false;
          const { type, count } = badge.requirement;
          
          switch (type) {
            case 'words_found_total':
              unlocked = state.totalWordsFound >= count;
              break;
            case 'levels_completed':
              unlocked = state.completedLevels.length >= count;
              break;
            case 'riddles_solved':
              unlocked = state.riddlesSolved.length >= count;
              break;
            case 'perfect_levels':
              const perfectLevels = Object.values(state.levelStats).filter(
                stat => stat && stat.stars === 3
              );
              unlocked = perfectLevels.length >= count;
              break;
            case 'themes_completed':
              // Nécessite les données de thème des niveaux
              break;
            default:
              break;
          }
          
          if (unlocked) {
            newBadges.push(badge.id);
          }
        });
        
        // Débloque tous les nouveaux badges en une seule fois
        if (newBadges.length > 0) {
          set((state) => ({
            unlockedBadges: [...new Set([...state.unlockedBadges, ...newBadges])]
          }));
        }
      }
    }),
    {
      name: 'nird-game-storage',
      partialize: (state) => ({
        // Ne persiste que les données importantes, pas l'état de jeu actuel
        currentLevel: state.currentLevel,
        unlockedLevels: state.unlockedLevels,
        completedLevels: state.completedLevels,
        totalWordsFound: state.totalWordsFound,
        totalScore: state.totalScore,
        riddlesSolved: state.riddlesSolved,
        unlockedBadges: state.unlockedBadges,
        levelStats: state.levelStats
      })
    }
  )
);

export default useGameStore;

