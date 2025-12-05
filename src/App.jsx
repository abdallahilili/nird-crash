import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import useGameStore from './store/gameStore';
import Header from './components/ui/Header';
import WelcomePage from './components/pages/WelcomePage';
import LevelSelector from './components/ui/LevelSelector';
import Game from './components/game/Game';
import levelsData from './data/levels.json';
import badgesData from './data/badges.json';
import './styles/animations.css';
import './App.css';

function App() {
  // États de navigation
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' | 'levels' | 'game'
  const [currentLevelData, setCurrentLevelData] = useState(null);
  
  const {
    currentLevel,
    setCurrentLevel,
    completeLevel,
    checkBadges,
    totalScore
  } = useGameStore();
  
  useEffect(() => {
    // Vérifie les badges au montage et lors des changements de score
    checkBadges(badgesData.badges);
  }, [totalScore, checkBadges]);
  
  // Navigation vers le sélecteur de niveaux
  const handleStartGame = () => {
    setCurrentView('levels');
  };
  
  // Sélection d'un niveau
  const handleSelectLevel = (levelId) => {
    const level = levelsData.levels.find(l => l.id === levelId);
    if (level) {
      setCurrentLevel(levelId);
      setCurrentLevelData(level);
      setCurrentView('game');
    }
  };
  
  // Niveau complété
  const handleLevelComplete = (stats) => {
    completeLevel(currentLevel, stats);
    checkBadges(badgesData.badges);
    setCurrentView('levels');
    setCurrentLevelData(null);
  };
  
  // Retour au menu
  const handleBackToMenu = () => {
    setCurrentView('levels');
    setCurrentLevelData(null);
  };
  
  // Retour à l'accueil
  const handleBackToHome = () => {
    setCurrentView('welcome');
    setCurrentLevelData(null);
  };
  
  return (
    <div className="app">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)',
          },
        }}
      />
      
      {/* Header - visible partout sauf sur la page d'accueil */}
      {currentView !== 'welcome' && (
        <Header 
          onMenuClick={handleBackToHome}
          currentLevel={currentLevelData?.id}
          totalScore={totalScore}
        />
      )}
      
      {/* Navigation entre les vues */}
      <AnimatePresence mode="wait">
        {currentView === 'welcome' && (
          <WelcomePage 
            key="welcome"
            onStartGame={handleStartGame}
          />
        )}
        
        {currentView === 'levels' && (
          <LevelSelector
            key="levels"
            levels={levelsData.levels}
            onSelectLevel={handleSelectLevel}
            onClose={handleBackToHome}
          />
        )}
        
        {currentView === 'game' && currentLevelData && (
          <Game
            key={`game-${currentLevelData.id}`}
            levelData={currentLevelData}
            onLevelComplete={handleLevelComplete}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
