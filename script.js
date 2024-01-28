let board = [];  // Declare an empty board variable

// Function to generate the Sudoku board based on difficulty
function generateSudoku(difficulty) {
    // Implement your logic to generate a Sudoku board based on difficulty
    // You can use an external library or write your own logic for Sudoku generation
    // For simplicity, let's assume you have a function generateBoard(difficulty) for this

    board = generateBoard(difficulty);

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

function generateBoard(diff) {
	let val_board = [];

     // Function to check if a number is present in a column
    const isInColumn = (column, num) => {
        // console.log("column input " + column + num);
        for (let i = 0; i < val_board.length; i++) {
            // Check if column index is within bounds
            if (
                val_board[i] &&
                val_board[i][column] === num
            ) {
                return true;
            }
        }
        return false;
    };
    
    // Function to check if a number is present in a 3x3 square
    const isInSquare = (startRow, startCol, num) => {
        // console.log("square input " + startRow + startCol + num);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if indices are within bounds
                if (
                    val_board[startRow + i] &&
                    val_board[startRow + i][startCol + j] === num
                ) {
                    return true;
                }
            }
        }

        return false;
    };

    // generate first row
	let row = [];
    while (row.length < 9) {
		let rand_int = Math.floor(Math.random() * 9 + 1);
		if (!row.includes(rand_int)) {
			row.push(rand_int);
		}
	}
	val_board.push(row);

    // generate rest of the rows
	while (val_board.length < 9) {
        let row = [];
        for (let i = 0; i < 9; i++) {
            console.log("i " + i);
            let rand_int;
            do {
                rand_int = Math.floor(Math.random() * 9) + 1;
                console.log("rand int " + rand_int)
            } while (
                row.includes(rand_int)  /*||
                 isInColumn(i, rand_int) ||
                isInSquare(
                    Math.floor(val_board.length / 3) * 3,
                    Math.floor(i / 3) * 3,
                    rand_int
                )*/
            );
            row.push(rand_int);
        }
        val_board.push(row);
    }

    return val_board;
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
