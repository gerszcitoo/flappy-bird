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

// function pauseGame() {
pause.addEventListener("click", () => {
  pauseStatus = true;
  pause.style.display = "none";
  resume.style.display = "block";
  block.style.animation = "none";
  hole.style.animation = "none";
  resume.addEventListener("click", () => {
    pauseStatus = false;
    pause.style.display = "block";
    resume.style.display = "none";
    block.style.animation = "block 2s infinite linear";
    hole.style.animation = "block 2s infinite linear";
  });
});
// }

// This generates the visible obstacle
function generateObstacle() {
  let holePosition = {
    top: hole.offsetTop,
    bottom: hole.offsetBottom,
    height: hole.offsetHeight,
  };
  let positionTopBar = {
    pos: holePosition.top,
  };
  let positionBottomBar = {
    pos: holePosition.top + holePosition.height,
  };

  bottomBar.style.height = `${positionBottomBar.pos}px`;
  topBar.style.height = `${positionTopBar.pos}px`;
}

// Agregar el evento animationiteration fuera de la función startGame()
hole.addEventListener("animationiteration", () => {
  if (!pauseStatus) {
    var random = -(Math.random() * 300 + 150);
    hole.style.top = random + "px";
    counter++;
    generateObstacle();
  }
});

start.addEventListener("click", function () {
  startStatus = true;
  game.style.display = "block";
  score.style.display = "block";
  startGame();
});

function startGame() {
  return new Promise((resolve) => {
    if (startStatus) {
      menu.style.display = "none";
      bestScoreMarker.style.display = "none";
      var gameInterval = setInterval(function () {
        if (!pauseStatus) {
          // update score
          score.innerHTML = `Puntos: ${counter}`;
          var characterTop = parseInt(
            window.getComputedStyle(character).getPropertyValue("top")
          );
          if (jumping === 0) {
            character.style.top = characterTop + 3 + "px";
          }
          var blockLeft = parseInt(
            window.getComputedStyle(block).getPropertyValue("left")
          );
          var holeTop = parseInt(
            window.getComputedStyle(hole).getPropertyValue("top")
          );
          var cTop = -(500 - characterTop);
          if (
            characterTop > 480 ||
            (blockLeft < 20 &&
              blockLeft > -50 &&
              (cTop < holeTop || cTop > holeTop + 130))
          ) {
            clearInterval(gameInterval);
            game.style.display = "none";
            score.style.display = "none";
            Swal.fire({
              icon: "error",
              title: "¡Perdiste!",
              text: `Tu Puntaje: ${counter}`,
              allowOutsideClick: false,
              showConfirmButton: true,
            }).then(() => {
              menu.style.display = "flex";
              bestScoreMarker.style.display = "block";
              character.style.top = 100 + "px";
              updateBestScore(counter);
              counter = 0;
              startStatus = false;
              resolve(); // Resuelve la promesa después de hacer clic en el botón de Swal
            });
          }
        }
      }, 10);
    }
  });
}

function jump() {
  jumping = 1;
  let jumpCount = 0;
  var jumpInterval = setInterval(function () {
    var characterTop = parseInt(
      window.getComputedStyle(character).getPropertyValue("top")
    );
    if (characterTop > 6 && jumpCount < 15) {
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

function updateBestScore(counter) {
  let bestScore = localStorage.getItem("best-score") || 0;
  if (counter > bestScore) {
    bestScore = counter;
    localStorage.setItem("best-score", bestScore);
  }
  bestScoreMarker.innerHTML = `Mejor Puntaje: ${bestScore}`;
}
