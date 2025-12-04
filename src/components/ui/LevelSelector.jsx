import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import './LevelSelector.css';

const getLevelColor = (theme) => {
  const colors = {
    'Innovation': '#FF6B6B',
    'Collaboration': '#4ECDC4',
    'Participation Citoyenne': '#9B59B6',
    'Projets Locaux': '#F39C12',
    'Développement Durable': '#27AE60',
    'Biodiversité': '#2ECC71',
    'Inclusion': '#E91E63',
    'Idées': '#FFD93D',
    'Communauté': '#3498DB',
    'Créativité': '#8E44AD',
    'Solutions Ouvertes': '#00BCD4',
    'Environnement': '#4CAF50',
  };
  return colors[theme] || '#4ECDC4';
};

// Positions des niveaux sur la carte (en pourcentages)
const levelPositions = [
  { top: '15%', left: '10%' },   // 1 - Innovation
  { top: '25%', left: '25%' },   // 2 - Collaboration
  { top: '10%', left: '45%' },   // 3 - Participation
  { top: '20%', left: '60%' },   // 4 - Projets Locaux
  { top: '35%', left: '70%' },   // 5 - Développement Durable
  { top: '50%', left: '75%' },   // 6 - Biodiversité
  { top: '65%', left: '65%' },   // 7 - Inclusion
  { top: '70%', left: '50%' },   // 8 - Idées
  { top: '65%', left: '35%' },   // 9 - Communauté
  { top: '50%', left: '20%' },   // 10 - Créativité
  { top: '40%', left: '10%' },   // 11 - Solutions Ouvertes
  { top: '80%', left: '25%' },   // 12 - Environnement
];

const LevelSelector = ({ levels, onSelectLevel, onClose }) => {
  const { unlockedLevels, completedLevels, levelStats } = useGameStore();
  
  return (
    <div className="level-selector-overlay" onClick={onClose}>
      <motion.div 
        className="level-selector-map-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="map-header">
          <h2>🗺️ Carte de Progression NIRD</h2>
          <button className="close-btn-map" onClick={onClose}>✕</button>
        </div>
        
        {/* Carte avec fond d'image */}
        <div className="map-background">
          {/* Chemin de connexion entre les niveaux */}
          <svg className="level-path" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 10,15 Q 15,20 25,25 T 45,10 T 60,20 T 70,35 T 75,50 T 65,65 T 50,70 T 35,65 T 20,50 T 10,40 T 25,80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          </svg>
          
          {/* Niveaux positionnés sur la carte */}
          {levels.map((level, index) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isCompleted = completedLevels.includes(level.id);
            const stats = levelStats[level.id];
            const position = levelPositions[index] || { top: '50%', left: '50%' };
            
            return (
              <motion.div
                key={level.id}
                className={`map-level-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                style={{
                  top: position.top,
                  left: position.left,
                  borderColor: getLevelColor(level.theme),
                }}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: isUnlocked ? 1 : 0.5,
                }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                whileHover={isUnlocked ? { 
                  scale: 1.2, 
                  zIndex: 100,
                  transition: { duration: 0.2 }
                } : {}}
              >
                {/* Numéro du niveau */}
                <div 
                  className="level-node-number"
                  style={{ background: getLevelColor(level.theme) }}
                >
                  {level.id}
                </div>
                
                {/* État du niveau */}
                <div className="level-node-status">
                  {!isUnlocked && <span className="lock-icon-map">🔒</span>}
                  {isCompleted && stats && (
                    <div className="stars-mini">
                      {[...Array(3)].map((_, i) => (
                        <span key={i} className={i < stats.stars ? 'star-filled-mini' : 'star-empty-mini'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Tooltip au survol */}
                {isUnlocked && (
                  <div className="level-tooltip">
                    <div className="tooltip-title">{level.title}</div>
                    <div className="tooltip-theme">{level.theme}</div>
                    {isCompleted && stats && (
                      <div className="tooltip-stats">
                        Score: {stats.score} • Mots: {stats.wordsFound?.length}/{level.words.length}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Légende */}
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-icon unlocked">1</div>
            <span>Débloqué</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon completed">2</div>
            <span>Complété</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon locked">🔒</div>
            <span>Verrouillé</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelSelector;
