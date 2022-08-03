const todayGame = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];

var timer;
var timeRemaining = 900;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {
  // add function to the buttons
  id("start-btn").addEventListener("click", startGame);
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function() {
      if (!disableSelect) {
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          this.classList.add("selected");
          selectedNum = this;
          updateMove();

        }
      }
    })
  }
};

function startGame() {
  id("start-btn").classList.add("hidden");
  let board = todayGame[0];
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: " + lives;
  // creates the board
  createBoard(board);
  // starts the timer
  startTimer();
  //numbers container
  id("number-container").classList.remove("hidden");
}

function startTimer() {
  id("timer").textContent = timeConversion(timeRemaining);
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}

// convert sec in string
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function createBoard(board) {
  clearPrevius();
  // increment tiles ids
  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement("p");
    // set the created tile to the pre-made sudoku game tile
    if (board.charAt(i) != "-") {
      tile.textContent = board.charAt(i);
    } else {
      // click event to recive new values
      tile.addEventListener("click", function() {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            for (let i = 0; i < 81; i++) {
              qsA(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    tile.id = idCount;
    idCount++;
    tile.classList.add("tile");

    // adding border styles!
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("rightBorder");
    }
    // add the tile to board
    id("board").appendChild(tile);
  }
}

function updateMove() {
  if (selectedTile && selectedNum) {
    selectedTile.textContent = selectedNum.textContent;
    if (checkCorrect(selectedTile)) {
      selectedTile.classList.remove("selected");
      selectedTile = null;
      // check if the board is completed
      if (checkDone()) {
        endGame();
      }
    } else {
      disableSelect = true;
      selectedTile.classList.add("incorrect");
      setTimeout(function() {
        lives--;
        if(lives === 0) {
          endGame();
        } else {
          id("lives").textContent = "Lives Remaining: " + lives;
          disableSelect = false;
        }
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsA(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  disableSelect = true;
  clearTimeout(timer);
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "You Lost!";
  } else {
    id("lives").textContent = "You Won!";
    alert("YOU WON! And a point is added to your ranking!");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://mateuscondefeitosa-code50-81862596-5g4w54gqjf7g97-5000.githubpreview.dev/gameWon");
    let data = {};
    xhr.send(data);
  }
}

function checkCorrect(tile) {
  let solution = todayGame[1];
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}



function clearPrevius() {
  // remove tiles
  let tiles = qsA(".tile");
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  // remove the timer
  if (timer) clearTimeout(timer);
  // clear the numbers
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }
  // clear selected tiles
  selectedTile = null;
  selectedNum = null;
}

// Helpers functions
function id(id) {
  return document.getElementById(id);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsA(selector) {
  return document.querySelectorAll(selector);
}
