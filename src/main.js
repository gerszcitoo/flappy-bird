let menu = document.getElementById("menu");
let start = document.getElementById("start");
let game = document.getElementById("game");
var block = document.getElementById("block");
let topBar = document.getElementById("top-bar");
let bottomBar = document.getElementById("bottom-bar");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
let score = document.getElementById("score");
let bestScoreMarker = document.getElementById("best-score");
let pause = document.getElementById("pause");
let resume = document.getElementById("resume");
let jumping = 0;
let counter = 0;
let pauseStatus = false;
let startStatus = false;
let jumpKeyPressed = false;
let hasPlayed = false;

// -------------MENU INTERFACE-------------

// ----START GAME----
start.addEventListener("click", function () {
  startStatus = true;
  game.style.display = "block";
  score.style.display = "block";
  startGame();
});

// ----PAUSE GAME----
function pauseGame() {
  pauseStatus = true;
  pause.style.display = "none";
  resume.style.display = "block";
  block.style.animation = "none";
  hole.style.animation = "none";
}
// ----RESUME GAME----
function resumeGame() {
  pauseStatus = false;
  pause.style.display = "block";
  resume.style.display = "none";
  block.style.animation = "block 2s infinite linear";
  hole.style.animation = "block 2s infinite linear";
}
// PAUSE/RESUME BY BUTTON
pause.addEventListener("click", () => {
  pauseGame();
  resume.addEventListener("click", () => {
    resumeGame();
  });
});

// -------------GAME-------------

// ----GENERATE VISIBLE OBSTACLE----
function generateObstacle() {
  let holePosition = {
    top: hole.offsetTop,
    height: hole.offsetHeight,
  };
  // calculates obstacles height based on the holes size
  let positionTopBar = {
    pos: holePosition.top,
  };
  topBar.style.height = `${positionTopBar.pos}px`;
  if (holePosition.top > -551) {
    let positionBottomBar = {
      pos: 500 - topBar.offsetHeight - holePosition.height,
    };
    bottomBar.style.height = `${positionBottomBar.pos}px`;
  } else {
    bottomBar.style.height = "0px";
  }
}

// ----GENERATE HOLE----
hole.addEventListener("animationiteration", () => {
  if (!pauseStatus) {
    var random = -(Math.random() * 300 + 150);
    hole.style.top = random + "px";
    counter++;
    generateObstacle();
  }
});

// ----GAME LOGIC----
function startGame() {
  return new Promise((resolve) => {
    if (startStatus) {
      // hides menu interface
      menu.style.display = "none";
      bestScoreMarker.style.display = "none";
      hasPlayed = true;
      var gameInterval = setInterval(async function () {
        if (!pauseStatus) {
          // update score
          score.innerHTML = `Puntos: ${counter}`;
          var characterTop = parseInt(
            window.getComputedStyle(character).getPropertyValue("top")
          );
          // falls if is not jumping
          if (jumping === 0) {
            character.style.top = characterTop + 3 + "px";
          }
          // recognizes blocks and hole hitbox
          var blockLeft = parseInt(
            window.getComputedStyle(block).getPropertyValue("right")
          );
          var holeTop = parseInt(
            window.getComputedStyle(hole).getPropertyValue("top")
          );
          var cTop = -(500 - characterTop);
          // lose condition
          if (
            characterTop > 480 ||
            (blockLeft < 20 &&
              blockLeft > -50 &&
              (cTop < holeTop || cTop > holeTop + 130))
          ) {
            clearInterval(gameInterval);
            game.style.display = "none";
            score.style.display = "none";
            // generates alert to insert players name
            const { value: playerName } = await Swal.fire({
              icon: "error",
              title: "¡Perdiste!",
              input: "text",
              inputLabel: "Nombre",
              inputPlaceholder: "Ingresa tu nombre...",
              inputAttributes: {
                "aria-label": "Ingresa tu nombre...",
              },
              showCancelButton: false,
              onOpen: () => {
                const input = document.querySelector("#swal2-input");
                if (input) {
                  input.setAttribute("autocomplete", "off");
                }
              },
              inputValidator: (value) => {
                if (!value) {
                  return "Debes ingresar un nombre";
                }
              },
            });
            if (playerName) {
              Swal.fire({
                icon: "success",
                title: "¡Puntaje guardado!",
                text: "Tu puntaje se guardo exitosamente.",
              }).then(() => {
                menu.style.display = "flex";
                bestScoreMarker.style.display = "block";
                character.style.top = 100 + "px";
                updateBestScores(counter, playerName);
                counter = 0;
                startStatus = false;
                resolve(); // promise ends after clicking OK on the alert
              });
            }
          }
        }
      }, 10);
    }
  });
}

// ----CHARACTERS JUMP----
function jump() {
  character.classList.add("animate");
  setTimeout(() => {
    character.classList.remove("animate");
  }, 300);
  jumping = 1;
  let jumpCount = 0;
  var jumpInterval = setInterval(function () {
    var characterTop = parseInt(
      window.getComputedStyle(character).getPropertyValue("top")
    );
    // if its playing, not in pause, not at the top, and not spamming jumps, it allows to jump
    if (characterTop > 6 && jumpCount < 15 && startStatus && !pauseStatus) {
      character.style.top = characterTop - 5 + "px";
    }
    if (jumpCount > 20) {
      clearInterval(jumpInterval);
      jumping = 0;
      jumpCount = 0;
    }
    jumpCount++;
  }, 10);
}

// ----BEST SCORES UPDATING----
function updateBestScores(counter, playerName) {
  let bestScores = JSON.parse(localStorage.getItem("flappy-best-scores")) || [];
  // if the game started
  if (hasPlayed) {
    let scoreToCompare = { points: counter, player: playerName };
    // if there's any score, it inserts the actual score into the array by order
    if (bestScores.length > 0) {
      bestScores.sort((a, b) => b.points - a.points);
      let insertIndex = bestScores.findIndex(
        (obj) => obj.points < scoreToCompare.points
      );
      if (insertIndex === -1) {
        insertIndex = bestScores.length;
      }
      bestScores.splice(insertIndex, 0, scoreToCompare);
    } else {
      bestScores.push(scoreToCompare);
    }
    bestScoreMarker.innerHTML = `Mejor Puntaje: ${bestScores[0].points}`;
    localStorage.setItem("flappy-best-scores", JSON.stringify(bestScores));
  }
}
// executes first time to get best score if there is one
updateBestScores();

// listen for keys to play with keyboard
window.addEventListener("keydown", function (event) {
  if (!startStatus && event.key == "Enter") {
    startStatus = true;
    game.style.display = "block";
    score.style.display = "block";
    startGame();
  }
  if (event.key == "Escape") {
    if (!pauseStatus) {
      pauseGame();
    } else {
      if (pauseStatus && event.key == "Escape") {
        resumeGame();
      }
    }
  }
  if (
    (!pauseStatus && event.key == " ") ||
    event.key == "ArrowUp" ||
    event.key == "w" ||
    event.key == "W"
  ) {
    if (!jumpKeyPressed) {
      jumpKeyPressed = true;
      jump();
    }
  }
  window.addEventListener("keyup", function (event) {
    if (
      event.key == " " ||
      event.key == "ArrowUp" ||
      event.key == "w" ||
      event.key == "W"
    ) {
      jumpKeyPressed = false;
    }
  });
});
