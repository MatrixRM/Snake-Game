let canvas = document.getElementsById('tela');
let ctx = canvas.getContext('2d');
let box = 32;
let snake = [];
snake [0] = {
    x: 8 *box,
    y: 8 * box
}

function criarBG() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, 16 * box, 16 * box);   
}

function criarCobrinha() {
    for(i=0 ; i < snake.length; i++){
        ctx.fillStyle = 'Black'
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

criarBG();
criarCobrinha();
