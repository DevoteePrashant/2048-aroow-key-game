function initializeGame() {
  document.getElementById("gameTable").setAttribute("tabindex", 0);

  var gameTable = document.getElementById("gameTable");
  var result = document.getElementById("result");
  var result2 = document.getElementById("result2");
  var matrix = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];

  var score = 0; // score
  var hasWon = false; // Flag to check if won

  function updateGameTable(matrix) {
    gameTable.innerHTML = "";
    for (var row of matrix) {
      var tr = document.createElement("tr");
      var tdArray = row.map((value) => {
        var td = document.createElement("td");
        td.textContent = value || "";
        return td;
      });
      tdArray.forEach((td) => tr.appendChild(td));
      gameTable.appendChild(tr);
    }
  }

  function generateNumber(matrix) {
    var emptyTiles = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (matrix[i][j] === "") {
          emptyTiles.push([i, j]);
        }
      }
    }
    if (emptyTiles.length > 0) {
      var [randomIndexX, randomIndexY] =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      matrix[randomIndexX][randomIndexY] = 2;
      updateGameTable(matrix);
      console.log("Matrix:", matrix);
    }
  }

  function isGameOver(matrix) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (matrix[i][j] === "") {
          return false;
        }
        if (i < 3 && matrix[i][j] === matrix[i + 1][j]) {
          return false;
        }
        if (j < 3 && matrix[i][j] === matrix[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  }

  function checkWin(matrix) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (matrix[i][j] === 128) {
          return true;
        }
      }
    }
    return false;
  }

  function mergeTiles(matrix, direction) {
    switch (direction) {
      case "up":
        for (var j = 0; j < 4; j++) {
          for (var i = 0; i < 4; i++) {
            if (matrix[i][j] === "") continue;
            for (var k = i + 1; k < 4; k++) {
              if (matrix[k][j] === "") continue;
              if (matrix[i][j] === matrix[k][j]) {
                matrix[i][j] *= 2;
                score += matrix[i][j];
                matrix[k][j] = "";
                if (matrix[i][j] === 128) {
                  hasWon = true;
                }
                break;
              } else {
                break;
              }
            }
          }
        }
        break;
      case "down":
        for (var j = 0; j < 4; j++) {
          for (var i = 3; i >= 0; i--) {
            if (matrix[i][j] === "") continue;
            for (var k = i - 1; k >= 0; k--) {
              if (matrix[k][j] === "") continue;
              if (matrix[i][j] === matrix[k][j]) {
                matrix[i][j] *= 2;
                score += matrix[i][j];
                matrix[k][j] = "";
                if (matrix[i][j] === 128) {
                  hasWon = true;
                }
                break;
              } else {
                break;
              }
            }
          }
        }
        break;
      case "left":
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 4; j++) {
            if (matrix[i][j] === "") continue;
            for (var k = j + 1; k < 4; k++) {
              if (matrix[i][k] === "") continue;
              if (matrix[i][j] === matrix[i][k]) {
                matrix[i][j] *= 2;
                score += matrix[i][j];
                matrix[i][k] = "";
                if (matrix[i][j] === 128) {
                  hasWon = true;
                }
                break;
              } else {
                break;
              }
            }
          }
        }
        break;
      case "right":
        for (var i = 0; i < 4; i++) {
          for (var j = 3; j >= 0; j--) {
            if (matrix[i][j] === "") continue;
            for (var k = j - 1; k >= 0; k--) {
              if (matrix[i][k] === "") continue;
              if (matrix[i][j] === matrix[i][k]) {
                matrix[i][j] *= 2;
                score += matrix[i][j];
                matrix[i][k] = "";
                if (matrix[i][j] === 128) {
                  hasWon = true;
                }
                break;
              } else {
                break;
              }
            }
          }
        }
        break;
    }
  }

  function moveTiles(matrix, direction) {
    switch (direction) {
      case "up":
        for (var j = 0; j < 4; j++) {
          var newColumn = matrix.map((row) => row[j]).filter((val) => val);
          while (newColumn.length < 4) {
            newColumn.push("");
          }
          for (var i = 0; i < 4; i++) {
            matrix[i][j] = newColumn[i];
          }
        }
        break;
      case "down":
        for (var j = 0; j < 4; j++) {
          var newColumn = matrix.map((row) => row[j]).filter((val) => val);
          while (newColumn.length < 4) {
            newColumn.unshift("");
          }
          for (var i = 0; i < 4; i++) {
            matrix[i][j] = newColumn[i];
          }
        }
        break;
      case "left":
        for (var i = 0; i < 4; i++) {
          var newRow = matrix[i].filter((val) => val);
          while (newRow.length < 4) {
            newRow.push("");
          }
          matrix[i] = newRow;
        }
        break;
      case "right":
        for (var i = 0; i < 4; i++) {
          var newRow = matrix[i].filter((val) => val);
          while (newRow.length < 4) {
            newRow.unshift("");
          }
          matrix[i] = newRow;
        }
        break;
    }
  }

  function handleMove(direction) {
    moveTiles(matrix, direction);
    mergeTiles(matrix, direction);
    moveTiles(matrix, direction);
    generateNumber(matrix);
    updateGameTable(matrix);
    if (isGameOver(matrix) || hasWon) {
      console.log("Game Over!");
      showResult(score, hasWon);
      return;
    }
  }

  function showResult(score, hasWon) {
    if (hasWon) {
      result.textContent = `Congratulations! You reached 128! Your score is ${score}`;
    } else {
      result.textContent = `Game Over! Your score is ${score}`;
    }
  }
  
  generateNumber(matrix);
  generateNumber(matrix);
  updateGameTable(matrix);
  
  document.addEventListener("keyup", function (e) {
    result2.textContent = `Your score is ${score}`;
    if (isGameOver(matrix) || hasWon) {
      console.log("Game Over!");
      return;
    }
    switch (e.keyCode) {
      case 38:
        handleMove("up");
        break;
        case 40:
          handleMove("down");
          break;
          case 37:
            handleMove("left");
            break;
            case 39:
        handleMove("right");
        break;
    }
  });
}

initializeGame();
