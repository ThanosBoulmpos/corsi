document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const countdownElement = document.getElementById("countdown");
  const numBlocks = 9;
  let tries = 2;
  const blockSize = 100; // Assuming square blocks
  const blocks = [];
  let sequence = [];
  let userSequence = [];
  let blockSequenceLength = 2; // Starting sequence length
  let score = 0;

  function updateTriesDisplay() {
    const triesDisplay = document.querySelector("#lifes p"); // Select the paragraph within the #lifes div
    triesDisplay.textContent = `Tries Remaining: ${tries}`;
  }

  updateTriesDisplay();

  function getRandomPosition() {
    return {
      left: Math.random() * (canvas.offsetWidth - blockSize),
      top: Math.random() * (canvas.offsetHeight - blockSize),
    };
  }

  function isOverlapping(pos, blocks) {
    return blocks.some((block) => {
      return !(
        pos.left > block.left + blockSize ||
        pos.left + blockSize < block.left ||
        pos.top > block.top + blockSize ||
        pos.top + blockSize < block.top
      );
    });
  }

  function placeBlock(i) {
    let position;
    do {
      position = getRandomPosition();
    } while (isOverlapping(position, blocks));

    const block = document.createElement("div");
    block.classList.add("block");
    block.id = "block-" + i;
    block.style.left = position.left + "px";
    block.style.top = position.top + "px";
    block.style.display = "flex";
    block.style.alignItems = "center";
    block.style.justifyContent = "center";
    block.style.fontSize = "2em"; // Adjust size as necessary
    block.style.color = "white"; // Text color
    block.addEventListener("click", function () {
      // Add checkmark to the block that was clicked
      this.innerHTML = "&#10003;"; // Unicode checkmark

      userSequence.push(i);
    });
    canvas.appendChild(block);

    blocks.push({
      left: position.left,
      top: position.top,
      element: block,
    });
  }

  function generateSequence() {
    sequence = [];
    let availableIndices = Array.from({ length: numBlocks }, (_, i) => i + 1); // Create an array [1, 2, ..., numBlocks]

    for (let i = 0; i < blockSequenceLength; i++) {
      let blockIndex = Math.floor(Math.random() * availableIndices.length); // Get a random index from the available indices
      sequence.push(availableIndices[blockIndex]); // Add the selected block to the sequence
      availableIndices.splice(blockIndex, 1); // Remove the selected block from the available indices
    }

    // tries = 2;
  }

  function highlightSequence() {
    let i = 0;
    const interval = setInterval(function () {
      if (i >= sequence.length) {
        clearInterval(interval);
        return;
      }
      const block = document.getElementById("block-" + sequence[i]);
      block.classList.add("highlight");
      setTimeout(function () {
        block.classList.remove("highlight");
      }, 500);
      i++;
    }, 600);
  }

  // function checkSequence() {
  //   if (userSequence.length === sequence.length) {
  //     // Add a delay before showing the result to ensure the last checkmark is shown
  //     setTimeout(function () {
  //       let correct = userSequence.every(
  //         (val, index) => val === sequence[index]
  //       );
  //       if (correct) {
  //         alert("Correct sequence!");
  //         // Increase the sequence length for the next round
  //         blockSequenceLength++;
  //       } else {
  //         alert("Incorrect sequence. Try again!");
  //       }
  //       resetTest();
  //     }, 300); // Delay of 300ms, adjust as needed
  //   }
  // }

  function checkSequence() {
    console.log("tries", tries);
    const doneButton = document.getElementById("doneButton");
    const doneButtonText = doneButton.querySelector("p") || doneButton; // Fallback to doneButton if <p> is not found.

    if (userSequence.length === sequence.length) {
      if (userSequence.every((val, index) => val === sequence[index])) {
        // Correct sequence
        score++;
        doneButtonText.textContent = "Correct!";
        setTimeout(function () {
          doneButtonText.textContent = "Done";
        }, 1000);
        blockSequenceLength++;
        resetTest();
      } else {
        tries--;
        updateTriesDisplay(); // Update the display for tries remaining

        if (tries <= 0) {
          displayGameOver();
          // No more tries left, game over
          doneButtonText.textContent = "Game Over";
          doneButton.style.backgroundColor = "red";
          doneButton.style.pointerEvents = "none";
        } else {
          // Incorrect sequence, but user has another try
          doneButtonText.textContent = "Try Again";
          blocks.forEach((block) => (block.element.innerHTML = "")); // Clear checkmarks
          doneButton.style.backgroundColor = "orange";
          setTimeout(function () {
            doneButtonText.textContent = "Done";
            doneButton.style.backgroundColor = ""; // Reset background color
            userSequence = []; // Reset the user's sequence
            highlightSequence(); // Show the sequence again
          }, 1000);
        }
      }
    } else {
      // Not enough selections made
      doneButtonText.textContent = "Incomplete!";
      setTimeout(function () {
        doneButtonText.textContent = "Done";
      }, 1000);
    }
  }

  function resetTest() {
    userSequence = [];
    generateSequence();

    // Clear checkmarks from all blocks
    blocks.forEach((block) => (block.element.innerHTML = ""));

    // Wait for the "GO" message to hide before starting
    setTimeout(highlightSequence, 1000);
  }

  function startCountdown(duration) {
    let timer = duration;
    countdownElement.innerText = timer;

    const countdownTimer = setInterval(function () {
      timer -= 1;
      countdownElement.innerText = timer;
      if (timer <= 0) {
        clearInterval(countdownTimer);
        countdownElement.innerText = "GO!";
        // Hide the countdown after a short delay and start the test
        setTimeout(() => {
          countdownElement.innerText = "";
          highlightSequence();
        }, 1000);
      }
    }, 1000);
  }

  // Initialize blocks
  // ... [Previous code]

  // Initialize blocks and start countdown
  for (let i = 1; i <= numBlocks; i++) {
    placeBlock(i);
  }
  generateSequence();

  // Start the countdown timer before starting the test
  startCountdown(3);

  // Function to clear the canvas and restart the test
  function restartTest() {
    // Clear existing blocks
    canvas.innerHTML = "";
    blocks.length = 0;
    userSequence.length = 0;
    sequence.length = 0;
    blockSequenceLength = 2; // Reset sequence length to initial value

    // Re-initialize blocks and sequence
    for (let i = 1; i <= numBlocks; i++) {
      placeBlock(i);
    }
    generateSequence();

    // Start countdown again
    startCountdown(3);
  }

  document.getElementById("doneButton").addEventListener("click", function () {
    checkSequence(); // This will now trigger when the "Done" button is clicked
  });

  //Display Game Over Text
  function displayGameOver() {
    canvas.innerHTML = "";
    const gameOverText = document.createElement("div");
    gameOverText.textContent = `Game Over. Your score is: ${score}`;
    gameOverText.style.fontFamily = "'Inter', sans-serif";
    gameOverText.style.position = "absolute";
    gameOverText.style.top = "50%";
    gameOverText.style.left = "50%";
    gameOverText.style.transform = "translate(-50%, -50%)";
    gameOverText.style.fontSize = "24px";
    gameOverText.style.color = "white";
    gameOverText.style.textAlign = "center";

    canvas.appendChild(gameOverText); // Add the game over text to the canvas

    // Optionally, disable the Done button to prevent further actions
    const doneButton = document.getElementById("doneButton");
    doneButton.style.pointerEvents = "none";
  }

  // Add restart functionality if needed
  // You can call restartTest() to restart the game at any time
});
