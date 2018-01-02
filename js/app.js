let moveArea = document.getElementsByClassName('moves')[0];
let moves;

let timeArea = document.getElementsByClassName('time')[0];
let time;
let intervalId;
let timing = false;

let scoreArea = document.getElementsByClassName('score')[0];
let score;

let startOrPauseBtn = document.getElementsByClassName('startorpause')[0];
let resetBtn = document.getElementsByClassName('reset')[0];

// game status: running or paused
let running = false;

// Enemies our player must avoid
class Enemy {
    constructor() {
        this.x = 0; // location x
        this.y = Math.floor(Math.random() * 3) + 1; // location y, random from 1/2/3
        this.speed = Math.random(); // speed
        // this.direction = Math.floor(Math.random() * 2); // 0左1右
        this.sprite = 'images/enemy-bug.png';
    }

    /**
     * @description Update the enemy's position
     * @param {float} dt - a time delta between ticks
     */
    update(dt) {
        if (running) {
            this.x += this.speed * dt;
            this.x %= 5;
            setTimeout(() => {
                this.checkCrush();
            }, 50);
        }
    }

    /**
     * @description check crush
     */
    checkCrush() {
        if (player) {
            if (Math.abs(this.x - player.x) <= 0.8 && this.y == player.y) {
                alert(`game over! you crushed!
move ${moves} steps,
spend ${time} seconds.`);
                stopTimer();
                reset();
            }
        }
    }

    /**
     * @description Draw the enemy on the screen
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20);
    }
}


// Our player
class Player {
    constructor() {
        this.x = Math.floor(Math.random() * 5); // location x ,random from 0/1/2/3/4
        this.y = 5; // location y
        // this.speed = Math.random(); // 速度
        // this.direction = Math.floor(Math.random() * 4); // 0左1右2上3下
        this.sprite = 'images/char-boy.png';
    }

    /**
     * @description Update the player's position
     * @param {string} direction - the direction player moves
     */
    update(direction) {
        if (running) {
            switch (direction) {
                case 'left':
                    this.x--;
                    if (this.x < 0) {
                        this.x = 0;
                    }
                    break;
                case 'right':
                    this.x++;
                    if (this.x > 4) {
                        this.x = 4;
                    }
                    break;
                case 'up':
                    this.y--;
                    if (this.y < 0) {
                        this.y = 0;
                    }
                    break;
                case 'down':
                    this.y++;
                    if (this.y > 5) {
                        this.y = 5;
                    }
                    break;
            }
            setTimeout(() => {
                this.checkSuccess();
            }, 50);
        }
    }

    /**
     * @description check success
     */
    checkSuccess() {
        if (this.y == 0) {
            alert(`success! your score is ${score},
move ${moves} steps,
spend ${time} seconds.`);
            stopTimer();
            reset();
        }
    }

    /**
     * @description Draw the enemy on the screen
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 10);
    }

    /**
     * @description handle player's input, contral the player's move direction
     * @param {string} input - player's direction input
     */
    handleInput(input) {
        if (running) {
            if (input == 'left' || input == 'right' || input == 'up' || input == 'down') {
                moves++;
                moveArea.innerHTML = moves;
                score = 100 - time - moves;
                scoreArea.innerHTML = score;
            }
            this.update(input);
            // this.render();
        }
    }
}

/**
 * @description Init the player and the enemies
 */
let init = function() {
    let allEnemies = [];
    for (let i = 0; i < 5; i++) {
        allEnemies.push(new Enemy());
    }
    let player = new Player();
}

/**
 * @description reset the game, include moves, time, score, enemies, player, and the game status.
 */
let reset = function() {
    moves = 0;
    moveArea.innerHTML = moves;
    time = 0;
    timeArea.innerHTML = time;
    score = 100;
    scoreArea.innerHTML = score;

    allEnemies = [];
    player = null;

    for (let i = 0; i < 5; i++) {
        allEnemies.push(new Enemy());
    }
    player = new Player();

    startOrPauseBtn.className = 'fa fa-play startorpause';

    running = false;
}

/**
 * @description start the game
 */
let start = function() {
    running = true;
}

/**
 * @description pause the game
 */
let pause = function() {
    running = false;
}

/**
 * @description start the timer
 */
let startTimer = function() {
    timing = true;
    intervalId = setInterval(() => {
        time++;
        timeArea.innerHTML = time;
        score = 100 - time - moves;
        scoreArea.innerHTML = score;
        checkTimeout();
    }, 1000);
}

/**
 * @description stop the timer
 */
let stopTimer = function() {
    timing = false;
    clearInterval(intervalId);
}

/**
 * @description init and reset the game
 */
let startGame = function() {
    init();
    reset();
    // start();
    // startTimer();
}

startGame();

/**
 * @description check timeout
 */
let checkTimeout = function() {
    if (score <= 0) {
        alert(`game over! you timeout!
move ${moves} steps,
spend ${time} seconds.`);
        stopTimer();
        reset();
    }
}

/**
 * @description bandle the click event to start/pause button
 */
startOrPauseBtn.onclick = function(e) {
    if (running) {
        running = false;
        startOrPauseBtn.className = 'fa fa-play startorpause';
        stopTimer();
        pause();
    } else {
        running = true;
        startOrPauseBtn.className = 'fa fa-pause startorpause';
        startTimer();
        start();
    }

}

/**
 * @description bandle the click event to reset button
 */
resetBtn.onclick = function(e) {
    stopTimer();
    reset();
}

/**
 * @description listens for key presses and sends the keys to Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (player) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});