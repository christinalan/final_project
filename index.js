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

  socket.on("freqData", (data) => {
    // console.log(data.freq);

    user.emit("freqData", data);
  });
});

let names = [];
let sounds = [];
let numbers = [];

//listening for users to connect
user.on("connection", (socket) => {
  console.log("mod socket connected : " + socket.id);

  //getting bat sound
  socket.on("animalSounds", (data) => {
    let dataSound = data.sound;
    let dataURL = data.soundURL.url;
    console.log(data.sound);

    console.log(dataSound);
    user.emit("dataSound", dataURL);
  });
});
