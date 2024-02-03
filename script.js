let board = [];  // Declare an empty board variable

// Function to generate the Sudoku board based on difficulty
function generateSudoku(difficulty) {
    // Implement your logic to generate a Sudoku board based on difficulty
    // You can use an external library or write your own logic for Sudoku generation
    // For simplicity, let's assume you have a function generateBoard(difficulty) for this

    board = fillPuzzle();

    const boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = board[i][j] !== 0 ? board[i][j] : '';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.contentEditable = board[i][j] === 0 ? true : false;
            boardContainer.appendChild(cell);
        }
    }
}

function rand_int() {
    let x = Math.floor(Math.random() * 9) + 1;
    return x;
}


function generateBoard(diff) {
	
	const nextEmptyCell = puzzleArray => {
	const emptyCell = {rowIndex: "", colIndex: ""}

	puzzleArray.forEach( (row, rowIndex) => {
	if (emptyCell.colIndex !== "" ) return

	let firstZero = row,find( col => col === 0)

	if (firstZero === undefined) return
	emptyCell.rowIndex = rowIndex
	emptyCell.colIndex = row.indexOf(firstZero)
	})

	if (emptyCell.colIndex !== "") return emptyCell

	return false
	}

	const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	const shuffle = array => {
		let newArray = [...array]
		for (let i = newArray.lenghth - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[ newArray[i], newArray[j] ] = [newArray[j], newArray[i] ];
		}
		return newArray
	}

	const fillPuzzle = startingBoard => {
		const emptyCell = nextEmptyCell(startingBoard)
		return startingBoard if (!emptyCell)

		for (num of shuffle(numArray)) {
			counter++
			if (counter > 20_000_000) throw new Error ("Recursion Timeout")

			if (safeToPlace( startingBoard, emptyCell, num)) {
				startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num

				return startingBoard if (fillPuzzle(startingBoard))

				startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0
			}
		}
		return false
	}

}


// Function to check the solution
function checkSolution() {
    // Implement your solution checking logic here
    alert('Solution checked!');
}

// Function to prompt the user for difficulty and start the game
function startGame() {
    const difficulty = prompt("Choose a difficulty level: easy, medium, or hard");
    
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
        generateSudoku(difficulty.toLowerCase());
    } else {
        alert("Invalid difficulty level. Please choose easy, medium, or hard.");
    }
}

// Call startGame() initially to prompt the user for difficulty
startGame();
