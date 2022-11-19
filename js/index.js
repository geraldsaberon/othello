const BOARD_CONTAINER = document.getElementById("board");
const WIDTH = 8;
const HEIGHT = 8;


function drawBoard(board) {
    const validMovesBoard = getBoardWithValidMoves(board, turn);
    BOARD_CONTAINER.innerHTML = "";
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            let tile = document.createElement("div");
            tile.id = `_${x}_${y}`;
            tile.className = "tile";

            // (x, y) coordinates show on each tile in the board
            let coordinates = document.createElement("p");
            coordinates.innerText = `(${x}, ${y})`;
            coordinates.className = "coordinates"
            tile.appendChild(coordinates)

            let circle = document.createElement("div");
            circle.className = "circle"

            if (validMovesBoard[x][y] == " ")
                circle.hidden = true;
            else if (validMovesBoard[x][y] == "X")
                circle.style.background = "#222";
            else if (validMovesBoard[x][y] == "O")
                circle.style.background = "WHITE";
            else if (validMovesBoard[x][y] == ".")
                circle.hidden = false;

            tile.onclick = click;
            tile.appendChild(circle);
            BOARD_CONTAINER.appendChild(tile);
        }        
    }   
}


function click(e) {
    let xstart = parseInt(this.textContent[1]);
    let ystart = parseInt(this.textContent[4]);

    let tilesToFlip = isValidMove(board, turn, xstart, ystart);
    if (tilesToFlip == false)
        return false // not valid move

    board[xstart][ystart] = turn;
    for (let [x, y] of tilesToFlip)
        board[x][y] = turn;
    if (turn == "X")
        turn = "O"
    else
        turn = "X"

    drawBoard(board);
    updateScoreDisplay();
    updateTurnDisplay();

    return true;

}


// generate a blank board
function getNewBoard() {
    let board = [];
    for (let i = 0; i < WIDTH; i++) {
        board.push([" ", " ", " ", " ", " ", " ", " ", " "])
    }
    return board;
}


function isValidMove(board, tile, xstart, ystart) {
    if (board[xstart][ystart] != " " || !isOnBoard(xstart, ystart))
        return false;
    let otherTile;
    if (tile == "X")
        otherTile = "O";
    else
        otherTile = "X";

    const tilesToFlip = [];
    for (let [xdirection, ydirection] of [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]) {
        let [x, y] = [xstart, ystart];
        x += xdirection;
        y += ydirection;
        while (isOnBoard(x, y) && board[x][y] == otherTile) {
            x += xdirection;
            y += ydirection;
            if (isOnBoard(x, y) && board[x][y] == tile) {
                while (true) {
                    x -= xdirection;
                    y -= ydirection;
                    if (x == xstart && y == ystart)
                        break;
                    tilesToFlip.push([x, y])
                }
            }
        }
    }
    if (tilesToFlip.length == 0)
        return false;
    return tilesToFlip; 
}


function isOnBoard(x, y) {
    return (x >= 0) && (x <= WIDTH-1) && (y >= 0) && (y <= HEIGHT-1);
}


function getBoardWithValidMoves(board, tile) {
    const boardCopy = getBoardCopy(board);

    for (let [x, y] of getValidMoves(boardCopy, tile))
        boardCopy[x][y] = ".";

    return boardCopy;
}


function getBoardCopy(board) {
    const boardCopy = getNewBoard();

    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            boardCopy[x][y] = board[x][y];
        }
    }
    return boardCopy;
}


function getValidMoves(board, tile) {
    const validMoves = [];
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (isValidMove(board, tile, x, y) != false)
                validMoves.push([x, y]);
        }
    }
    return validMoves;
}


function getScores(board) {
    let xscore = 0;
    let oscore = 0;

    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (board[x][y] == "X")
                xscore++;
            if (board[x][y] == "O")
                oscore++;
        }
    }
    console.log("X score", xscore);
    console.log("O score", oscore);
    return {X:xscore, O:oscore}
}


function updateScoreDisplay() {
    let scoreBlack = document.getElementById("score-black");
    let scoreWhite = document.getElementById("score-white");
    let score = getScores(board);
    scoreBlack.textContent = score.X;
    scoreWhite.textContent = score.O;
}


function updateTurnDisplay() {
    let turnTracker = document.getElementById("turn");
    if (turn == "X")
        turnTracker.textContent = "Black";
    else
        turnTracker.textContent = "White";
}


function startGame() {
    let board = getNewBoard();
    board[3][3] = "O";
    board[3][4] = "X";
    board[4][3] = "X";
    board[4][4] = "O";
    drawBoard(board);
    return board;
}


let turn = "X"; 
const board = startGame();
