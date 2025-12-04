import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useGameStore from './store/gameStore';
import Header from './components/ui/Header';
import LevelSelector from './components/ui/LevelSelector';
import Game from './components/game/Game';
import levelsData from './data/levels.json';
import badgesData from './data/badges.json';
import './styles/animations.css';
import './App.css';

function App() {
  const [showLevelSelector, setShowLevelSelector] = useState(true);
  const [currentLevelData, setCurrentLevelData] = useState(null);
  
  const {
    currentLevel,
    setCurrentLevel,
    completeLevel,
    checkBadges,
    totalScore
  } = useGameStore();
  
  useEffect(() => {
    // Check for unlocked badges on mount and when relevant state changes
    checkBadges(badgesData.badges);
  }, [totalScore]);
  
  const handleSelectLevel = (levelId) => {
    const level = levelsData.levels.find(l => l.id === levelId);
    if (level) {
      setCurrentLevel(levelId);
      setCurrentLevelData(level);
      setShowLevelSelector(false);
    }
  };
  
  const handleLevelComplete = (stats) => {
    completeLevel(currentLevel, stats);
    checkBadges(badgesData.badges);
    setShowLevelSelector(true);
    setCurrentLevelData(null);
  };
  
  const handleBackToMenu = () => {
    setShowLevelSelector(true);
    setCurrentLevelData(null);
  };
  
  return (
    <div className="app">
      <Toaster position="top-center" />
      
      <Header 
        onMenuClick={() => setShowLevelSelector(true)}
        currentLevel={currentLevelData?.id}
        totalScore={totalScore}
      />
      
      {showLevelSelector && (
        <LevelSelector
          levels={levelsData.levels}
          onSelectLevel={handleSelectLevel}
          onClose={() => currentLevelData && setShowLevelSelector(false)}
        />
      )}
      
      {currentLevelData && !showLevelSelector && (
        <Game
          levelData={currentLevelData}
          onLevelComplete={handleLevelComplete}
          onBackToMenu={handleBackToMenu}
        />
      )}
      
      {!showLevelSelector && !currentLevelData && (
        <div className="welcome-screen">
          <div className="welcome-content">
            <h1 className="welcome-title">🎯 Bienvenue sur NIRD Crash!</h1>
            <p className="welcome-description">
              Un jeu éducatif pour découvrir les valeurs du NIRD à travers des mots, des énigmes et des défis !
            </p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowLevelSelector(true)}
            >
              Commencer à jouer 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
