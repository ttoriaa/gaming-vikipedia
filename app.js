const boardEl = document.getElementById("board");
const trailLayerEl = document.getElementById("trailLayer");
const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const statusTitleEl = document.getElementById("statusTitle");
const statusEl = document.getElementById("status");
const turnEl = document.getElementById("turn");
const lastMoveEl = document.getElementById("lastMove");
const aiOpt1El = document.getElementById("aiOpt1");
const aiOpt2El = document.getElementById("aiOpt2");
const aiOpt3El = document.getElementById("aiOpt3");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const aiLevelEl = document.getElementById("aiLevel");
const tipsTitleEl = document.getElementById("tipsTitle");
const tip1El = document.getElementById("tip1");
const tip2El = document.getElementById("tip2");
const tip3El = document.getElementById("tip3");
const langZhBtn = document.getElementById("langZhBtn");
const langEnBtn = document.getElementById("langEnBtn");

const tabButtons = [...document.querySelectorAll(".tab-btn")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];

const g2048GridEl = document.getElementById("g2048Grid");
const g2048StateEl = document.getElementById("g2048State");
const g2048ScoreEl = document.getElementById("g2048Score");
const g2048BestEl = document.getElementById("g2048Best");
const g2048NewBtn = document.getElementById("g2048NewBtn");

const sudokuGridEl = document.getElementById("sudokuGrid");
const sudokuStateEl = document.getElementById("sudokuState");
const sudokuNewBtn = document.getElementById("sudokuNewBtn");
const sudokuCheckBtn = document.getElementById("sudokuCheckBtn");
const sudokuSolveBtn = document.getElementById("sudokuSolveBtn");

const PIECE_MAP = {
  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
};

const PIECE_VALUE = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

let game = new Chess();
let selectedSquare = null;
let possibleMoves = [];
let isAiThinking = false;
let lastMovePath = null;
let currentLanguage = "zh";

const I18N = {
  zh: {
    htmlLang: "zh-CN",
    title: "///M Chess",
    subtitle: "Sheer Driving Pleasure.",
    statusTitle: "对局状态",
    ai1: "简单（随机）",
    ai2: "中等（贪心）",
    ai3: "困难（浅层搜索）",
    undo: "悔棋",
    reset: "重新开始",
    tipsTitle: "说明",
    tip1: "支持将军、将死、和棋判定。",
    tip2: "兵升变默认升后。",
    tip3: "悔棋会回退双方各一步。",
    turnLabel: "当前回合",
    white: "白棋",
    black: "黑棋",
    lastMoveLabel: "上一步",
    checkmateWhiteWin: "黑棋将死，白棋获胜",
    checkmateBlackWin: "白棋将死，黑棋获胜",
    draw: "和棋",
    check: "{turn}被将军",
    aiThinking: "电脑思考中...",
    inProgress: "对局进行中",
  },
  en: {
    htmlLang: "en",
    title: "///M Chess",
    subtitle: "Sheer Driving Pleasure.",
    statusTitle: "Game Status",
    ai1: "Easy (Random)",
    ai2: "Medium (Greedy)",
    ai3: "Hard (Shallow Search)",
    undo: "Undo",
    reset: "Restart",
    tipsTitle: "Tips",
    tip1: "Check, checkmate, and draw are fully supported.",
    tip2: "Pawn promotion defaults to queen.",
    tip3: "Undo rolls back one move for both sides.",
    turnLabel: "Turn",
    white: "White",
    black: "Black",
    lastMoveLabel: "Last move",
    checkmateWhiteWin: "Checkmate: White wins",
    checkmateBlackWin: "Checkmate: Black wins",
    draw: "Draw",
    check: "{turn} is in check",
    aiThinking: "AI is thinking...",
    inProgress: "Game in progress",
  },
};

function t(key) {
  return I18N[currentLanguage][key];
}

function getTurnTextByColor(color) {
  return color === "w" ? t("white") : t("black");
}

function renderStaticText() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("title");
  pageTitleEl.textContent = t("title");
  pageSubtitleEl.textContent = t("subtitle");
  statusTitleEl.textContent = t("statusTitle");
  aiOpt1El.textContent = t("ai1");
  aiOpt2El.textContent = t("ai2");
  aiOpt3El.textContent = t("ai3");
  undoBtn.textContent = t("undo");
  resetBtn.textContent = t("reset");
  tipsTitleEl.textContent = t("tipsTitle");
  tip1El.textContent = t("tip1");
  tip2El.textContent = t("tip2");
  tip3El.textContent = t("tip3");
  langZhBtn.classList.toggle("is-active", currentLanguage === "zh");
  langEnBtn.classList.toggle("is-active", currentLanguage === "en");
}

function renderTurnText() {
  turnEl.textContent = `${t("turnLabel")}: ${getTurnTextByColor(game.turn())}`;
}

function renderLastMoveText() {
  if (!lastMovePath) {
    lastMoveEl.textContent = `${t("lastMoveLabel")}: -`;
    return;
  }
  lastMoveEl.textContent = `${t("lastMoveLabel")}: ${lastMovePath.from} -> ${lastMovePath.to}`;
}

function squareName(rankIndex, fileIndex) {
  return `${FILES[fileIndex]}${8 - rankIndex}`;
}

function isLightSquare(rankIndex, fileIndex) {
  return (rankIndex + fileIndex) % 2 === 0;
}

function squareToPoint(square) {
  const fileIndex = FILES.indexOf(square[0]);
  const rankIndex = 8 - Number(square[1]);
  return {
    x: ((fileIndex + 0.5) / 8) * 100,
    y: ((rankIndex + 0.5) / 8) * 100,
  };
}

function renderMoveTrail() {
  trailLayerEl.innerHTML = "";
  if (!lastMovePath) {
    return;
  }

  const from = squareToPoint(lastMovePath.from);
  const to = squareToPoint(lastMovePath.to);

  trailLayerEl.innerHTML = `
    <defs>
      <marker id="trailArrow" markerWidth="3" markerHeight="3" refX="2.7" refY="1.5" orient="auto" markerUnits="strokeWidth">
        <path d="M 0 0 L 3 1.5 L 0 3 z" fill="#111111"></path>
      </marker>
    </defs>
    <line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#111111" stroke-width="0.75" stroke-linecap="round" marker-end="url(#trailArrow)" stroke-dasharray="2.4 2.4" opacity="0.66"></line>
  `;
}

function syncLastMoveFromHistory() {
  const history = game.history({ verbose: true });
  const last = history[history.length - 1];
  if (!last) {
    lastMovePath = null;
    renderLastMoveText();
    return;
  }
  lastMovePath = { from: last.from, to: last.to };
  renderLastMoveText();
}

function renderBoard() {
  boardEl.innerHTML = "";

  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
      const square = squareName(rankIndex, fileIndex);
      const piece = game.get(square);
      const squareEl = document.createElement("button");
      squareEl.type = "button";
      squareEl.className = `square ${isLightSquare(rankIndex, fileIndex) ? "light" : "dark"}`;
      squareEl.dataset.square = square;
      squareEl.ariaLabel = square;

      if (piece) {
        const key = piece.color === "w" ? piece.type.toUpperCase() : piece.type;
        const pieceEl = document.createElement("span");
        pieceEl.className = `piece ${piece.color === "w" ? "white-piece" : "black-piece"}`;
        pieceEl.textContent = PIECE_MAP[key];
        squareEl.appendChild(pieceEl);
      }

      if (selectedSquare === square) {
        squareEl.classList.add("selected");
      }

      const matchingMove = possibleMoves.find((m) => m.to === square);
      if (matchingMove) {
        squareEl.classList.add(matchingMove.captured ? "capture" : "hint");
      }

      if (lastMovePath && lastMovePath.to === square) {
        squareEl.classList.add("last-to");
      }

      boardEl.appendChild(squareEl);
    }
  }

  renderMoveTrail();
}

function getTurnText() {
  return getTurnTextByColor(game.turn());
}

function updateStatus(lastMove = null) {
  renderTurnText();

  if (lastMove) {
    lastMovePath = { from: lastMove.from, to: lastMove.to };
  }
  renderLastMoveText();

  if (game.in_checkmate()) {
    statusEl.textContent = game.turn() === "w" ? t("checkmateBlackWin") : t("checkmateWhiteWin");
    return;
  }

  if (game.in_draw()) {
    statusEl.textContent = t("draw");
    return;
  }

  if (game.in_check()) {
    statusEl.textContent = t("check").replace("{turn}", getTurnText());
    return;
  }

  statusEl.textContent = isAiThinking ? t("aiThinking") : t("inProgress");
}

function clearSelection() {
  selectedSquare = null;
  possibleMoves = [];
}

function getMovesForSquare(square) {
  return game.moves({ square, verbose: true });
}

function userMove(from, to) {
  const move = game.move({ from, to, promotion: "q" });
  if (!move) {
    return false;
  }

  lastMovePath = { from: move.from, to: move.to };
  clearSelection();
  renderBoard();
  updateStatus(move);

  if (!game.game_over()) {
    window.setTimeout(aiMove, 220);
  }

  return true;
}

function evaluateBoard() {
  let score = 0;

  for (let rank = 1; rank <= 8; rank += 1) {
    for (const file of FILES) {
      const piece = game.get(`${file}${rank}`);
      if (!piece) {
        continue;
      }

      const value = PIECE_VALUE[piece.type] || 0;
      score += piece.color === "b" ? value : -value;
    }
  }

  return score;
}

function minimax(depth, alpha, beta, maximizingPlayer) {
  if (depth === 0 || game.game_over()) {
    return evaluateBoard();
  }

  const moves = game.moves({ verbose: true });

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of moves) {
    game.move(move);
    const evalScore = minimax(depth - 1, alpha, beta, true);
    game.undo();
    minEval = Math.min(minEval, evalScore);
    beta = Math.min(beta, evalScore);
    if (beta <= alpha) {
      break;
    }
  }
  return minEval;
}

function pickAiMove(level) {
  const moves = game.moves({ verbose: true });
  if (!moves.length) {
    return null;
  }

  if (level === "1") {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (level === "2") {
    const weighted = moves
      .map((move) => {
        let score = 0;
        if (move.captured) {
          score += PIECE_VALUE[move.captured] || 0;
        }
        if (move.flags.includes("p")) {
          score += 850;
        }
        if (move.san.includes("+")) {
          score += 40;
        }
        return { move, score };
      })
      .sort((a, b) => b.score - a.score);

    const bestScore = weighted[0].score;
    const topMoves = weighted.filter((item) => item.score === bestScore);
    return topMoves[Math.floor(Math.random() * topMoves.length)].move;
  }

  let bestMove = null;
  let bestEval = -Infinity;
  const depth = 2;

  for (const move of moves) {
    game.move(move);
    const evalScore = minimax(depth - 1, -Infinity, Infinity, false);
    game.undo();

    if (evalScore > bestEval) {
      bestEval = evalScore;
      bestMove = move;
    }
  }

  return bestMove || moves[Math.floor(Math.random() * moves.length)];
}

function aiMove() {
  if (game.game_over() || game.turn() !== "b") {
    return;
  }

  isAiThinking = true;
  updateStatus();

  window.setTimeout(() => {
    const aiMoveChoice = pickAiMove(aiLevelEl.value);
    if (aiMoveChoice) {
      const move = game.move({
        from: aiMoveChoice.from,
        to: aiMoveChoice.to,
        promotion: "q",
      });
      lastMovePath = { from: move.from, to: move.to };
      renderBoard();
      isAiThinking = false;
      updateStatus(move);
      return;
    }

    isAiThinking = false;
    updateStatus();
  }, 120);
}

function handleSquareClick(square) {
  if (isAiThinking || game.game_over() || game.turn() !== "w") {
    return;
  }

  const clickedPiece = game.get(square);

  if (selectedSquare) {
    const validMove = possibleMoves.some((move) => move.to === square);
    if (validMove) {
      userMove(selectedSquare, square);
      return;
    }
  }

  if (clickedPiece && clickedPiece.color === "w") {
    selectedSquare = square;
    possibleMoves = getMovesForSquare(square);
    renderBoard();
    return;
  }

  clearSelection();
  renderBoard();
}

boardEl.addEventListener("click", (event) => {
  const target = event.target.closest(".square");
  if (!target) {
    return;
  }
  handleSquareClick(target.dataset.square);
});

resetBtn.addEventListener("click", () => {
  game = new Chess();
  clearSelection();
  isAiThinking = false;
  lastMovePath = null;
  renderLastMoveText();
  renderBoard();
  updateStatus();
});

undoBtn.addEventListener("click", () => {
  if (isAiThinking) {
    return;
  }

  game.undo();
  game.undo();
  clearSelection();
  syncLastMoveFromHistory();
  renderBoard();
  updateStatus();
});

langZhBtn.addEventListener("click", () => {
  currentLanguage = "zh";
  renderStaticText();
  updateStatus();
});

langEnBtn.addEventListener("click", () => {
  currentLanguage = "en";
  renderStaticText();
  updateStatus();
});

let g2048Board = [];
let g2048Score = 0;
let g2048Best = 0;

const TILE_COLORS = {
  0: "#1f2937",
  2: "#dbeafe",
  4: "#bfdbfe",
  8: "#93c5fd",
  16: "#60a5fa",
  32: "#38bdf8",
  64: "#0ea5e9",
  128: "#38bdf8",
  256: "#3b82f6",
  512: "#2563eb",
  1024: "#1d4ed8",
  2048: "#e8334a",
};

function init2048Board() {
  g2048Board = Array.from({ length: 4 }, () => Array(4).fill(0));
  g2048Score = 0;
  addRandomTile();
  addRandomTile();
  render2048();
  g2048StateEl.textContent = "进行中";
}

function addRandomTile() {
  const empty = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      if (g2048Board[r][c] === 0) {
        empty.push([r, c]);
      }
    }
  }
  if (!empty.length) {
    return;
  }
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  g2048Board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function compactLine(line) {
  const values = line.filter((n) => n !== 0);
  const out = [];
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] === values[i + 1]) {
      const merged = values[i] * 2;
      out.push(merged);
      g2048Score += merged;
      i += 1;
    } else {
      out.push(values[i]);
    }
  }
  while (out.length < 4) {
    out.push(0);
  }
  return out;
}

function move2048(direction) {
  const old = JSON.stringify(g2048Board);

  if (direction === "left") {
    g2048Board = g2048Board.map((row) => compactLine(row));
  }

  if (direction === "right") {
    g2048Board = g2048Board.map((row) => compactLine([...row].reverse()).reverse());
  }

  if (direction === "up") {
    for (let c = 0; c < 4; c += 1) {
      const col = compactLine([g2048Board[0][c], g2048Board[1][c], g2048Board[2][c], g2048Board[3][c]]);
      for (let r = 0; r < 4; r += 1) {
        g2048Board[r][c] = col[r];
      }
    }
  }

  if (direction === "down") {
    for (let c = 0; c < 4; c += 1) {
      const col = compactLine([g2048Board[3][c], g2048Board[2][c], g2048Board[1][c], g2048Board[0][c]]).reverse();
      for (let r = 0; r < 4; r += 1) {
        g2048Board[r][c] = col[r];
      }
    }
  }

  const changed = JSON.stringify(g2048Board) !== old;
  if (changed) {
    addRandomTile();
  }
  render2048();

  if (!canMove2048()) {
    g2048StateEl.textContent = "游戏结束";
  }

  if (has2048Tile()) {
    g2048StateEl.textContent = "你达成 2048!";
  }
}

function has2048Tile() {
  return g2048Board.some((row) => row.some((n) => n >= 2048));
}

function canMove2048() {
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const v = g2048Board[r][c];
      if (v === 0) {
        return true;
      }
      if (r < 3 && v === g2048Board[r + 1][c]) {
        return true;
      }
      if (c < 3 && v === g2048Board[r][c + 1]) {
        return true;
      }
    }
  }
  return false;
}

function render2048() {
  g2048GridEl.innerHTML = "";
  g2048Best = Math.max(g2048Best, g2048Score);
  g2048ScoreEl.textContent = `Score: ${g2048Score}`;
  g2048BestEl.textContent = `Best: ${g2048Best}`;

  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const value = g2048Board[r][c];
      const cell = document.createElement("div");
      cell.className = `g2048-cell ${value ? "has-value" : ""}`;
      cell.style.background = TILE_COLORS[value] || "#e8334a";
      cell.textContent = value || "";
      g2048GridEl.appendChild(cell);
    }
  }
}

g2048NewBtn.addEventListener("click", init2048Board);

window.addEventListener("keydown", (event) => {
  const activeTab = document.querySelector(".tab-btn.is-active");
  const tabName = activeTab ? activeTab.dataset.tab : "chess";

  if (tabName === "g2048") {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      move2048("up");
    }
    if (event.key === "ArrowDown") {
      move2048("down");
    }
    if (event.key === "ArrowLeft") {
      move2048("left");
    }
    if (event.key === "ArrowRight") {
      move2048("right");
    }
  }
});

const SUDOKU_PUZZLES = [
  {
    puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  },
  {
    puzzle: "300200000000107000706030500070009080900020004010800050009040301000702000000008006",
    solution: "351286497492157638786934512275469183938521764614873259829645371163792845547318926",
  },
  {
    puzzle: "009000000080605020501078000000000700706040102004000000000720903090301080000000600",
    solution: "249813567387695421561478239132569748756342192894187356615724983972361485438951672",
  },
];

let sudokuPuzzle = null;
let sudokuSolution = null;

function buildSudokuGrid() {
  sudokuGridEl.innerHTML = "";
  for (let idx = 0; idx < 81; idx += 1) {
    const input = document.createElement("input");
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const given = sudokuPuzzle[idx] !== "0";
    input.type = "text";
    input.maxLength = 1;
    input.className = "sudoku-cell";
    input.dataset.index = String(idx);

    if ((col + 1) % 3 === 0 && col !== 8) {
      input.classList.add("right-edge");
    }
    if ((row + 1) % 3 === 0 && row !== 8) {
      input.classList.add("bottom-edge");
    }

    if (given) {
      input.value = sudokuPuzzle[idx];
      input.classList.add("given");
      input.readOnly = true;
    }

    input.addEventListener("input", () => {
      input.classList.remove("bad");
      input.value = input.value.replace(/[^1-9]/g, "").slice(0, 1);
      sudokuStateEl.textContent = "进行中";
    });

    sudokuGridEl.appendChild(input);
  }
}

function pickSudoku() {
  const chosen = SUDOKU_PUZZLES[Math.floor(Math.random() * SUDOKU_PUZZLES.length)];
  sudokuPuzzle = chosen.puzzle;
  sudokuSolution = chosen.solution;
  buildSudokuGrid();
  sudokuStateEl.textContent = "进行中";
}

function checkSudoku() {
  const cells = [...sudokuGridEl.querySelectorAll(".sudoku-cell")];
  let hasError = false;
  let complete = true;

  cells.forEach((cell, idx) => {
    if (cell.classList.contains("given")) {
      return;
    }

    cell.classList.remove("bad");
    const value = cell.value;
    if (!value) {
      complete = false;
      return;
    }

    if (value !== sudokuSolution[idx]) {
      hasError = true;
      cell.classList.add("bad");
    }
  });

  if (hasError) {
    sudokuStateEl.textContent = "有错误，已标红";
    return;
  }

  if (!complete) {
    sudokuStateEl.textContent = "暂无错误，继续加油";
    return;
  }

  sudokuStateEl.textContent = "完成! Perfect.";
}

function solveSudoku() {
  const cells = [...sudokuGridEl.querySelectorAll(".sudoku-cell")];
  cells.forEach((cell, idx) => {
    cell.value = sudokuSolution[idx];
    cell.classList.remove("bad");
  });
  sudokuStateEl.textContent = "答案已揭晓";
}

sudokuNewBtn.addEventListener("click", pickSudoku);
sudokuCheckBtn.addEventListener("click", checkSudoku);
sudokuSolveBtn.addEventListener("click", solveSudoku);

function activateTab(tabName) {
  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

renderStaticText();
renderBoard();
updateStatus();
init2048Board();
pickSudoku();
