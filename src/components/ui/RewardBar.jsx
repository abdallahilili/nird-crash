import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import './RewardBar.css';

const RewardBar = ({ currentScore, targetScore, stars }) => {
  const { totalScore, totalWordFound } = useGameStore();
  
  const progressPercentage = Math.min((currentScore / targetScore) * 100, 100);
  
  const renderStars = () => {
    return [1, 2, 3].map(star => (
      <motion.div
        key={star}
        className={`star ${star <= stars ? 'active' : ''}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: star * 0.1, type: 'spring' }}
      >
        ⭐
      </motion.div>
    ));
  };
  
  return (
    <div className="reward-bar-container">
      <div className="reward-stats">
        <div className="stat-item">
          <div className="stat-label">Score actuel</div>
          <motion.div 
            className="stat-value"
            key={currentScore}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
          >
            {currentScore}
          </motion.div>
        </div>
        
        <div className="stat-divider" />
        
        <div className="stat-item">
          <div className="stat-label">Objectif</div>
          <div className="stat-value">{targetScore}</div>
        </div>
        
        <div className="stat-divider" />
        
        <div className="stat-item">
          <div className="stat-label">Total global</div>
          <div className="stat-value total">{totalScore}</div>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-bar-container">
          <motion.div 
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          >
            <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
          </motion.div>
        </div>
      </div>
      
      <div className="stars-container">
        {renderStars()}
      </div>
    </div>
  );
};

export default RewardBar;
