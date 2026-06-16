const boardEl = document.getElementById("board");
const trailLayerEl = document.getElementById("trailLayer");
const statusEl = document.getElementById("status");
const turnEl = document.getElementById("turn");
const lastMoveEl = document.getElementById("lastMove");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const aiLevelEl = document.getElementById("aiLevel");

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
    lastMoveEl.textContent = "上一步：-";
    return;
  }
  lastMovePath = { from: last.from, to: last.to };
  lastMoveEl.textContent = `上一步：${last.from} -> ${last.to}`;
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
  return game.turn() === "w" ? "白棋" : "黑棋";
}

function updateStatus(lastMove = null) {
  turnEl.textContent = `当前回合：${getTurnText()}`;

  if (lastMove) {
    lastMoveEl.textContent = `上一步：${lastMove.from} -> ${lastMove.to}`;
  }

  if (game.in_checkmate()) {
    statusEl.textContent = game.turn() === "w" ? "黑棋将死，白棋获胜" : "白棋将死，黑棋获胜";
    return;
  }

  if (game.in_draw()) {
    statusEl.textContent = "和棋";
    return;
  }

  if (game.in_check()) {
    statusEl.textContent = `${getTurnText()}被将军`;
    return;
  }

  statusEl.textContent = isAiThinking ? "电脑思考中..." : "对局进行中";
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
  lastMoveEl.textContent = "上一步：-";
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

renderBoard();
updateStatus();
