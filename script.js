const canvas = document.getElementById('tela');
const ctx = canvas.getContext('2d');
const box = 32;

// Inicialização da cobra e comida
let snake = [{ x: 8 * box, y: 8 * box }];
let direction = null;
let food = {
    x: Math.floor(Math.random() * 16) * box,
    y: Math.floor(Math.random() * 16) * box
};
let score = 0;

// Função para desenhar o fundo
function criarBG() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, 16 * box, 16 * box);
}

// Função para desenhar a cobra
function criarCobrinha() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'black' : 'lime';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
}

// Atualiza o estado do jogo
function updateGame() {
    const head = { x: snake[0].x, y: snake[0].y };

    // Atualiza a posição da cabeça
    if (direction === 'left') head.x -= box;
    if (direction === 'up') head.y -= box;
    if (direction === 'right') head.x += box;
    if (direction === 'down') head.y += box;

    // Colisão com bordas
    if (head.x < 0 || head.x >= 16 * box || head.y < 0 || head.y >= 16 * box) {
        clearInterval(game);
        alert(`Game Over! Score: ${score}`);
        return;
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(game);
            alert(`Game Over! Score: ${score}`);
            return;
        }
    }

    // Comer a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 16) * box,
            y: Math.floor(Math.random() * 16) * box
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);

    criarBG();
    criarCobrinha();
    drawFood();
}

// Captura as teclas do teclado
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
    if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
});

// Loop do jogo
const game = setInterval(updateGame, 150);
