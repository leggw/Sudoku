// Backtracking references:
// https://lisperator.net/blog/javascript-sudoku-solver/
// https://norvig.com/sudoku.html

"use strict";

const SIZE = 9;
const BOX_SIZE = 3;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const EMPTY_COUNTS = { easy: 43, medium: 45, hard: 49 };
const POSITIONS = Array.from({ length: SIZE * SIZE }, (_, index) => index);

function shuffle(values) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
}

function rowOf(index) {
    return Math.floor(index / SIZE);
}

function columnOf(index) {
    return index % SIZE;
}

function boxOf(index) {
    const row = Math.floor(rowOf(index) / BOX_SIZE);
    const column = Math.floor(columnOf(index) / BOX_SIZE);
    return row * BOX_SIZE + column;
}

const peers = POSITIONS.map(index => POSITIONS.filter(other =>
    other !== index && (rowOf(index) === rowOf(other)
        || columnOf(index) === columnOf(other)
        || boxOf(index) === boxOf(other))
));

function candidatesFor(board, index) {
    const used = new Set(peers[index].map(other => board[other]));
    return DIGITS.filter(digit => !used.has(digit));
}

function nextEmptyCell(board) {
    let best = null;

    // Trying the most constrained square first reduces the search.
    for (const index of POSITIONS) {
        if (board[index] !== 0) continue;
        const candidates = candidatesFor(board, index);

        if (candidates.length === 0) return { index, candidates };
        if (best === null || candidates.length < best.candidates.length) {
            best = { index, candidates };
        }
    }

    return best;
}

function fillBoard(board) {
    const cell = nextEmptyCell(board);
    if (cell === null) return true;

    for (const digit of shuffle(cell.candidates)) {
        board[cell.index] = digit;
        if (fillBoard(board)) return true;
        board[cell.index] = 0;
    }
    return false;
}

function countSolutions(board, limit = 2) {
    const cell = nextEmptyCell(board);
    if (cell === null) return 1;

    let count = 0;
    for (const digit of cell.candidates) {
        board[cell.index] = digit;
        count += countSolutions(board, limit - count);
        // Restore the input board even when the search stops early.
        board[cell.index] = 0;
        if (count >= limit) break;
    }
    return count;
}

function generatePuzzle(emptyTarget, previousPuzzle) {
    for (;;) {
        const solution = Array(SIZE * SIZE).fill(0);
        fillBoard(solution);
        const clues = [...solution];
        let removed = 0;

        for (const index of shuffle(POSITIONS)) {
            clues[index] = 0;
            if (countSolutions(clues) === 1) {
                removed++;
                if (removed === emptyTarget) break;
            } else {
                clues[index] = solution[index];
            }
        }

        if (removed === emptyTarget && clues.some((digit, index) => digit !== previousPuzzle?.[index])) {
            return { clues, solution };
        }
    }
}

const boardElement = document.getElementById("board-container");
const difficulty = document.getElementById("difficulty");
const mistakeCounter = document.getElementById("mistake-counter");
const gameStatus = document.getElementById("game-status");
const keypad = document.getElementById("number-buttons");
const eraseButton = document.getElementById("erase");
const checkButton = document.getElementById("check-solution");

let game;
let cells = [];

function selectCell(index, moveFocus = false) {
    game.selected = index;
    cells.forEach((cell, position) => {
        cell.tabIndex = position === index ? 0 : -1;
        cell.classList.toggle("selected", position === index);
        cell.classList.toggle("related", peers[index].includes(position));
    });
    if (moveFocus) cells[index].focus();
}

function renderCell(index) {
    const cell = cells[index];
    const value = game.board[index];
    const given = game.clues[index] !== 0;
    const wrong = value !== 0 && value !== game.solution[index];
    let description = value === 0 ? "empty" : String(value);
    if (given) description += ", given";
    if (wrong) description += ", incorrect";

    cell.textContent = value || "";
    cell.classList.toggle("incorrect", wrong);
    cell.setAttribute("aria-label", `Row ${rowOf(index) + 1}, column ${columnOf(index) + 1}: ${description}`);
}

function startGame(moveFocus = false) {
    const { clues, solution } = generatePuzzle(EMPTY_COUNTS[difficulty.value], game?.clues);
    game = { clues, solution, board: [...clues], selected: 0, mistakes: 0, solved: false };

    cells = POSITIONS.map(index => {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.dataset.index = index;
        cell.classList.toggle("given", clues[index] !== 0);
        cell.classList.toggle("box-right", [2, 5].includes(columnOf(index)));
        cell.classList.toggle("box-bottom", [2, 5].includes(rowOf(index)));
        return cell;
    });
    boardElement.replaceChildren(...cells);
    POSITIONS.forEach(renderCell);
    selectCell(clues.indexOf(0), moveFocus);
    mistakeCounter.textContent = "Mistakes: 0";
    gameStatus.textContent = "";
    checkButton.disabled = false;
    eraseButton.disabled = false;
    for (const button of keypad.querySelectorAll("button")) button.disabled = false;
}

function checkSolution() {
    if (game.board.every((value, index) => value === game.solution[index])) {
        game.solved = true;
        gameStatus.textContent = "Puzzle solved!";
        checkButton.disabled = true;
        eraseButton.disabled = true;
        for (const button of keypad.querySelectorAll("button")) button.disabled = true;
        return;
    }

    if (game.board.some((value, index) => value !== 0 && value !== game.solution[index])) {
        gameStatus.textContent = "The red entries need another look.";
    } else {
        gameStatus.textContent = "All entries are correct so far. Keep going!";
    }
}

function enterNumber(value) {
    const { selected, clues, board, solution } = game;
    if (game.solved) return;
    if (clues[selected] !== 0) {
        gameStatus.textContent = "Choose an empty or editable square.";
        return;
    }
    if (board[selected] === value) return;

    board[selected] = value;
    renderCell(selected);
    gameStatus.textContent = "";

    if (value !== 0 && value !== solution[selected]) {
        game.mistakes++;
        mistakeCounter.textContent = `Mistakes: ${game.mistakes}`;
    } else if (board.every((digit, index) => digit === solution[index])) {
        checkSolution();
    }
}

boardElement.addEventListener("focusin", event => {
    const cell = event.target.closest(".cell");
    if (cell !== null) selectCell(Number(cell.dataset.index));
});

boardElement.addEventListener("click", event => {
    const cell = event.target.closest(".cell");
    if (cell !== null) selectCell(Number(cell.dataset.index), true);
});

boardElement.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const row = rowOf(game.selected);
    const column = columnOf(game.selected);
    const moves = {
        ArrowUp: [Math.max(0, row - 1), column],
        ArrowDown: [Math.min(SIZE - 1, row + 1), column],
        ArrowLeft: [row, Math.max(0, column - 1)],
        ArrowRight: [row, Math.min(SIZE - 1, column + 1)],
    };
    const move = moves[event.key];

    if (Array.isArray(move)) {
        event.preventDefault();
        selectCell(move[0] * SIZE + move[1], true);
    } else if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        enterNumber(Number(event.key));
    } else if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        enterNumber(0);
    }
});

keypad.addEventListener("click", event => {
    const button = event.target.closest("[data-number]");
    if (button !== null) enterNumber(Number(button.dataset.number));
});

eraseButton.addEventListener("click", () => enterNumber(0));
checkButton.addEventListener("click", checkSolution);
document.getElementById("new-game").addEventListener("click", () => startGame(true));

startGame();
