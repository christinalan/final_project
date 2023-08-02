//initializing the express 'sketch' object
let express = require("express");
let app = express();

app.use("/", express.static("public"));

//initialize the HTTP server
let http = require("http");
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("server is listening at port: " + port);
});

//initialize socket.io
let io = require("socket.io")();
io.listen(server);

//different nameSpaces
// let user = io.of("/user");

let p5letters = [];
let numberLetters = [];
let p5Letter, singleLetter;
let letterToNum;
let viewers = [];
let newMsg;
let hearClicked = false;

//listening for users to connect
io.sockets.on("connection", (socket) => {
  console.log("mod socket connected : " + socket.id);
  viewers.push(socket.id);
  let viewerCount = viewers.length;

  io.sockets.emit("viewers", viewerCount);

  //getting first letters message to server
  socket.on("msg", (data) => {
    // console.log(data);

    p5letters.push(data.firstLetters);
    // console.log(p5letters1);

    for (let i = 0; i < p5letters.length; i++) {
      p5Letter = p5letters[i];
      p5Letter.forEach((e) => {
        singleLetter = e;
        letterToNum = singleLetter.charCodeAt(0) - 97;
        if (letterToNum >= 13) {
          letterToNum = Math.round(singleLetter.charCodeAt(0) - 111);
        }
        if (letterToNum < 0) {
          letterToNum = Math.round((letterToNum * -1) / 3);
        }
        numberLetters.push(letterToNum);
      });
    }

    // console.log(numberLetters1);

    let msgObj = {
      name: data.name,
      message: data.message,
    };

    newMsg = {
      name: data.name,
      message: data.message,
      color: data.color,
    };

    let hearColor = {
      color: data.color,
    };

    let letterSounds = {
      letters: numberLetters,
      animal: data.animal,
    };

    // io.emit("msgObj", msgObj);
    socket.emit("msgObj", msgObj);

    socket.broadcast.emit("hearColor", hearColor);
    socket.broadcast.emit("letterSounds", letterSounds);

    p5letters = [];
    numberLetters = [];
    // user.emit("letters", data.firstLetters);
  });

  socket.on("bool", (data) => {
    hearClicked = true;
    socket.emit("bool", data);

    if (!hearClicked) {
      return;
    } else {
      console.log(newMsg);
      socket.emit("sentMsg", newMsg);
    }
  });

  //getting bat sound
  // socket.on("animalSounds", (data) => {
  //   // let dataSound = data.sound;
  //   let dataURL = data.soundURL.url;
  //   console.log(dataURL);

  //   socket.broadcast.emit("dataSound", dataURL);
  // });

  // socket.on("animalSounds1", (data) => {
  //   // let dataSound = data.sound;
  //   let dataURL1 = data.soundURL.url;
  //   console.log(dataURL1);

  //   socket.broadcast.emit("dataSound", dataURL1);
  // });

  // socket.on("animalSounds2", (data) => {
  //   // let dataSound = data.sound;
  //   let dataURL2 = data.soundURL.url;
  //   console.log(dataURL2);

  //   socket.broadcast.emit("dataSound", dataURL2);
  // });
});
