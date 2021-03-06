//create a socket namespace
let socket = io();

socket.on("connect", () => {
  console.log(socket.id + " has connected");
});

//global socket variables
let playing, clicked;
let hearButton;
let animals = [
  "armadillo",
  "bat",
  "capercaillie",
  "dolphin",
  "elephant",
  "elk",
  "frog",
  "kauai oo",
  "lemur",
  "midshipman fish",
  "rat",
  "seal",
  "treehopper",
  "walrus",
  "whale",
];
let animalOption, selectedAnimal;
let serverLetters;
let soundTriggered = {
  armadilloTr: false,
  batTr: false,
  caperTr: false,
  dolphinTr: false,
  elephantTr: false,
  elkTr: false,
  frogTr: false,
  kauaiTr: false,
  lemurTr: false,
  fishTr: false,
  ratTr: false,
  sealTr: false,
  treeTr: false,
  walrusTr: false,
  whaleTr: false,
};
// let soundtriggered, soundtriggered1, soundtriggered2;
let queue1 = [];
let src1;
let selectedAnimal1, serverLetters1;

let p5Letters = [];
let numberLetters = []; // queue of audio messages
let queue = [];
let src;
let audioPlaying = 0;
let playThis = [];
let p5Letter, singleLetter, letterToNum;
let yesAudio = false;
let hearClicked = false;
let hearIsTrue;
let dataColor;

let nameInput = document.getElementById("input-name");
let msgInput = document.getElementById("input-chat");
let sendButton = document.getElementById("send-name");
let curName, curMsg, letterGroup;
let canvas0 = document.getElementById("chat-canvas");
let textInput = document.getElementById("chat-box-msgs");
let randomColor = Math.floor(Math.random() * 16777215).toString(16);
let newColor, hearColor;
let hearbtn = document.getElementById("hear-button");

//the chat box element ID
let receivedMsg, msgEl;
let chatBox = document.getElementById("chat-box-msgs");

//variables for the Instructions window
let instructions = document.getElementById("instructions");
let modal = document.getElementById("info-modal");
let infoSpan = document.getElementById("info-span");

let viewerBox = document.getElementById("viewer-count");

window.addEventListener("load", () => {
  //modal stuff
  instructions.onclick = function () {
    modal.style.display = "block";
  };

  infoSpan.onclick = function () {
    modal.style.display = "none";
  };

  //viewer count
  socket.on("viewers", (data) => {
    // console.log(data);

    let showCount = document.createElement("p");
    showCount.innerHTML = data;

    // viewerBox.appendChild(showCount);
  });

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

  letterGroup = "";
  sendButton.addEventListener("click", () => {
    letterGroup = msgInput.value.match(/\b(\w)/g);
    // console.log(letterGroup);
    curMsg = msgInput.value;
    curName = nameInput.value;
    let msgObj = {
      name: curName,
      message: curMsg,
      firstLetters: letterGroup,
      animal: selectedAnimal,
      color: newColor,
    };
    socket.emit("msg", msgObj);
    clear();
  });

  socket.on("msgObj", (data) => {
    receivedMsg = data.name + ": " + data.message;
    // console.log(receivedMsg);
    msgEl = document.createElement("p");
    msgEl.innerHTML = receivedMsg;

    chatBox.appendChild(msgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  //listening for the letters from the server and converting them right away?
  socket.on("letterSounds", (data) => {
    // console.log(data.animal);
    selectedAnimal = data.animal;
    // console.log(data.letters);
    serverLetters = data.letters;

    for (let i = 0; i < serverLetters.length; i++) {
      if (selectedAnimal == "armadillo") {
        console.log(selectedAnimal);
        queue.push(armadilloMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "bat") {
        console.log(selectedAnimal);
        queue.push(batMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "capercaillie") {
        console.log(selectedAnimal);
        queue.push(capercaillieMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "dolphin") {
        console.log(selectedAnimal);
        queue.push(dolphinMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "elephant") {
        console.log(selectedAnimal);
        queue.push(elephantMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "elk") {
        console.log(selectedAnimal);
        queue.push(elkMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "frog") {
        console.log(selectedAnimal);
        queue.push(frogMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "kauai oo") {
        console.log(selectedAnimal);
        queue.push(kauaiooMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "lemur") {
        console.log(selectedAnimal);
        queue.push(lemurMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "midshipman fish") {
        console.log(selectedAnimal);
        queue.push(plainfinMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "rat") {
        console.log(selectedAnimal);
        queue.push(ratMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "seal") {
        console.log(selectedAnimal);
        queue.push(sealMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "treehopper") {
        queue.push(treehopperMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "walrus") {
        queue.push(walrusMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "whale") {
        queue.push(whaleMusic[serverLetters[i]]);
      }
    }

    //after queue array is created, playThis will load the audio files from src
    for (let i = 0; i < queue.length; i++) {
      src = queue[i].url;
      console.log(queue);
      console.log(src);
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

    hearClicked = true;
    socket.emit("bool", hearClicked);
  });

  socket.on("bool", (data) => {
    console.log(data);
    hearIsTrue = true;
    // console.log(hearIsTrue);
  });

  socket.on("sentMsg", (data) => {
    console.log(data);

    if (!hearIsTrue) {
      return;
    } else {
      // chatBox.style.color = data.color;
      receivedMsg = data.name + ": " + data.message;

      msgEl = document.createElement("p");
      msgEl.innerHTML = receivedMsg;

      chatBox.appendChild(msgEl);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  //changing color accordingly to dropdown selection
  function createRandomColor() {
    let hexParts = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += hexParts[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function changeColor() {
    newColor = createRandomColor();
    chatBox.style.color = newColor;
    let canvascolor = document.getElementsByTagName("CANVAS")[0];
    canvascolor.style.outlineColor = newColor;
    let drpdwncolor = document.getElementById("select-animal");
    drpdwncolor.style.backgroundColor = newColor;

    hearbtn.style.backgroundColor = newColor;

    return newColor;
  }

  //change of dropdown
  dropdown.addEventListener("change", function (e) {
    changeColor();
    if (e.target.value == "armadillo") {
      Object.keys(soundTriggered).forEach((item) => {
        item != "armadilloTr" ? soundTriggered[item] : false;
        soundTriggered.armadilloTr = true;
      });
      // console.log(soundTriggered.armadilloTr);
      // console.log(soundTriggered.whaleTr);
      selectedAnimal = animals[0];
    } else if (e.target.value == "bat") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
        soundTriggered.batTr = true;
      });
      // console.log(soundTriggered.batTr);
      // console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[1];
    } else if (e.target.value == "capercaillie") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.caperTr = true;
      // console.log(soundTriggered.caperTr);
      // console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[2];
    } else if (e.target.value == "dolphin") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.dolphinTr = true;
      // console.log(soundTriggered.dolphinTr);
      // console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[3];
    } else if (e.target.value == "elephant") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.elephantTr = true;
      // console.log(soundTriggered.elephantTr);
      // console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[4];
    } else if (e.target.value == "elk") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.elkTr = true;
      console.log(soundTriggered.elkTr);
      selectedAnimal = animals[5];
    } else if (e.target.value == "frog") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.frogTr = true;
      console.log(soundTriggered.frogTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[6];
    } else if (e.target.value == "kauai oo") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.kauaiTr = true;
      console.log(soundTriggered.kauaiTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[7];
    } else if (e.target.value == "lemur") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.lemurTr = true;
      console.log(soundTriggered.lemurTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[8];
    } else if (e.target.value == "midshipman fish") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.fishTr = true;
      console.log(soundTriggered.fishTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[9];
    } else if (e.target.value == "rat") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.ratTr = true;
      console.log(soundTriggered.ratTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[10];
    } else if (e.target.value == "seal") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.sealTr = true;
      console.log(soundTriggered.sealTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[11];
    } else if (e.target.value == "treehopper") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.treeTr = true;
      console.log(soundTriggered.treeTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[12];
    } else if (e.target.value == "walrus") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.walrusTr = true;
      console.log(soundTriggered.walrusTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[13];
    } else if (e.target.value == "whale") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.whaleTr = true;
      console.log(soundTriggered.whaleTr);
      console.log(soundTriggered.armadilloTr);
      selectedAnimal = animals[14];
    }
  });

  function clear() {
    document.getElementById("input-chat").value = "";
  }

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

  socket.on("hearColor", (data) => {
    dataColor = data.color;
    let currentColor = hearbtn.style.backgroundColor;

    let blinkCol = setInterval(() => {
      hearbtn.style.backgroundColor = dataColor;
    }, 250);

    let blinkCol2 = setInterval(() => {
      hearbtn.style.backgroundColor = currentColor;
    }, 500);

    hearButton.onclick = function () {
      hearbtn.style.backgroundColor = currentColor;
      clearInterval(blinkCol);
    };

    dropdown.onchange = function () {
      clearInterval(blinkCol2);
    };
  });
});

let level;

let armadilloMusic = [];
let batMusic = [];
let capercaillieMusic = [];
let dolphinMusic = [];
let elephantMusic = [];
let elkMusic = [];
let frogMusic = [];
let kauaiooMusic = [];
let lemurMusic = [];
let plainfinMusic = [];
let ratMusic = [];
let sealMusic = [];
let treehopperMusic = [];
let walrusMusic = [];
let whaleMusic = [];

let singleArmadilloNote,
  singleBatNote,
  singleCapNote,
  singleDolphinNote,
  singleEleNote,
  singleElkNote,
  singleFrogNote,
  singleKNote,
  singleLemurNote,
  singleFishNote,
  singleRatNote,
  singleSealNote,
  singleTreeNote,
  singleWalrusNote,
  singleWhaleNote;

let singleNote;
let newBatSound;
let newTreeSound;
// global variables for p5 Sketch
let cnv;
let mouseFreq;
let analyzer, waveform, freqAnalyzer, waveFreq, audioIn;
let x, y;

var MinFreq = 20;
var MaxFreq = 15000;
var FreqStep = 10;
let w;
let yStart = 0;

let fromCol;
let toCol;
let p5Color;

let width, height;
let divX, divY;

function preload() {
  for (let i = 1; i <= 15; i++) {
    armadilloMusic[i - 1] = loadSound("/Audio/armadillo" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    batMusic[i - 1] = loadSound("/Audio/bat" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    capercaillieMusic[i - 1] = loadSound("/Audio/cap" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    dolphinMusic[i - 1] = loadSound("/Audio/dolphin" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    elephantMusic[i - 1] = loadSound("/Audio/elephant" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    elkMusic[i - 1] = loadSound("/Audio/elk" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    frogMusic[i - 1] = loadSound("/Audio/frog" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    kauaiooMusic[i - 1] = loadSound("/Audio/kau" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    lemurMusic[i - 1] = loadSound("/Audio/lemur" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    plainfinMusic[i - 1] = loadSound("/Audio/plainfin" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    ratMusic[i - 1] = loadSound("/Audio/rat" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    sealMusic[i - 1] = loadSound("/Audio/seal" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    treehopperMusic[i - 1] = loadSound("/Audio/treehopper" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    walrusMusic[i - 1] = loadSound("/Audio/walrus" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    whaleMusic[i - 1] = loadSound("/Audio/whale" + i + ".mp3");
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
  audioIn = new p5.AudioIn();

  w = width / 64;
}

let yposition = 200;
let speed = 0.01;
let antiGravity = 0.01;

function draw() {
  background(0);

  waveFreq = freqAnalyzer.analyze();
  level = amplitude.getLevel();

  fromCol = color(50, 250, 155);
  toCol = color(50, 100, 200);

  for (var key in soundTriggered) {
    if (soundTriggered.hasOwnProperty(key) == true) {
      // console.log(key + ": " + soundTriggered[key]);
      if (soundTriggered[key] == true) {
        // console.log("true !!");

        toCol = color(newColor);
        let noHex = newColor.substring(1);
        // console.log(noHex);
        p5Color = noHex.split("");
        // console.log(p5Color);
        let newHex = shuffle(p5Color);
        // console.log(newHex);
        fromColor = color("#" + newHex);
      }
    }
  }

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
}

function playSounds() {
  let noteIndex = Math.round((mouseX + divX / 2) / divX) - 1;

  singleArmadilloNote = armadilloMusic[noteIndex];

  singleBatNote = batMusic[noteIndex];

  singleCapNote = capercaillieMusic[noteIndex];

  singleDolphinNote = dolphinMusic[noteIndex];

  singleEleNote = elephantMusic[noteIndex];

  singleElkNote = elkMusic[noteIndex];

  singleFrogNote = frogMusic[noteIndex];

  singleKNote = kauaiooMusic[noteIndex];

  singleLemurNote = lemurMusic[noteIndex];

  singleFishNote = plainfinMusic[noteIndex];

  singleRatNote = ratMusic[noteIndex];

  singleSealNote = sealMusic[noteIndex];

  singleTreeNote = treehopperMusic[noteIndex];

  singleWalrusNote = walrusMusic[noteIndex];

  singleWhaleNote = whaleMusic[noteIndex];

  if (soundTriggered.armadilloTr == true) {
    singleArmadilloNote = armadilloMusic[noteIndex];
    singleArmadilloNote.play();
  }

  if (soundTriggered.batTr == true) {
    singleBatNote = batMusic[noteIndex];
    singleBatNote.play();
  }

  if (soundTriggered.caperTr == true) {
    singleCapNote = capercaillieMusic[noteIndex];
    singleCapNote.play();
  }

  if (soundTriggered.dolphinTr == true) {
    singleDolphinNote = dolphinMusic[noteIndex];
    singleDolphinNote.play();
  }

  if (soundTriggered.elephantTr == true) {
    singleEleNote = elephantMusic[noteIndex];
    singleEleNote.play();
  }

  if (soundTriggered.elkTr == true) {
    singleElkNote = elkMusic[noteIndex];
    singleElkNote.play();
  }

  if (soundTriggered.frogTr == true) {
    singleFrogNote = frogMusic[noteIndex];
    singleFrogNote.play();
  }

  if (soundTriggered.kauaiTr == true) {
    singleKNote = kauaiooMusic[noteIndex];
    singleKNote.play();
  }

  if (soundTriggered.lemurTr == true) {
    singleLemurNote = lemurMusic[noteIndex];
    singleLemurNote.play();
  }

  if (soundTriggered.fishTr == true) {
    singleFishNote = plainfinMusic[noteIndex];
    singleFishNote.play();
  }

  if (soundTriggered.ratTr == true) {
    singleRatNote = ratMusic[noteIndex];
    singleRatNote.play();
  }

  if (soundTriggered.sealTr == true) {
    singleSealNote = sealMusic[noteIndex];
    singleSealNote.play();
  }

  if (soundTriggered.treeTr == true) {
    singleTreeNote = treehopperMusic[noteIndex];
    singleTreeNote.play();
  }

  if (soundTriggered.walrusTr == true) {
    singleWalrusNote = walrusMusic[noteIndex];
    singleWalrusNote.play();
  }

  if (soundTriggered.whaleTr == true) {
    singleWhaleNote = whaleMusic[noteIndex];
    singleWhaleNote.play();
  }

  // for (let i = 0; i < allMusic.length; i++) {
  //   singleNote = allMusic[i][noteIndex];
  //   if (soundTriggered.armadilloTr == true) {
  //     singleNote = allMusic[0][noteIndex];
  //     console.log(soundTriggered.armadilloTr);
  //     console.log(singleNote);
  //     // Object.keys(soundTriggered).forEach((item) => {
  //     //   item != "armadilloTr" ? soundTriggered[item] : false;
  //     //   console.log(soundTriggered.batTr);
  //     // });
  //   }
  //   if (soundTriggered.batTr == true) {
  //     singleNote = allMusic[1][noteIndex];
  //     // Object.keys(soundTriggered).forEach((item) => {
  //     //   item != "batTr" ? soundTriggered[item] : false;
  //     // });
  //   }
  //   if (soundTriggered.caperTr == true) {
  //     singleNote = allMusic[2][noteIndex];
  //   }
  // }

  // Object.keys(soundTriggered).forEach((item) => {
  //   if ((soundTriggered[item] = true)) {
  //     singleNote.play();
  //   }
  //   if ((soundTriggered[item] = false)) {
  //     singleNote.setVolume(0);
  //     singleNote.stop();
  //     console.log(soundTriggered.batTr);
  //   }
  // });

  // if (soundTriggered.armadilloTr == true) {
  //   console.log(singleNote);
  //   singleNote.play();
  //   singleArmadilloNote.setVolume(1);
  //   singleArmadilloNote.play();
  //   singleBatNote.setVolume(0);
  //   singleCapNote.setVolume(0);
  //   singleDolphinNote.setVolume(0);
  //   singleEleNote.setVolume(0);
  //   singleElkNote.setVolume(0);
  //   singleFrogNote.setVolume(0);
  //   singleKNote.setVolume(0);
  //   singleLemurNote.setVolume(0);
  //   singleFishNote.setVolume(0);
  //   singleRatNote.setVolume(0);
  //   singleSealNote.setVolume(0);
  //   singleTreeNote.setVolume(0);
  //   singleWalrusNote.setVolume(0);
  //   singleWhaleNote.setVolume(0);
  // }
}
