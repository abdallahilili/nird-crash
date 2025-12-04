import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import useGameStore from '../../store/gameStore';
import LetterGrid from './LetterGrid';
import WordList from './WordList';
import PopupInfo from '../ui/PopupInfo';
import RewardBar from '../ui/RewardBar';
import ParticleSystem from '../effects/ParticleSystem';
import FloatingPoints from '../effects/FloatingPoints';
import messagesData from '../../data/messages.json';
import './Game.css';

const Game = ({ levelData, onLevelComplete, onBackToMenu }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentWordData, setCurrentWordData] = useState(null);
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleSolved, setRiddleSolved] = useState(false);
  
  // Combo system
  const [combo, setCombo] = useState(0);
  const [lastWordTime, setLastWordTime] = useState(null);
  const lastWordTimeRef = useRef(null);
  
  // Particle system
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  
  // Floating points
  const [floatingPoints, setFloatingPoints] = useState([]);
  const floatingPointsIdRef = useRef(0);
  
  const {
    foundWords,
    currentScore,
    addFoundWord,
    solveRiddle,
    riddlesSolved,
    calculateStars,
    resetLevel
  } = useGameStore();
  
  const stars = calculateStars(foundWords.length, levelData.words.length);
  
  useEffect(() => {
    // Reset level state when level changes
    resetLevel();
    setRiddleSolved(riddlesSolved.includes(levelData.id));
    setCombo(0);
    setLastWordTime(null);
    lastWordTimeRef.current = null;
  }, [levelData.id]);
  
  // Combo timer - reset combo after 5 seconds of inactivity
  useEffect(() => {
    if (lastWordTime) {
      const timer = setTimeout(() => {
        if (Date.now() - lastWordTime > 5000) {
          setCombo(0);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastWordTime]);
  
  // Helper to show floating points
  const showFloatingPointsEffect = (points, comboMultiplier, position) => {
    const id = floatingPointsIdRef.current++;
    const newFloatingPoint = {
      id,
      points,
      position,
      isCombo: comboMultiplier > 1,
      comboMultiplier,
    };
    
    setFloatingPoints(prev => [...prev, newFloatingPoint]);
    
    // Remove after animation
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(fp => fp.id !== id));
    }, 2500);
  };
  
  const handleWordFormed = (word, position) => {
    const normalizedWord = word.toUpperCase().trim();
    
    // Check if word already found
    if (foundWords.includes(normalizedWord)) {
      toast('Vous avez déjà trouvé ce mot ! 🔄', {
        icon: '⚠️',
        style: {
          background: '#FFD93D',
          color: '#2C3E50',
        }
      });
      return { success: false };
    }
    
    // Find the word in level words
    const wordData = levelData.words.find(w => w.word === normalizedWord);
    
    if (wordData) {
      // Calculate combo
      const now = Date.now();
      let currentCombo = 1;
      
      if (lastWordTimeRef.current && now - lastWordTimeRef.current < 5000) {
        currentCombo = combo + 1;
        setCombo(currentCombo);
      } else {
        setCombo(1);
      }
      
      setLastWordTime(now);
      lastWordTimeRef.current = now;
      
      // Calculate position for effects (center of screen if not provided)
      const effectPosition = position || {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      
      // Show particles
      setParticlePosition(effectPosition);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 100);
      
      // Show floating points with combo multiplier
      showFloatingPointsEffect(wordData.points, currentCombo, effectPosition);
      
      // Valid word found!
      addFoundWord(normalizedWord, wordData.points * currentCombo);
      setCurrentWordData(wordData);
      setShowPopup(true);
      
      // Show motivational message with combo info
      const randomMessage = messagesData.messages[
        Math.floor(Math.random() * messagesData.messages.length)
      ];
      
      const comboMessage = currentCombo > 1 ? ` 🔥 COMBO x${currentCombo}!` : '';
      
      toast.success(randomMessage + comboMessage, {
        duration: 2000,
        style: {
          background: currentCombo > 1 
            ? 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)'
            : 'linear-gradient(135deg, #6BCF7F 0%, #A8E6CF 100%)',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
      
      // Check if level is complete
      if (foundWords.length + 1 >= levelData.requiredWords) {
        setTimeout(() => {
          handleLevelComplete();
        }, 2000);
      }
      
      return { success: true, combo: currentCombo };
    } else {
      // Invalid word - shake animation will be handled by LetterGrid
      toast.error('Ce mot n\'est pas dans la liste ! 😕', {
        duration: 1500,
      });
      return { success: false };
    }
  };
  
  const handleLevelComplete = () => {
    const finalStars = calculateStars(foundWords.length, levelData.words.length);
    
    toast.success(`🎉 Niveau complété avec ${finalStars} étoile${finalStars > 1 ? 's' : ''} !`, {
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
        color: '#fff',
        fontSize: '1.1rem',
        fontWeight: 'bold',
      }
    });
    
    setTimeout(() => {
      onLevelComplete({
        score: currentScore,
        wordsFound: foundWords,
        stars: finalStars,
        riddleSolved: riddleSolved
      });
    }, 3000);
  };
  
  const handleRiddleSubmit = () => {
    const normalizedAnswer = riddleAnswer.toUpperCase().trim();
    const correctAnswer = levelData.riddleAnswer.toUpperCase().trim();
    
    if (normalizedAnswer === correctAnswer) {
      setRiddleSolved(true);
      solveRiddle(levelData.id);
      setShowRiddleModal(false);
      toast.success('🎯 Bravo ! Énigme résolue ! +50 points bonus !', {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #9B59B6 0%, #E91E63 100%)',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
      addFoundWord('BONUS_RIDDLE', 50);
    } else {
      toast.error('Pas tout à fait... Réessayez ! 🤔', {
        duration: 2000,
      });
    }
  };
  
  return (
    <div 
      className="game-container"
      style={{ 
        background: `linear-gradient(135deg, ${levelData.backgroundColor}22 0%, ${levelData.backgroundColor}44 100%)`
      }}
    >
      <Toaster position="top-center" />
      
      <div className="game-content container">
        <div className="game-header-section">
          <button className="btn btn-secondary back-btn" onClick={onBackToMenu}>
            ← Retour
          </button>
          
          <div className="level-info">
            <motion.h1 
              className="level-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {levelData.title}
            </motion.h1>
            <motion.p 
              className="level-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {levelData.description}
            </motion.p>
            
            <motion.div 
              className="level-story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              📖 {levelData.story}
            </motion.div>
          </div>
          
          <button 
            className={`btn riddle-btn ${riddleSolved ? 'solved' : ''}`}
            onClick={() => setShowRiddleModal(true)}
            disabled={riddleSolved}
          >
            {riddleSolved ? '✓ Énigme résolue' : '🧩 Énigme'}
          </button>
        </div>
        
        <RewardBar 
          currentScore={currentScore}
          targetScore={levelData.targetScore}
          stars={stars}
        />
        
        <div className="game-main">
          <div className="game-left">
            <WordList 
              levelWords={levelData.words}
              foundWords={foundWords}
            />
          </div>
          
          <div className="game-center">
            <LetterGrid 
              gridLetters={levelData.gridLetters}
              onWordFormed={handleWordFormed}
            />
          </div>
        </div>
      </div>
      
      {/* Popup Info */}
      <AnimatePresence>
        {showPopup && currentWordData && (
          <PopupInfo
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            wordData={currentWordData}
            levelTheme={levelData.theme}
          />
        )}
      </AnimatePresence>
      
      {/* Particle System */}
      <ParticleSystem
        active={showParticles}
        position={particlePosition}
        type="confetti"
        count={combo > 2 ? 50 : 30}
        colors={['#FFD93D', '#4CAF50', '#2563EB', '#FF6B6B', '#9B59B6']}
        duration={2000}
      />
      
      {/* Floating Points */}
      {floatingPoints.map(fp => (
        <FloatingPoints
          key={fp.id}
          points={fp.points}
          position={fp.position}
          isVisible={true}
          isCombo={fp.isCombo}
          comboMultiplier={fp.comboMultiplier}
          onComplete={() => {}}
        />
      ))}
      
      {/* Riddle Modal */}
      <AnimatePresence>
        {showRiddleModal && !riddleSolved && (
          <motion.div 
            className="riddle-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRiddleModal(false)}
          >
            <motion.div 
              className="riddle-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🧩 Énigme du niveau</h3>
              <p className="riddle-text">{levelData.riddle}</p>
              
              <input
                type="text"
                className="riddle-input"
                placeholder="Votre réponse..."
                value={riddleAnswer}
                onChange={(e) => setRiddleAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRiddleSubmit()}
              />
              
              <div className="riddle-actions">
                <button className="btn btn-secondary" onClick={() => setShowRiddleModal(false)}>
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={handleRiddleSubmit}>
                  Valider
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
