function minimax(board, depth, isMaximizing) {
    if (depth == 0 || gameOver(board)) {
        // TODO: return heuristic evaluations
        return 1;
    }

    if (isMaximizing) {
        return 1;
    } else {
        return -1;
    }
}


function getAImove(board, AItile) {
    let possibleMoves = getValidMoves(board, AItile);
    possibleMoves = shuffleArray(possibleMoves);

    let bestScore = -Infinity;
    let bestMove;
    for (let [x, y] of possibleMoves) {
        let boardCopy = getBoardCopy(board);
        makeMove(boardCopy, AItile, x, y);
        let score = minimax(boardCopy, 4, true);
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
