// Variáveis do Jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameStatus = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Configurações do jogo
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Variáveis de estado
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let direction = {x: 0, y: 0};
let nextDirection = {x: 0, y: 0};
let gameSpeed = 100;

// Atualizar display de melhor score
highScoreDisplay.textContent = highScore;

// Event Listeners para controles
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);

// Event Listeners para teclado
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    
    // Arrow keys
    if (event.key === 'ArrowUp' || key === 'w') {
        if (direction.y === 0) nextDirection = {x: 0, y: -1};
        event.preventDefault();
    } else if (event.key === 'ArrowDown' || key === 's') {
        if (direction.y === 0) nextDirection = {x: 0, y: 1};
        event.preventDefault();
    } else if (event.key === 'ArrowLeft' || key === 'a') {
        if (direction.x === 0) nextDirection = {x: -1, y: 0};
        event.preventDefault();
    } else if (event.key === 'ArrowRight' || key === 'd') {
        if (direction.x === 0) nextDirection = {x: 1, y: 0};
        event.preventDefault();
    }
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        gameStatus.classList.remove('show');
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        direction = {x: 1, y: 0};
        gameLoop();
    }
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Retomar' : 'Pausar';
        if (!gamePaused) {
            gameLoop();
        }
    }
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    food = generateFood();
    score = 0;
    gameRunning = false;
    gamePaused = false;
    direction = {x: 0, y: 0};
    nextDirection = {x: 0, y: 0};
    gameSpeed = 100;
    
    scoreDisplay.textContent = score;
    pauseBtn.textContent = 'Pausar';
    pauseBtn.disabled = true;
    startBtn.disabled = false;
    gameStatus.classList.remove('show');
    
    draw();
}

function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        foodOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    }
    
    return newFood;
}

function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    update();
    draw();
    
    setTimeout(gameLoop, gameSpeed);
}

function update() {
    // Atualizar direção
    direction = nextDirection;
    
    // Criar nova cabeça
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Verificar colisão com paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame('Colisão com a parede!');
        return;
    }
    
    // Verificar colisão com a própria cobra
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame('Colisão com você mesmo!');
        return;
    }
    
    // Adicionar nova cabeça
    snake.unshift(head);
    
    // Verificar se comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        food = generateFood();
        
        // Aumentar velocidade gradualmente
        if (gameSpeed > 50) {
            gameSpeed -= 1;
        }
    } else {
        // Remover cauda se não comeu
        snake.pop();
    }
}

function draw() {
    // Limpar canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar grade (opcional)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Desenhar cobra
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Cabeça
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 10;
        } else {
            // Corpo
            ctx.fillStyle = '#00cc00';
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        }
        
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    
    // Desenhar comida
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
}

function endGame(reason) {
    gameRunning = false;
    gamePaused = false;
    
    // Atualizar melhor score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
    
    // Mostrar mensagem
    gameStatus.textContent = `Fim de Jogo! ${reason}\nSeu Score: ${score}`;
    gameStatus.classList.add('show', 'game-over');
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pausar';
    
    draw();
}

// Desenhar inicial
resetGame();