import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import educationalSectionsData from '../../data/educationalSections.json';
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

// Positions des sections éducatives sur la carte (en pourcentages)
const sectionPositions = [
  { top: '10%', left: '15%' },   // 1 - Pourquoi agir ?
  { top: '20%', left: '35%' },   // 2 - Qu'est-ce que NIRD ?
  { top: '15%', left: '55%' },   // 3 - Les 3 piliers
  { top: '30%', left: '70%' },   // 4 - Concrètement
  { top: '50%', left: '75%' },   // 5 - Qui peut agir ?
  { top: '70%', left: '65%' },   // 6 - Comment rejoindre
  { top: '75%', left: '45%' },   // 7 - Exemple inspirant
  { top: '65%', left: '25%' },   // 8 - Logiciels libres
];

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
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('education'); // 'education' | 'quiz'
  const { unlockedLevels, completedLevels, levelStats, unlockLevel } = useGameStore();
  const sections = educationalSectionsData.sections;
  
  // Débloque tous les niveaux au chargement pour accès direct
  useEffect(() => {
    levels.forEach(level => {
      if (!unlockedLevels.includes(level.id)) {
        unlockLevel(level.id);
      }
    });
  }, [levels, unlockedLevels, unlockLevel]);
  
  return (
    <div className="level-selector-overlay" onClick={onClose}>
      <div className="level-selector-back-button">
        <button onClick={onClose} className="btn-back-to-home">
          ← Retour à l'accueil
        </button>
      </div>
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
        
        {/* Onglets pour basculer entre Éducation et Quiz */}
        <div className="map-tabs">
          <motion.button
            className={`map-tab ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📚 Éducation
          </motion.button>
          <motion.button
            className={`map-tab ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎮 Quiz & Jeux
          </motion.button>
        </div>
        
        {/* Carte avec sections éducatives ou quiz */}
        <div className="map-background">
          <AnimatePresence mode="wait">
            {activeTab === 'education' ? (
              <motion.div
                key="education"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Chemin de connexion entre les sections */}
                <svg className="level-path" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 15,10 Q 25,15 35,20 T 55,15 T 70,30 T 75,50 T 65,70 T 45,75 T 25,65"
                    fill="none"
                    stroke="rgba(0, 132, 61, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                </svg>
                
                {/* Sections éducatives positionnées sur la carte */}
                {sections.map((section, index) => {
                  const position = sectionPositions[index] || { top: '50%', left: '50%' };
                  
                  return (
                    <motion.div
                      key={section.id}
                      className="map-educational-node"
                      style={{
                        top: position.top,
                        left: position.left,
                        borderColor: section.color,
                      }}
                      onClick={() => setSelectedSection(section)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.15, 
                        zIndex: 100,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {/* Icône de la section */}
                      <div 
                        className="section-node-icon"
                        style={{ background: section.color }}
                      >
                        {section.icon}
                      </div>
                      
                      {/* Tooltip au survol */}
                      <div className="section-tooltip">
                        <div className="tooltip-title">{section.title}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                
                {/* Niveaux de quiz positionnés sur la carte - TOUS ACCESSIBLES */}
                {levels.map((level, index) => {
                  const isUnlocked = true; // Tous les niveaux sont débloqués
                  const isCompleted = completedLevels.includes(level.id);
                  const stats = levelStats[level.id];
                  const position = levelPositions[index] || { top: '50%', left: '50%' };
                  
                  return (
                    <motion.div
                      key={level.id}
                      className={`map-level-node unlocked ${isCompleted ? 'completed' : ''}`}
                      style={{
                        top: position.top,
                        left: position.left,
                        borderColor: getLevelColor(level.theme),
                      }}
                      onClick={() => onSelectLevel(level.id)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        zIndex: 100,
                        transition: { duration: 0.2 }
                      }}
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
                      
                      {/* Tooltip au survol - toujours visible */}
                      <div className="level-tooltip">
                        <div className="tooltip-title">{level.title}</div>
                        <div className="tooltip-theme">{level.theme}</div>
                        {isCompleted && stats && (
                          <div className="tooltip-stats">
                            Score: {stats.score} • Mots: {stats.wordsFound?.length}/{level.words.length}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Modal de détail de la section */}
        <AnimatePresence>
          {selectedSection && (
            <motion.div
              className="section-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSection(null)}
            >
              <motion.div
                className="section-modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ borderTopColor: selectedSection.color }}
              >
                <button 
                  className="section-modal-close"
                  onClick={() => setSelectedSection(null)}
                >
                  ✕
                </button>
                
                <div className="section-modal-header">
                  <span className="section-modal-icon" style={{ color: selectedSection.color }}>
                    {selectedSection.icon}
                  </span>
                  <h3 className="section-modal-title">{selectedSection.title}</h3>
                </div>
                
                <div className="section-modal-body">
                  <div className="section-content">
                    {selectedSection.content.split('\n').map((line, i) => (
                      <p key={i} className="section-content-line">{line}</p>
                    ))}
                  </div>
                  
                  {selectedSection.solution && (
                    <div className="section-solution" style={{ borderLeftColor: selectedSection.color }}>
                      <p>{selectedSection.solution}</p>
                    </div>
                  )}
                  
                  {/* Boutons d'action */}
                  <div className="section-modal-actions">
                    <motion.button
                      className="btn btn-secondary"
                      onClick={() => setSelectedSection(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Fermer
                    </motion.button>
                    <motion.button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedSection(null);
                        setActiveTab('quiz');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ background: selectedSection.color }}
                    >
                      Aller aux Quiz →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LevelSelector;
