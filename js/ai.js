function minimax(board, depth, alpha, beta, isMaximizing) {
    if (depth == 0 || gameOver(board))
        return mobility(board, aiTile, playerTile) + coinParity(board, aiTile, playerTile);

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


function getAImove(board, aiTile) {
    let possibleMoves = getValidMoves(board, aiTile);
    possibleMoves = shuffleArray(possibleMoves);

    let bestScore = -Infinity;
    let bestMove;
    for (let [x, y] of possibleMoves) {
        let boardCopy = getBoardCopy(board);
        makeMove(boardCopy, aiTile, x, y);
        let score = minimax(boardCopy, 4, -Infinity, Infinity, true);
        if (score > bestScore) {
            bestMove = [x, y];
            bestScore = score;
        }
    }
    return bestMove;
}


function executeAImove(board, tile) {
    let AImove = getAImove(board, tile);
    
    if (AImove == undefined)
        return

    let moveSuccess = makeMove(board, tile, AImove[0], AImove[1]);

    if (moveSuccess) {
        if (turn == playerTile && getValidMoves(board, aiTile).length != 0)
            turn = aiTile;
        else if (getValidMoves(board, playerTile).length != 0)
            turn = playerTile;
    }

    drawBoard(board);
    updateScoreDisplay();
    updateTurnDisplay();

    return true;
}


// Heuristics
function mobility(board, you, opponent) {
    let yourTiles = getValidMoves(board, you).length;
    let opponentTiles = getValidMoves(board, opponent).length;

    let value;
    if (yourTiles > opponentTiles)
        value = (100 * yourTiles)/(yourTiles + opponentTiles)
    else if (yourTiles < opponentTiles)
        value = (100 * opponentTiles)/(yourTiles + opponentTiles)
    else
        value = 0;

    return value;
}


function coinParity(board, you, opponent) {
    let yourScore = getScores(board).O;
    let opponentScore = getScores(board).X;
    return  100 * (yourScore - opponentScore)/(yourScore + opponentScore);
}

