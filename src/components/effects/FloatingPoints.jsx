import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPoints.css';

const FloatingPoints = ({ 
  points, 
  position, 
  isVisible, 
  onComplete,
  isCombo = false,
  comboMultiplier = 1
}) => {
  if (!isVisible) return null;

  const displayText = isCombo && comboMultiplier > 1 
    ? `+${points} x${comboMultiplier}!` 
    : `+${points}`;

  return (
    <AnimatePresence>
      <motion.div
        className={`floating-points ${isCombo ? 'combo' : ''}`}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          pointerEvents: 'none',
          zIndex: 999,
        }}
        initial={{
          opacity: 0,
          scale: 0.5,
          y: 0,
        }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 1, 0.8],
          y: -100,
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
        onAnimationComplete={onComplete}
      >
        <div className="points-value">
          {displayText}
        </div>
        {isCombo && comboMultiplier > 1 && (
          <motion.div 
            className="combo-label"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            🔥 COMBO!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingPoints;
