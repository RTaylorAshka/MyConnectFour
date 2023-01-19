/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let reset = false;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  
  
  for(let y = 0; y < HEIGHT; y++){
    let row = [];

    for(let x = 0; x < WIDTH; x++){
      row.push(0);
    }

    board.push(row);

  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  const htmlBoard = document.getElementById('board');

 
  //creating top row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //creating cells in top row and giving number as an id
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

 
  // loop creates row for the amount specified in HEIGHT, then loops in the amount of cells specified by WIDTH
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }

  
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {

  //console.log(board);
  
  for(let y = (HEIGHT - 1); y >= 0; y--){
    let boardRow = board[y];
    //console.log(y);

    if(boardRow[x] == 0){
      
      //console.log(board[y][x]);

      return y;
    }
  }
  //console.log("HERE!")
  return null;
  
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  

  let div = document.createElement("div");
  div.setAttribute("class", `piece`);
  let setDrop = HEIGHT - y;
  console.log(y + 1);
  div.setAttribute("class", `piece pl${currPlayer} drop${y + 1}`);
  

  let cell = document.getElementById(`${y}-${x}`);
  console.log(cell);
  cell.appendChild(div);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  reset = true
  setTimeout(() => {
    (alert(msg))
    location.reload();
  }, 500);
  
  
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  if(reset){
    return;
  }
  
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  //updating html
  
  

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  
  if(board.every((row) => (row.every((val) => val !== 0)))){
    return endGame('Game Over!');
  }

  // switch players
  if(currPlayer == 1){
    currPlayer = 2;
  } else {currPlayer = 1}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
