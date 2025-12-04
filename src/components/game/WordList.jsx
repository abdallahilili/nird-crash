import { motion } from 'framer-motion';
import './WordList.css';
import './WordList-animations.css';

const WordList = ({ levelWords, foundWords }) => {
  return (
    <div className="word-list-container">
      <h3 className="word-list-title">
        Mots trouvés: {foundWords.length} / {levelWords.length}
      </h3>
      
      <div className="word-list">
        {levelWords.map((wordData, index) => {
          const isFound = foundWords.includes(wordData.word);
          
          return (
            <motion.div
              key={index}
              className={`word-item ${isFound ? 'found' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: isFound ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                delay: index * 0.05,
                scale: { duration: 0.3 }
              }}
            >
              {isFound ? (
                <motion.div
                  className="word-found"
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="word-check">✓</span>
                  <span className="word-text">{wordData.word}</span>
                  <motion.span 
                    className="word-points"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    {wordData.points}pts
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  <span className="word-hint">
                    {wordData.word.substring(0, 2)}{'_'.repeat(wordData.word.length - 2)}
                  </span>
                  <span className="word-points-hidden">{wordData.points}pts</span>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="word-list-progress">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(foundWords.length / levelWords.length) * 100}%`,
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            {/* Effet de vague */}
            <motion.div
              className="progress-wave"
              animate={{
                x: ['0%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
        <motion.div 
          className="progress-text"
          key={foundWords.length}
          initial={{ scale: 1.3, color: "#FFD93D" }}
          animate={{ scale: 1, color: "#2C3E50" }}
          transition={{ duration: 0.3 }}
        >
          {Math.round((foundWords.length / levelWords.length) * 100)}% complété
        </motion.div>
      </div>
    </div>
  );
};

export default WordList;
