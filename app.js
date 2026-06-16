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
const g2048TitleEl = document.getElementById("g2048Title");
const g2048DescEl = document.getElementById("g2048Desc");
const g2048StatusTitleEl = document.getElementById("g2048StatusTitle");
const g2048StateEl = document.getElementById("g2048State");
const g2048ScoreEl = document.getElementById("g2048Score");
const g2048BestEl = document.getElementById("g2048Best");
const g2048NewBtn = document.getElementById("g2048NewBtn");
const g2048TouchTitleEl = document.getElementById("g2048TouchTitle");
const g2048UpBtn = document.getElementById("g2048UpBtn");
const g2048LeftBtn = document.getElementById("g2048LeftBtn");
const g2048DownBtn = document.getElementById("g2048DownBtn");
const g2048RightBtn = document.getElementById("g2048RightBtn");
const g2048TipsTitleEl = document.getElementById("g2048TipsTitle");
const g2048Tip1El = document.getElementById("g2048Tip1");
const g2048Tip2El = document.getElementById("g2048Tip2");
const g2048Tip3El = document.getElementById("g2048Tip3");
const g2048LangZhBtn = document.getElementById("g2048LangZhBtn");
const g2048LangEnBtn = document.getElementById("g2048LangEnBtn");

const sudokuGridEl = document.getElementById("sudokuGrid");
const sudokuTitleEl = document.getElementById("sudokuTitle");
const sudokuDescEl = document.getElementById("sudokuDesc");
const sudokuStatusTitleEl = document.getElementById("sudokuStatusTitle");
const sudokuStateEl = document.getElementById("sudokuState");
const sudokuNewBtn = document.getElementById("sudokuNewBtn");
const sudokuCheckBtn = document.getElementById("sudokuCheckBtn");
const sudokuSolveBtn = document.getElementById("sudokuSolveBtn");
const sudokuTipsTitleEl = document.getElementById("sudokuTipsTitle");
const sudokuTip1El = document.getElementById("sudokuTip1");
const sudokuTip2El = document.getElementById("sudokuTip2");
const sudokuTip3El = document.getElementById("sudokuTip3");
const sudokuLangZhBtn = document.getElementById("sudokuLangZhBtn");
const sudokuLangEnBtn = document.getElementById("sudokuLangEnBtn");

const snakeTitleEl = document.getElementById("snakeTitle");
const snakeDescEl = document.getElementById("snakeDesc");
const snakeBoardEl = document.getElementById("snakeBoard");
const snakeTouchTitleEl = document.getElementById("snakeTouchTitle");
const snakeStatusTitleEl = document.getElementById("snakeStatusTitle");
const snakeStateEl = document.getElementById("snakeState");
const snakeScoreEl = document.getElementById("snakeScore");
const snakeBestEl = document.getElementById("snakeBest");
const snakeStartBtn = document.getElementById("snakeStartBtn");
const snakeResetBtn = document.getElementById("snakeResetBtn");
const snakeTipsTitleEl = document.getElementById("snakeTipsTitle");
const snakeTip1El = document.getElementById("snakeTip1");
const snakeTip2El = document.getElementById("snakeTip2");
const snakeTip3El = document.getElementById("snakeTip3");
const snakeUpBtn = document.getElementById("snakeUpBtn");
const snakeLeftBtn = document.getElementById("snakeLeftBtn");
const snakeDownBtn = document.getElementById("snakeDownBtn");
const snakeRightBtn = document.getElementById("snakeRightBtn");
const snakeLangZhBtn = document.getElementById("snakeLangZhBtn");
const snakeLangEnBtn = document.getElementById("snakeLangEnBtn");

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
    title: "///M Playground",
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
    title: "///M Playground",
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
let g2048Language = "zh";
let g2048StatusKey = "ready";

const G2048_I18N = {
  zh: {
    title: "///M 2048",
    desc: "合并数字，冲击 2048。支持方向键、滑动手势和屏幕方向按钮。",
    statusTitle: "游戏状态",
    stateReady: "准备开始",
    statePlaying: "进行中",
    stateGameOver: "游戏结束",
    stateWin: "你达成 2048!",
    score: "分数",
    best: "最高分",
    newGame: "新开一局",
    touchTitle: "触控方向",
    tipsTitle: "提示",
    tip1: "同数字相撞会合并并得分。",
    tip2: "每步后随机出现一个新数字。",
    tip3: "无法移动时游戏结束。",
  },
  en: {
    title: "///M 2048",
    desc: "Merge tiles and chase 2048. Use arrow keys, swipe gestures, or on-screen buttons.",
    statusTitle: "Game Status",
    stateReady: "Ready",
    statePlaying: "In progress",
    stateGameOver: "Game over",
    stateWin: "You reached 2048!",
    score: "Score",
    best: "Best",
    newGame: "New Game",
    touchTitle: "Touch Controls",
    tipsTitle: "Tips",
    tip1: "Matching tiles merge and increase your score.",
    tip2: "A new tile appears after each valid move.",
    tip3: "The game ends when no move is possible.",
  },
};

function t2048(key) {
  return G2048_I18N[g2048Language][key];
}

function get2048StateText() {
  if (g2048StatusKey === "ready") {
    return t2048("stateReady");
  }
  if (g2048StatusKey === "playing") {
    return t2048("statePlaying");
  }
  if (g2048StatusKey === "gameOver") {
    return t2048("stateGameOver");
  }
  return t2048("stateWin");
}

function render2048StaticText() {
  g2048TitleEl.textContent = t2048("title");
  g2048DescEl.textContent = t2048("desc");
  g2048StatusTitleEl.textContent = t2048("statusTitle");
  g2048StateEl.textContent = get2048StateText();
  g2048ScoreEl.textContent = `${t2048("score")}: ${g2048Score}`;
  g2048BestEl.textContent = `${t2048("best")}: ${g2048Best}`;
  g2048NewBtn.textContent = t2048("newGame");
  g2048TouchTitleEl.textContent = t2048("touchTitle");
  g2048TipsTitleEl.textContent = t2048("tipsTitle");
  g2048Tip1El.textContent = t2048("tip1");
  g2048Tip2El.textContent = t2048("tip2");
  g2048Tip3El.textContent = t2048("tip3");
  g2048LangZhBtn.classList.toggle("is-active", g2048Language === "zh");
  g2048LangEnBtn.classList.toggle("is-active", g2048Language === "en");
}

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
  g2048StatusKey = "playing";
  addRandomTile();
  addRandomTile();
  render2048();
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
    g2048StatusKey = "playing";
    addRandomTile();
  }
  render2048();

  if (!canMove2048()) {
    g2048StatusKey = "gameOver";
    render2048StaticText();
  }

  if (has2048Tile()) {
    g2048StatusKey = "win";
    render2048StaticText();
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
  render2048StaticText();

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
g2048LangZhBtn.addEventListener("click", () => {
  g2048Language = "zh";
  render2048StaticText();
});
g2048LangEnBtn.addEventListener("click", () => {
  g2048Language = "en";
  render2048StaticText();
});

g2048UpBtn.addEventListener("click", () => move2048("up"));
g2048LeftBtn.addEventListener("click", () => move2048("left"));
g2048DownBtn.addEventListener("click", () => move2048("down"));
g2048RightBtn.addEventListener("click", () => move2048("right"));

let g2048TouchStartX = 0;
let g2048TouchStartY = 0;

g2048GridEl.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }
    g2048TouchStartX = touch.clientX;
    g2048TouchStartY = touch.clientY;
  },
  { passive: true },
);

g2048GridEl.addEventListener(
  "touchend",
  (event) => {
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    const dx = touch.clientX - g2048TouchStartX;
    const dy = touch.clientY - g2048TouchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 24;

    if (Math.max(absX, absY) < threshold) {
      return;
    }

    if (absX > absY) {
      move2048(dx > 0 ? "right" : "left");
      return;
    }

    move2048(dy > 0 ? "down" : "up");
  },
  { passive: true },
);

window.addEventListener("keydown", (event) => {
  const activeTab = document.querySelector(".tab-btn.is-active");
  const tabName = activeTab ? activeTab.dataset.tab : "chess";

  if ((tabName === "g2048" || tabName === "snake") && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }

  if (tabName === "g2048") {
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

  if (tabName === "snake") {
    if (event.key === "ArrowUp") {
      setSnakeDirection("up");
    }
    if (event.key === "ArrowDown") {
      setSnakeDirection("down");
    }
    if (event.key === "ArrowLeft") {
      setSnakeDirection("left");
    }
    if (event.key === "ArrowRight") {
      setSnakeDirection("right");
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
let sudokuLanguage = "zh";
let sudokuStatusKey = "playing";

const SNAKE_SIZE = 20;
let snake = [];
let snakeDirection = "right";
let snakeNextDirection = "right";
let snakeFood = null;
let snakeScore = 0;
let snakeBest = 0;
let snakeSpeed = 170;
let snakeStatus = "ready";
let snakeTimerId = null;
let snakeLanguage = "zh";

const SNAKE_I18N = {
  zh: {
    title: "///M Snake",
    desc: "吃到红点会变长，撞墙或撞到自己就结束。",
    touchTitle: "触控方向",
    statusTitle: "游戏状态",
    stateReady: "准备开始",
    stateRunning: "进行中",
    statePaused: "已暂停",
    stateGameOver: "游戏结束",
    score: "分数",
    best: "最高分",
    startPause: "开始 / 暂停",
    reset: "重新开始",
    tipsTitle: "Tips",
    tip1: "支持方向键和屏幕方向按钮。",
    tip2: "每吃一个食物得 10 分。",
    tip3: "速度会逐渐变快。",
  },
  en: {
    title: "///M Snake",
    desc: "Eat red food to grow. Hit a wall or yourself and the game ends.",
    touchTitle: "Touch Controls",
    statusTitle: "Game Status",
    stateReady: "Ready",
    stateRunning: "In progress",
    statePaused: "Paused",
    stateGameOver: "Game over",
    score: "Score",
    best: "Best",
    startPause: "Start / Pause",
    reset: "Restart",
    tipsTitle: "Tips",
    tip1: "Use arrow keys and on-screen direction buttons.",
    tip2: "Each food gives 10 points.",
    tip3: "Speed gradually increases.",
  },
};

const SUDOKU_I18N = {
  zh: {
    title: "///M Sudoku",
    desc: "填满 9x9 网格，让每行、每列、每宫都包含 1-9。",
    statusTitle: "题目状态",
    statePlaying: "进行中",
    stateError: "有错误，已标红",
    statePartial: "暂无错误，继续加油",
    stateComplete: "完成! Perfect.",
    stateReveal: "答案已揭晓",
    newGame: "新题",
    check: "检查",
    solve: "揭晓答案",
    tipsTitle: "提示",
    tip1: "点击格子后输入 1-9。",
    tip2: "只允许修改非预填数字。",
    tip3: "可随时检查或直接揭晓答案。",
  },
  en: {
    title: "///M Sudoku",
    desc: "Fill the 9x9 grid so each row, column, and box contains 1-9.",
    statusTitle: "Puzzle Status",
    statePlaying: "In progress",
    stateError: "There are mistakes, highlighted in red",
    statePartial: "No mistakes so far, keep going",
    stateComplete: "Complete! Perfect.",
    stateReveal: "Solution revealed",
    newGame: "New Puzzle",
    check: "Check",
    solve: "Reveal Solution",
    tipsTitle: "Tips",
    tip1: "Click a cell, then enter 1-9.",
    tip2: "Only non-given cells are editable.",
    tip3: "Check anytime or reveal the full solution.",
  },
};

function tSudoku(key) {
  return SUDOKU_I18N[sudokuLanguage][key];
}

function getSudokuStateText() {
  if (sudokuStatusKey === "playing") {
    return tSudoku("statePlaying");
  }
  if (sudokuStatusKey === "error") {
    return tSudoku("stateError");
  }
  if (sudokuStatusKey === "partial") {
    return tSudoku("statePartial");
  }
  if (sudokuStatusKey === "complete") {
    return tSudoku("stateComplete");
  }
  return tSudoku("stateReveal");
}

function renderSudokuStaticText() {
  sudokuTitleEl.textContent = tSudoku("title");
  sudokuDescEl.textContent = tSudoku("desc");
  sudokuStatusTitleEl.textContent = tSudoku("statusTitle");
  sudokuStateEl.textContent = getSudokuStateText();
  sudokuNewBtn.textContent = tSudoku("newGame");
  sudokuCheckBtn.textContent = tSudoku("check");
  sudokuSolveBtn.textContent = tSudoku("solve");
  sudokuTipsTitleEl.textContent = tSudoku("tipsTitle");
  sudokuTip1El.textContent = tSudoku("tip1");
  sudokuTip2El.textContent = tSudoku("tip2");
  sudokuTip3El.textContent = tSudoku("tip3");
  sudokuLangZhBtn.classList.toggle("is-active", sudokuLanguage === "zh");
  sudokuLangEnBtn.classList.toggle("is-active", sudokuLanguage === "en");
}

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
      sudokuStatusKey = "playing";
      renderSudokuStaticText();
    });

    sudokuGridEl.appendChild(input);
  }
}

function pickSudoku() {
  const chosen = SUDOKU_PUZZLES[Math.floor(Math.random() * SUDOKU_PUZZLES.length)];
  sudokuPuzzle = chosen.puzzle;
  sudokuSolution = chosen.solution;
  buildSudokuGrid();
  sudokuStatusKey = "playing";
  renderSudokuStaticText();
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
    sudokuStatusKey = "error";
    renderSudokuStaticText();
    return;
  }

  if (!complete) {
    sudokuStatusKey = "partial";
    renderSudokuStaticText();
    return;
  }

  sudokuStatusKey = "complete";
  renderSudokuStaticText();
}

function solveSudoku() {
  const cells = [...sudokuGridEl.querySelectorAll(".sudoku-cell")];
  cells.forEach((cell, idx) => {
    cell.value = sudokuSolution[idx];
    cell.classList.remove("bad");
  });
  sudokuStatusKey = "reveal";
  renderSudokuStaticText();
}

sudokuNewBtn.addEventListener("click", pickSudoku);
sudokuCheckBtn.addEventListener("click", checkSudoku);
sudokuSolveBtn.addEventListener("click", solveSudoku);
sudokuLangZhBtn.addEventListener("click", () => {
  sudokuLanguage = "zh";
  renderSudokuStaticText();
});
sudokuLangEnBtn.addEventListener("click", () => {
  sudokuLanguage = "en";
  renderSudokuStaticText();
});

function renderSnakeStatus() {
  const statusText = {
    ready: SNAKE_I18N[snakeLanguage].stateReady,
    running: SNAKE_I18N[snakeLanguage].stateRunning,
    paused: SNAKE_I18N[snakeLanguage].statePaused,
    gameOver: SNAKE_I18N[snakeLanguage].stateGameOver,
  }[snakeStatus];

  snakeStateEl.textContent = statusText;
  snakeScoreEl.textContent = `${SNAKE_I18N[snakeLanguage].score}: ${snakeScore}`;
  snakeBestEl.textContent = `${SNAKE_I18N[snakeLanguage].best}: ${snakeBest}`;
}

function renderSnakeStaticText() {
  const text = SNAKE_I18N[snakeLanguage];
  snakeTitleEl.textContent = text.title;
  snakeDescEl.textContent = text.desc;
  snakeTouchTitleEl.textContent = text.touchTitle;
  snakeStatusTitleEl.textContent = text.statusTitle;
  snakeStartBtn.textContent = text.startPause;
  snakeResetBtn.textContent = text.reset;
  snakeTipsTitleEl.textContent = text.tipsTitle;
  snakeTip1El.textContent = text.tip1;
  snakeTip2El.textContent = text.tip2;
  snakeTip3El.textContent = text.tip3;
  snakeLangZhBtn.classList.toggle("is-active", snakeLanguage === "zh");
  snakeLangEnBtn.classList.toggle("is-active", snakeLanguage === "en");
  renderSnakeStatus();
}

function snakeOccupied(x, y) {
  return snake.some((part) => part.x === x && part.y === y);
}

function spawnSnakeFood() {
  const empty = [];
  for (let y = 0; y < SNAKE_SIZE; y += 1) {
    for (let x = 0; x < SNAKE_SIZE; x += 1) {
      if (!snakeOccupied(x, y)) {
        empty.push({ x, y });
      }
    }
  }
  snakeFood = empty[Math.floor(Math.random() * empty.length)] || { x: 0, y: 0 };
}

function renderSnakeBoard() {
  snakeBoardEl.innerHTML = "";

  for (let y = 0; y < SNAKE_SIZE; y += 1) {
    for (let x = 0; x < SNAKE_SIZE; x += 1) {
      const cell = document.createElement("div");
      cell.className = "snake-cell";

      if (snakeFood && snakeFood.x === x && snakeFood.y === y) {
        cell.classList.add("snake-food");
      }

      const idx = snake.findIndex((part) => part.x === x && part.y === y);
      if (idx === 0) {
        cell.classList.add("snake-head");
      } else if (idx > 0) {
        cell.classList.add("snake-body");
      }

      snakeBoardEl.appendChild(cell);
    }
  }

  renderSnakeStatus();
}

function setSnakeDirection(direction) {
  const opposite = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  if (opposite[direction] === snakeDirection) {
    return;
  }
  snakeNextDirection = direction;
}

function clearSnakeTimer() {
  if (snakeTimerId) {
    window.clearInterval(snakeTimerId);
    snakeTimerId = null;
  }
}

function snakeTick() {
  snakeDirection = snakeNextDirection;
  const head = snake[0];
  const delta = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }[snakeDirection];

  const next = { x: head.x + delta.x, y: head.y + delta.y };
  if (next.x < 0 || next.y < 0 || next.x >= SNAKE_SIZE || next.y >= SNAKE_SIZE || snakeOccupied(next.x, next.y)) {
    snakeStatus = "gameOver";
    clearSnakeTimer();
    renderSnakeBoard();
    return;
  }

  snake.unshift(next);

  if (snakeFood && next.x === snakeFood.x && next.y === snakeFood.y) {
    snakeScore += 10;
    snakeBest = Math.max(snakeBest, snakeScore);
    snakeSpeed = Math.max(80, snakeSpeed - 4);
    spawnSnakeFood();

    if (snakeTimerId) {
      clearSnakeTimer();
      snakeTimerId = window.setInterval(snakeTick, snakeSpeed);
    }
  } else {
    snake.pop();
  }

  renderSnakeBoard();
}

function resetSnake() {
  clearSnakeTimer();
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  snakeDirection = "right";
  snakeNextDirection = "right";
  snakeScore = 0;
  snakeSpeed = 170;
  snakeStatus = "ready";
  spawnSnakeFood();
  renderSnakeBoard();
}

function toggleSnakeStartPause() {
  if (snakeStatus === "running") {
    snakeStatus = "paused";
    clearSnakeTimer();
    renderSnakeStatus();
    return;
  }

  if (snakeStatus === "ready" || snakeStatus === "gameOver") {
    resetSnake();
  }

  snakeStatus = "running";
  clearSnakeTimer();
  snakeTimerId = window.setInterval(snakeTick, snakeSpeed);
  renderSnakeStatus();
}

snakeStartBtn.addEventListener("click", toggleSnakeStartPause);
snakeResetBtn.addEventListener("click", resetSnake);
snakeUpBtn.addEventListener("click", () => setSnakeDirection("up"));
snakeLeftBtn.addEventListener("click", () => setSnakeDirection("left"));
snakeDownBtn.addEventListener("click", () => setSnakeDirection("down"));
snakeRightBtn.addEventListener("click", () => setSnakeDirection("right"));
snakeLangZhBtn.addEventListener("click", () => {
  snakeLanguage = "zh";
  renderSnakeStaticText();
});
snakeLangEnBtn.addEventListener("click", () => {
  snakeLanguage = "en";
  renderSnakeStaticText();
});

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

  if (tabName !== "snake" && snakeStatus === "running") {
    snakeStatus = "paused";
    clearSnakeTimer();
    renderSnakeStatus();
  }
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

renderStaticText();
renderBoard();
updateStatus();
init2048Board();
pickSudoku();
resetSnake();
renderSnakeStaticText();
