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
      setCurrentLevel: (level) => set({ currentLevel: level }),
      
      unlockLevel: (levelId) => set((state) => ({
        unlockedLevels: [...new Set([...state.unlockedLevels, levelId])]
      })),
      
      completeLevel: (levelId, stats) => set((state) => {
        const newCompletedLevels = [...new Set([...state.completedLevels, levelId])];
        const nextLevel = levelId + 1;
        
        // Update level stats
        const newLevelStats = {
          ...state.levelStats,
          [levelId]: stats
        };
        
        // Unlock next level
        const newUnlockedLevels = nextLevel <= 12 
          ? [...new Set([...state.unlockedLevels, nextLevel])]
          : state.unlockedLevels;
        
        return {
          completedLevels: newCompletedLevels,
          unlockedLevels: newUnlockedLevels,
          levelStats: newLevelStats,
          totalScore: state.totalScore + stats.score
        };
      }),
      
      addFoundWord: (word, points) => set((state) => ({
        foundWords: [...state.foundWords, word],
        currentScore: state.currentScore + points,
        totalWordsFound: state.totalWordsFound + 1
      })),
      
      solveRiddle: (levelId) => set((state) => ({
        riddlesSolved: [...new Set([...state.riddlesSolved, levelId])]
      })),
      
      unlockBadge: (badgeId) => set((state) => ({
        unlockedBadges: [...new Set([...state.unlockedBadges, badgeId])]
      })),
      
      selectLetter: (letter, position) => set((state) => ({
        selectedLetters: [...state.selectedLetters, { letter, position }],
        currentWord: state.currentWord + letter
      })),
      
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
        const percentage = (wordsFound / totalWords) * 100;
        if (percentage >= 100) return 3;
        if (percentage >= 75) return 2;
        if (percentage >= 50) return 1;
        return 0;
      },
      
      // Check badge requirements
      checkBadges: (badges) => {
        const state = get();
        badges.forEach(badge => {
          if (state.unlockedBadges.includes(badge.id)) return;
          
          let unlocked = false;
          switch (badge.requirement.type) {
            case 'words_found_total':
              unlocked = state.totalWordsFound >= badge.requirement.count;
              break;
            case 'levels_completed':
              unlocked = state.completedLevels.length >= badge.requirement.count;
              break;
            case 'riddles_solved':
              unlocked = state.riddlesSolved.length >= badge.requirement.count;
              break;
            case 'perfect_levels':
              const perfectLevels = Object.values(state.levelStats).filter(stat => stat.stars === 3);
              unlocked = perfectLevels.length >= badge.requirement.count;
              break;
            case 'themes_completed':
              // This would need level theme data to check
              break;
          }
          
          if (unlocked) {
            get().unlockBadge(badge.id);
          }
        });
      }
    }),
    {
      name: 'nird-game-storage',
    }
  )
);

export default useGameStore;
