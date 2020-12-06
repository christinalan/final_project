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
let toggleButton;
let hearButton, convertButton;
let receivedSound;
let animals = ["bat", "treehopper", "walrus"];
let animalOption;
let soundtriggered, soundtriggered1;

let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "!",
  "?",
  ".",
  "+"
];
console.log(alphabet)

let alph;

let msgInput = document.getElementById("input-chat");
let nameInput = document.getElementById("uname");
let sendButton = document.getElementById("send-name");
let curName, curMsg, letterGroup;

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
    } else if (e.target.value == "treehopper") {
      soundtriggered1 = true;
      soundtriggered = false;
    }
  });

  sendButton.addEventListener("click", () => {
    letterGroup = msgInput.value.match(/\b(\w)/g);
    console.log(letterGroup);
    curMsg = msgInput.value;
    curName = nameInput.value;
    let msgObj = { name: curName, message: curMsg, firstLetters: letterGroup };
    socket.emit("msg", msgObj);
 
  });
});

let soundIsPlaying = false;
let level;
let singleBatNote;
let batMusic = [];
let treehopperMusic = [];
let singleTreeNote;
let serverMusic = [];
let serverSound;

let newBatSound;
let newTreeSound;
// global variables for p5 Sketch
let cnv;
let mouseFreq;
let analyzer, waveform, freqAnalyzer, waveFreq;
let x, y;

let soundLength = 30;

var MinFreq = 20;
var MaxFreq = 15000;
var FreqStep = 10;
let w;
let yStart = 0;

var fromCol;
var toCol;

let tree;

function preload() {
  for (let i = 1; i <= 15; i++) {
    batMusic[i - 1] = loadSound("../Audio/bat" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    treehopperMusic[i - 1] = loadSound("../Audio/treehopper" + i + ".mp3");
  }
}

let buildMap = (batMusic, alphabet) => {
  let map = new Map();
  for (let i=0; i<batMusic.length; i++){
    map.set(batMusic[i], alphabet[i])
  }
  return map;
}






let width, height;
let divX, divY;
let p5Letters = [];
let p5Letter, singleLetter, letterToNum;
let batPosition, newBatNote;
let convertedsounds = [];

function setup() {
  width = window.innerWidth / 2;
  height = (2 * window.innerHeight) / 3;
  canvas = createCanvas(width, height);
  canvas.parent("chat-canvas");
  divX = width / 14;
  alph = alphabet.length / 14;
  // divY = height / octaves.length;

  canvas.mousePressed(playSounds);
  background(0);

  analyzer = new p5.FFT();
  freqAnalyzer = new p5.FFT(0, 64);
  amplitude = new p5.Amplitude();

  w = width / 64;

  for (let i = 0; i < batMusic.length; i++) {
    batPosition = batMusic.indexOf(batMusic[i]);
    // letterToNum = alphabet[batPosition];
  }
  //I want to map each letter of the alphabet to a different sound
  //about 2 letters per animal sound
  for (let i = 0; i < alphabet.length; i++) {
    // letterToNum = map(alphabet[i], 0, 27, 0, 14);
  }

  //listening for the letters from the server
  socket.on("letters", (data) => {
  
    p5Letters.push(data);

    // p5Letters.forEach((e) => console.log(e));
    for (let i = 0; i < p5Letters.length; i++) {
      console.log(p5Letters.length)
      p5Letter = p5Letters[i]; 
      console.log(p5Letters[i])
      p5Letter.forEach((e) => {
        singleLetter = e;
        if (singleLetter == "a" || singleLetter == "b") {
          letterToNum = 0;
        } else if (singleLetter == "c" || singleLetter == "d") {
          letterToNum = 1;
        } else if (singleLetter == "e" || singleLetter == "f") {
          letterToNum = 2;
        } else if (singleLetter == "g" || singleLetter == "h") {
          letterToNum = 3;
        } else if (singleLetter == "i" || singleLetter == "j") {
          letterToNum = 4;
        } else if (singleLetter == "k" || singleLetter == "l") {
          letterToNum = 5;
        } else if (singleLetter == "m" || singleLetter == "n" ) {
          letterToNum = 6;
        } else if (singleLetter == "o" || singleLetter == "p") {
          letterToNum = 7;
        } else if (singleLetter == "q" || singleLetter == "r") {
          letterToNum = 8;
        } else if (singleLetter == "s" || singleLetter == "t") {
          letterToNum = 9;
        } else if (singleLetter == "u" || singleLetter == "v") {
          letterToNum = 10;
        } else if (singleLetter == "w" || singleLetter == "x") {
          letterToNum = 11;
        } else if (singleLetter == "y" || singleLetter == "z") {
          letterToNum = 12;
        } else if (singleLetter == "!" || singleLetter == "?") {
          letterToNum = 13;
        }
        else if (singleLetter == "." || singleLetter == "+") {
          letterToNum = 14;
        }
        convertedsounds.push(letterToNum);
        console.log(convertedsounds)

      });
    }
  });

  convertButton = document.getElementById("convert-button");
  convertButton.addEventListener("click", () => {
    for (let i=0;i<convertedsounds.length;i++){
    batMusic[convertedsounds[i]].play();
    console.log( batMusic[convertedsounds[i]])
    }
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

  hearButton = document.getElementById("hear-button");
  hearButton.addEventListener("click", () => {
    // batMusic[batNumber].play();
    newBatSound.play();
    // batMusic[newBatNote].play();
  });

  fromCol = color(50, 250, 155);
  toCol = color(50, 100, 200);
  fromCol2 = color(0, 100, 255);
  toCol2 = color(250, 100, 50);
}

let yposition = 200;
let speed = 0.01;
let antiGravity = 0.01;

function draw() {
  background(0);

  waveFreq = freqAnalyzer.analyze();
  level = amplitude.getLevel();

  let rectWidth = 1; //(soundLength * fps) / windowWidth;
  let rectHeight = (MaxFreq - MinFreq) / windowHeight;

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

    if (level > 0) {
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
  console.log(batNote);
  if (soundtriggered == true) {
    singleBatNote.play();
  }

  let treeNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleTreeNote = treehopperMusic[treeNote];
  if (soundtriggered1 == true) {
    singleTreeNote.play();
  }

  soundtriggered = true;
  let animalSounds = {
    sound: batNote,
    soundURL: batMusic[batNote],
  };

  socket.emit("animalSounds", animalSounds);

// soundtriggered1 = true;
//   let treeSounds = {
//     sound: treeNote,
//     soundURL:treehopperMusic[treeNote],
//   };

//   socket.emit("animalSounds1", treeSounds);
}

function mouseClicked() {
  clicked = !clicked;

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
