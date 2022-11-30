function minimax(board, depth, alpha, beta, isMaximizing) {
    if (depth == 0 || gameOver(board)) {
        let max = isMaximizing ? aiTile : playerTile;
        let min = !isMaximizing ? aiTile : playerTile;

        let m = mobility(board, max, min);
        let cp = coinParity(board, max, min);
        let cc = cornersCaptured(board, max, min);
        let sw = staticWeights(board, max, min);

        return m + cp + cc + sw;
    }

    if (isMaximizing) {
        let maxValue = -Infinity;
        let possibleMoves = getValidMoves(board, aiTile);

        for (let [x, y] of possibleMoves) {
            let boardCopy = getBoardCopy(board);
            makeMove(boardCopy, aiTile, x, y);
            let value = minimax(boardCopy, depth-1, alpha, beta, false);
            maxValue = Math.max(maxValue, value);
            alpha = Math.max(alpha, maxValue);
            if (beta <= alpha)
                break;
        }

        return maxValue;

    } else {
        let minValue = Infinity;
        let possibleMoves = getValidMoves(board, playerTile);

        for (let [x, y] of possibleMoves) {
            let boardCopy = getBoardCopy(board);
            makeMove(boardCopy, playerTile, x, y);
            let score = minimax(boardCopy, depth-1, alpha, beta, true);
            minValue = Math.min(minValue, score);
            beta = Math.min(beta, minValue);
            if (beta <= alpha)
                break;
        }

        return minValue;
    }
}


function getAImove(board, tile) {
    let possibleMoves = getValidMoves(board, tile);
    possibleMoves = shuffleArray(possibleMoves);

    let bestScore = -Infinity;
    let bestMove = possibleMoves[0];
    for (let [x, y] of possibleMoves) {
        let boardCopy = getBoardCopy(board);
        makeMove(boardCopy, tile, x, y);
        let score = minimax(boardCopy, 3, -Infinity, Infinity, false);
        if (score > bestScore) {
            bestMove = [x, y];
            bestScore = score;
        }
    }
    return bestMove;
}


function executeAImove(board, tile) {
    let AImove = getAImove(board, tile);
    
    if (AImove == undefined) {
        turn = playerTile;
        drawBoard(board);
        updateTurnDisplay();
        return;
    }

    let moveSuccess = makeMove(board, tile, AImove[0], AImove[1]);

    if (moveSuccess)
        if (getValidMoves(board, playerTile).length != 0)
            turn = playerTile;

    drawBoard(board, AImove[0], AImove[1]);
    updateScoreDisplay();
    updateTurnDisplay();

    // if AI's opponent has no available moves, do executeMove again
    if (getValidMoves(board, playerTile).length == 0)
        setTimeout(() => executeAImove(board, tile), AI_MOVE_DELAY)
}


// Heuristics
function mobility(board, max, min) {
    let maxTiles = getValidMoves(board, max).length;
    let minTiles = getValidMoves(board, min).length;

    let value;
    if (maxTiles > minTiles)
        value = (100 * maxTiles) / (maxTiles + minTiles);
    else if (maxTiles < minTiles)
        value = (100 * minTiles) / (maxTiles + minTiles);
    else
        value = 0;

    return value;
}


function coinParity(board, max, min) {
    let maxScore = getScores(board)[max];
    let minScore = getScores(board)[min];

    return  100 * (maxScore - minScore) / (maxScore + minScore);
}


function cornersCaptured(board, max, min) {
    const corners = [[0,0], [0,7], [7,0], [7,7]];
    let maxValue = 0;
    let minValue = 0;

    for (let c of corners) {
        if (board[c[0]][c[1]] == max)
            maxValue++;
        else if (board[c[0]][c[1]] == min)
            minValue++;
    }

    let value = 100 * (maxValue - minValue) / (maxValue + minValue);

    if (Number.isNaN(value))
        value = 0;

    return value;
}


const WEIGHTS = [
    [20, -3, 11,  8,  8, 11, -3, 20],
    [-3, -7, -4,  1,  1, -4, -7, -3],
    [11, -4,  2,  2,  2,  2, -4, 11],
    [ 8,  1,  2, -3, -3,  2,  1,  8],
    [ 8,  1,  2, -3, -3,  2,  1,  8],
    [11, -4,  2,  2,  2,  2, -4, 11],
    [-3, -7, -4,  1,  1, -4, -7, -3],
    [20, -3, 11,  8,  8, 11, -3, 20],
]


function staticWeights(board, max, min) {
    let maxValue = 0;
    let minValue = 0;
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] == max)
                maxValue += WEIGHTS[i][j];
            else if (board[i][j] == min)
                minValue += WEIGHTS[i][j];
        }
    }

    return maxValue - minValue;
}