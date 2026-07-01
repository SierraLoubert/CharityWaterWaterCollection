const collectSound = new Audio("sound/collect.mp3");
const badSound = new Audio("sound/bad.mp3");
const winSound = new Audio("sound/win.mp3");
const clickSound = new Audio("sound/click.mp3");

// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly

let score = 0;
let timer = 120;

let timerInterval;

//new//
let dropSpeed = 800;
let badDropChance = 0.25;
let startingTime = 120;

// Start button begins a new round.
document.getElementById("start-btn").addEventListener("click", () => {
   clickSound.play();
   
  if (gameRunning) return;

  startGame();
});

document.getElementById("play-again-btn").addEventListener("click", () => {
  resetGame();
  startGame();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  collectSound.play();

  resetGame();

  document.getElementById("start-overlay").style.display = "flex";
  document.getElementById("overlay-message").textContent =
    "Collect clean water drops and avoid pollution. Reach 100 points before time runs out!";
  document.getElementById("start-btn").style.display = "inline-block";
  document.getElementById("play-again-btn").style.display = "none";
});



function startGame() {

  if (gameRunning) return;

  gameRunning = true;

  // Hide the start overlay while the game is running.
  document.getElementById("start-overlay").style.display = "none";

  const difficultySelect = document.getElementById("difficulty");
  const difficulty = difficultySelect ? difficultySelect.value : "normal";

if (difficulty === "easy") {

  startingTime = 150;
  dropSpeed = 1000;
  badDropChance = 0.15;

} else if (difficulty === "hard") {

  startingTime = 60;
  dropSpeed = 600;
  badDropChance = 0.40;

} else {

  startingTime = 120;
  dropSpeed = 800;
  badDropChance = 0.25;

}

timer = startingTime;

document.getElementById("score").textContent = score;
document.getElementById("time").textContent = timer;

clearInterval(dropMaker);
clearInterval(timerInterval);

dropMaker = setInterval(createDrop, dropSpeed);

// Drop one immediately so the game feels responsive on click.
createDrop();

timerInterval = setInterval(() => {
  timer -= 1;
  document.getElementById("time").textContent = timer;

  if (timer <= 0) {
    endGame();
  }
}, 1000);

}

function createDrop() {

  const drop = document.createElement("div");

  const isBadDrop =
  Math.random() < badDropChance;

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

      badSound.currentTime = 0;
      badSound.play();

      if (score < 0) score = 0;

    } else {

      score += 5;

      collectSound.currentTime = 0;
      collectSound.play();

      if (score >= 100) {

        score = 100;

        document.getElementById("score").textContent = score;

        winGame();

        return;
      }
    }

    document.getElementById("score").textContent = score;
    checkMilestones();

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
    spread: 90,
  });

  winSound.currentTime = 0;
  winSound.play();

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

//Milestone Function

function checkMilestones() {

  milestones.forEach((milestone) => {

    if (score === milestone.score) {

      document.getElementById(
        "milestone-message"
      ).textContent = milestone.message;

    }

  });

}

const milestones = [
  {
    score: 25,
    message: "You helped provide clean water for a family!"
  },
  {
    score: 50,
    message: "You are helping an entire community!"
  },
  {
    score: 75,
    message: "More children can attend school!"
  }
];

//addEventListener
document.getElementById("learn-link").addEventListener("click", () => {
    console.log("User opened charity: water website.");
});

document.getElementById("donate-link").addEventListener("click", () => {
    console.log("User opened donation page.");
});
