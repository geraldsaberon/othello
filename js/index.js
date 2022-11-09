const BOARD_CONTAINER = document.getElementById('board');
let currentPlayer = "B";
let gameState = Array(64).fill("");

function boardInit() {
    let tiles = [];
    let tile, circle, index;
    for (let i = 0; i < 64; i++) {
        tile = document.createElement("div");
        tile.id = `_${i}`;
        tile.className = "tile";

        index = document.createElement("p");
        index.innerText = i;
        index.className = "index"
        tile.appendChild(index)

        circle = document.createElement("div");
        circle.className = "circle"
        circle.hidden = true;
        tile.appendChild(circle);

        tile.onclick = click;
        tiles.push(tile);
        BOARD_CONTAINER.appendChild(tile);
    }
    const init = [27, 28, 35, 36];
    for (let i of init) {
        tiles[i].childNodes[1].hidden = false;
        if (i == 28 || i == 35) {
            tiles[i].childNodes[1].style.background = "#222";
            gameState[i] = "B"
        } else {
            tiles[i].childNodes[1].style.background = "#fff";
            gameState[i] = "W"
        }
    }
}


function click() {
    console.log("click", this)
    if (!this.childNodes[1].hidden)
        return;

    if (currentPlayer == "B") {
        this.childNodes[1].style.background = "#222";
        this.childNodes[1].hidden = false;
        currentPlayer = "W"
    } else {
        this.childNodes[1].style.background = "#fff";
        this.childNodes[1].hidden = false;
        currentPlayer = "B"
    }
}

boardInit();