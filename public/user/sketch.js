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
let playing, clicked;
let toggleButton;
let hearButton, convertButton;
let animals = ["bat", "treehopper", "walrus"];
let animalOption;
let soundtriggered, soundtriggered1, soundtriggered2;

let p5Letters = [];
let numberLetters = []; // queue of audio messages
let queue = [];
let src;
let audioPlaying = 0;
let playThis = [];
let p5Letter, singleLetter, letterToNum;
let yesAudio = false;

let nameInput = document.getElementById("input-name");
let msgInput = document.getElementById("input-chat");
let sendButton = document.getElementById("send-name");
let curName, curMsg, letterGroup;

//the chat box element ID
let chatBox = document.getElementById("chat-box-msgs");

//variables for the Instructions window
let modal = document.getElementById("info-modal");
let infoButton = document.getElementById("info-button");
//span that closes the window
let span = document.getElementsByClassName("close")[0];

window.addEventListener("load", () => {
  // animal dropdown
  let dropdown = document.getElementById("select-animal");
  let defaultoption = document.createElement("option");
  defaultoption.text = "select animal";
  dropdown.add(defaultoption);

  for (let i = 0; i < animals.length; i++) {
    let animalOption = document.createElement("option");
    animalOption.text = animals[i];
    dropdown.add(animalOption);
  }
  dropdown.selectedIndex = 0;

  //change of dropdown
  dropdown.addEventListener("change", function (e) {
    if (e.target.value == "bat") {
      soundtriggered = true;
      soundtriggered1 = false;
      soundtriggered2 = false;
    } else if (e.target.value == "treehopper") {
      soundtriggered1 = true;
      soundtriggered = false;
      soundtriggered2 = false;
    } else if (e.target.value == "walrus") {
      soundtriggered2 = true;
      soundtriggered = false;
      soundtriggered1 = false;
    }
  });

  letterGroup = "";
  sendButton.addEventListener("click", () => {
    letterGroup = msgInput.value.match(/\b(\w)/g);
    console.log(letterGroup);
    curMsg = msgInput.value;
    curName = nameInput.value;
    let msgObj = { name: curName, message: curMsg, firstLetters: letterGroup };
    socket.emit("msg", msgObj);
  });

  socket.on("msgObj", (data) => {
    let receivedMsg = data.name + ": " + data.message;
    // console.log(receivedMsg);
    let msgEl = document.createElement("p");
    msgEl.innerHTML = receivedMsg;

    chatBox.appendChild(msgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  //listening for the letters from the server
  socket.on("letters", (data) => {
    p5Letters.push(data);

    for (let i = 0; i < p5Letters.length; i++) {
      // console.log(p5Letters.length);
      p5Letter = p5Letters[i];
      // console.log(p5Letters[i]);
      p5Letter.forEach((e) => {
        singleLetter = e;
        letterToNum = singleLetter.charCodeAt(0) - 97;
        if (letterToNum >= 13) {
          letterToNum = Math.round(singleLetter.charCodeAt(0) - 111);
        }
        if (letterToNum < 0) {
          letterToNum = Math.round((letterToNum * -1) / 3);
        }
        // console.log(letterToNum);
        numberLetters.push(letterToNum);
        // console.log(numberLetters);
      });
    }
    p5Letters = [];
    console.log(p5Letters);
  });

  convertButton = document.getElementById("convert-button");
  convertButton.addEventListener("click", () => {
    queue = [];
    for (let i = 0; i < numberLetters.length; i++) {
      if (soundtriggered == true) {
        queue.push(batMusic[numberLetters[i]]);
      }

      if (soundtriggered1 == true) {
        queue.push(treehopperMusic[numberLetters[i]]);
      }

      if (soundtriggered2 == true) {
        queue.push(walrusMusic[numberLetters[i]]);
      }
    }

    numberLetters = [];
    console.log(numberLetters);
    //after queue array is created, playThis will load the audio files from src
    for (let i = 0; i < queue.length; i++) {
      src = queue[i].url;
      // console.log(queue);
      // console.log(src);
      playThis[i] = loadSound(src, soundSuccess, soundError, soundWaiting);
      // console.log(playThis);
    }
    src = "";
    queue = [];
  });

  hearButton = document.getElementById("hear-button");
  hearButton.addEventListener("click", () => {
    //can only play after the sounds are loaded
    setUpQueue();
  });

  //listening for bat sound to come from server
  socket.on("dataSound", (data) => {
    // batNumber = data.sound;
    serverMusic.push(data);
    // console.log(serverMusic);

    for (let i = 0; i < serverMusic.length; i++) {
      newBatSound = new Audio(serverMusic[i]);
      // console.log(newBatSound);
    }
    // let newBatSound = new Audio(data);
  });

  function setUpQueue() {
    if (audioPlaying == 1 || playThis.length == 0) return;
    // console.log(playThis);
    playQueue();
  }

  function playQueue() {
    audioPlaying = 1;
    if (playThis.length == 0) {
      audioPlaying = 0;
      return;
    }
    src = playThis[0];
    src.play();
    // console.log(src);
    // this will play the next file in the playThis array
    src.onended(() => {
      playThis.splice(0, 1);
      playQueue();
    });

    yesAudio = true;
  }

  function soundSuccess(resp) {
    console.log("Sound is ready!");
    // alert("sound is ready");
  }
  function soundError(err) {
    console.log("sound is not working");
    console.log(err);
  }
  function soundWaiting() {
    console.log("Waiting for sound...");
  }
});

let level;
let singleBatNote;
let batMusic = [];
let treehopperMusic = [];
let singleTreeNote;
let serverMusic = [];
let serverSound;
let walrusMusic = [];
let singleWalrusNote;

let newBatSound;
let newTreeSound;
// global variables for p5 Sketch
let cnv;
let mouseFreq;
let analyzer, waveform, freqAnalyzer, waveFreq;
let x, y;

var MinFreq = 20;
var MaxFreq = 15000;
var FreqStep = 10;
let w;
let yStart = 0;

var fromCol;
var toCol;

let width, height;
let divX, divY;

function preload() {
  for (let i = 1; i <= 15; i++) {
    batMusic[i - 1] = loadSound("../Audio/bat" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    treehopperMusic[i - 1] = loadSound("../Audio/treehopper" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    walrusMusic[i - 1] = loadSound("../Audio/walrus" + i + ".mp3");
  }
}

function setup() {
  width = window.innerWidth / 2;
  height = (2 * window.innerHeight) / 3;
  canvas = createCanvas(width, height);
  canvas.parent("chat-canvas");
  divX = width / 15;

  canvas.mousePressed(playSounds);
  background(0);

  analyzer = new p5.FFT();
  freqAnalyzer = new p5.FFT(0, 64);
  amplitude = new p5.Amplitude();

  w = width / 64;

  fromCol = color(50, 250, 155);
  toCol = color(50, 100, 200);
  fromCol2 = color(0, 100, 255);
  toCol2 = color(250, 100, 50);
}

let yposition = 200;
let speed = 0.01;
let antiGravity = 0.01;
let firstAn = false;

function draw() {
  background(0);

  waveFreq = freqAnalyzer.analyze();
  level = amplitude.getLevel();

  noStroke();
  for (let i = 0; i < waveFreq.length; i++) {
    let amp = waveFreq[i];
    let x = map(amp, 0, 200, height, 0);
    // let x = map(i, 0, waveFreq.length, 0, width);
    let y = map(i, 0, 200, height / 2, 0);
    let c = constrain(freqAnalyzer.getEnergy(i), 0, 255);
    let l = map(c, 0, 255, 0, 1);
    let col = lerpColor(fromCol, toCol, l);
    fill(col);
    rect(x, yposition + y, i / 2, amp);

    if (amp > 0) {
      push();
      stroke(col);
      line(x, yposition + y, 0, height / i);
      pop();
    }

    yposition -= speed;
    // speed -= antiGravity;

    if (yposition < -height / 2) {
      yposition = height - 200;
      background(0);
    }
  }
  if (yposition <= height) {
    waveFreq.splice(0, 1);
  }

  push();
  beginShape();
  for (let i = 0; i < waveFreq.length; i++) {
    let c = constrain(freqAnalyzer.getEnergy(i), 0, 255);
    let l = map(c, 0, 255, 0, 1);
    let col = lerpColor(fromCol2, toCol2, l);
    let alpha = map(level, 0, 0.5, 50, 150);
    noStroke();
    // fill(col, alpha);
    // vertex(i * w, map(waveFreq[i], 0, 256, height, 0));
  }
  endShape();
  pop();
}

function playSounds() {
  let batNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleBatNote = batMusic[batNote];

  if (soundtriggered == true) {
    // singleBatNote.play();

    let animalSounds = {
      sound: batNote,
      soundURL: batMusic[batNote],
    };

    socket.emit("animalSounds", animalSounds);
  }

  let treeNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleTreeNote = treehopperMusic[treeNote];
  if (soundtriggered1 == true) {
    // singleTreeNote.play();

    let treeSounds = {
      sound: treeNote,
      soundURL: treehopperMusic[treeNote],
    };

    socket.emit("animalSounds1", treeSounds);
  }

  let walrusNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleWalrusNote = walrusMusic[walrusNote];
  if (soundtriggered2 == true) {
    singleWalrusNote.play();

    let walrusSounds = {
      sound: walrusNote,
      soundURL: walrusMusic[walrusNote],
    };

    socket.emit("animalSounds2", walrusSounds);
  }
}

function animalAnimation() {
  waveform = analyzer.waveform();

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
      // line(width / 2, height / 2, x, y);
      // vertex(x, y + height / 2);
      // vertex(x + width / 2, y);
    }
  }
  endShape();
  pop();
}

function mouseClicked() {
  clicked = !clicked;
}

// function keyPressed() {
//   if (keyCode === 32) {
//     playing = !playing;

//     if (playing) {
//       osc1.start();
//       osc2.start(1);
//       toggleButton.style.background = "green";
//       toggleButton.innerHTML = "On";
//     } else {
//       osc1.stop();
//       osc2.stop();
//       toggleButton.innerHTML = "Off";
//       toggleButton.style.background = "red";
//     }
//   }
// }
