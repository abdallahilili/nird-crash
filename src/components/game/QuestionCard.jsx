import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import './QuestionCard.css';

const QuestionCard = ({ question, onAnswer, isAnswered, selectedAnswer, showResult }) => {
  if (!question) return null;

  // Si c'est une question à compléter (type: completion)
  if (question.type === 'completion') {
    const handleAnswer = (answer) => {
      if (isAnswered) return;
      onAnswer(answer);
    };

    const isCorrect = selectedAnswer === question.correctOption;
    const showJustification = showResult && isAnswered;

    return (
      <motion.div
        className="question-card-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="question-card-header">
          <h3 className="question-card-title">
            <Lightbulb size={24} />
            Complétez la phrase
          </h3>
          {question.source && (
            <span className="question-source">{question.source}</span>
          )}
        </div>

        <p className="question-text">{question.question}</p>

        {/* Deux cartes de réponse pour compléter */}
        <div className="answer-cards">
          <motion.button
            className={`answer-card answer-option1 ${selectedAnswer === 'option1' ? 'selected' : ''} ${showResult && selectedAnswer === 'option1' ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
            onClick={() => handleAnswer('option1')}
            disabled={isAnswered}
            whileHover={!isAnswered ? { scale: 1.05, y: -5 } : {}}
            whileTap={!isAnswered ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle size={32} />
            <span className="answer-label">{question.option1}</span>
            {showResult && selectedAnswer === 'option1' && (
              <motion.div
                className="answer-icon-result"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {isCorrect ? '✓' : '✗'}
              </motion.div>
            )}
          </motion.button>

          <motion.button
            className={`answer-card answer-option2 ${selectedAnswer === 'option2' ? 'selected' : ''} ${showResult && selectedAnswer === 'option2' ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
            onClick={() => handleAnswer('option2')}
            disabled={isAnswered}
            whileHover={!isAnswered ? { scale: 1.05, y: -5 } : {}}
            whileTap={!isAnswered ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <XCircle size={32} />
            <span className="answer-label">{question.option2}</span>
            {showResult && selectedAnswer === 'option2' && (
              <motion.div
                className="answer-icon-result"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {isCorrect ? '✓' : '✗'}
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Justification après la réponse */}
        <AnimatePresence>
          {showJustification && (
            <motion.div
              className={`question-justification ${isCorrect ? 'justification-correct' : 'justification-incorrect'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="justification-header">
                {isCorrect ? (
                  <>
                    <CheckCircle size={24} />
                    <span>Bonne réponse !</span>
                  </>
                ) : (
                  <>
                    <XCircle size={24} />
                    <span>Mauvaise réponse</span>
                  </>
                )}
              </div>
              <p className="justification-text">{question.justification}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Question vrai/faux classique
  const handleAnswer = (answer) => {
    if (isAnswered) return;
    onAnswer(answer);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;
  const showJustification = showResult && isAnswered;

  return (
    <motion.div
      className="question-card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="question-card-header">
        <h3 className="question-card-title">
          <Lightbulb size={24} />
          Question
        </h3>
        {question.source && (
          <span className="question-source">{question.source}</span>
        )}
      </div>

      <p className="question-text">{question.question}</p>

      {/* Deux cartes de réponse avec des mots */}
      <div className="answer-cards">
        <motion.button
          className={`answer-card answer-true ${selectedAnswer === true ? 'selected' : ''} ${showResult && selectedAnswer === true ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
          onClick={() => handleAnswer(true)}
          disabled={isAnswered}
          whileHover={!isAnswered ? { scale: 1.05, y: -5 } : {}}
          whileTap={!isAnswered ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle size={32} />
          <span className="answer-label">{question.cardTrue || 'VRAI'}</span>
          {showResult && selectedAnswer === true && (
            <motion.div
              className="answer-icon-result"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {isCorrect ? '✓' : '✗'}
            </motion.div>
          )}
        </motion.button>

        <motion.button
          className={`answer-card answer-false ${selectedAnswer === false ? 'selected' : ''} ${showResult && selectedAnswer === false ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
          onClick={() => handleAnswer(false)}
          disabled={isAnswered}
          whileHover={!isAnswered ? { scale: 1.05, y: -5 } : {}}
          whileTap={!isAnswered ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <XCircle size={32} />
          <span className="answer-label">{question.cardFalse || 'FAUX'}</span>
          {showResult && selectedAnswer === false && (
            <motion.div
              className="answer-icon-result"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {isCorrect ? '✓' : '✗'}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Justification après la réponse */}
      <AnimatePresence>
        {showJustification && (
          <motion.div
            className={`question-justification ${isCorrect ? 'justification-correct' : 'justification-incorrect'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="justification-header">
              {isCorrect ? (
                <>
                  <CheckCircle size={24} />
                  <span>Bonne réponse !</span>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <span>Mauvaise réponse</span>
                </>
              )}
            </div>
            <p className="justification-text">{question.justification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
