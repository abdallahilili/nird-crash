import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Zap } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import './LetterGrid.css';

const LetterGrid = ({ gridLetters, onWordFormed }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [validationAnimation, setValidationAnimation] = useState(null);
  const gridRef = useRef(null);
  const cursorTrailRef = useRef([]);
  const lastWordTimeRef = useRef(null);
  
  const { foundWords } = useGameStore();

  // Mémoïsation pour optimiser les vérifications
  const isCellSelected = useCallback((row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  }, [selectedCells]);

  const getSelectionIndex = useCallback((row, col) => {
    return selectedCells.findIndex(cell => cell.row === row && cell.col === col);
  }, [selectedCells]);

  // Vérifie si deux cellules sont adjacentes (8 directions)
  const areCellsAdjacent = useCallback((cell1, cell2) => {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  }, []);

  // Vérifie si le chemin est valide
  const isValidPath = useCallback((newRow, newCol) => {
    if (selectedCells.length === 0) return true;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return false;
    
    return areCellsAdjacent(lastCell, { row: newRow, col: newCol }) && 
           !isCellSelected(newRow, newCol);
  }, [selectedCells, areCellsAdjacent, isCellSelected]);

  // Calcule la position pour les effets
  const calculateWordPosition = useCallback(() => {
    if (!gridRef.current || selectedCells.length === 0) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / gridLetters[0].length;
    
    const avgRow = selectedCells.reduce((sum, cell) => sum + cell.row, 0) / selectedCells.length;
    const avgCol = selectedCells.reduce((sum, cell) => sum + cell.col, 0) / selectedCells.length;
    
    return {
      x: gridRect.left + (avgCol + 0.5) * cellSize,
      y: gridRect.top + (avgRow + 0.5) * cellSize
    };
  }, [selectedCells, gridLetters]);

  // Gestion du début de sélection
  const handleCellMouseDown = useCallback((letter, row, col, event) => {
    event.preventDefault();
    setIsSelecting(true);
    setSelectedCells([{ letter, row, col }]);
    setCurrentWord(letter);
    lastWordTimeRef.current = Date.now();
  }, []);

  // Gestion du survol pendant la sélection
  const handleCellMouseEnter = useCallback((letter, row, col) => {
    if (!isSelecting) return;
    
    if (isValidPath(row, col)) {
      setSelectedCells(prev => [...prev, { letter, row, col }]);
      setCurrentWord(prev => prev + letter);
    }
  }, [isSelecting, isValidPath]);

  // Gestion du clic sur une cellule
  const handleCellClick = useCallback((letter, row, col) => {
    if (selectedCells.length === 0) {
      setSelectedCells([{ letter, row, col }]);
      setCurrentWord(letter);
      return;
    }

    if (isValidPath(row, col)) {
      setSelectedCells(prev => [...prev, { letter, row, col }]);
      setCurrentWord(prev => prev + letter);
    } else if (selectedCells.length === 1 && 
               selectedCells[0].row === row && 
               selectedCells[0].col === col) {
      resetSelection();
    }
  }, [selectedCells, isValidPath]);

  // Réinitialise la sélection
  const resetSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectedCells([]);
    setCurrentWord('');
    cursorTrailRef.current = [];
  }, []);

  // Soumet le mot
  const handleSubmitWord = useCallback(() => {
    if (currentWord.length < 3) return;
    
    const position = calculateWordPosition();
    const result = onWordFormed(currentWord, position);
    
    if (result) {
      setValidationAnimation(result.success ? 'success' : 'error');
      setTimeout(() => setValidationAnimation(null), 600);
    }
    
    resetSelection();
  }, [currentWord, onWordFormed, calculateWordPosition, resetSelection]);

  // Gestion du relâchement de la souris
  const handleMouseUp = useCallback(() => {
    if (isSelecting && currentWord.length >= 3) {
      handleSubmitWord();
    } else {
      resetSelection();
    }
  }, [isSelecting, currentWord.length, handleSubmitWord, resetSelection]);

  // Écouteurs globaux
  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalMouseLeave = () => {
      if (isSelecting) handleMouseUp();
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    if (gridRef.current) {
      gridRef.current.addEventListener('mouseleave', handleGlobalMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
      if (gridRef.current) {
        gridRef.current.removeEventListener('mouseleave', handleGlobalMouseLeave);
      }
    };
  }, [handleMouseUp, isSelecting]);

  // Empêche le scroll pendant la sélection
  useEffect(() => {
    if (isSelecting) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isSelecting]);

  // Rendu de la grille avec mémoïsation
  const gridCells = useMemo(() => {
    return gridLetters.map((row, rowIndex) =>
      row.map((letter, colIndex) => {
        const isSelected = isCellSelected(rowIndex, colIndex);
        const selectionIndex = getSelectionIndex(rowIndex, colIndex);
        
        return {
          letter,
          row: rowIndex,
          col: colIndex,
          isSelected,
          selectionIndex
        };
      })
    );
  }, [gridLetters, isCellSelected, getSelectionIndex]);

  return (
    <div className="letter-grid-wrapper">
      {/* Affichage du mot actuel */}
      <AnimatePresence>
        {currentWord && (
          <motion.div 
            className="current-word-display"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="word-text">{currentWord.toUpperCase()}</span>
            <span className="word-length">({currentWord.length})</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteneur de la grille */}
      <div 
        ref={gridRef}
        className="letter-grid-container"
        onMouseLeave={() => {
          if (isSelecting) handleMouseUp();
        }}
      >
        {/* Animation de validation */}
        <AnimatePresence>
          {validationAnimation && (
            <motion.div
              className={`validation-overlay ${validationAnimation}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="validation-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {validationAnimation === 'success' ? (
                  <Check className="w-12 h-12" />
                ) : (
                  <X className="w-12 h-12" />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille de lettres */}
        <div className="letter-grid">
          {gridCells.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell) => (
                <motion.button
                  key={`${cell.row}-${cell.col}`}
                  className={`grid-cell ${cell.isSelected ? 'selected' : ''}`}
                  onMouseDown={(e) => handleCellMouseDown(cell.letter, cell.row, cell.col, e)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleCellMouseDown(cell.letter, cell.row, cell.col, e);
                  }}
                  onMouseEnter={() => handleCellMouseEnter(cell.letter, cell.row, cell.col)}
                  onClick={() => handleCellClick(cell.letter, cell.row, cell.col)}
                  whileHover={{ scale: cell.isSelected ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: cell.isSelected ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="cell-letter">{cell.letter}</span>
                  
                  {/* Numéro d'ordre de sélection */}
                  {cell.isSelected && (
                    <motion.span 
                      className="selection-order"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {cell.selectionIndex + 1}
                    </motion.span>
                  )}
                  
                  {/* Indicateur de début */}
                  {cell.isSelected && cell.selectionIndex === 0 && (
                    <motion.span
                      className="start-indicator"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="grid-instructions">
          <p>Glissez pour sélectionner les lettres adjacentes</p>
          <p className="instructions-hint">(minimum 3 lettres)</p>
        </div>
      </div>

      {/* Contrôles */}
      <div className="grid-controls">
        <motion.button 
          className="btn-control btn-clear"
          onClick={resetSelection}
          disabled={currentWord.length === 0}
          whileHover={{ scale: currentWord.length > 0 ? 1.05 : 1 }}
          whileTap={{ scale: currentWord.length > 0 ? 0.95 : 1 }}
        >
          <RotateCcw className="w-5 h-5" />
          Effacer
        </motion.button>
        
        <motion.button 
          className={`btn-control btn-submit ${currentWord.length >= 3 ? 'active' : ''}`}
          onClick={handleSubmitWord}
          disabled={currentWord.length < 3}
          whileHover={{ scale: currentWord.length >= 3 ? 1.05 : 1 }}
          whileTap={{ scale: currentWord.length >= 3 ? 0.95 : 1 }}
        >
          <Check className="w-5 h-5" />
          Valider
          {currentWord.length >= 3 && (
            <span className="word-count-badge">{currentWord.length}</span>
          )}
        </motion.button>
      </div>

      {/* Indicateur de sélection en cours */}
      {isSelecting && (
        <motion.div
          className="selecting-indicator"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Zap className="w-4 h-4" />
          Sélection en cours
        </motion.div>
      )}
    </div>
  );
};

export default LetterGrid;
