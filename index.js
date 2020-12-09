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
let mod = io.of("/mod");
let user = io.of("/user");

//listening for users to connect
mod.on("connection", (socket) => {
  console.log("mod socket connected : " + socket.id);
});

let p5letters1 = [];
let numberLetters1 = [];
let p5Letter1, singleLetter1;
let letterToNum1;

//listening for users to connect
user.on("connection", (socket) => {
  console.log("mod socket connected : " + socket.id);

  //getting first letters message to server
  socket.on("msg", (data) => {
    // console.log(data);

    p5letters1.push(data.firstLetters);
    // console.log(p5letters1);

    for (let i = 0; i < p5letters1.length; i++) {
      p5Letter1 = p5letters1[i];
      p5Letter1.forEach((e) => {
        singleLetter1 = e;
        letterToNum1 = singleLetter1.charCodeAt(0) - 97;
        if (letterToNum1 >= 13) {
          letterToNum1 = Math.round(singleLetter1.charCodeAt(0) - 111);
        }
        if (letterToNum1 < 0) {
          letterToNum1 = Math.round((letterToNum1 * -1) / 3);
        }
        numberLetters1.push(letterToNum1);
      });
    }

    console.log(numberLetters1);

    let msgObj = {
      name: data.name,
      message: data.message,
    };

    let letterSounds = {
      letters: numberLetters1,
      animal: data.animal,
    };

    console.log(data.animal);
    user.emit("msgObj", msgObj);
    socket.broadcast.emit("letterSounds", letterSounds);
    // console.log(p5letters1);
    p5letters1 = [];
    numberLetters1 = [];
    // user.emit("letters", data.firstLetters);
  });

  //getting bat sound
  socket.on("animalSounds", (data) => {
    // let dataSound = data.sound;
    let dataURL = data.soundURL.url;
    console.log(dataURL);

    socket.broadcast.emit("dataSound", dataURL);
  });

  socket.on("animalSounds1", (data) => {
    // let dataSound = data.sound;
    let dataURL1 = data.soundURL.url;
    console.log(dataURL1);

    socket.broadcast.emit("dataSound", dataURL1);
  });

  socket.on("animalSounds2", (data) => {
    // let dataSound = data.sound;
    let dataURL2 = data.soundURL.url;
    console.log(dataURL2);

    socket.broadcast.emit("dataSound", dataURL2);
  });
});
