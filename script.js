// ==========================================
// AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  playTone(value, min = 5, max = 100, duration = 0.05, type = 'sine') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const normalized = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
      const freq = 180 + normalized * 700;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio policy catch
    }
  }

  playPathExplore(stepIndex, maxSteps) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const scale = [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37, 659.25, 739.99];
      const pitchIdx = stepIndex % scale.length;
      const baseFreq = scale[pitchIdx];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  playPathNode(index, total) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const progress = Math.min(1, index / Math.max(1, total));
      const freq = 350 + progress * 550;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }
}

const soundSynth = new SoundSynthesizer();

// ==========================================
// SORTING ALGORITHMS
// ==========================================
const SORTING_ALGORITHMS_INFO = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    summary: 'Simple comparison-based sort repeatedly swapping adjacent elements out of order.',
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    summary: 'Divide-and-conquer algorithm partitioning around a selected pivot element.',
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    summary: 'Divide-and-conquer algorithm dividing array into halves, sorting, and merging.',
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    summary: 'Builds sorted array one element at a time by inserting into correct position.',
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    summary: 'Repeatedly finds minimum element from unsorted portion and moves to front.',
  },
};

function generateArrayData(size) {
  const result = [];
  const min = 5;
  const max = 100;
  for (let i = 0; i < size; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return result;
}

function computeBubbleSortSteps(initial) {
  const steps = [];
  const arr = [...initial];
  const n = arr.length;
  const sorted = [];

  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [...sorted] });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...arr], comparing: [j, j + 1], swapping: [], sortedIndices: [...sorted] });
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        steps.push({ array: [...arr], comparing: [j, j + 1], swapping: [j, j + 1], sortedIndices: [...sorted] });
      }
    }
    sorted.push(n - 1 - i);
    steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [...sorted] });
  }
  sorted.push(0);
  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: Array.from({ length: n }, (_, idx) => idx) });
  return steps;
}

function computeQuickSortSteps(initial) {
  const steps = [];
  const arr = [...initial];
  const sorted = [];

  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [...sorted] });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], comparing: [j, high], swapping: [], sortedIndices: [...sorted] });
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          steps.push({ array: [...arr], comparing: [i, j], swapping: [i, j], sortedIndices: [...sorted] });
        }
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    sorted.push(i + 1);

    steps.push({ array: [...arr], comparing: [i + 1, high], swapping: [i + 1, high], sortedIndices: [...sorted] });
    return i + 1;
  }

  function helper(low, high) {
    if (low <= high) {
      const pi = partition(low, high);
      helper(low, pi - 1);
      helper(pi + 1, high);
    }
  }

  helper(0, arr.length - 1);
  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: Array.from({ length: arr.length }, (_, idx) => idx) });
  return steps;
}

function computeMergeSortSteps(initial) {
  const steps = [];
  const arr = [...initial];

  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [] });

  function merge(start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      steps.push({ array: [...arr], comparing: [start + i, mid + 1 + j], swapping: [], sortedIndices: [] });
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      steps.push({ array: [...arr], comparing: [k], swapping: [k], sortedIndices: [] });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({ array: [...arr], comparing: [k], swapping: [k], sortedIndices: [] });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({ array: [...arr], comparing: [k], swapping: [k], sortedIndices: [] });
      j++;
      k++;
    }
  }

  function helper(start, end) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      helper(start, mid);
      helper(mid + 1, end);
      merge(start, mid, end);
    }
  }

  helper(0, arr.length - 1);
  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: Array.from({ length: arr.length }, (_, idx) => idx) });
  return steps;
}

function computeInsertionSortSteps(initial) {
  const steps = [];
  const arr = [...initial];
  const n = arr.length;

  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [0] });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push({ array: [...arr], comparing: [i], swapping: [], sortedIndices: Array.from({ length: i }, (_, idx) => idx) });

    while (j >= 0 && arr[j] > key) {
      steps.push({ array: [...arr], comparing: [j, j + 1], swapping: [], sortedIndices: [] });
      arr[j + 1] = arr[j];
      steps.push({ array: [...arr], comparing: [j, j + 1], swapping: [j + 1], sortedIndices: [] });
      j--;
    }

    arr[j + 1] = key;
    steps.push({ array: [...arr], comparing: [j + 1], swapping: [j + 1], sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx) });
  }

  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: Array.from({ length: n }, (_, idx) => idx) });
  return steps;
}

function computeSelectionSortSteps(initial) {
  const steps = [];
  const arr = [...initial];
  const n = arr.length;
  const sorted = [];

  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [...sorted] });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...arr], comparing: [minIdx, j], swapping: [], sortedIndices: [...sorted] });
      if (arr[j] < arr[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      steps.push({ array: [...arr], comparing: [i, minIdx], swapping: [i, minIdx], sortedIndices: [...sorted] });
    }

    sorted.push(i);
    steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: [...sorted] });
  }

  sorted.push(n - 1);
  steps.push({ array: [...arr], comparing: [], swapping: [], sortedIndices: Array.from({ length: n }, (_, idx) => idx) });
  return steps;
}

function computeSortSteps(algo, arr) {
  switch (algo) {
    case 'bubble': return computeBubbleSortSteps(arr);
    case 'quick': return computeQuickSortSteps(arr);
    case 'merge': return computeMergeSortSteps(arr);
    case 'insertion': return computeInsertionSortSteps(arr);
    case 'selection': return computeSelectionSortSteps(arr);
    default: return computeBubbleSortSteps(arr);
  }
}

// ==========================================
// PATHFINDING ALGORITHMS
// ==========================================
const PATHFINDING_ALGORITHMS_INFO = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    summary: 'The father of pathfinding algorithms; explores uniformly in all directions and guarantees the lowest total weight cost.',
    guaranteesShortestPath: true,
    weighted: true,
    timeComplexity: 'O((V+E)log V)',
    spaceComplexity: 'O(V)',
  },
  astar: {
    name: 'A* Search',
    summary: 'Uses Manhattan heuristics to guide search towards target; guarantees shortest path while routing around high weights.',
    guaranteesShortestPath: true,
    weighted: true,
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
  },
  bfs: {
    name: 'Breadth-First Search',
    summary: 'Explores radially level-by-level; unweighted (ignores cell weights) and finds the fewest hops on uniform grids.',
    guaranteesShortestPath: true,
    weighted: false,
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
  },
  dfs: {
    name: 'Depth-First Search',
    summary: 'Dives deep along single branches before backtracking; unweighted and does not guarantee shortest path or lowest cost.',
    guaranteesShortestPath: false,
    weighted: false,
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
  },
};

// DIJKSTRA'S ALGORITHM (Real-time chronological weight decrement)
function runDijkstra(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const distances = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  const parentMap = new Map();
  const visitedSet = new Set();
  const animationEvents = [];

  distances[startNode.row][startNode.col] = 0;

  // PQ element: { row, col, dist, remainingWeight }
  const pq = [{ row: startNode.row, col: startNode.col, dist: 0, remainingWeight: 1 }];
  let reached = false;

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const current = pq.shift();
    const key = `${current.row},${current.col}`;

    if (visitedSet.has(key)) continue;

    const isStart = current.row === startNode.row && current.col === startNode.col;
    const isEnd = current.row === endNode.row && current.col === endNode.col;

    // Real-time weight decrement tick: if node still has cost > 1, decrement and re-queue with +1 distance
    if (current.remainingWeight > 1) {
      const nextRemaining = current.remainingWeight - 1;
      if (!isStart && !isEnd) {
        animationEvents.push({
          type: 'decrement',
          row: current.row,
          col: current.col,
          remainingWeight: nextRemaining,
        });
      }
      pq.push({
        row: current.row,
        col: current.col,
        dist: current.dist + 1,
        remainingWeight: nextRemaining,
      });
      continue;
    }

    // Node is fully traversed
    visitedSet.add(key);
    if (!isStart && !isEnd) {
      animationEvents.push({
        type: 'visited',
        row: current.row,
        col: current.col,
      });
    }

    if (isEnd) {
      reached = true;
      break;
    }

    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of deltas) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
        const nKey = `${nr},${nc}`;
        if (visitedSet.has(nKey) || grid[nr][nc].isWall) continue;

        const stepWeight = grid[nr][nc].weight || 1;
        const newDist = current.dist + stepWeight;

        if (newDist < distances[nr][nc]) {
          distances[nr][nc] = newDist;
          parentMap.set(nKey, { row: current.row, col: current.col });
          pq.push({ row: nr, col: nc, dist: newDist, remainingWeight: stepWeight });
        }
      }
    }
  }

  const shortestPathNodesInOrder = [];
  let totalCost = 0;
  if (reached) {
    let curr = endNode;
    while (curr) {
      shortestPathNodesInOrder.unshift(curr);
      if (curr.row !== startNode.row || curr.col !== startNode.col) {
        totalCost += grid[curr.row][curr.col].weight || 1;
      }
      curr = parentMap.get(`${curr.row},${curr.col}`) || null;
    }
  }

  return { animationEvents, shortestPathNodesInOrder, totalCost };
}

// A* SEARCH (Real-time chronological weight decrement)
function runAStar(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const manhattan = (r1, c1, r2, c2) => Math.abs(r1 - r2) + Math.abs(c1 - c2);

  const gScores = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  const fScores = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  const parentMap = new Map();
  const closedSet = new Set();
  const animationEvents = [];

  gScores[startNode.row][startNode.col] = 0;
  const initialH = manhattan(startNode.row, startNode.col, endNode.row, endNode.col);
  fScores[startNode.row][startNode.col] = initialH;

  const openSet = [{
    row: startNode.row,
    col: startNode.col,
    g: 0,
    h: initialH,
    f: initialH,
    remainingWeight: 1,
  }];

  let reached = false;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f || a.h - b.h);
    const current = openSet.shift();
    const key = `${current.row},${current.col}`;

    if (closedSet.has(key)) continue;

    const isStart = current.row === startNode.row && current.col === startNode.col;
    const isEnd = current.row === endNode.row && current.col === endNode.col;

    // Real-time weight decrement tick:
    if (current.remainingWeight > 1) {
      const nextRemaining = current.remainingWeight - 1;
      if (!isStart && !isEnd) {
        animationEvents.push({
          type: 'decrement',
          row: current.row,
          col: current.col,
          remainingWeight: nextRemaining,
        });
      }
      current.remainingWeight = nextRemaining;
      current.g += 1;
      current.f = current.g + current.h;
      openSet.push(current);
      continue;
    }

    closedSet.add(key);
    if (!isStart && !isEnd) {
      animationEvents.push({
        type: 'visited',
        row: current.row,
        col: current.col,
      });
    }

    if (isEnd) {
      reached = true;
      break;
    }

    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of deltas) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
        const nKey = `${nr},${nc}`;
        if (closedSet.has(nKey) || grid[nr][nc].isWall) continue;

        const stepWeight = grid[nr][nc].weight || 1;
        const tentativeG = gScores[current.row][current.col] + stepWeight;

        if (tentativeG < gScores[nr][nc]) {
          gScores[nr][nc] = tentativeG;
          const h = manhattan(nr, nc, endNode.row, endNode.col);
          fScores[nr][nc] = tentativeG + h;
          parentMap.set(nKey, { row: current.row, col: current.col });
          openSet.push({
            row: nr,
            col: nc,
            g: tentativeG,
            h,
            f: tentativeG + h,
            remainingWeight: stepWeight,
          });
        }
      }
    }
  }

  const shortestPathNodesInOrder = [];
  let totalCost = 0;
  if (reached) {
    let curr = endNode;
    while (curr) {
      shortestPathNodesInOrder.unshift(curr);
      if (curr.row !== startNode.row || curr.col !== startNode.col) {
        totalCost += grid[curr.row][curr.col].weight || 1;
      }
      curr = parentMap.get(`${curr.row},${curr.col}`) || null;
    }
  }

  return { animationEvents, shortestPathNodesInOrder, totalCost };
}

// BREADTH-FIRST SEARCH
// BREADTH-FIRST SEARCH
function runBFS(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const visited = new Set();
  const parentMap = new Map();
  const queue = [];
  const animationEvents = [];

  const startKey = `${startNode.row},${startNode.col}`;
  queue.push(startNode);
  visited.add(startKey);
  parentMap.set(startKey, null);
  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();
    const isStart = current.row === startNode.row && current.col === startNode.col;
    const isEnd = current.row === endNode.row && current.col === endNode.col;

    if (!isStart && !isEnd) {
      animationEvents.push({ type: 'visited', row: current.row, col: current.col });
    }

    if (isEnd) {
      found = true;
      break;
    }

    const deltas = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    for (const [dr, dc] of deltas) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
        const key = `${nr},${nc}`;
        if (!visited.has(key) && !grid[nr][nc].isWall) {
          visited.add(key);
          parentMap.set(key, current);
          queue.push({ row: nr, col: nc });
        }
      }
    }
  }

  const shortestPathNodesInOrder = [];
  let totalCost = 0;
  if (found) {
    let curr = endNode;
    while (curr) {
      shortestPathNodesInOrder.unshift(curr);
      if (curr.row !== startNode.row || curr.col !== startNode.col) {
        totalCost += 1;
      }
      curr = parentMap.get(`${curr.row},${curr.col}`) || null;
    }
  }
  return { animationEvents, shortestPathNodesInOrder, totalCost };
}

// DEPTH-FIRST SEARCH
function runDFS(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const visited = new Set();
  const parentMap = new Map();
  const stack = [];
  const animationEvents = [];

  const startKey = `${startNode.row},${startNode.col}`;
  stack.push(startNode);
  parentMap.set(startKey, null);
  let found = false;

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    const currentKey = `${current.row},${current.col}`;
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    const isStart = current.row === startNode.row && current.col === startNode.col;
    const isEnd = current.row === endNode.row && current.col === endNode.col;

    if (!isStart && !isEnd) {
      animationEvents.push({ type: 'visited', row: current.row, col: current.col });
    }

    if (isEnd) {
      found = true;
      break;
    }

    const deltas = [[1, 0], [0, -1], [-1, 0], [0, 1]];
    for (const [dr, dc] of deltas) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
        const nKey = `${nr},${nc}`;
        if (!visited.has(nKey) && !grid[nr][nc].isWall) {
          parentMap.set(nKey, current);
          stack.push({ row: nr, col: nc });
        }
      }
    }
  }

  const shortestPathNodesInOrder = [];
  let totalCost = 0;
  if (found) {
    let curr = endNode;
    while (curr) {
      shortestPathNodesInOrder.unshift(curr);
      if (curr.row !== startNode.row || curr.col !== startNode.col) {
        totalCost += 1;
      }
      curr = parentMap.get(`${curr.row},${curr.col}`) || null;
    }
  }
  return { animationEvents, shortestPathNodesInOrder, totalCost };
}

function runPathfinding(algo, grid, startNode, endNode) {
  switch (algo) {
    case 'dijkstra': return runDijkstra(grid, startNode, endNode);
    case 'astar': return runAStar(grid, startNode, endNode);
    case 'bfs': return runBFS(grid, startNode, endNode);
    case 'dfs': return runDFS(grid, startNode, endNode);
    default: return runDijkstra(grid, startNode, endNode);
  }
}

// ==========================================
// APPLICATION CONTROLLER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const topNav = document.getElementById('top-nav');
  const navBackBtn = document.getElementById('nav-back-btn');
  const navModeTitle = document.getElementById('nav-mode-title');
  const sortingNavTabs = document.getElementById('sorting-nav-tabs');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIconMuted = document.getElementById('audio-icon-muted');
  const audioIconUnmuted = document.getElementById('audio-icon-unmuted');

  // Views
  const viewMenu = document.getElementById('view-menu');
  const viewSorting = document.getElementById('view-sorting');
  const viewPathfinding = document.getElementById('view-pathfinding');

  // State
  let currentMode = 'menu';
  let isMuted = true;

  // Sorting State
  let currentSortAlgo = 'bubble';
  let sortArraySize = 24;
  let sortSpeedMs = 30;
  let rawSortArray = generateArrayData(sortArraySize);
  let sortSteps = computeSortSteps(currentSortAlgo, rawSortArray);
  let currentStepIndex = 0;
  let isSortingRunning = false;
  let sortTimer = null;

  // Pathfinding State
  const NUM_ROWS = 15;
  const NUM_COLS = 29;
  let currentPfAlgo = 'dijkstra';
  let currentDrawTool = 'wall'; // 'wall' | 'weight'
  let weightValue = 5;
  let startNode = { row: 7, col: 4 };
  let endNode = { row: 7, col: 24 };
  let pfSpeedMs = 15;
  let isPfRunning = false;
  let pfTimeouts = [];
  let pfGrid = [];

  // Audio Toggle
  function updateAudioUI() {
    if (isMuted) {
      audioIconMuted.classList.remove('hidden');
      audioIconUnmuted.classList.add('hidden');
    } else {
      audioIconMuted.classList.add('hidden');
      audioIconUnmuted.classList.remove('hidden');
    }
  }

  audioToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    soundSynth.setMuted(isMuted);
    updateAudioUI();
  });

  // Mode View Switcher with Smooth Fluid Transitions
  let isTransitioning = false;

  function switchMode(newMode) {
    if (isTransitioning || currentMode === newMode) return;
    if (isSortingRunning) stopSorting();
    clearPfTimeouts();

    isTransitioning = true;
    const oldMode = currentMode;
    currentMode = newMode;

    const viewMap = {
      menu: viewMenu,
      sorting: viewSorting,
      pathfinding: viewPathfinding,
    };

    const currentEl = viewMap[oldMode];
    const targetEl = viewMap[newMode];

    // 1. Animate current element out smoothly
    if (currentEl) {
      currentEl.classList.remove('view-visible', 'view-enter-start');
      currentEl.classList.add('view-exit');
    }

    // 2. Animate topNav header
    if (newMode === 'menu') {
      topNav.classList.remove('header-slide-in');
      topNav.classList.add('hidden');
    } else {
      if (newMode === 'sorting') {
        navModeTitle.textContent = 'Sorting';
        sortingNavTabs.classList.remove('hidden');
      } else if (newMode === 'pathfinding') {
        navModeTitle.textContent = 'Pathfinding';
        sortingNavTabs.classList.add('hidden');
      }
      topNav.classList.remove('hidden');
      topNav.classList.add('header-slide-in');
    }

    // 3. Halfway through the transition (200ms), swap elements and enter target
    setTimeout(() => {
      // Hide old view and unhide target with initial enter offset
      Object.keys(viewMap).forEach((m) => {
        const el = viewMap[m];
        if (m === newMode) {
          el.classList.remove('view-hidden', 'view-exit');
          el.classList.add('flex', 'view-enter-start');
        } else {
          el.classList.add('view-hidden');
          el.classList.remove('view-visible', 'view-exit', 'view-enter-start');
          if (m !== 'menu') el.classList.remove('flex');
        }
      });

      // Prepare target view renders
      if (newMode === 'sorting') {
        renderSortingView();
      } else if (newMode === 'pathfinding') {
        renderPfGrid();
      }

      // Next paint frame: slide and fade target into place
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          targetEl.classList.remove('view-enter-start');
          targetEl.classList.add('view-visible');

          setTimeout(() => {
            isTransitioning = false;
          }, 300);
        });
      });
    }, 200);
  }

  const cardSelectSorting = document.getElementById('card-select-sorting');
  const cardSelectPathfinding = document.getElementById('card-select-pathfinding');

  cardSelectSorting.addEventListener('click', () => {
    if (isTransitioning) return;
    cardSelectSorting.classList.add('card-active-press');
    if (!isMuted) soundSynth.playTone(45, 5, 100, 0.07, 'triangle');
    setTimeout(() => cardSelectSorting.classList.remove('card-active-press'), 220);
    switchMode('sorting');
  });

  cardSelectPathfinding.addEventListener('click', () => {
    if (isTransitioning) return;
    cardSelectPathfinding.classList.add('card-active-press');
    if (!isMuted) soundSynth.playTone(65, 5, 100, 0.07, 'triangle');
    setTimeout(() => cardSelectPathfinding.classList.remove('card-active-press'), 220);
    switchMode('pathfinding');
  });

  navBackBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    if (!isMuted) soundSynth.playTone(35, 5, 100, 0.06, 'sine');
    switchMode('menu');
  });

  // ==========================================
  // RENDER MENU PATHFINDING PREVIEW
  // ==========================================
  const pfMenuPreviewContainer = document.getElementById('pathfinding-menu-preview');
  if (pfMenuPreviewContainer) {
    const gridEl = document.createElement('div');
    gridEl.className = 'grid grid-cols-11 gap-1';
    for (let idx = 0; idx < 44; idx++) {
      const r = Math.floor(idx / 11);
      const c = idx % 11;
      const isStart = r === 1 && c === 1;
      const isEnd = r === 2 && c === 9;
      const isWall = (r === 0 && c === 4) || (r === 1 && c === 4) || (r === 2 && c === 4) || (r === 2 && c === 7) || (r === 3 && c === 7);
      const isPath = (r === 1 && c >= 1 && c <= 3) || (r === 3 && c >= 3 && c <= 6) || (r === 1 && c === 6) || (r === 2 && c === 6) || (r === 1 && c >= 7 && c <= 9) || (r === 2 && c === 9);
      const isVisited = !isStart && !isEnd && !isWall && !isPath && ((r >= 0 && r <= 3 && c <= 7) || (r === 0 && c >= 8));

      let cellStyle = 'bg-neutral-950 border-neutral-850/80';
      if (isStart) cellStyle = 'bg-emerald-500 border-emerald-400 shadow-xs shadow-emerald-500/50';
      else if (isEnd) cellStyle = 'bg-rose-500 border-rose-400 shadow-xs shadow-rose-500/50';
      else if (isPath) cellStyle = 'bg-amber-400 border-amber-300 shadow-xs shadow-amber-400/50';
      else if (isWall) cellStyle = 'bg-neutral-800 border-neutral-700';
      else if (isVisited) cellStyle = 'bg-slate-800 border-slate-700/60';

      const cell = document.createElement('div');
      cell.className = `w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center text-[7px] ${cellStyle}`;
      if (isStart) {
        cell.innerHTML = '<svg class="w-2.5 h-2.5 text-black fill-current" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
      } else if (isEnd) {
        cell.innerHTML = '<svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
      }
      gridEl.appendChild(cell);
    }
    pfMenuPreviewContainer.appendChild(gridEl);
  }

  // ==========================================
  // SORTING CONTROLLER
  // ==========================================
  const sortBarsContainer = document.getElementById('sorting-bars-container');
  const sortPlayBtn = document.getElementById('sort-play-btn');
  const sortPlayText = document.getElementById('sort-play-text');
  const sortResetBtn = document.getElementById('sort-reset-btn');
  const sortNewBtn = document.getElementById('sort-new-btn');
  const sortSizeSlider = document.getElementById('sort-size-slider');
  const sortSizeLabel = document.getElementById('sort-size-label');
  const sortSpeedSlider = document.getElementById('sort-speed-slider');
  const sortSpeedLabel = document.getElementById('sort-speed-label');
  const sortStepCurrent = document.getElementById('sort-step-current');
  const sortStepTotal = document.getElementById('sort-step-total');
  const sortStepPct = document.getElementById('sort-step-pct');
  const sortProgressFill = document.getElementById('sort-progress-fill');
  const sortScrubInput = document.getElementById('sort-scrub-input');

  function renderSortingView() {
    const currentStep = sortSteps[currentStepIndex] || {
      array: rawSortArray,
      comparing: [],
      swapping: [],
      sortedIndices: [],
    };
    const displayArray = currentStep.array;
    const comparing = currentStep.comparing || [];
    const swapping = currentStep.swapping || [];
    const sorted = currentStep.sortedIndices || [];

    sortBarsContainer.innerHTML = '';
    const showLabels = displayArray.length <= 24;

    displayArray.forEach((val, idx) => {
      const heightPercent = Math.max(8, Math.min(100, val));
      let colorClass = 'bg-neutral-700 hover:bg-neutral-600';
      if (swapping.includes(idx)) colorClass = 'bg-rose-500';
      else if (comparing.includes(idx)) colorClass = 'bg-amber-400';
      else if (sorted.includes(idx)) colorClass = 'bg-emerald-500';

      const barWrap = document.createElement('div');
      barWrap.className = 'flex-1 flex flex-col items-center justify-end h-full min-w-[2px] max-w-[36px]';
      if (showLabels) {
        const lbl = document.createElement('span');
        lbl.className = 'text-[9px] sm:text-[10px] font-mono text-neutral-400 mb-1 select-none';
        lbl.textContent = val;
        barWrap.appendChild(lbl);
      }

      const bar = document.createElement('div');
      bar.style.height = `${heightPercent}%`;
      bar.className = `w-full rounded-t-xs transition-all duration-75 ${colorClass}`;
      barWrap.appendChild(bar);

      sortBarsContainer.appendChild(barWrap);
    });

    const safeTotal = Math.max(1, sortSteps.length - 1);
    const pct = Math.round((currentStepIndex / safeTotal) * 100);
    sortStepCurrent.textContent = Math.min(currentStepIndex + 1, sortSteps.length);
    sortStepTotal.textContent = sortSteps.length;
    sortStepPct.textContent = `${pct}%`;
    sortProgressFill.style.width = `${pct}%`;
    sortScrubInput.max = safeTotal;
    sortScrubInput.value = currentStepIndex;

    const info = SORTING_ALGORITHMS_INFO[currentSortAlgo];
    document.getElementById('sort-info-name').textContent = info.name;
    document.getElementById('sort-info-summary').textContent = info.summary;
    document.getElementById('sort-info-best').textContent = info.timeComplexity.best;
    document.getElementById('sort-info-avg').textContent = info.timeComplexity.average;
    document.getElementById('sort-info-worst').textContent = info.timeComplexity.worst;
    document.getElementById('sort-info-space').textContent = info.spaceComplexity;
  }

  function playStepAudio(step) {
    if (!step || isMuted) return;
    if (step.swapping && step.swapping.length > 0) {
      const idx = step.swapping[0];
      const val = step.array[idx];
      if (val !== undefined) soundSynth.playTone(val, 5, 100, 0.04, 'triangle');
    } else if (step.comparing && step.comparing.length > 0) {
      const idx = step.comparing[0];
      const val = step.array[idx];
      if (val !== undefined) soundSynth.playTone(val, 5, 100, 0.03, 'sine');
    }
  }

  function stopSorting() {
    isSortingRunning = false;
    if (sortTimer) clearTimeout(sortTimer);
    sortPlayText.textContent = 'Start';
    sortPlayBtn.classList.remove('bg-amber-400', 'hover:bg-amber-300');
    sortPlayBtn.classList.add('bg-white', 'hover:bg-neutral-200');
  }

  function startSorting() {
    if (currentStepIndex >= sortSteps.length - 1) {
      currentStepIndex = 0;
    }
    isSortingRunning = true;
    sortPlayText.textContent = 'Pause';
    sortPlayBtn.classList.remove('bg-white', 'hover:bg-neutral-200');
    sortPlayBtn.classList.add('bg-amber-400', 'hover:bg-amber-300');

    function loop() {
      if (!isSortingRunning) return;
      if (currentStepIndex >= sortSteps.length - 1) {
        stopSorting();
        return;
      }
      currentStepIndex++;
      playStepAudio(sortSteps[currentStepIndex]);
      renderSortingView();
      if (currentStepIndex >= sortSteps.length - 1) {
        stopSorting();
        return;
      }
      sortTimer = setTimeout(loop, sortSpeedMs);
    }

    sortTimer = setTimeout(loop, sortSpeedMs);
  }

  sortPlayBtn.addEventListener('click', () => {
    if (isSortingRunning) stopSorting();
    else startSorting();
  });

  sortResetBtn.addEventListener('click', () => {
    stopSorting();
    currentStepIndex = 0;
    renderSortingView();
  });

  sortNewBtn.addEventListener('click', () => {
    stopSorting();
    rawSortArray = generateArrayData(sortArraySize);
    sortSteps = computeSortSteps(currentSortAlgo, rawSortArray);
    currentStepIndex = 0;
    renderSortingView();
  });

  sortSizeSlider.addEventListener('input', (e) => {
    if (isSortingRunning) return;
    sortArraySize = Number(e.target.value);
    sortSizeLabel.textContent = sortArraySize;
    rawSortArray = generateArrayData(sortArraySize);
    sortSteps = computeSortSteps(currentSortAlgo, rawSortArray);
    currentStepIndex = 0;
    renderSortingView();
  });

  sortSpeedSlider.addEventListener('input', (e) => {
    sortSpeedMs = 305 - Number(e.target.value);
    sortSpeedLabel.textContent = `${sortSpeedMs}ms`;
  });

  sortScrubInput.addEventListener('input', (e) => {
    stopSorting();
    currentStepIndex = Number(e.target.value);
    renderSortingView();
  });

  document.querySelectorAll('.sort-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isSortingRunning) return;
      document.querySelectorAll('.sort-tab-btn').forEach((b) => {
        b.className = 'sort-tab-btn px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors text-neutral-400 hover:text-white cursor-pointer';
      });
      btn.className = 'sort-tab-btn px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors bg-neutral-800 text-white font-semibold shadow-xs cursor-pointer';
      currentSortAlgo = btn.getAttribute('data-algo');
      sortSteps = computeSortSteps(currentSortAlgo, rawSortArray);
      currentStepIndex = 0;
      renderSortingView();
    });
  });

  // ==========================================
  // PATHFINDING CONTROLLER
  // ==========================================
  const pfGridContainer = document.getElementById('pf-grid-container');
  const pfVisualizeBtn = document.getElementById('pf-visualize-btn');
  const pfVisualizeText = document.getElementById('pf-visualize-text');
  const pfClearPathBtn = document.getElementById('pf-clear-path-btn');
  const pfClearBoardBtn = document.getElementById('pf-clear-board-btn');
  const pfMazeBtn = document.getElementById('pf-maze-btn');
  const pfRandomWeightBtn = document.getElementById('pf-random-weight-btn');
  const pfToolWallBtn = document.getElementById('pf-tool-wall-btn');
  const pfToolWeightBtn = document.getElementById('pf-tool-weight-btn');
  const pfWeightBtnLabel = document.getElementById('pf-weight-button-label');
  const pfWeightControlsPanel = document.getElementById('pf-weight-controls-panel');
  const pfWeightMinus = document.getElementById('pf-weight-minus');
  const pfWeightPlus = document.getElementById('pf-weight-plus');
  const pfWeightDisplay = document.getElementById('pf-weight-display');
  const pfSpeedSlider = document.getElementById('pf-speed-slider');
  const pfSpeedLabel = document.getElementById('pf-speed-label');
  const pfStatVisited = document.getElementById('pf-stat-visited');
  const pfStatPath = document.getElementById('pf-stat-path');
  const pfStatCost = document.getElementById('pf-stat-cost');
  const pfStatCostBadge = document.getElementById('pf-stat-cost-badge');
  const pfStatStatus = document.getElementById('pf-stat-status');
  const pfLegendWeightBadge = document.getElementById('pf-legend-weight-badge');
  const pfLegendWeightText = document.getElementById('pf-legend-weight-text');

  function initPfGridData() {
    pfGrid = [];
    for (let r = 0; r < NUM_ROWS; r++) {
      const row = [];
      for (let c = 0; c < NUM_COLS; c++) {
        row.push({
          row: r,
          col: c,
          isStart: r === startNode.row && c === startNode.col,
          isEnd: r === endNode.row && c === endNode.col,
          isWall: false,
          weight: 1,
          isVisited: false,
          isPath: false,
        });
      }
      pfGrid.push(row);
    }
  }

  initPfGridData();

  function clearPfTimeouts() {
    pfTimeouts.forEach((id) => clearTimeout(id));
    pfTimeouts = [];
    isPfRunning = false;
    pfVisualizeText.textContent = 'Visualize';
    pfVisualizeBtn.disabled = false;
  }

  function setDrawTool(tool) {
    const isWeightedAlgo = PATHFINDING_ALGORITHMS_INFO[currentPfAlgo]?.weighted;
    if (tool === 'weight' && !isWeightedAlgo) {
      tool = 'wall';
    }
    currentDrawTool = tool;
    if (tool === 'weight') {
      pfToolWeightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-xs cursor-pointer';
      pfToolWallBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors text-neutral-400 hover:text-white cursor-pointer';
      if (pfWeightControlsPanel) {
        pfWeightControlsPanel.classList.remove('hidden');
        pfWeightControlsPanel.classList.add('flex');
      }
    } else {
      pfToolWallBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors bg-neutral-800 text-white shadow-xs cursor-pointer';
      if (isWeightedAlgo) {
        pfToolWeightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors text-neutral-400 hover:text-white cursor-pointer';
      }
      if (pfWeightControlsPanel) {
        pfWeightControlsPanel.classList.add('hidden');
        pfWeightControlsPanel.classList.remove('flex');
      }
    }
  }

  function updatePfAlgorithmSupportUI() {
    const isWeightedAlgo = PATHFINDING_ALGORITHMS_INFO[currentPfAlgo]?.weighted;
    if (!isWeightedAlgo) {
      if (currentDrawTool === 'weight') {
        setDrawTool('wall');
      }
      pfToolWeightBtn.disabled = true;
      pfToolWeightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors bg-neutral-900/60 text-neutral-600 opacity-40 border border-neutral-900 cursor-not-allowed';
      pfToolWeightBtn.title = 'Weights are only supported in Dijkstra and A*';

      pfRandomWeightBtn.disabled = true;
      pfRandomWeightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/60 text-neutral-600 opacity-40 border border-neutral-900 text-xs font-medium cursor-not-allowed';
      pfRandomWeightBtn.title = 'Weights are only supported in Dijkstra and A*';

      if (pfWeightControlsPanel) {
        pfWeightControlsPanel.classList.add('hidden');
        pfWeightControlsPanel.classList.remove('flex');
      }
    } else {
      pfToolWeightBtn.disabled = false;
      pfToolWeightBtn.title = '';
      pfRandomWeightBtn.disabled = false;
      pfRandomWeightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors text-xs font-medium cursor-pointer';
      pfRandomWeightBtn.title = '';
      setDrawTool(currentDrawTool);
    }
  }

  function updatePfWeightUI() {
    pfWeightDisplay.textContent = weightValue;
    pfWeightBtnLabel.textContent = `Weight (${weightValue}x)`;
    pfLegendWeightBadge.textContent = weightValue;
    pfLegendWeightText.textContent = `Weight (${weightValue}x cost)`;

    // Update preset buttons styling
    document.querySelectorAll('.pf-weight-preset-btn').forEach((btn) => {
      const val = Number(btn.getAttribute('data-weight-preset'));
      if (val === weightValue) {
        btn.className = 'pf-weight-preset-btn px-1.5 py-0.5 rounded bg-amber-500/25 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 cursor-pointer';
      } else {
        btn.className = 'pf-weight-preset-btn px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white font-mono text-[10px] cursor-pointer';
      }
    });
  }

  // Weight stepper buttons
  pfWeightMinus.addEventListener('click', () => {
    if (isPfRunning || weightValue <= 2) return;
    weightValue--;
    updatePfWeightUI();
  });

  pfWeightPlus.addEventListener('click', () => {
    if (isPfRunning || weightValue >= 50) return;
    weightValue++;
    updatePfWeightUI();
  });

  // Quick weight presets (2x, 5x, 10x, 20x)
  document.querySelectorAll('.pf-weight-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isPfRunning) return;
      weightValue = Number(btn.getAttribute('data-weight-preset'));
      updatePfWeightUI();
      setDrawTool('weight');
    });
  });

  pfToolWallBtn.addEventListener('click', () => {
    if (isPfRunning) return;
    setDrawTool('wall');
  });

  pfToolWeightBtn.addEventListener('click', () => {
    if (isPfRunning || !PATHFINDING_ALGORITHMS_INFO[currentPfAlgo]?.weighted) return;
    setDrawTool('weight');
  });

  pfSpeedSlider.addEventListener('input', (e) => {
    pfSpeedMs = 51 - Number(e.target.value);
    pfSpeedLabel.textContent = `${pfSpeedMs}ms`;
  });

  // Mouse / Touch drawing state
  let isGridMouseDown = false;
  let gridDragMode = null; // 'start' | 'end' | 'draw'

  function renderPfGrid() {
    pfGridContainer.innerHTML = '';

    for (let r = 0; r < NUM_ROWS; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'flex gap-[2px]';

      for (let c = 0; c < NUM_COLS; c++) {
        const node = pfGrid[r][c];
        const cell = document.createElement('div');
        cell.id = `pf-node-${r}-${c}`;
        cell.dataset.row = r;
        cell.dataset.col = c;

        let cellClass = 'bg-neutral-950 border border-neutral-900/60 hover:bg-neutral-850';
        if (node.isStart) {
          cellClass = 'bg-emerald-500 text-black border border-emerald-400 shadow-xs shadow-emerald-500/40';
        } else if (node.isEnd) {
          cellClass = 'bg-rose-500 text-white border border-rose-400 shadow-xs shadow-rose-500/40';
        } else if (node.isPath) {
          cellClass = 'animate-path';
        } else if (node.isVisited) {
          cellClass = 'animate-visited';
        } else if (node.isWall) {
          cellClass = 'bg-neutral-800 border border-neutral-700 animate-wall';
        } else if (node.weight > 1) {
          cellClass = 'bg-amber-950/40 border border-amber-600/60 text-amber-300';
        }

        cell.className = `w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-[3px] cursor-pointer transition-colors duration-75 text-[10px] relative ${cellClass}`;

        if (node.isStart) {
          cell.innerHTML = '<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        } else if (node.isEnd) {
          cell.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
        } else if (!node.isWall && node.weight > 1) {
          cell.innerHTML = `<span class="weight-badge">${node.weight}</span>`;
        }

        // Cell Interactions
        cell.addEventListener('mousedown', (e) => {
          e.preventDefault();
          if (isPfRunning) return;
          isGridMouseDown = true;
          if (node.isStart) {
            gridDragMode = 'start';
          } else if (node.isEnd) {
            gridDragMode = 'end';
          } else {
            gridDragMode = 'draw';
            togglePfNode(r, c);
          }
        });

        cell.addEventListener('mouseenter', () => {
          if (!isGridMouseDown || isPfRunning) return;
          if (gridDragMode === 'start') {
            if (!node.isEnd && !node.isWall) {
              startNode = { row: r, col: c };
              initPfGridFromPositions();
            }
          } else if (gridDragMode === 'end') {
            if (!node.isStart && !node.isWall) {
              endNode = { row: r, col: c };
              initPfGridFromPositions();
            }
          } else if (gridDragMode === 'draw') {
            if (!node.isStart && !node.isEnd) {
              togglePfNode(r, c);
            }
          }
        });

        rowEl.appendChild(cell);
      }
      pfGridContainer.appendChild(rowEl);
    }

    // Info card update
    const info = PATHFINDING_ALGORITHMS_INFO[currentPfAlgo];
    document.getElementById('pf-info-name').textContent = info.name;
    document.getElementById('pf-info-summary').textContent = info.summary;
    document.getElementById('pf-info-shortest').textContent = info.guaranteesShortestPath ? 'Yes' : 'No';
    document.getElementById('pf-info-weighted').textContent = info.weighted ? 'Yes' : 'No';
    document.getElementById('pf-info-time').textContent = info.timeComplexity;
    document.getElementById('pf-info-space').textContent = info.spaceComplexity;

    // Badge styling for Weighted status in strip
    if (info.weighted) {
      pfStatCostBadge.textContent = 'Weighted';
      pfStatCostBadge.className = 'text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold';
    } else {
      pfStatCostBadge.textContent = 'Unweighted';
      pfStatCostBadge.className = 'text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal';
    }

    updatePfAlgorithmSupportUI();
  }

  function initPfGridFromPositions() {
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        pfGrid[r][c].isStart = r === startNode.row && c === startNode.col;
        pfGrid[r][c].isEnd = r === endNode.row && c === endNode.col;
        pfGrid[r][c].isVisited = false;
        pfGrid[r][c].isPath = false;
      }
    }
    pfStatVisited.textContent = '0';
    pfStatPath.textContent = '0';
    pfStatCost.textContent = '0';
    pfStatStatus.textContent = 'Ready';
    renderPfGrid();
  }

  function togglePfNode(r, c) {
    const node = pfGrid[r][c];
    if (node.isStart || node.isEnd) return;

    if (currentDrawTool === 'wall') {
      node.isWall = !node.isWall;
      node.weight = 1;
    } else if (currentDrawTool === 'weight' && PATHFINDING_ALGORITHMS_INFO[currentPfAlgo]?.weighted) {
      node.isWall = false;
      node.weight = node.weight === weightValue ? 1 : weightValue;
    }
    renderPfGrid();
  }

  document.addEventListener('mouseup', () => {
    isGridMouseDown = false;
    gridDragMode = null;
  });

  // Algorithm tabs for Pathfinding
  document.querySelectorAll('.pf-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isPfRunning) return;
      document.querySelectorAll('.pf-tab-btn').forEach((b) => {
        b.className = 'pf-tab-btn flex-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap text-center transition-colors text-neutral-400 hover:text-white cursor-pointer';
      });
      btn.className = 'pf-tab-btn flex-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap text-center transition-colors bg-neutral-800 text-white font-semibold cursor-pointer';
      currentPfAlgo = btn.getAttribute('data-pf-algo');

      // If switching to an unweighted algorithm, clean off any lingering weights from the grid
      const isWeighted = PATHFINDING_ALGORITHMS_INFO[currentPfAlgo]?.weighted;
      if (!isWeighted) {
        for (let r = 0; r < NUM_ROWS; r++) {
          for (let c = 0; c < NUM_COLS; c++) {
            pfGrid[r][c].weight = 1;
          }
        }
      }

      clearPfPath();
    });
  });

  function clearPfPath() {
    if (isPfRunning) return;
    clearPfTimeouts();
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        pfGrid[r][c].isVisited = false;
        pfGrid[r][c].isPath = false;
      }
    }
    pfStatVisited.textContent = '0';
    pfStatPath.textContent = '0';
    pfStatCost.textContent = '0';
    pfStatStatus.textContent = 'Ready';
    renderPfGrid();
  }

  pfClearPathBtn.addEventListener('click', clearPfPath);

  pfClearBoardBtn.addEventListener('click', () => {
    if (isPfRunning) return;
    clearPfTimeouts();
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        pfGrid[r][c].isWall = false;
        pfGrid[r][c].weight = 1;
        pfGrid[r][c].isVisited = false;
        pfGrid[r][c].isPath = false;
      }
    }
    pfStatVisited.textContent = '0';
    pfStatPath.textContent = '0';
    pfStatCost.textContent = '0';
    pfStatStatus.textContent = 'Ready';
    renderPfGrid();
  });

  // Random Maze generator
  pfMazeBtn.addEventListener('click', () => {
    if (isPfRunning) return;
    clearPfTimeouts();
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        const isStart = r === startNode.row && c === startNode.col;
        const isEnd = r === endNode.row && c === endNode.col;
        pfGrid[r][c].isVisited = false;
        pfGrid[r][c].isPath = false;
        pfGrid[r][c].weight = 1;
        if (!isStart && !isEnd) {
          pfGrid[r][c].isWall = Math.random() < 0.28;
        } else {
          pfGrid[r][c].isWall = false;
        }
      }
    }
    pfStatVisited.textContent = '0';
    pfStatPath.textContent = '0';
    pfStatCost.textContent = '0';
    pfStatStatus.textContent = 'Ready';
    renderPfGrid();
  });

  // Random Weight generator (random positions and varied random weight values)
  pfRandomWeightBtn.addEventListener('click', () => {
    if (isPfRunning || !PATHFINDING_ALGORITHMS_INFO[currentPfAlgo]?.weighted) return;
    clearPfTimeouts();
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        const isStart = r === startNode.row && c === startNode.col;
        const isEnd = r === endNode.row && c === endNode.col;
        pfGrid[r][c].isVisited = false;
        pfGrid[r][c].isPath = false;
        pfGrid[r][c].isWall = false;
        if (!isStart && !isEnd) {
          // 25% chance of being weighted, with diverse random weights from 2 to 20
          if (Math.random() < 0.25) {
            pfGrid[r][c].weight = Math.floor(Math.random() * 19) + 2;
          } else {
            pfGrid[r][c].weight = 1;
          }
        } else {
          pfGrid[r][c].weight = 1;
        }
      }
    }
    pfStatVisited.textContent = '0';
    pfStatPath.textContent = '0';
    pfStatCost.textContent = '0';
    pfStatStatus.textContent = 'Ready';
    renderPfGrid();
  });

  // Visualization Runner with Live Weight Decrements
  pfVisualizeBtn.addEventListener('click', () => {
    if (isPfRunning) return;
    clearPfTimeouts();

    // Reset visited and path states and restore current visual weight numbers
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        pfGrid[r][c].isVisited = false;
        pfGrid[r][c].isPath = false;
      }
    }
    renderPfGrid();

    isPfRunning = true;
    pfVisualizeText.textContent = 'Searching...';
    pfStatStatus.textContent = 'Searching...';
    pfStatStatus.className = 'text-amber-400 font-semibold';

    const { animationEvents, shortestPathNodesInOrder, totalCost } = runPathfinding(
      currentPfAlgo,
      pfGrid,
      startNode,
      endNode
    );

    let visitedCount = 0;

    animationEvents.forEach((ev, idx) => {
      const timeoutId = setTimeout(() => {
        const cell = document.getElementById(`pf-node-${ev.row}-${ev.col}`);
        if (!cell) return;

        if (ev.type === 'decrement') {
          // Decrement the visible badge value in real-time
          let badge = cell.querySelector('.weight-badge');
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'weight-badge';
            cell.appendChild(badge);
          }
          badge.textContent = ev.remainingWeight;

          // Pulse animation on decrement
          cell.classList.remove('weight-decrement-pulse');
          void cell.offsetWidth; // Force CSS reflow
          cell.classList.add('weight-decrement-pulse');

          if (!isMuted) {
            soundSynth.playTone(ev.remainingWeight * 8, 1, 40, 0.03, 'triangle');
          }
        } else if (ev.type === 'visited') {
          cell.classList.remove('weight-decrement-pulse');
          cell.classList.add('animate-visited');
          visitedCount++;
          pfStatVisited.textContent = visitedCount;

          if (!isMuted && visitedCount % 2 === 0) {
            soundSynth.playPathExplore(visitedCount, animationEvents.length);
          }
        }

        if (idx === animationEvents.length - 1) {
          animateShortestPath(shortestPathNodesInOrder, totalCost);
        }
      }, idx * pfSpeedMs);

      pfTimeouts.push(timeoutId);
    });

    if (animationEvents.length === 0) {
      isPfRunning = false;
      pfVisualizeText.textContent = 'Visualize';
      pfStatStatus.textContent = 'No Path Found';
      pfStatStatus.className = 'text-rose-400 font-semibold';
    }
  });

  function animateShortestPath(pathNodes, totalCost) {
    if (pathNodes.length === 0) {
      isPfRunning = false;
      pfVisualizeText.textContent = 'Visualize';
      pfStatStatus.textContent = 'No Path Found';
      pfStatStatus.className = 'text-rose-400 font-semibold';
      return;
    }

    pathNodes.forEach((node, idx) => {
      const timeoutId = setTimeout(() => {
        const cell = document.getElementById(`pf-node-${node.row}-${node.col}`);
        const isS = node.row === startNode.row && node.col === startNode.col;
        const isE = node.row === endNode.row && node.col === endNode.col;

        if (cell && !isS && !isE) {
          cell.classList.remove('animate-visited', 'weight-decrement-pulse');
          cell.classList.add('animate-path');

          // If this cell was weighted, display its original weight on top of the glowing path
          const origWeight = pfGrid[node.row][node.col].weight;
          if (origWeight > 1) {
            let badge = cell.querySelector('.weight-badge');
            if (badge) badge.textContent = origWeight;
          }
        }
        pfStatPath.textContent = idx + 1;

        if (!isMuted) {
          soundSynth.playPathNode(idx, pathNodes.length);
        }

        if (idx === pathNodes.length - 1) {
          isPfRunning = false;
          pfVisualizeText.textContent = 'Visualize';
          pfStatCost.textContent = totalCost;
          pfStatStatus.textContent = `Target Reached (Cost: ${totalCost})`;
          pfStatStatus.className = 'text-emerald-400 font-semibold';
        }
      }, idx * Math.max(20, pfSpeedMs * 1.5));

      pfTimeouts.push(timeoutId);
    });
  }

  // Initial setup
  updateAudioUI();
  updatePfWeightUI();
  setDrawTool('wall');
  renderSortingView();
  renderPfGrid();
});
