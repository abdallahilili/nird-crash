import { motion, AnimatePresence } from 'framer-motion';
import './PopupInfo.css';

const PopupInfo = ({ isOpen, onClose, wordData, levelTheme }) => {
  if (!isOpen || !wordData) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="popup-content"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="popup-close" onClick={onClose}>
            ✕
          </button>
          
          <div className="popup-header">
            <motion.div 
              className="popup-word"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {wordData.word}
            </motion.div>
            <motion.div 
              className="popup-points"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              +{wordData.points} points 🌟
            </motion.div>
          </div>
          
          {wordData.image && (
            <motion.div 
              className="popup-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <img src={wordData.image} alt={wordData.word} />
            </motion.div>
          )}
          
          <motion.div 
            className="popup-explanation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p>{wordData.explanation}</p>
          </motion.div>
          
          <motion.div 
            className="popup-theme-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            Thème: {levelTheme}
          </motion.div>
          
          <motion.button 
            className="btn btn-primary popup-continue-btn"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuer 🚀
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupInfo;
