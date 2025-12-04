import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ onMenuClick, currentLevel, totalScore }) => {
  return (
    <header className="game-header">
      <motion.div 
        className="header-content container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <button className="menu-btn" onClick={onMenuClick}>
            <span className="menu-icon">☰</span>
          </button>
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">NIRD Crash</span>
          </div>
        </div>
        
        <div className="header-center">
          {currentLevel && (
            <div className="current-level-info">
              <span className="level-badge">Niveau {currentLevel}</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <div className="total-score">
            <span className="score-label">Score Total</span>
            <motion.span 
              className="score-value"
              key={totalScore}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {totalScore}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
