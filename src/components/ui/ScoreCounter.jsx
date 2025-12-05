import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Compteur de score animé
 * Affiche un nombre qui s'anime progressivement vers la valeur cible
 */
const ScoreCounter = ({ 
  value, 
  duration = 1000, 
  prefix = '', 
  suffix = '',
  className = '' 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    let startTime = null;
    const startValue = displayValue;
    const difference = value - startValue;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Fonction d'easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + difference * easeOut);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      className={`score-counter ${className}`}
      initial={{ scale: 1 }}
      animate={{ scale: value > displayValue ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default ScoreCounter;

