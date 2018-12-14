// Enemy class
var Enemy = function(x, y, speed) {
  // Variables applied to each of our instances

  this.initPositionX = x;
  this.initPositionY = y - 10;
  this.x = this.initPositionX;
  this.y = this.initPositionY;

  this.step = 101;
  this.initSpeed = speed;
  this.speed = this.initSpeed;

  this.sprite = "images/enemy-bug.png";
};

// method that updates the enemy's position
Enemy.prototype.update = function(dt) {
  if (this.x >= 505) {
    this.x = -101;
  } else {
    this.x += this.speed * dt;
  }
};

// method that increases the enemy's speed
Enemy.prototype.changeSpeed = function() {
  this.speed += 20;
};

// method that draws the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
  this.x = this.initPositionX;
  this.y = this.initPositionY;
  this.speed = this.initSpeed;
};

// player class
class Player {
  constructor(sprite) {
    this.sprite = sprite;
    this.x = 202;
    this.y = 415 - 10;
    this.stepX = 101;
    this.stepY = 83;
    this.score = 0;
    this.health = 3;
  }

  resetPosition() {
    this.x = 202;
    this.y = 415 - 10;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(keycode) {
    if (keycode === "left") {
      this.x -= this.stepX;
    } else if (keycode === "up") {
      this.y -= this.stepY;
    } else if (keycode === "right") {
      this.x += this.stepX;
    } else if (keycode === "down") {
      this.y += this.stepY;
    }
  }

  update() {
    for (let bug of allEnemies) {
      if (this.y === bug.y && this.x - bug.x < 50 && bug.x - this.x < 50) {
        this.resetPosition();
        this.health -= 1;
      } else if (this.y < -10) {
        this.resetPosition();
        this.score += 1;
        for (let bug of allEnemies) {
          bug.changeSpeed();
        }
      } else if (this.y > 425 || this.x < 0 || this.x > 405) {
        this.resetPosition();
      }
    }
    gameBoard.render();
  }

  reset() {
    this.health = 3;
    this.score = 0;
  }
}

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//objects containing all of the data and methods required to create the sidebar

const charList = {
  characters: [
    {
      type: "boy",
      src: "images/char-boy.png"
    },
    {
      type: "cat",
      src: "images/char-cat-girl.png"
    },
    {
      type: "horn",
      src: "images/char-horn-girl.png"
    },
    {
      type: "pink",
      src: "images/char-pink-girl.png"
    },
    {
      type: "princess",
      src: "images/char-princess-girl.png"
    }
  ],

  render: function() {
    const charContainer = document.querySelector(".char-list");
    let i;
    const characters = charList.characters;
    charContainer.innerHTML = "";

    for (i = 0; i < characters.length; i++) {
      const charElement = document.createElement("img");
      charElement.src = characters[i].src;
      charContainer.appendChild(charElement);

      charElement.addEventListener(
        "click",
        (function(character) {
          return function() {
            charList.setCurrentCharacter(character);
          };
        })(characters[i])
      );
    }
  },

  setCurrentCharacter: function(character) {
    player = new Player(character.src);
  }
};

const gameBoard = {
  init: function() {
    this.scoreDisplay = document.getElementById("score");
    this.firstHeart = document.getElementById("heart-one");
    this.secondHeart = document.getElementById("heart-two");
  },

  render: function() {
    this.scoreDisplay.innerHTML = player.score;
    if (player.health === 2) {
      this.firstHeart.style.display = "none";
    } else if (player.health === 1) {
      this.secondHeart.style.display = "none";
    } else {
      this.firstHeart.style.display = "initial";
      this.secondHeart.style.display = "initial";
    }
  }
};

//modal objects handles the view of the closing modal

const modal = {
  init: function() {
    this.modalOverlay = document.querySelector(".modal-overlay");
    this.btn = document.querySelector(".btn-reset");

    this.btn.addEventListener("click", function() {
      for (let enemy of allEnemies) {
        enemy.reset();
      }
      player.reset();
      charList.render();
      gameBoard.render();
      modal.close();
    });
  },

  open: function() {
    this.modalOverlay.classList.add("active");
  },

  close: function() {
    this.modalOverlay.classList.remove("active");
  }
};

charList.render();
gameBoard.init();
modal.init();

// player and enemy objects are instantiated

let player = new Player("images/char-boy.png");
const allEnemies = [];
const enemy1 = new Enemy(0, 83, 100);
const enemy2 = new Enemy(0, 166, 200);
const enemy3 = new Enemy(0, 249, 250);
allEnemies.push(enemy1, enemy2, enemy3);
