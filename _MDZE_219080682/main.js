let canvas = document.getElementById('gameboard');
let gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported');
}

// Set up the shaders, program, and buffers
let vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0, 1);
    }
`;

let fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

let program = createProgram(gl, vertexShader, fragmentShader);

let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
let colorUniformLocation = gl.getUniformLocation(program, 'u_color');

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Function to set up the attribute pointer
function setUpAttributePointer() {
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

alert("Welcome to the Snake Game!\n\nRules:\n- Use arrow keys to control the snake.\n- Eat the red blocks to increase your score.\n- Avoid hitting the walls or yourself.\n\nPress 'OK' to start playing!")

alert("Press the 'start' button to play the game!");

// Initialize the game state
let gridSize = 20; 
let snake = [{ x: 160, y: 160 }];
let direction = 'right';
let food = { x: 0, y: 0 }; 
let gameOver = false;
let currentScore = 0;
let highestScore = localStorage.getItem('highestScore') || 0;
let gameInterval = null; 
let gamePaused = true; 

function updateScoreDisplay() {
    
    const currentScoreDisplay = document.getElementById('currentScore');
    currentScoreDisplay.textContent = currentScore;

    
    const highestScoreDisplay = document.getElementById('highestScore');
    highestScoreDisplay.textContent = highestScore;
}

// Place the initial food
placeFood();

// Main game loop
function gameLoop() {
    if (gameOver) return;
    if (gamePaused) return; 

    
    moveSnake();

    checkCollision();

    gl.clear(gl.COLOR_BUFFER_BIT);

    drawFood();

    drawSnake();

    gameInterval = setTimeout(gameLoop, 200); 
}

// Function to move the snake
function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'left':
            head.x -= gridSize;
            break;
        case 'up':
            head.y -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
    }

    // Ensure the snake's position aligns with the grid
    head.x = Math.round(head.x / gridSize) * gridSize;
    head.y = Math.round(head.y / gridSize) * gridSize;

    
    snake.unshift(head);

    
    if (head.x === food.x && head.y === food.y) {
        currentScore++;
      
        if (currentScore > highestScore) {
            highestScore = currentScore;
            localStorage.setItem('highestScore', highestScore);
        }   
        updateScoreDisplay(); 
        
        placeFood();
    } else {
        
        snake.pop();
    }
}

// Function to check for collisions
function checkCollision() {
    let head = snake[0];

    // Check for collision with walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        endGame();
    }

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            endGame();
        }
    }
}

// Function to place food at a random position
function placeFood() {
    food.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    food.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
}

// Function to draw the food
function drawFood() {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        food.x / canvas.width * 2 - 1, food.y / canvas.height * 2 - 1,
        (food.x + gridSize) / canvas.width * 2 - 1, food.y / canvas.height * 2 - 1,
        food.x / canvas.width * 2 - 1, (food.y + gridSize) / canvas.height * 2 - 1,
        (food.x + gridSize) / canvas.width * 2 - 1, (food.y + gridSize) / canvas.height * 2 - 1
    ]), gl.STATIC_DRAW);

    gl.useProgram(program);
    setUpAttributePointer();
    gl.uniform4f(colorUniformLocation, 1, 0, 0, 1); // Red color for food
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// Function to draw the snake
function drawSnake() {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let vertices = [];
    for (let segment of snake) {
        vertices.push(segment.x / canvas.width * 2 - 1, segment.y / canvas.height * 2 - 1);
        vertices.push((segment.x + gridSize) / canvas.width * 2 - 1, segment.y / canvas.height * 2 - 1);
        vertices.push(segment.x / canvas.width * 2 - 1, (segment.y + gridSize) / canvas.height * 2 - 1);
        vertices.push((segment.x + gridSize) / canvas.width * 2 - 1, (segment.y + gridSize) / canvas.height * 2 - 1);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.useProgram(program);
    setUpAttributePointer();
    gl.uniform4f(colorUniformLocation, 0, 1, 0, 1); // Green color for snake
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, snake.length * 4);
}

// Function to handle game over
function endGame() {
    alert('Game Over');
    updateScoreDisplay();
}

// Event listener for the start button
const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
    if (!gameInterval) {
        gameOver = false;
        currentScore = 0;
        updateScoreDisplay();
        placeFood();
        gamePaused = false; 
        gameLoop(); 
    }
});

// Event listener for the pause button
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
    if (gameInterval) {
        clearInterval(gameInterval); 
        gameInterval = null;
        gamePaused = true; 
    }
});

// Event listener for the stop button
const stopBtn = document.getElementById('stopBtn');
stopBtn.addEventListener('click', () => {
    if (gameInterval) {
        clearInterval(gameInterval); 
        gameInterval = null;
    }
    gameOver = true;
});

// Event listener for key presses to change direction
document.addEventListener('keydown', (event) => {
    
    switch (event.key) {
        case 'ArrowLeft':
            
                 direction = 'left';
            break;
        case 'ArrowUp':
            
                direction = 'down';
            break;
        case 'ArrowRight':
            
                direction = 'right';
            break;
        case 'ArrowDown':
            
                direction = 'up';
            break;
     }
});
updateScoreDisplay();
