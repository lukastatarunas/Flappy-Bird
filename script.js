const canvas = document.getElementById("canvas");
const drawingUtilities = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const generateRandomNumber = number => {
  return Math.floor(Math.random() * (number + 1));
}

const draw = (color, x, y, width, height) => {
  drawingUtilities.fillStyle = color;
  drawingUtilities.fillRect(x, y, width, height);
}

let gameIsOn = true;

const gameOver = () => {
  gameIsOn = false;
  bird.speed = 0;
}

let score = 0;

let bird = {
  x: 0,
  y: canvas.height / 10,
  width: 50,
  height: 50,
  color: "red",
  speed: 5,
  skipPipe: false,
  forward: function() {
    this.x += this.speed;
  },
  down: function() {
    this.y += 4;
  },
  up: function() {
    this.y -= 80;
  },
  draw: function() {
    draw(this.color, canvas.width / 4, this.y, this.width, this.height);
  }
}

let pipe = {
  width: 100,
  color: "green",
  list: [[canvas.width, 0, canvas.height / 2 - bird.height * 1.5], [canvas.width, canvas.height - (canvas.height / 2 - bird.height * 2), canvas.height / 2 - bird.height * 1.5]],
  draw: function() {

    for (i = 0; i < this.list.length; i++) {
      draw(this.color, this.list[i][0] - bird.x, this.list[i][1], this.width, this.list[i][2]);
    }

  },
  generate: function() {
    randomNumber = generateRandomNumber(canvas.height - bird.height * 3);
    this.list.push([this.list[this.list.length - 1][0] + canvas.width * (3/4), 0, randomNumber], [this.list[this.list.length - 1][0] + canvas.width * (3/4), randomNumber + bird.height * 3, canvas.height])
  },
}

pipe.generate();

document.addEventListener("keydown", event => {
  if (gameIsOn) {
    bird.up();
  }
});

document.addEventListener("click", event => {
  if (gameIsOn) {
    bird.up();
  }
});

const main = () => {
  window.requestAnimationFrame(main);

  bird.forward();
  bird.down();

  if (bird.y < -bird.height) {
    gameOver();
  }

  for (i = 0; i < pipe.list.length; i++) {

    if (pipe.list[i][0] - bird.x < -pipe.width) {
      pipe.list.shift();
      pipe.generate();
    }

    if (pipe.list[i][0] - bird.x < canvas.width / 4) {

      if (pipe.list[i][0] - bird.x - bird.width > canvas.width / 4 - pipe.width) {
        bird.skipPipe = true;
      }

      else if (bird.skipPipe) {
        score++;
        bird.skipPipe = false;
      }

    }

    if (pipe.list[i][0] - bird.x < canvas.width / 4 + bird.width && pipe.list[i][0] - bird.x - bird.width > canvas.width / 4 - pipe.width) {
      
      if (!(bird.y > pipe.list[0][2] && bird.y + bird.height < pipe.list[1][1])) {
        gameOver();
      }

    }
  }

  draw("black", 0, 0, canvas.width, canvas.height);

  pipe.draw();
  bird.draw();

  if (bird.y > canvas.height) {
    canvas.height = 0;
    document.getElementById("score").innerHTML = score;
  }

}

main();