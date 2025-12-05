import { motion } from 'framer-motion';
import { Star, Home, ArrowRight, RotateCcw } from 'lucide-react';
import ScoreCounter from './ScoreCounter';
import './LevelCompleteModal.css';

const LevelCompleteModal = ({
    isOpen,
    stats,
    onNextLevel,
    onMenu,
    onReplay
}) => {
    if (!isOpen) return null;

    const { score, stars, wordsFound, totalWords } = stats;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { scale: 0.8, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.1
            }
        },
        exit: { scale: 0.8, opacity: 0, y: 20 }
    };

    const starVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: (i) => ({
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: 0.4 + (i * 0.2)
            }
        })
    };

    return (
        <motion.div
            className="level-complete-overlay"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="level-complete-modal"
                variants={modalVariants}
            >
                <div className="modal-header">
                    <motion.h2
                        className="modal-title"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Niveau Terminé !
                    </motion.h2>
                </div>

                <div className="stars-container">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="star-wrapper"
                            custom={i}
                            variants={starVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Star
                                className={`modal-star ${i < stars ? 'active' : ''}`}
                                fill={i < stars ? "currentColor" : "none"}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="stats-grid">
                    <motion.div
                        className="stat-item"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <span className="stat-label">Score Final</span>
                        <span className="stat-value">
                            <ScoreCounter value={score} duration={1500} />
                        </span>
                    </motion.div>

                    <motion.div
                        className="stat-item"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <span className="stat-label">Mots Trouvés</span>
                        <span className="stat-value">{wordsFound}/{totalWords}</span>
                    </motion.div>
                </div>

                <div className="modal-actions">
                    <motion.button
                        className="btn-modal btn-home"
                        onClick={onMenu}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home size={20} />
                        Menu
                    </motion.button>

                    <motion.button
                        className="btn-modal btn-home"
                        onClick={onReplay}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RotateCcw size={20} />
                        Rejouer
                    </motion.button>

                    <motion.button
                        className="btn-modal btn-next"
                        onClick={onNextLevel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                    >
                        Niveau Suivant
                        <ArrowRight size={20} />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LevelCompleteModal;
