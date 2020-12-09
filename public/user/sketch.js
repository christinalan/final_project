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

let nameInput = document.getElementById("input-name");
let msgInput = document.getElementById("input-chat");
let sendButton = document.getElementById("send-name");
let curName, curMsg, letterGroup;
let canvas0 = document.getElementById("chat-canvas");
let textInput = document.getElementById("chat-box-msgs");
let randomColor = Math.floor(Math.random() * 16777215).toString(16);
let newColor;

//the chat box element ID
let chatBox = document.getElementById("chat-box-msgs");
let textMessages = document.getElementsByTagName("P");

//variables for the Instructions window
let instructions = document.getElementById("instructions");
let modal = document.getElementById("info-modal");
let infoSpan = document.getElementById("info-span");

window.addEventListener("load", () => {
  //modal stuff
  instructions.onclick = function () {
    modal.style.display = "block";
  };

  infoSpan.onclick = function () {
    modal.style.display = "none";
  };

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
    let hearbtn = document.getElementById("hear-button");
    hearbtn.style.backgroundColor = newColor;
    return newColor;
  }

  //change of dropdown
  dropdown.addEventListener("change", function (e) {
    changeColor();
    if (e.target.value == "armadillo") {
      soundTriggered.armadilloTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "armadilloTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.armadilloTr);
      // soundtriggered1 = false;
      // soundtriggered2 = false;
      selectedAnimal = animals[0];
    } else if (e.target.value == "bat") {
      soundTriggered.batTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "batTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.batTr);
      selectedAnimal = animals[1];
    } else if (e.target.value == "capercaillie") {
      soundTriggered.caperTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "caperTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.caperTr);
      selectedAnimal = animals[2];
    } else if (e.target.value == "dolphin") {
      soundTriggered.dolphinTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "dolphinTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.dolphinTr);
      selectedAnimal = animals[3];
    } else if (e.target.value == "elephant") {
      soundTriggered.elephantTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "elephantTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.elephantTr);
      selectedAnimal = animals[4];
    } else if (e.target.value == "elk") {
      soundTriggered.elkTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "elkTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.elkTr);
      selectedAnimal = animals[5];
    } else if (e.target.value == "frog") {
      soundTriggered.frogTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "frogTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.frogTr);
      selectedAnimal = animals[6];
    } else if (e.target.value == "kauai oo") {
      soundTriggered.kauaiTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "kauaiTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.kauaiTr);
      selectedAnimal = animals[7];
    } else if (e.target.value == "lemur") {
      soundTriggered.lemurTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "lemurTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.lemurTr);
      selectedAnimal = animals[8];
    } else if (e.target.value == "midshipman fish") {
      soundTriggered.fishTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "fishTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.fishTr);
      selectedAnimal = animals[9];
    } else if (e.target.value == "rat") {
      soundTriggered.ratTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "ratTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.ratTr);
      selectedAnimal = animals[10];
    } else if (e.target.value == "seal") {
      soundTriggered.sealTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "sealTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.sealTr);
      selectedAnimal = animals[11];
    } else if (e.target.value == "treehopper") {
      soundTriggered.treeTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "treeTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.treeTr);
      selectedAnimal = animals[12];
    } else if (e.target.value == "walrus") {
      soundTriggered.walrusTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "walrusTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.walrusTr);
      selectedAnimal = animals[13];
      // changeColor1();
    } else if (e.target.value == "whale") {
      soundTriggered.whaleTr = true;
      Object.keys(soundTriggered).forEach((item) => {
        item != "whaleTr" ? soundTriggered[item] : false;
      });
      console.log(soundTriggered.whaleTr);
      selectedAnimal = animals[14];
      // changeColor2();
    }
  });

  function clear() {
    document.getElementById("input-chat").value = "";
  }

  letterGroup = "";
  sendButton.addEventListener("click", () => {
    letterGroup = msgInput.value.match(/\b(\w)/g);
    console.log(letterGroup);
    curMsg = msgInput.value;
    curName = nameInput.value;
    let msgObj = {
      name: curName,
      message: curMsg,
      firstLetters: letterGroup,
      animal: selectedAnimal,
    };
    socket.emit("msg", msgObj);
    clear();
  });

  socket.on("msgObj", (data) => {
    let receivedMsg = data.name + ": " + data.message;
    // console.log(receivedMsg);
    let msgEl = document.createElement("p");
    msgEl.innerHTML = receivedMsg;

    chatBox.appendChild(msgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  //listening for the letters from the server and converting them right away?
  socket.on("letterSounds", (data) => {
    console.log(data.animal);
    selectedAnimal = data.animal;
    console.log(data.letters);
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
      console.log(playThis);
    }
    src = "";
    queue = [];
  });

  hearButton = document.getElementById("hear-button");
  hearButton.addEventListener("click", () => {
    //can only play after the sounds are loaded
    setUpQueue();
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
    armadilloMusic[i - 1] = loadSound("../Audio/armadillo" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    batMusic[i - 1] = loadSound("../Audio/bat" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    capercaillieMusic[i - 1] = loadSound("../Audio/capercaillie" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    dolphinMusic[i - 1] = loadSound("../Audio/dolphin" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    elephantMusic[i - 1] = loadSound("../Audio/elephant" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    elkMusic[i - 1] = loadSound("../Audio/elk" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    frogMusic[i - 1] = loadSound("../Audio/frog" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    kauaiooMusic[i - 1] = loadSound("../Audio/kauaioo" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    lemurMusic[i - 1] = loadSound("../Audio/lemur" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    plainfinMusic[i - 1] = loadSound("../Audio/plainfin" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    ratMusic[i - 1] = loadSound("../Audio/rat" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    sealMusic[i - 1] = loadSound("../Audio/seal" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    treehopperMusic[i - 1] = loadSound("../Audio/treehopper" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    walrusMusic[i - 1] = loadSound("../Audio/walrus" + i + ".mp3");
  }
  for (let i = 1; i <= 15; i++) {
    whaleMusic[i - 1] = loadSound("../Audio/whale" + i + ".mp3");
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
  console.log(audioIn.getSources());

  w = width / 64;

  // let isTrue = Object.keys(soundTriggered).some(
  //   (item) => !soundTriggered[item]
  // );
  // console.log(isTrue);
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

  if (soundTriggered.armadilloTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
    // toColor = color(100, 300, 50);
  }

  if (soundTriggered.batTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.caperTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.dolphinTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.elephantTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.elkTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.frogTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.kauaiTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.lemurTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.fishTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.ratTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.sealTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.treeTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.walrusTr == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
  }

  if (soundTriggered.whale == true) {
    toCol = color(newColor);
    let noHex = newColor.substring(1);
    // console.log(noHex);
    p5Color = noHex.split("");
    // console.log(p5Color);
    let newHex = shuffle(p5Color);
    // console.log(newHex);
    fromColor = color("#" + newHex);
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
  let armNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleArmadilloNote = armadilloMusic[armNote];

  if (soundTriggered.armadilloTr == true) {
    singleArmadilloNote.play();
  }

  let batNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleBatNote = batMusic[batNote];

  if (soundTriggered.batTr == true) {
    singleBatNote.play();

    let batSounds = {
      sound: batNote,
      soundURL: batMusic[batNote],
    };

    socket.emit("animalSounds", batSounds);
  }

  let capNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleCapNote = capercaillieMusic[capNote];

  if (soundTriggered.caperTr == true) {
    singleCapNote.play();
  }

  let dolNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleDolphinNote = dolphinMusic[dolNote];

  if (soundTriggered.dolphinTr == true) {
    singleDolphinNote.play();
  }

  let elpNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleEleNote = elephantMusic[elpNote];

  if (soundTriggered.elephantTr == true) {
    singleEleNote.play();
  }

  let elkNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleElkNote = elkMusic[elkNote];

  if (soundTriggered.elkTr == true) {
    singleElkNote.play();
  }

  let frogNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleFrogNote = frogMusic[frogNote];

  if (soundTriggered.frogTr == true) {
    singleFrogNote.play();
  }

  let kNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleKNote = kauaiooMusic[kNote];

  if (soundTriggered.kauaiTr == true) {
    singleKNote.play();
  }

  let lemurNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleLemurNote = lemurMusic[lemurNote];

  if (soundTriggered.lemurTr == true) {
    singleLemurNote.play();
  }

  let fishNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleFishNote = plainfinMusic[fishNote];

  if (soundTriggered.fishTr == true) {
    singleFishNote.play();
  }

  let ratNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleRatNote = ratMusic[ratNote];

  if (soundTriggered.ratTr == true) {
    singleRatNote.play();
  }

  let sealNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleSealNote = sealMusic[sealNote];

  if (soundTriggered.sealTr == true) {
    singleRatNote.play();
  }

  let treeNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleTreeNote = treehopperMusic[treeNote];
  if (soundTriggered.treeTr == true) {
    singleTreeNote.play();
  }

  let walrusNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleWalrusNote = walrusMusic[walrusNote];
  if (soundTriggered.walrusTr == true) {
    singleWalrusNote.play();
  }

  let whaleNote = Math.round((mouseX + divX / 2) / divX) - 1;
  singleWhaleNote = whaleMusic[whaleNote];
  if (soundTriggered.whaleTr == true) {
    singleWhaleNote.play();
  }
}

function mouseClicked() {
  clicked = !clicked;
}
