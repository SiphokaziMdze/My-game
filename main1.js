const canvas = document.getElementById('gameboard');
const webgl = canvas.getContext('webgl');

if (!webgl) {
    throw new Error("WebGL is not supported by browser!");
}

const blockSize = 25;
const rows = 20;
const cols = 20;
let gameOver = false;
let currentScore = 0;
let highestScore = localStorage.getItem('highestScore') || 0; // Retrieve highest score from localStorage

canvas.height = rows * blockSize;
canvas.width = cols * blockSize;

webgl.clearColor(0, 0, 0, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let foodX;
let foodY;

const velocity = [0, 0];

// Initialize the snake with a starting position
const snakeVertices = [
    [0.0, 0.0, 0.0] // Initial position of the snake head
];

const foodVertices = new Float32Array([
    0.0, 0.0, 0.0
]);

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, foodVertices, webgl.STATIC_DRAW);

const vsSource = `
    attribute vec3 pos;
    uniform mat4 pointMatrix;
    
    void main() {
        gl_Position = pointMatrix * vec4(pos, 1);
        gl_PointSize = 20.0;
    }
`;

const fsSource = `
    precision mediump float;
    uniform bool isSnake;
    void main() {
        if (isSnake) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green color for snake
        } else {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color for food
        }
    }
`;

const vShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vShader, vsSource);
webgl.compileShader(vShader);

const fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fShader, fsSource);
webgl.compileShader(fShader);

const program = webgl.createProgram();
webgl.attachShader(program, vShader);
webgl.attachShader(program, fShader);
webgl.linkProgram(program);
webgl.useProgram(program);

const position = webgl.getAttribLocation(program, 'pos');
webgl.enableVertexAttribArray(position);
webgl.vertexAttribPointer(position, 3, webgl.FLOAT, false, 0, 0);

const pointMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0, 
    0, 0, 1, 0,
    snakeX / (canvas.width / 2) - 1,
    -snakeY / (canvas.height / 2) + 1,
    0, 1
];

const pointMatrixLocation = webgl.getUniformLocation(program, 'pointMatrix');
webgl.uniformMatrix4fv(pointMatrixLocation, false, pointMatrix);

// Add event listener for keyboard arrows
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            // Move the snake up
            moveSnake(0, -blockSize);
            break;
        case 'ArrowDown':
            // Move the snake down
            moveSnake(0, blockSize);
            break;
        case 'ArrowLeft':
            // Move the snake left
            moveSnake(-blockSize, 0);
            break;
        case 'ArrowRight':
            // Move the snake right
            moveSnake(blockSize, 0);
            break;
    }
}

function moveSnake(dx, dy) {
    // Update snake's position
    snakeX += dx;
    snakeY += dy;

    // Check for collisions with food
    if (snakeX === foodX && snakeY === foodY) {
        console.log("Snake ate food!");
        snakeVertices.push([foodX, foodY, 0.0]);
        currentScore++; // Increase current score
        if (currentScore > highestScore) {
            highestScore = currentScore; // Update highest score if current score is higher
            localStorage.setItem('highestScore', highestScore); // Store highest score in localStorage
        }
        updateScoreDisplay(); // Update score display
        placeFood(); // Respawn food at a new location
    }

    // Update snake's position in the matrix
    pointMatrix[12] = snakeX / (canvas.width / 2) - 1;
    pointMatrix[13] = -snakeY / (canvas.height / 2) + 1;

    checkCollision();
}

function render() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    webgl.uniform1i(webgl.getUniformLocation(program, 'isSnake'), true);
    webgl.uniformMatrix4fv(pointMatrixLocation, false, pointMatrix);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(snakeVertices.flat()), webgl.STATIC_DRAW);
    webgl.drawArrays(webgl.POINTS, 0, snakeVertices.length);

    const foodMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0, 
        0, 0, 1, 0,
        foodX / (canvas.width / 2) - 1,
        -foodY / (canvas.height / 2) + 1,
        0, 1
    ];
    webgl.uniform1i(webgl.getUniformLocation(program, 'isSnake'), false);
    webgl.uniformMatrix4fv(pointMatrixLocation, false, foodMatrix);
    webgl.bufferData(webgl.ARRAY_BUFFER, foodVertices, webgl.STATIC_DRAW);
    webgl.drawArrays(webgl.POINTS, 0, 1);
}

function checkCollision() {
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
        gameOver = true;
        endGame();
        return;
    }

    for (let i = 1; i < snakeVertices.length; i++) {
        if (snakeX === snakeVertices[i][0] && snakeY === snakeVertices[i][1]) {
            gameOver = true;
            endGame();
            return;
        }
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function endGame() {
    // Display game over message
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = "Game Over!!!!!!!";
    gameOverMessage.style.position = "absolute";
    gameOverMessage.style.top = "50%";
    gameOverMessage.style.left = "50%";
    gameOverMessage.style.transform = "translate(-50%, -50%)";
    gameOverMessage.style.color = "red";
    gameOverMessage.style.fontSize = "50px";
    document.body.appendChild(gameOverMessage);

    // Stop the game loop or any ongoing animations
    cancelAnimationFrame(gameLoop);
}

function updateScoreDisplay() {
    // Update current score display
    const currentScoreDisplay = document.getElementById('currentScore');
    currentScoreDisplay.textContent = currentScore;

    // Update highest score display
    const highestScoreDisplay = document.getElementById('highestScore');
    highestScoreDisplay.textContent = highestScore;
}

function gameLoop() {
    if (!gameOver) {
        moveSnake(velocity[0], velocity[1]);
        render();
        requestAnimationFrame(gameLoop);
    }
}

// Call placeFood() at the start to initialize food position
placeFood();

// Update score display initially
updateScoreDisplay();

// Start the game loop
gameLoop();
