import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, Check, X } from 'lucide-react';
import './LetterQuizCard.css';

const LetterQuizCard = ({ question, onAnswer, isAnswered, showResult }) => {
  if (!question || question.type !== 'letter') return null;

  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const correctWord = question.correctWord.toUpperCase();
  const wordPattern = question.wordPattern.toUpperCase(); // Ex: "L__UX"
  const availableLetters = question.availableLetters.toUpperCase().split('');

  // Crée un tableau avec les positions des lettres manquantes
  const wordArray = wordPattern.split('');
  const missingIndices = [];
  wordArray.forEach((char, index) => {
    if (char === '_') {
      missingIndices.push(index);
    }
  });

  const handleLetterClick = (letter) => {
    if (isAnswered || isValidated) return;
    
    const nextIndex = selectedLetters.length;
    if (nextIndex < missingIndices.length) {
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);
      
      // Construit le mot avec les lettres sélectionnées
      let newAnswer = wordPattern;
      newSelected.forEach((selectedLetter, idx) => {
        const pos = missingIndices[idx];
        newAnswer = newAnswer.substring(0, pos) + selectedLetter + newAnswer.substring(pos + 1);
      });
      setCurrentAnswer(newAnswer);
    }
  };

  const handleRemoveLetter = (index) => {
    if (isAnswered || isValidated) return;
    
    const newSelected = selectedLetters.filter((_, i) => i !== index);
    setSelectedLetters(newSelected);
    
    // Reconstruit le mot
    let newAnswer = wordPattern;
    newSelected.forEach((selectedLetter, idx) => {
      const pos = missingIndices[idx];
      newAnswer = newAnswer.substring(0, pos) + selectedLetter + newAnswer.substring(pos + 1);
    });
    setCurrentAnswer(newAnswer);
  };

  const handleValidate = () => {
    if (selectedLetters.length !== missingIndices.length) return;
    
    setIsValidated(true);
    const isCorrect = currentAnswer === correctWord;
    
    if (isCorrect) {
      onAnswer(true, currentAnswer);
    } else {
      setShowCorrectAnswer(true);
      onAnswer(false, currentAnswer);
    }
  };

  const handleReset = () => {
    setSelectedLetters([]);
    setCurrentAnswer(wordPattern);
    setIsValidated(false);
    setShowCorrectAnswer(false);
  };

  const isCorrect = currentAnswer === correctWord && isValidated;

  return (
    <motion.div
      className="letter-quiz-card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="letter-quiz-header">
        <h3 className="letter-quiz-title">
          <Lightbulb size={24} />
          Complétez le mot
        </h3>
        {question.source && (
          <span className="letter-quiz-source">{question.source}</span>
        )}
      </div>

      <p className="letter-quiz-question">{question.question}</p>

      {/* Mot avec lettres manquantes */}
      <div className="word-display-container">
        <div className="word-display">
          {currentAnswer.split('').map((char, index) => {
            const isMissing = wordPattern[index] === '_';
            const isFilled = isMissing && selectedLetters.length > 0 && 
              missingIndices.indexOf(index) < selectedLetters.length;
            
            return (
              <motion.div
                key={index}
                className={`word-letter ${isMissing ? 'missing' : ''} ${isFilled ? 'filled' : ''} ${isValidated && isMissing ? (correctWord[index] === char ? 'correct' : 'incorrect') : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {isMissing && !isFilled ? '_' : char}
                {isMissing && isFilled && (
                  <button
                    className="remove-letter-btn"
                    onClick={() => handleRemoveLetter(missingIndices.indexOf(index))}
                    disabled={isValidated}
                  >
                    ×
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lettres disponibles */}
      {!isValidated && (
        <div className="available-letters">
          <p className="letters-label">Choisissez les lettres :</p>
          <div className="letters-grid">
            {availableLetters.map((letter, index) => {
              const countInWord = correctWord.split(letter).length - 1;
              const countSelected = selectedLetters.filter(l => l === letter).length;
              const canUse = countSelected < countInWord;
              const isDisabled = !canUse || isValidated;
              
              return (
                <motion.button
                  key={`${letter}-${index}`}
                  className={`letter-btn ${!canUse ? 'used' : ''}`}
                  onClick={() => handleLetterClick(letter)}
                  disabled={isDisabled}
                  whileHover={canUse ? { scale: 1.1 } : {}}
                  whileTap={canUse ? { scale: 0.9 } : {}}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bouton de validation */}
      {!isValidated && (
        <motion.button
          className={`validate-btn ${selectedLetters.length === missingIndices.length ? 'ready' : 'disabled'}`}
          onClick={handleValidate}
          disabled={selectedLetters.length !== missingIndices.length}
          whileHover={selectedLetters.length === missingIndices.length ? { scale: 1.05 } : {}}
          whileTap={selectedLetters.length === missingIndices.length ? { scale: 0.95 } : {}}
        >
          <Check size={20} />
          Valider
        </motion.button>
      )}

      {/* Résultat */}
      <AnimatePresence>
        {isValidated && (
          <motion.div
            className={`result-display ${isCorrect ? 'correct' : 'incorrect'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {isCorrect ? (
              <>
                <CheckCircle size={32} />
                <h4>Bonne réponse !</h4>
                <p>{question.justification}</p>
              </>
            ) : (
              <>
                <XCircle size={32} />
                <h4>Mauvaise réponse</h4>
                <p>La bonne réponse est : <strong>{correctWord}</strong></p>
                <p className="justification-text">{question.justification}</p>
                <button className="reset-btn" onClick={handleReset}>
                  Réessayer
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LetterQuizCard;

