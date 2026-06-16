const boardEl = document.getElementById("board");
const trailLayerEl = document.getElementById("trailLayer");
const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const statusTitleEl = document.getElementById("statusTitle");
const statusEl = document.getElementById("status");
const turnEl = document.getElementById("turn");
const lastMoveEl = document.getElementById("lastMove");
const aiLevelLabelEl = document.getElementById("aiLevelLabel");
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
    title: "国际象棋 · Human vs AI",
    subtitle: "你执白棋，电脑执黑棋。点击棋子并点击目标格子完成走子。",
    statusTitle: "对局状态",
    aiLevelLabel: "AI 难度",
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
    loading: "加载中...",
  },
  en: {
    htmlLang: "en",
    title: "Chess · Human vs AI",
    subtitle: "You play White, AI plays Black. Click a piece and then a target square to move.",
    statusTitle: "Game Status",
    aiLevelLabel: "AI Difficulty",
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
    loading: "Loading...",
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
  aiLevelLabelEl.textContent = t("aiLevelLabel");
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
      <marker id="trailArrow" markerWidth="4" markerHeight="4" refX="3.4" refY="2" orient="auto" markerUnits="strokeWidth">
        <path d="M 0 0 L 4 2 L 0 4 z" fill="#111111"></path>
      </marker>
    </defs>
    <line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#111111" stroke-width="1" stroke-linecap="round" marker-end="url(#trailArrow)" stroke-dasharray="2.6 2.2" opacity="0.66"></line>
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

      if (lastMovePath?.to === square) {
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

renderStaticText();
renderBoard();
updateStatus();
