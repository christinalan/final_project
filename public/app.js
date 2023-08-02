//create a socket namespace
let socket = io();

socket.on("connect", () => {
  console.log(socket.id + " has connected");
});

//global socket variables
let playing, clicked;
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

// variables for mapping letters to audio snippets
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

//html elements
let nameInput = document.getElementById("input-name");
let msgInput = document.getElementById("input-chat");
let sendButton = document.getElementById("send-name");
let curName, curMsg, letterGroup;
let canvas = document.getElementById("chat-canvas");
let textInput = document.getElementById("chat-box-msgs");
let randomColor = Math.floor(Math.random() * 16777215).toString(16);
let newColor, hearColor;
let hearButton = document.getElementById("hear-button");

//the chat box element ID
let receivedMsg, msgEl;
let chatBox = document.getElementById("chat-box-msgs");

//variables for the Instructions window
let instructions = document.getElementById("instructions");
let modal = document.getElementById("info-modal");
let infoSpan = document.getElementById("info-span");

//variables for the recording
let chunks = [];

//loading function, modal and socket connection
window.addEventListener("load", () => {
  //modal stuff
  instructions.onclick = function () {
    modal.style.display = "block";
  };

  infoSpan.onclick = function () {
    modal.style.display = "none";
  };

  //viewer count (not used currently)
  socket.on("viewers", (data) => {
    // console.log(data);

    let showCount = document.createElement("p");
    showCount.innerHTML = data;
    // viewerBox.appendChild(showCount);
  });

  // animal dropdown
  let dropdown = document.getElementById("select-animal");
  let defaultoption = document.createElement("option");
  defaultoption.text = "Select Animal";
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

  //listening for the letters from the server and converting them on the server side 
  socket.on("letterSounds", (data) => {
    // console.log(data.animal);
    selectedAnimal = data.animal;
    serverLetters = data.letters;

    for (let i = 0; i < serverLetters.length; i++) {
      if (selectedAnimal == "armadillo") {
        queue.push(armadilloMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "bat") {
        queue.push(batMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "capercaillie") {
        queue.push(capercaillieMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "dolphin") {
        queue.push(dolphinMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "elephant") {
        queue.push(elephantMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "elk") {
        queue.push(elkMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "frog") {
        queue.push(frogMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "kauai oo") {
        queue.push(kauaiooMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "lemur") {
        queue.push(lemurMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "midshipman fish") {
        queue.push(plainfinMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "rat") {
        queue.push(ratMusic[serverLetters[i]]);
      }

      if (selectedAnimal == "seal") {
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
      // console.log(queue);
      // console.log(src);
      playThis[i] = loadSound(src, soundSuccess, soundError, soundWaiting);
    }
    src = "";
    queue = [];
  });

  hearButton.addEventListener("click", () => {
    //can only play after the sounds are loaded
    setUpQueue();

    //send to server that messages are being requested
    hearClicked = true;
    socket.emit("bool", hearClicked);
  });

  // socket.on("bool", (data) => {
  //   hearIsTrue = true;
  // });

  //receiving message from server and adding to the chatbox
  socket.on("sentMsg", (data) => {
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

  function setUpQueue() {
    if (audioPlaying == 1 || playThis.length == 0) return;
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

  //FUNCTIONS FOR NOTIFYING STATUS OF SOUND
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

  //DROPDOWN COLOR AND ANIMAL CHANGES
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

    return newColor;
  }

  //change of dropdown
  dropdown.addEventListener("change", function (e) {
    changeColor();
    if (e.target.value == "armadillo") {
      Object.keys(soundTriggered).forEach((item) => {
        //set all the other sounds not selected to false
        item != "armadilloTr" ? soundTriggered[item] : false;
        soundTriggered.armadilloTr = true;
      });
      selectedAnimal = animals[0];
    } else if (e.target.value == "bat") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
        soundTriggered.batTr = true;
      });
      selectedAnimal = animals[1];
    } else if (e.target.value == "capercaillie") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.caperTr = true;
      selectedAnimal = animals[2];
    } else if (e.target.value == "dolphin") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.dolphinTr = true;
      selectedAnimal = animals[3];
    } else if (e.target.value == "elephant") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.elephantTr = true;
      selectedAnimal = animals[4];
    } else if (e.target.value == "elk") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.elkTr = true;
      selectedAnimal = animals[5];
    } else if (e.target.value == "frog") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.frogTr = true;
      selectedAnimal = animals[6];
    } else if (e.target.value == "kauai oo") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.kauaiTr = true;
      selectedAnimal = animals[7];
    } else if (e.target.value == "lemur") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.lemurTr = true;
      selectedAnimal = animals[8];
    } else if (e.target.value == "midshipman fish") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.fishTr = true;
      selectedAnimal = animals[9];
    } else if (e.target.value == "rat") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.ratTr = true;
      selectedAnimal = animals[10];
    } else if (e.target.value == "seal") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.sealTr = true;
      selectedAnimal = animals[11];
    } else if (e.target.value == "treehopper") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.treeTr = true;
      selectedAnimal = animals[12];
    } else if (e.target.value == "walrus") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.walrusTr = true;
      selectedAnimal = animals[13];
    } else if (e.target.value == "whale") {
      Object.keys(soundTriggered).forEach((item) => {
        soundTriggered[item] = false;
      });
      soundTriggered.whaleTr = true;
      selectedAnimal = animals[14];
    }
  });

  function clear() {
    document.getElementById("input-chat").value = "";
  }


  //FUNCTIONS THAT USE THE BOOLEAN HEAR-MESSAGES DATA
  socket.on("hearColor", (data) => {
    dataColor = data.color;
    let currentColor = hearButton.style.backgroundColor;

    //BLINKING FUNCTIONS TO LET THE USER KNOW A MESSAGE HAS BEEN SENT
    let blinkCol = setInterval(() => {
      hearButton.style.backgroundColor = dataColor;
    }, 250);

    let blinkCol2 = setInterval(() => {
      hearButton.style.backgroundColor = currentColor;
    }, 500);

    hearButton.onclick = function () {
      hearButton.style.backgroundColor = currentColor;
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


//Function that creates the visual canvas
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

//function for generating visuals
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
        toCol = color(newColor);
        let noHex = newColor.substring(1);
        p5Color = noHex.split("");
        let newHex = shuffle(p5Color);
        fromColor = color("#" + newHex);
      }
    }
  }

  noStroke();
  for (let i = 0; i < waveFreq.length; i++) {
    let amp = waveFreq[i];
    let x = map(amp, 0, 200, height, 0);
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

    if (yposition < -height / 2) {
      yposition = height - 200;
      background(0);
    }
  }
  if (yposition <= height) {
    waveFreq.splice(0, 1);
  }
}

//PRELOAD SOUNDS
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

//function for playing the music (testing the sounds on the canvas)
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

}


//EVERYTHING BELOW IS FOR RECORDING SOUND ON THE PAGE
const record = document.getElementById('record-button')
let recording = false;
let audio = document.createElement('audio');
let deleteButton = document.createElement("button");
deleteButton.classList.add("delete-button", "record-container")
audio.classList.add("recorded-clip")
audio.setAttribute("controls", "");
deleteButton.innerHTML = "Delete";
let deleted = false;
//recording Audio (using webAudio)
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia(
    {
      audio: true,
    }
  ).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    record.addEventListener("click", () => {
      console.log(chunks);
      recording = !recording;
      if (recording) {
        mediaRecorder.start();
        console.log("recording has started");
        record.style.background = "#e50000"
        record.textContent = "Recording"
  
      } else {
        mediaRecorder.stop();
        console.log("recording has stopped")
        record.style.backgroundColor = "black"
        record.style.color = "rgb(174, 255, 43)"
        record.textContent = "Record"
      }
    })

    mediaRecorder.addEventListener("stop", (e) => {  
      const logContainer = document.getElementById('log')

        logContainer.appendChild(audio);
        logContainer.appendChild(deleteButton);

        const blob = new Blob(chunks, {type: "audio/ogg: codecs=opus"});
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL

    })

    deleteButton.addEventListener('click', (e) => {
      let evtTgt = e.target;
      evtTgt.parentNode.removeChild(evtTgt.parentNode.firstChild)
      evtTgt.parentNode.removeChild(evtTgt)
    })

    mediaRecorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data)
    })

  }).catch((err) => {
    console.error(`The following getUserMedia error occurred: ${err}`)
  })
} else {
  console.log("getUserMedia is not supported on your browser")
}