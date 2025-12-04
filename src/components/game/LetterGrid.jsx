import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import './LetterGrid.css';
import './LetterGrid-animations.css';

const LetterGrid = ({ gridLetters, onWordFormed }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursorTrail, setShowCursorTrail] = useState(false);
  const [validationAnimation, setValidationAnimation] = useState(null); // 'success' or 'error'
  const gridRef = useRef(null);
  const cursorTrailRef = useRef([]);
  
  const { foundWords } = useGameStore();
  
  // Vérifie si deux cellules sont adjacentes (incluant diagonales)
  const areCellsAdjacent = (cell1, cell2) => {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  };

  // Vérifie si une cellule est déjà sélectionnée
  const isCellAlreadySelected = useCallback((row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  }, [selectedCells]);

  // Trouve l'index de la dernière cellule sélectionnée
  const getLastSelectedCell = () => {
    return selectedCells.length > 0 ? selectedCells[selectedCells.length - 1] : null;
  };

  // Vérifie si le chemin vers une nouvelle cellule est valide
  const isValidPath = (newRow, newCol) => {
    if (selectedCells.length === 0) return true;
    
    const lastCell = getLastSelectedCell();
    if (!lastCell) return false;
    
    // Vérifie l'adjacence
    if (!areCellsAdjacent(lastCell, { row: newRow, col: newCol })) {
      return false;
    }
    
    // Vérifie si déjà sélectionnée
    if (isCellAlreadySelected(newRow, newCol)) {
      return false;
    }
    
    return true;
  };

  // Met à jour la position du curseur pour l'animation de drag
  const updateCursorPosition = (event) => {
    if (!gridRef.current || !isSelecting) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setCursorPosition({ x, y });
    
    // Ajoute la position au trail
    cursorTrailRef.current.push({ x, y, timestamp: Date.now() });
    
    // Garde seulement les dernières positions (pour l'effet de trainée)
    if (cursorTrailRef.current.length > 10) {
      cursorTrailRef.current.shift();
    }
  };

  // Handle mouse down on a cell
  const handleCellMouseDown = (letter, row, col, event) => {
    setIsSelecting(true);
    setShowCursorTrail(true);
    setSelectedCells([{ letter, row, col }]);
    setCurrentWord(letter);
    
    // Initialise la position du curseur
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    if (gridRef.current) {
      const gridRect = gridRef.current.getBoundingClientRect();
      setCursorPosition({
        x: x - gridRect.left,
        y: y - gridRect.top
      });
    }
  };

  // Handle mouse enter on a cell while dragging
  const handleCellMouseEnter = useCallback((letter, row, col, event) => {
    if (!isSelecting) return;
    
    if (isValidPath(row, col)) {
      const newSelectedCells = [...selectedCells, { letter, row, col }];
      const newWord = newSelectedCells.map(cell => cell.letter).join('');
      
      setSelectedCells(newSelectedCells);
      setCurrentWord(newWord);
      
      // Met à jour la position du curseur au centre de la cellule
      if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (gridRef.current) {
          const gridRect = gridRef.current.getBoundingClientRect();
          setCursorPosition({
            x: rect.left + rect.width / 2 - gridRect.left,
            y: rect.top + rect.height / 2 - gridRect.top
          });
        }
      }
    }
  }, [isSelecting, selectedCells, isValidPath, isCellAlreadySelected]);

  // Handle mouse move for cursor trail
  const handleMouseMove = (event) => {
    if (!isSelecting) return;
    updateCursorPosition(event);
  };

  // Handle mouse up - complete word selection
  const handleMouseUp = useCallback(() => {
    if (isSelecting && currentWord.length >= 3) {
      // Calculate center position of the word
      const gridRect = gridRef.current?.getBoundingClientRect();
      if (gridRect && selectedCells.length > 0) {
        const avgRow = selectedCells.reduce((sum, cell) => sum + cell.row, 0) / selectedCells.length;
        const avgCol = selectedCells.reduce((sum, cell) => sum + cell.col, 0) / selectedCells.length;
        
        const cellSize = gridRect.width / 5; // assuming 5x5 grid
        const centerX = gridRect.left + (avgCol + 0.5) * cellSize;
        const centerY = gridRect.top + (avgRow + 0.5) * cellSize;
        
        const position = { x: centerX, y: centerY };
        const result = onWordFormed(currentWord, position);
        
        // Animate validation feedback
        if (result) {
          setValidationAnimation(result.success ? 'success' : 'error');
          setTimeout(() => setValidationAnimation(null), 600);
        }
      }
    }
    resetSelection();
  }, [isSelecting, currentWord, onWordFormed, selectedCells]);

  // Handle click on individual cell (for touch/click interface)
  const handleCellClick = (letter, row, col) => {
    if (selectedCells.length === 0) {
      setSelectedCells([{ letter, row, col }]);
      setCurrentWord(letter);
      return;
    }

    if (isValidPath(row, col)) {
      const newSelectedCells = [...selectedCells, { letter, row, col }];
      const newWord = newSelectedCells.map(cell => cell.letter).join('');
      setSelectedCells(newSelectedCells);
      setCurrentWord(newWord);
    } else if (selectedCells.length === 1 && 
               selectedCells[0].row === row && 
               selectedCells[0].col === col) {
      // Si on clique sur la même cellule, on efface la sélection
      resetSelection();
    }
  };

  // Reset selection
  const resetSelection = () => {
    setIsSelecting(false);
    setShowCursorTrail(false);
    setSelectedCells([]);
    setCurrentWord('');
    cursorTrailRef.current = [];
  };

  // Rendu de l'effet de trainée du curseur
  const renderCursorTrail = () => {
    if (!showCursorTrail || cursorTrailRef.current.length < 2) return null;

    const trailElements = [];
    const now = Date.now();
    
    // Filtre les positions récentes (moins de 200ms)
    const recentPositions = cursorTrailRef.current.filter(
      pos => now - pos.timestamp < 200
    );

    for (let i = 0; i < recentPositions.length - 1; i++) {
      const currentPos = recentPositions[i];
      const nextPos = recentPositions[i + 1];
      
      // Calcule la distance et l'angle entre les points
      const dx = nextPos.x - currentPos.x;
      const dy = nextPos.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      // Calcule l'opacité basée sur l'âge (les plus récents sont plus visibles)
      const age = now - currentPos.timestamp;
      const opacity = Math.max(0, 1 - age / 200);
      
      trailElements.push(
        <motion.div
          key={`trail-${i}`}
          className="cursor-trail-segment"
          style={{
            position: 'absolute',
            left: currentPos.x,
            top: currentPos.y,
            width: distance,
            height: 4,
            backgroundColor: `rgba(255, 217, 61, ${opacity * 0.5})`,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
            zIndex: 3,
            borderRadius: '2px',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: opacity, scale: 1 }}
          transition={{ duration: 0.1 }}
        />
      );
    }
    
    return trailElements;
  };

  // Rendu du curseur de drag
  const renderDragCursor = () => {
    if (!isSelecting || !cursorPosition) return null;

    return (
      <motion.div
        className="drag-cursor"
        style={{
          position: 'absolute',
          left: cursorPosition.x,
          top: cursorPosition.y,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 217, 61, 0.3)',
          border: '2px solid #FFD93D',
          zIndex: 4,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Point central du curseur */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FFD93D',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>
    );
  };

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [handleMouseUp]);

  // Écouteur pour le mouvement global de la souris
  useEffect(() => {
    const handleGlobalMouseMove = (event) => {
      handleMouseMove(event);
    };

    if (isSelecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isSelecting]);

  // Prévenir le comportement par défaut du drag
  useEffect(() => {
    const preventDefault = (e) => {
      if (isSelecting) {
        e.preventDefault();
      }
    };

    document.addEventListener('dragstart', preventDefault);
    
    return () => {
      document.removeEventListener('dragstart', preventDefault);
    };
  }, [isSelecting]);

  return (
    <div className="letter-grid-container">
      {currentWord && (
        <motion.div 
          className="current-word-display"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {currentWord.toUpperCase()}
          <span className="word-length"> ({currentWord.length})</span>
        </motion.div>
      )}
      
      <div 
        ref={gridRef}
        className="letter-grid-wrapper"
        onMouseLeave={() => {
          if (isSelecting) {
            handleMouseUp();
          }
        }}
      >
        <div className="letter-grid">
          {/* Effet de trainée du curseur */}
          <div className="cursor-trail">
            {renderCursorTrail()}
          </div>
          
          {/* Curseur de drag */}
          {renderDragCursor()}
          
          {/* Grille de lettres */}
          {gridLetters.map((row, rowIndex) => (
            <div key={rowIndex} className="letter-row">
              {row.map((letter, colIndex) => {
                const isSelected = isCellAlreadySelected(rowIndex, colIndex);
                const selectionIndex = selectedCells.findIndex(
                  cell => cell.row === rowIndex && cell.col === colIndex
                );
                
                return (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`letter-cell ${isSelected ? 'selected' : ''}`}
                    onMouseDown={(e) => handleCellMouseDown(letter, rowIndex, colIndex, e)}
                    onMouseEnter={(e) => handleCellMouseEnter(letter, rowIndex, colIndex, e)}
                    onTouchStart={(e) => handleCellMouseDown(letter, rowIndex, colIndex, e)}
                    onTouchMove={(e) => {
                      if (!isSelecting) return;
                      e.preventDefault();
                      const touch = e.touches[0];
                      const element = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (element && element.classList.contains('letter-cell')) {
                        const row = parseInt(element.dataset.row);
                        const col = parseInt(element.dataset.col);
                        const letter = element.textContent;
                        handleCellMouseEnter(letter, row, col);
                      }
                    }}
                    onClick={() => handleCellClick(letter, rowIndex, colIndex)}
                    data-row={rowIndex}
                    data-col={colIndex}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                      backgroundColor: isSelected ? '#FFD93D' : '#FFFFFF',
                      color: isSelected ? '#2C3E50' : '#333333',
                      zIndex: isSelected ? 2 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {letter}
                    {isSelected && (
                      <motion.div 
                        className="selection-order"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {selectionIndex + 1}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid-controls">
        <motion.button 
          className="btn btn-secondary" 
          onClick={resetSelection}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Effacer
        </motion.button>
        <motion.button 
          className="btn btn-primary" 
          onClick={() => {
            if (currentWord.length >= 3) {
              onWordFormed(currentWord);
              resetSelection();
            }
          }}
          disabled={currentWord.length < 3}
          whileHover={{ scale: currentWord.length >= 3 ? 1.05 : 1 }}
          whileTap={{ scale: currentWord.length >= 3 ? 0.95 : 1 }}
          animate={{
            backgroundColor: currentWord.length >= 3 ? '#4CAF50' : '#CCCCCC',
          }}
        >
          Valider ({currentWord.length})
        </motion.button>
      </div>
    </div>
  );
};

export default LetterGrid;