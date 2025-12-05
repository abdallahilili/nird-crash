const fs = require('fs');
const path = require('path');

// Read the original file
const filePath = path.join(__dirname, '..', '..', 'src', 'components', 'game', 'LetterGrid.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Add touchMove handler after handleMouseMove
const handleMouseMoveSection = `  // Handle mouse move for cursor trail
  const handleMouseMove = (event) => {
    if (!isSelecting) return;
    updateCursorPosition(event);
  };`;

const handleTouchMoveCode = `  // Handle mouse move for cursor trail
  const handleMouseMove = (event) => {
    if (!isSelecting) return;
    updateCursorPosition(event);
  };

  // Handle touch move for drag selection
  const handleTouchMove = useCallback((event) => {
    if (!isSelecting) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    // Update cursor position for trail
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setCursorPosition({ x, y });
      
      // Add to trail
      cursorTrailRef.current.push({ x, y, timestamp: Date.now() });
      if (cursorTrailRef.current.length > 10) {
        cursorTrailRef.current.shift();
      }
    }
    
    // Find which cell the touch is over
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.row !== undefined && element.dataset.col !== undefined) {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      const letter = gridLetters[row][col];
      
      // Trigger cell selection if valid
      if (isValidPath(row, col)) {
        const newSelectedCells = [...selectedCells, { letter, row, col }];
        const newWord = newSelectedCells.map(cell => cell.letter).join('');
        setSelectedCells(newSelectedCells);
        setCurrentWord(newWord);
      }
    }
  }, [isSelecting, gridLetters, selectedCells, isValidPath]);`;

content = content.replace(handleMouseMoveSection, handleTouchMoveCode);

// Fix 2: Update handleCellMouseEnter dependencies to include isValidPath
content = content.replace(
  '  }, [isSelecting, selectedCells]);',
  '  }, [isSelecting, selectedCells, isValidPath]);'
);

// Fix 3: Add onTouchMove to cell rendering
const oldCellHandlers = `                    onMouseDown={(e) => handleCellMouseDown(letter, rowIndex, colIndex, e)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleCellMouseDown(letter, rowIndex, colIndex, e);
                    }}
                    onMouseEnter={(e) => handleCellMouseEnter(letter, rowIndex, colIndex, e)}
                    onClick={() => handleCellClick(letter, rowIndex, colIndex)}`;

const newCellHandlers = `                    onMouseDown={(e) => handleCellMouseDown(letter, rowIndex, colIndex, e)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCellMouseDown(letter, rowIndex, colIndex, e);
                    }}
                    onMouseEnter={(e) => handleCellMouseEnter(letter, rowIndex, colIndex, e)}
                    onTouchMove={(e) => handleTouchMove(e)}
                    onClick={() => handleCellClick(letter, rowIndex, colIndex)}`;

content = content.replace(oldCellHandlers, newCellHandlers);

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ LetterGrid.jsx has been successfully patched!');
console.log('Changes made:');
console.log('1. Added handleTouchMove function for touch drag selection');
console.log('2. Fixed handleCellMouseEnter dependencies');
console.log('3. Added onTouchMove handler to cells');
console.log('4. Added stopPropagation to onTouchStart');
