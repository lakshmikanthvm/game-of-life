export let selectedPatternData = {};
export let currentPattern = [];
let patterns = [];

// (world: boolean[][]) => boolean[][]
export const next = (world) => {
  let nextPattern = [...world];
  const rows = world.length;
  const cols = world[0].length;
  for (let row in world) {
    for (let col in world[row]) {
      let neighbors = getNumberOfNeighbors({ world, row, col, rows, cols });
      // Check the rules
      // If Alive
      if (world[row][col] === true) {
        if (neighbors < 2) {
          nextPattern[row][col] = false;
        } else if (neighbors === 2 || neighbors === 3) {
          nextPattern[row][col] = true;
        } else if (neighbors > 3) {
          nextPattern[row][col] = false;
        }
      } else if (world[row][col] === false) {
        // If Dead or Empty
        if (neighbors === 3) {
          nextPattern[row][col] = true;
        }
      }
    }
  }
  return nextPattern;
};
// (pattern: string) => boolean[][]
export const parse = (pattern) => {
  const patternRows = pattern.split('\n').filter((item) => item != '');
  return patternRows.map(patternItem => {
    const patternCols = patternItem.split('');
    return patternCols.map(item => {
      if (item === '.') {
        return false;
      } else if (item === 'O') {
        return true;
      }
      return;
    });
  });
};

const getNumberOfNeighbors = ({ world, row, col, rows, cols }) => {
  let count = 0;
  let newRow = Number(row);
  let newCol = Number(col);

  // checking whether currently at the first row
  if (newRow - 1 >= 0) {
    // checking neighbor at the top
    if (world[newRow - 1][newCol] === true)
      count++;
  }
  // currently not at the first cell and the upper left corner
  if (newRow - 1 >= 0 && newCol - 1 >= 0) {
    // checking neighbor at the upper left
    if (world[newRow - 1][newCol - 1] === true)
      count++;
  }
  // currently not at the first row last column and upper right corner
  if (newRow - 1 >= 0 && newCol + 1 < cols) {
    // checking neighbor at the upper right
    if (world[newRow - 1][newCol + 1] === true)
      count++;
  }
  // currently not at the first column
  if (newCol - 1 >= 0) {
    //checking neighbor at the left
    if (world[newRow][newCol - 1] === true)
      count++;
  }
  // currently not at the last column
  if (newCol + 1 < cols) {
    //checking neighbor at the right
    if (world[newRow][newCol + 1] === true)
      count++;
  }
  // currently not at the bottom left corner
  if (newRow + 1 < rows && newCol - 1 >= 0) {
    //checking neighbor at the bottom left
    if (world[newRow + 1][newCol - 1] === true)
      count++;
  }
  // currently not at the bottom right
  if (newRow + 1 < rows && newCol + 1 < cols) {
    //checking neighbor at the bottom right
    if (world[newRow + 1][newCol + 1] === true)
      count++;
  }
  // currently not at the last row
  if (newRow + 1 < rows) {
    //checking neighbor at the bottom
    if (world[newRow + 1][newCol] === true)
      count++;
  }
  return count;
}

const fetchPatterns = () => {
  return fetch('./src/lexicon.json')
    .then(res => res.json())
    .then(result => result);
}

const initializeData = async () => {
  patterns = await fetchPatterns();
  const patternsDropdown = document.getElementById("pattern");
  for (let pattern of patterns) {
    const option = new Option(pattern.name, pattern.name);
    patternsDropdown.options.add(option);
  }
}

export const patternSelected = (event) => {
  const selectedPattern = event.target.value;
  const patternDescription = document.getElementById("description");
  selectedPatternData = patterns.find(pattern => pattern.name === selectedPattern);
  currentPattern = selectedPatternData?.pattern ? parse(selectedPatternData.pattern) : [];
  patternDescription.innerHTML = selectedPatternData?.description ?? '';
}

initializeData();