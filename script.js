// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly

let score = 0;
let timer = 120;

let timerInterval;

// Start button begins a new round.
document.getElementById("start-btn").addEventListener("click", () => {
  if (gameRunning) return;

  startGame();
});

document.getElementById("play-again-btn").addEventListener("click", () => {
  resetGame();
  startGame();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  resetGame();

  document.getElementById("start-overlay").style.display = "flex";
  document.getElementById("overlay-message").textContent =
    "Collect clean water drops and avoid pollution. Reach 100 points before time runs out!";
  document.getElementById("start-btn").style.display = "inline-block";
  document.getElementById("play-again-btn").style.display = "none";
});



function startGame() {

    if (gameRunning) return;

    document.getElementById("start-overlay").style.display = "none";

    gameRunning = true;

    score = 0;
    timer = 120;

    document.getElementById("score").textContent = score;
    document.getElementById("time").textContent = timer;

    dropMaker = setInterval(createDrop, 800);

    timerInterval = setInterval(() => {

        timer--;

        document.getElementById("time").textContent = timer;

        if (timer <= 0) {
            endGame();
        }

    }, 1000);
}

function createDrop() {

  const drop = document.createElement("div");

  const isBadDrop = Math.random() < 0.25;

  drop.className = isBadDrop
    ? "water-drop bad-drop"
    : "water-drop";

  const gameWidth =
    document.getElementById("game-container").offsetWidth;

  drop.style.left =
    Math.random() * (gameWidth - 60) + "px";

  drop.style.animationDuration = "4s";

  drop.addEventListener("click", () => {

    if (!gameRunning) return;

    if (isBadDrop) {

      score -= 3;

      if (score < 0) score = 0;

    } else {

      score += 5;

      if (score >= 100) {

        score = 100;

        document.getElementById("score").textContent = score;

        winGame();

        return;
      }
    }

    document.getElementById("score").textContent = score;

    drop.remove();

  });

  document.getElementById("game-container")
    .appendChild(drop);

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

}
/*function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}*/

function endGame() {

    gameRunning = false;

    clearInterval(dropMaker);
    clearInterval(timerInterval);

    let message = "";

    if (score <= 24) {

        message =
        "Time's Up!\n\n" +
        "Final Score: " + score +
        "\n\nYou collected enough clean water for a cup.";

    } else if (score <= 74) {

        message =
        "Time's Up!\n\n" +
        "Final Score: " + score +
        "\n\nYou collected enough clean water for three families.";

    } 

    document.getElementById("start-overlay").style.display = "flex";
     document.getElementById("overlay-message").textContent =
    "You collected enough clean water for a cup.";
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("play-again-btn").style.display = "inline-block";

}

function winGame() {

  gameRunning = false;

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  confetti({
    particleCount: 150,
    spread: 90
  });

  document.getElementById("start-overlay").style.display = "flex";
  document.getElementById("overlay-message").textContent =
    "You collected enough clean water for whole village!";
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("play-again-btn").style.display = "inline-block";

}

function resetGame() {

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  clearExistingDrops();

  gameRunning = false;

  score = 0;
  timer = 120;

  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timer;

}

function clearExistingDrops() {

  const gameContainer = document.getElementById("game-container");
  const drops = gameContainer.querySelectorAll(".water-drop");

  drops.forEach((drop) => drop.remove());

}