// Class for handling grid logic and state
export class GridLogic {
  constructor(sideSize, fibNeighborsMap) {
    this.sideSize = sideSize;
    this.fieldControls = Array(sideSize).fill().map(() => Array(sideSize).fill(null));
    this.fibNeighborsMap = fibNeighborsMap;
    this.fieldsToHighlight = new Set();
    this.isAnimating = false; // Add animation state flag
  }

  // Update single field
  updateField(row, col, { value, color }) {
    const field = this.fieldControls[row][col];
    if (field) {
      if (value !== undefined) field.changeValue(value);
      if (color !== undefined) field.changeColor(color);
    }
  }

  incrementValue(row, col) {
    const field = this.fieldControls[row][col];
    if (field) {
      const newValue = (field.value || 0) + 1;
      this.updateField(row, col, {
        color: 'yellow',
        value: newValue
      });
      field.value = newValue;
    }
  }

  updateLineValues(fixedIndex, isRow, intersectionRowIndex = null) {
    console.log(fixedIndex)
    for (let i = 0; i < this.sideSize; i++) {
      if (isRow) {
        this.incrementValue(fixedIndex, i);
      } else if (i !== intersectionRowIndex) { // Skip intersection for column
        this.incrementValue(i, fixedIndex);
      }
    }
  }

  resetColors(row, col) {
    for (let i = 0; i < this.sideSize; i++) {
      this.updateField(row, i, { color: 'white' });
      if (i !== row) {
        this.updateField(i, col, { color: 'white' });
      }
    }

  }

  highlightFibonacciSequences() {
    this.fieldsToHighlight.forEach(pos => {
      const [r, c] = pos.split(',').map(Number);
      this.updateField(r, c, { color: 'green' });
    });
  }

  resetHighlightedFields() {
    this.fieldsToHighlight.forEach(pos => {
      const [r, c] = pos.split(',').map(Number);
      this.updateField(r, c, {
        color: 'white',
        value: null
      });
      this.fieldControls[r][c].value = null;
    });
  }

  // Initialize field control
  initializeField(row, col, fieldData) {
    this.fieldControls[row][col] = fieldData;
  }

  // Add new helper method
  checkFibSequence(currentField, neighborField, direction, positions) {
    const currentValue = currentField.value;
    const neighborValue = neighborField.value;
    let sequence = new Set([positions.current, positions.neighbor]);

    // Generic check function that works for both directions
    const checkSequence = (startValue, nextValue, startPos, dir, isForward) => {
      let prevValue = startValue;
      let currentValue = nextValue;
      let pos = startPos;

      while (pos >= 0 && pos < this.sideSize) {
        const nextField = positions.isRow ?
          this.fieldControls[positions.fixed][pos] :
          this.fieldControls[pos][positions.fixed];

        if (nextField && nextField.value === currentValue) {
          sequence.add(pos);
          // For forward check we add, for backward we subtract
          const newValue = isForward ?
            prevValue + currentValue :
            prevValue - currentValue;
          prevValue = currentValue;
          currentValue = newValue;
        } else {
          break;
        }
        pos += dir;
      }
    };

    if (neighborValue < currentValue) {
      checkSequence(currentValue, neighborValue, positions.neighbor, direction, false);
      checkSequence(neighborValue, currentValue - neighborValue, positions.neighbor + direction, direction, true);
    } else {
      checkSequence(currentValue, neighborValue, positions.neighbor, direction, true);
      checkSequence(neighborValue, currentValue, positions.neighbor - direction, -direction, false);
    }

    const finalSequence = Array.from(sequence).sort((a, b) => a - b);
    return finalSequence.length >= 5 ? finalSequence : null;
  }

  // Helper method to check neighbor in specific direction
  checkNeighborInDirection(field, row, col, rowDelta, colDelta, neighbors) {
    const neighborRow = row + rowDelta;
    const neighborCol = col + colDelta;

    if (neighborRow >= 0 && neighborRow < this.sideSize &&
      neighborCol >= 0 && neighborCol < this.sideSize) {
      const neighborField = this.fieldControls[neighborRow][neighborCol];
      if (neighborField && neighborField.value && neighbors.includes(neighborField.value)) {
        const positions = {
          current: rowDelta === 0 ? col : row,
          neighbor: rowDelta === 0 ? neighborCol : neighborRow,
          fixed: rowDelta === 0 ? row : col,
          isRow: rowDelta === 0
        };
        const sequence = this.checkFibSequence(field, neighborField,
          rowDelta === 0 ? colDelta : rowDelta, positions);
        if (sequence) {
          sequence.forEach(pos => {
            const posKey = rowDelta === 0 ?
              `${row},${pos}` : `${pos},${col}`;
            this.fieldsToHighlight.add(posKey);
          });
        }
      }
    }
  }

  // Helper method to check all directions for a field
  checkAllDirections(field, row, col) {
    if (field && field.value) {
      const neighbors = this.fibNeighborsMap[field.value];
      if (neighbors) {
        // Check all four directions
        this.checkNeighborInDirection(field, row, col, 0, -1, neighbors);  // Left
        this.checkNeighborInDirection(field, row, col, 0, 1, neighbors);   // Right
        this.checkNeighborInDirection(field, row, col, -1, 0, neighbors);  // Up
        this.checkNeighborInDirection(field, row, col, 1, 0, neighbors);   // Down
      }
    }
  }

  // Handle field click
  handleFieldClick(row, col) {
    if (this.isAnimating) return; // Skip if animation is in progress

    // Update values and show yellow highlight
    this.updateLineValues(row, true);    // Update row
    this.updateLineValues(col, false, row);   // Update column

    // Clear previous highlights and check for new Fibonacci sequences
    this.fieldsToHighlight.clear();
    for (let i = 0; i < this.sideSize; i++) {
      this.checkAllDirections(this.fieldControls[row][i], row, i);
      if (i !== row) {
        this.checkAllDirections(this.fieldControls[i][col], i, col);
      }
    }

    // Animation sequence with timeouts
    return this.animateFieldChanges(row, col);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async resetColorsWithDelay(row, col) {
    await this.delay(200);
    this.resetColors(row, col);
  }

  async highlightSequencesWithDelay() {
    if (this.fieldsToHighlight.size > 0) {
      await this.delay(200);
      this.highlightFibonacciSequences();
    }
  }

  async resetHighlightWithDelay() {
    if (this.fieldsToHighlight.size > 0) {
      await this.delay(500);
      this.resetHighlightedFields();
    }
  }

  async animateFieldChanges(row, col) {
    this.isAnimating = true;
    try {
      await this.resetColorsWithDelay(row, col);
      await this.highlightSequencesWithDelay();
      await this.resetHighlightWithDelay();
    } catch (error) {
      console.error('Animation sequence failed:', error);
    } finally {
      this.isAnimating = false;
    }
  }
} 