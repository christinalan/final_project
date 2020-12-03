//create a socket namespace
let socket = io("/user");
let modSocket = io("/mod");

socket.on("connect", () => {
  console.log("connected");
});

modSocket.on("connect", () => {
  console.log("mod socket in user is connected");
});

//global socket variables
let score;
let clientName;
let clientDate;
let playing, clicked;
let p5playing;
let nameInput;
let sendButton;
let curName;
let toggleButton;
let hearClicked;
let hearButton;
let serverBatSound;
let batMusic1;
let receivedSound;

//variables for the Instructions window
let modal = document.getElementById("info-modal");
let infoButton = document.getElementById("info-button");
//span that closes the window
let span = document.getElementsByClassName("close")[0];

window.addEventListener("load", () => {
  //instructions window
  infoButton.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  //start the oscillators
  toggleButton = document.getElementById("play-button");
  toggleButton.addEventListener("click", () => {
    playing = !playing;
  });

  nameInput = document.getElementById("uname");
  sendButton = document.getElementById("send-name");

  sendButton.addEventListener("click", () => {
    curName = nameInput.value;
    let msgObj = { name: curName };
    socket.emit("msg", msgObj);
  });

  //ScoreButton receives the scoreboard data from the server
  // hearButton = document.getElementById("hear-button");
  // let receivedMsg;
  // let msgEl;

  hearButton = document.getElementById("hear-button")
    hearButton.addEventListener("click", () => {
      batMusic[receivedSound].play();
      console.log(batMusic[receivedSound])
      console.log(batMusic)
    });
});

let batSounds = [];
let batMusic = [];
let serverMusic = [];
let preLoadServer = [];
let sentSound = false;
let last = [serverMusic.length - 1]

let bat1,
  bat2,
  bat3,
  bat4,
  bat5,
  bat6,
  bat7,
  bat8,
  bat9,
  bat10,
  bat12,
  bat13,
  bat14,
  bat15;

// global variables for p5 Sketch
let cnv;
let mouseFreq;
let analyzer, waveform, freqAnalyzer, waveFreq;
let x, y;

function preload() {
  for (let i = 1; i < 14; i++) {
    batMusic[i - 1] = loadSound("../Audio/bat" + i + ".mp3");
  }
}

let divX, divY;

function setup() {
  batSounds.push(
    bat1,
    bat2,
    bat3,
    bat4,
    bat5,
    bat6,
    bat7,
    bat8,
    bat9,
    bat10,
    bat12,
    bat13,
    bat14,
    bat15
  );

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas = createCanvas(width, height);
  divX = width / batMusic.length;
  // divY = height / octaves.length;
  for (i = 0; i < 8; i++) {
    line(0, divY * i, width, divY * i);
    line(divX * i, 0, divX * i, height);
  }

  canvas.mousePressed(playSounds);
  background(0);

  analyzer = new p5.FFT();

  freqAnalyzer = new p5.FFT();

  //listening for bat sound to come from server
  socket.on("dataSound", (data) => {
    sentSound = true;
    receivedSound = data;
    serverMusic.push(receivedSound);
    console.log(receivedSound);
  });
}


//array of sounds evenly mapped to windowWidth
function playSounds() {
  let batNote = Math.round((mouseX + divX / 2) / divX) - 1;
  batMusic[batNote].play();

  let animalSounds = {
    sound: batMusic[batNote],
    number : batNote
  };

  socket.emit("animalSounds", animalSounds);
}

function mouseClicked() {
  clicked = !clicked;

  waveform = analyzer.waveform();
  waveFreq = freqAnalyzer.analyze();

  for (let i = 0; i < waveform.length; i++) {
    let angle = map(i, 0, waveform.length, 0, 360);
    let amp = waveform[i];
    let r = map(amp, 0, 128, 100, 5);
    let x = r * cos(angle);
    let y = r * sin(angle);
    // let x = map(i, 0, waveform.length, 0, width);
    // let y = map(waveform[i], -1, 1, 0, height);
    // let radius = map(amp, 0, 0.5, 300, 5);
    fill(255, r);
    // vertex(x, y);
    ellipse(windowWidth / 2 + x, windowHeight / 2 + y, r);
  }

  // draw the shape of the waveform
  push();
  beginShape();
  strokeWeight(5);
  noFill();
  for (let i = 0; i < waveFreq.length; i++) {
    let angle = map(i, 0, waveFreq.length, 0, 360);
    let amp = waveFreq[i];
    let r = map(amp, 0, 128, 0, 400);
    let x = r * cos(angle);
    let y = r * sin(angle);
    let col = map(i, 0, waveFreq.length, 0, 255);

    // stroke(200, 255, i);
    if (amp != 0) {
      stroke(constrain(col, 100, 255), random(255), 155);
      line(width / 2, height / 2, x, y);
      vertex(x, y + height / 2);
      vertex(x + width / 2, y);
    }
  }
  endShape();
  pop();
}

function keyPressed() {
  if (keyCode === 32) {
    playing = !playing;

    if (playing) {
      osc1.start();
      osc2.start(1);
      toggleButton.style.background = "green";
      toggleButton.innerHTML = "On";
    } else {
      osc1.stop();
      osc2.stop();
      toggleButton.innerHTML = "Off";
      toggleButton.style.background = "red";
    }
  }
}
