import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import useGameStore from '../../store/gameStore';
import LetterGrid from './LetterGrid';
import WordList from './WordList';
import QuestionCard from './QuestionCard';
import LetterQuizCard from './LetterQuizCard';
import PopupInfo from '../ui/PopupInfo';
import RewardBar from '../ui/RewardBar';
import ParticleSystem from '../effects/ParticleSystem';
import FloatingPoints from '../effects/FloatingPoints';
import messagesData from '../../data/messages.json';
import questionsData from '../../data/questions.json';
import quizQuestionsData from '../../data/quizQuestions.json';
import letterQuizQuestionsData from '../../data/letterQuizQuestions.json';
import Director from '../Director';
import Mentor from '../Mentor';
import './Game.css';

const Game = ({ levelData, onLevelComplete, onBackToMenu }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentWordData, setCurrentWordData] = useState(null);
  const [directorEmotion, setDirectorEmotion] = useState('thinking');
  const [directorReaction, setDirectorReaction] = useState(null);
  const [showMentor, setShowMentor] = useState(false);
  const [mentorMessage, setMentorMessage] = useState('');
  const [mentorEmotion, setMentorEmotion] = useState('happy');
  
  // Système de questions vrai/faux et à compléter
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  
  // Système de questions avec lettres intermittentes
  const [currentLetterQuiz, setCurrentLetterQuiz] = useState(null);
  const [showNextQuizButton, setShowNextQuizButton] = useState(false);
  
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
    calculateStars,
    resetLevel
  } = useGameStore();
  
  const stars = calculateStars(foundWords.length, levelData.words.length);
  
  // Fonction pour charger une nouvelle question aléatoire
  const loadNewQuestion = useCallback(() => {
    // Charge TOUTES les questions (pas seulement celles du niveau)
    const allLetterQuestions = letterQuizQuestionsData.questions;
    const allCompletionQuestions = quizQuestionsData.questions;
    
    // Mélange aléatoire : 50% de chance d'avoir une question avec lettres, 50% une question à compléter
    const useLetterQuiz = Math.random() < 0.5 && allLetterQuestions.length > 0;
    
    if (useLetterQuiz && allLetterQuestions.length > 0) {
      const randomLetterQuestion = allLetterQuestions[Math.floor(Math.random() * allLetterQuestions.length)];
      setCurrentLetterQuiz(randomLetterQuestion);
      setCurrentQuizQuestion(null);
    } else if (allCompletionQuestions.length > 0) {
      const randomQuestion = allCompletionQuestions[Math.floor(Math.random() * allCompletionQuestions.length)];
      setCurrentQuizQuestion(randomQuestion);
      setCurrentLetterQuiz(null);
    } else {
      setCurrentQuizQuestion(null);
      setCurrentLetterQuiz(null);
    }
    
    setSelectedAnswer(null);
    setIsQuestionAnswered(false);
    setShowQuestionResult(false);
    setShowNextQuizButton(false);
  }, []);

  useEffect(() => {
    // Reset level state when level changes
    resetLevel();
    setCombo(0);
    setLastWordTime(null);
    lastWordTimeRef.current = null;
    
    // Charge une question aléatoire
    loadNewQuestion();
  }, [levelData.id, resetLevel, loadNewQuestion]);

  // Affiche le bouton "Quiz suivant" après qu'une question soit répondue
  useEffect(() => {
    if (isQuestionAnswered) {
      const timer = setTimeout(() => {
        setShowNextQuizButton(true);
      }, 2000); // Affiche après 2 secondes
      return () => clearTimeout(timer);
    }
  }, [isQuestionAnswered]);
  
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
  
  // Helper to show floating points - optimisé avec useCallback
  const showFloatingPointsEffect = useCallback((points, comboMultiplier, position) => {
    const id = floatingPointsIdRef.current++;
    const newFloatingPoint = {
      id,
      points,
      position,
      isCombo: comboMultiplier > 1,
      comboMultiplier,
    };
    
    setFloatingPoints(prev => [...prev, newFloatingPoint]);
    
    // Retire après l'animation
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(fp => fp.id !== id));
    }, 2500);
  }, []);
  
  const handleLevelComplete = useCallback(() => {
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
        riddleSolved: false
      });
    }, 3000);
  }, [foundWords.length, levelData.words.length, currentScore, foundWords, calculateStars, onLevelComplete]);

  const handleWordFormed = useCallback((word, position) => {
    const normalizedWord = word.toUpperCase().trim();
    
    // Vérifie si le mot est déjà trouvé
    if (foundWords.includes(normalizedWord)) {
      setDirectorEmotion('thinking');
      setDirectorReaction(null);
      toast('Vous avez déjà trouvé ce mot ! 🔄', {
        icon: '⚠️',
        duration: 1500,
        style: {
          background: '#FFD93D',
          color: '#2C3E50',
        }
      });
      return { success: false };
    }
    
    // Trouve le mot dans la liste des mots du niveau
    const wordData = levelData.words.find(w => w.word === normalizedWord);
    
    if (!wordData) {
      setDirectorReaction('incorrect');
      setDirectorEmotion('sad');
      setMentorEmotion('sad');
      setMentorMessage('😔 Ce mot n\'est pas dans la liste ! Essayez encore.');
      setShowMentor(true);
      setTimeout(() => {
        setDirectorReaction(null);
        setDirectorEmotion('thinking');
        setShowMentor(false);
      }, 3000);
      toast.error('Ce mot n\'est pas dans la liste ! 😕', {
        duration: 1500,
      });
      return { success: false };
    }
    
    // Calcule le combo
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
    
    // Position pour les effets
    const effectPosition = position || {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    
    // Affiche les particules
    setParticlePosition(effectPosition);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 100);
    
    // Affiche les points flottants avec multiplicateur de combo
    showFloatingPointsEffect(wordData.points * currentCombo, currentCombo, effectPosition);
    
    // Vérifie si c'est une réponse à une question
    const levelQuestions = questionsData.questions.filter(q => q.levelId === levelData.id);
    let isCorrectAnswer = null;
    let feedbackMessage = '';
    
    for (const question of levelQuestions) {
      const answer = question.answers.find(a => a.word === normalizedWord);
      if (answer) {
        isCorrectAnswer = answer.isCorrect;
        feedbackMessage = answer.feedback;
        break;
      }
    }
    
    // Mot valide trouvé !
    addFoundWord(normalizedWord, wordData.points * currentCombo);
    setCurrentWordData(wordData);
    setShowPopup(true);
    
    // Réaction du Director selon la réponse
    if (isCorrectAnswer !== null) {
      if (isCorrectAnswer) {
        setDirectorReaction('correct');
        setDirectorEmotion('happy');
        setMentorEmotion('happy');
        setMentorMessage(feedbackMessage || '🎉 Excellente réponse !');
        setShowMentor(true);
        setTimeout(() => {
          setDirectorReaction(null);
          setDirectorEmotion('thinking');
          setShowMentor(false);
        }, 4000);
      } else {
        setDirectorReaction('incorrect');
        setDirectorEmotion('sad');
        setMentorEmotion('sad');
        setMentorMessage(feedbackMessage || '😔 Ce n\'est pas la bonne réponse, mais continuez !');
        setShowMentor(true);
        setTimeout(() => {
          setDirectorReaction(null);
          setDirectorEmotion('thinking');
          setShowMentor(false);
        }, 4000);
      }
    } else {
      // Pas de question associée, réaction normale
      setDirectorEmotion('happy');
      setTimeout(() => setDirectorEmotion('thinking'), 3000);
    }
    
    // Message motivationnel avec info combo
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
    
    // Vérifie si le niveau est complété
    if (foundWords.length + 1 >= levelData.requiredWords) {
      setTimeout(() => {
        handleLevelComplete();
      }, 2000);
    }
    
    return { success: true, combo: currentCombo };
  }, [foundWords, levelData.words, levelData.requiredWords, combo, addFoundWord, showFloatingPointsEffect, handleLevelComplete]);
  

  
  // Gestion de la réponse à la question à compléter
  const handleQuestionAnswer = useCallback((answer) => {
    if (isQuestionAnswered || !currentQuizQuestion) return;
    
    setSelectedAnswer(answer);
    setIsQuestionAnswered(true);
    setShowQuestionResult(true);
    
    const isCorrect = answer === currentQuizQuestion.correctOption;
    
    // Réaction du Director
    if (isCorrect) {
      setDirectorReaction('correct');
      setDirectorEmotion('happy');
      setMentorEmotion('happy');
      setMentorMessage('🎉 Excellente réponse !');
      setShowMentor(true);
      addFoundWord('BONUS_QUESTION', 50);
      setTimeout(() => {
        setDirectorReaction(null);
        setDirectorEmotion('thinking');
        setShowMentor(false);
      }, 4000);
      
      toast.success('✅ Bonne réponse ! +50 points !', {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #6BCF7F 0%, #4CAF50 100%)',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
    } else {
      setDirectorReaction('incorrect');
      setDirectorEmotion('sad');
      setMentorEmotion('sad');
      setMentorMessage('😔 Ce n\'est pas la bonne réponse, mais continuez !');
      setShowMentor(true);
      setTimeout(() => {
        setDirectorReaction(null);
        setDirectorEmotion('thinking');
        setShowMentor(false);
      }, 4000);
      
      toast.error('❌ Mauvaise réponse', {
        duration: 2000,
      });
    }
  }, [currentQuizQuestion, isQuestionAnswered, addFoundWord]);

  // Gestion de la réponse à la question avec lettres intermittentes
  const handleLetterQuizAnswer = useCallback((isCorrect, answer) => {
    if (isQuestionAnswered) return;
    
    setIsQuestionAnswered(true);
    setShowQuestionResult(true);
    
    // Réaction du Director
    if (isCorrect) {
      setDirectorReaction('correct');
      setDirectorEmotion('happy');
      setMentorEmotion('happy');
      setMentorMessage('🎉 Excellente réponse !');
      setShowMentor(true);
      addFoundWord('BONUS_LETTER_QUIZ', 75);
      setTimeout(() => {
        setDirectorReaction(null);
        setDirectorEmotion('thinking');
        setShowMentor(false);
      }, 4000);
      
      toast.success(`✅ Bonne réponse ! ${answer} - +75 points !`, {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #6BCF7F 0%, #4CAF50 100%)',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
    } else {
      setDirectorReaction('incorrect');
      setDirectorEmotion('sad');
      setMentorEmotion('sad');
      setMentorMessage(`La bonne réponse est : ${currentLetterQuiz.correctWord}`);
      setShowMentor(true);
      setTimeout(() => {
        setDirectorReaction(null);
        setDirectorEmotion('thinking');
        setShowMentor(false);
      }, 4000);
      
      toast.error(`❌ Mauvaise réponse. La bonne réponse est : ${currentLetterQuiz.correctWord}`, {
        duration: 3000,
      });
    }
  }, [currentLetterQuiz, isQuestionAnswered, addFoundWord]);

  // Gestion du passage au quiz suivant
  const handleNextQuiz = useCallback(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);
  
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
          </div>
        </div>
        
        <RewardBar 
          currentScore={currentScore}
          targetScore={levelData.targetScore}
          stars={stars}
        />
        
        <div className="game-main">
          <div className="game-left">
            {/* Mentor avec réactions */}
            <Mentor
              message={mentorMessage}
              isVisible={showMentor}
              onClose={() => setShowMentor(false)}
              emotion={mentorEmotion}
              reaction={directorReaction}
            />
            
            {/* WordList contient maintenant le Director SVG animé à la place de la liste de mots */}
            <WordList 
              levelWords={levelData.words}
              foundWords={foundWords}
              levelId={levelData.id}
              directorEmotion={directorEmotion}
              directorReaction={directorReaction}
            />
          </div>
          
          <div className="game-center">
            {/* Question avec lettres intermittentes */}
            {currentLetterQuiz ? (
              <div className="quiz-question-section">
                <LetterQuizCard
                  question={currentLetterQuiz}
                  onAnswer={handleLetterQuizAnswer}
                  isAnswered={isQuestionAnswered}
                  showResult={showQuestionResult}
                />
                {/* Bouton Quiz suivant */}
                <AnimatePresence>
                  {showNextQuizButton && (
                    <motion.button
                      className="btn-next-quiz"
                      onClick={handleNextQuiz}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span>Quiz suivant →</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ) : currentQuizQuestion ? (
              /* Question à compléter basée sur les informations éducatives */
              <div className="quiz-question-section">
                <QuestionCard
                  question={currentQuizQuestion}
                  onAnswer={handleQuestionAnswer}
                  isAnswered={isQuestionAnswered}
                  selectedAnswer={selectedAnswer}
                  showResult={showQuestionResult}
                />
                {/* Bouton Quiz suivant */}
                <AnimatePresence>
                  {showNextQuizButton && (
                    <motion.button
                      className="btn-next-quiz"
                      onClick={handleNextQuiz}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span>Quiz suivant →</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <LetterGrid 
                gridLetters={levelData.gridLetters}
                onWordFormed={handleWordFormed}
              />
            )}
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
      
    </div>
  );
};

export default Game;
