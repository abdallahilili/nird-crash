import { motion } from 'framer-motion';
import Director from '../Director';
import './WordList.css';
import './WordList-animations.css';

const WordList = ({ levelWords, foundWords, levelId, directorEmotion, directorReaction }) => {

  return (
    <div className="word-list-container">
      {/* Personnage SVG animé Director - REMPLACE LA LISTE DE MOTS */}
      <motion.div
        className="director-display-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{ 
          width: '100%',
          height: '450px',
          minHeight: '450px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Director 
            emotion={directorEmotion || 'thinking'} 
            reaction={directorReaction} 
          />
        </div>
      </motion.div>
      
      {/* Barre de progression en bas */}
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
