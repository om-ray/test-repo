let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io")(server);
let mongoose = require("mongoose");
let PlayerModel = require("./Server/Schemas/PlayerModel");
let ProgressModel = require("./Server/Schemas/ProgressSchema");
let nodemailer = require("nodemailer");
let fetch = require("node-fetch");
let MONGODB_URI = "mongodb+srv://123om123:crbBhQirzfyonefb@cluster0.c3yq9.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/dist", express.static(__dirname + "/dist"));
app.use("/admin", express.static(__dirname + "/src/Admin.html"));
app.use("/admin.js", express.static(__dirname + "/src/admin.js"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/style.css", express.static(__dirname + "/style.css"));
app.use("/adminStyle.css", express.static(__dirname + "/adminStyle.css"));

server.listen(3000);
PlayerModel.updateMany({ LoggedIn: true }, { $set: { LoggedIn: false } }).then((res) => {
  if (res) {
    console.log("all players logged out");
  }
  if (!res) {
    console.log("Could not update");
  }
});
console.log("Server listening on port 3000");

let socketList = [];
let playerList = [];

let Player = function () {
  this.id = Math.floor(10000 + Math.random() * 90000);
  this.hp = 100;
  this.maxHp = 100;
  this.speed = 0.07;
  this.maxSpeed = 0.09;
  this.bulletList = [];
  this.ammoList = [];
  this.movement = {
    forward: false,
    left: false,
    backwards: false,
    right: false,
  };

  this.attack = {
    shoot: false,
  };

  this.shoot = function () {
    socket.emit("shoot");
  };
};

let sendVerificationCode = function (email, code, username) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "omihridesh",
      pass: "aq123edsMI.changed",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: "War",
    to: email,
    subject: "Here is your Verification Code for War",
    html: `<p>Your verification for the username "${username.toString()}" code is:</p><span style="font-size: 30px; font-weight:bold;">${code.toString()}</span>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    res.render("contact", { msg: "Email has been sent" });
  });
};

let scoreArray = [];
let timeArray = [];
let current_minutes;
let current_minutes2;
let current_seconds;
let current_seconds2;
let matchIsStarting = false;
let matchIsEnding = false;
let betweenMatches = false;
let duration = 300;
let rest = 60;

let countdown = function (seconds) {
  seconds = seconds;

  function tick() {
    seconds--;
    current_minutes = parseInt(seconds / 60);
    current_seconds = seconds % 60;

    if (seconds > 0) {
      setTimeout(tick, 1000);
    } else if (seconds <= 0) {
      matchIsEnding = true;
      between(rest);
    }
  }
  tick();
};

let between = function (seconds2) {
  seconds2 = seconds2;

  function tick2() {
    seconds2--;
    current_minutes2 = parseInt(seconds2 / 60);
    current_seconds2 = seconds2 % 60;
    if (seconds2 > 0) {
      matchIsStarting = false;
      betweenMatches = true;
      setTimeout(tick2, 1000);
    } else if (seconds2 <= 0) {
      betweenMatches = false;
      reset();
      matchIsStarting = true;
      setTimeout(function () {
        matchIsStarting = false;
      }, 10);
    }
  }
  tick2();
};

let reset = function () {
  countdown(duration);
};

countdown(duration);

let removeDupes = function (scoreArray) {
  for (let i = scoreArray.length - 1; i > 0; i--) {
    if (scoreArray.length > 1) {
      if (scoreArray[i - 1]) {
        if (scoreArray[i].username === scoreArray[i - 1].username) {
          if (scoreArray[i].score <= scoreArray[i - 1].score) {
            scoreArray.splice(i, 1);
          } else if (scoreArray[i].score >= scoreArray[i - 1].score) {
            scoreArray.splice(i - 1, 1);
          }
        }
      }
    }
  }
};

let sortArray = function (scoreArray) {
  scoreArray.sort((a, b) => b.score - a.score);
};

io.on("connection", function (socket) {
  console.log(socket.id + " joined the server on " + new Date().toLocaleString());

  socket.on("Sign up attempt", async function (signUpInfo) {
    let playerData = {
      ID: Math.floor(Math.random() * 1000000),
      LoggedIn: false,
      Username: signUpInfo.username,
      Email: signUpInfo.email,
      Password: signUpInfo.password,
      Code: Math.floor(Math.random() * 1000000),
      Verified: false,
      IP: null,
      Geolocation: {},
      Health: 100,
      Score: 0,
      Wins: 0,
      Losses: 0,
      Ties: 0,
      Bullets: 0,
    };

    let progressData = {
      Username: signUpInfo.username,
      Email: signUpInfo.email,
      DatesWon: [],
    };

    await PlayerModel.findOne({ Username: signUpInfo.username }, async (err, res) => {
      if (res) {
        console.log("SIGN UP FAILED: Player with this username already exists");
        socket.emit("Player with this username already exists");
      }
      if (!res) {
        await PlayerModel.findOne({ Username: signUpInfo.username, Email: signUpInfo.email }, (err, res) => {
          if (res) {
            console.log("SIGN UP FAILED: Player with this email already exists");
            socket.emit("Player with this email already exists");
          }
          if (!res) {
            let newPlayerModel = new PlayerModel(playerData);
            let newProgressModel = new ProgressModel(progressData);
            newPlayerModel.save((err) => {
              if (err) {
                console.error(err);
              } else {
                socket.emit("Sign up successful");
                sendVerificationCode(playerData.Email, playerData.Code, playerData.Username);
                for (let i in playerList) {
                  if (playerList[i].id == socket.id) {
                    playerList[i].username = playerData.Username;
                  }
                }
              }
            });
            newProgressModel.save((err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("progress for this account has been created");
              }
            });
          }
          if (err) {
            console.error(err);
          }
        });
      }
      if (err) {
        console.error(err);
      }
    });
  });

  socket.on("Log in attempt", async function (logInInfo) {
    await PlayerModel.findOne({ Username: logInInfo.username }, async (err, res) => {
      if (res) {
        if (res.checkPassword(logInInfo.password)) {
          if (res.checkVerification()) {
            if (!res.checkLoggedIn()) {
              socket.emit("Log in successful");
              for (let i in playerList) {
                if (playerList[i].id == socket.id) {
                  playerList[i].username = logInInfo.username;
                }
              }
              await PlayerModel.updateOne(
                { Username: logInInfo.username, Password: logInInfo.password, LoggedIn: false, Verified: true },
                { $set: { LoggedIn: true } },
                { upsert: false }
              ).then((res) => {
                if (res) {
                }
              });
            } else if (res.checkLoggedIn()) {
              socket.emit("This player is already logged in");
            }
          } else if (!res.checkVerification()) {
            socket.emit("Account needs verification");
          }
        } else if (!res.checkPassword(logInInfo.password)) {
          socket.emit("Wrong password");
        }
      }
      if (!res) {
        socket.emit("No player exists with that username");
      }
      if (err) {
        console.error(err);
      }
    });
  });

  socket.on("Verification code", async function (data) {
    await PlayerModel.findOne({ Code: data.code, Username: data.username, Verified: false }, async (err, res) => {
      if (res) {
        await PlayerModel.updateOne({ Username: data.username }, { $set: { Verified: true } }, { upsert: false }).then((res) => {
          if (res) {
            console.log(res);
          }
        });
        socket.emit("You have been verified");
      }
      if (!res) {
        socket.emit("Wrong verification code");
      }
      if (err) {
        console.error(err);
      }
    });
  });

  socket.on("I wish to exist", function (player) {
    let newPlayer = new Player();

    playerList.push({
      player: newPlayer,
      id: socket.id,
      username: null,
      score: 0,
    });
    socketList.push({
      socketId: socket.id,
      id: player.id,
    });
    socket.broadcast.emit("New connection", { player: player, connector: socket.id });
  });

  socket.on("updated player info", function (playerInfo) {
    socket.broadcast.emit("players updated info", playerInfo);
    PlayerModel.updateOne(
      { Username: playerInfo.username },
      { $set: { Health: playerInfo.health, Score: playerInfo.score, Bullets: playerInfo.bulletList } },
      { upsert: false }
    ).then((res) => {});
  });

  socket.on("updated bullet info", function (bulletInfo) {
    socket.broadcast.emit("bullets updated info", bulletInfo);
  });

  socket.on("me", function (data) {
    io.to(data.connector).emit("other player", data.me);
  });

  socket.on("player health", function (health, username, id) {
    socket.broadcast.emit("updated player health", health, id);
    PlayerModel.updateOne({ Username: username }, { $set: { Health: health } }, { upsert: false }).then((res) => {});
  });

  socket.on("Player health", function (data) {
    socket.broadcast.emit("updated player health", data.health, data.id);
    PlayerModel.updateOne({ Username: data.username }, { $set: { Health: data.health } }, { upsert: false }).then((res) => {});
  });

  socket.on("score went up", function (score, username) {
    socket.broadcast.emit("updated player score", username, score + 1);
    scoreArray.push({ username: username, score: score + 1 });
    removeDupes(scoreArray);
    sortArray(scoreArray);
    PlayerModel.updateOne({ Username: username }, { $set: { Score: score + 1 } }, { upsert: false }).then((res) => {});
  });

  socket.on("IP", function (data) {
    fetch(
      `http://ip-api.com/json/${data.ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
    )
      .then((results) => results.json())
      .then(function (res) {
        PlayerModel.updateOne({ Username: data.username }, { $set: { IP: data.ip, Geolocation: res } }).then((res) => {
          if (res) {
          }
        });
      });
  });

  socket.on("can i have the leaderboard values", function () {
    socket.emit("you already have them");
  });

  socket.on("send past winners", function () {
    ProgressModel.find({}, (err, res) => {
      if (res) {
        for (let i in res) {
          let arr = res[i];
          if (arr.DatesWon.length > 0) {
            socket.emit("Past winners", arr.DatesWon);
          }
        }
      }
    });
  });

  socket.on("gimme all the data", function () {
    PlayerModel.find({}, (err, res) => {
      if (res) {
        socket.emit("Here is the data", res);
      }
      if (!res) {
        console.log("What data?");
      }
      if (err) {
        console.error(err);
      }
    });
  });

  socket.on("disconnect", function () {
    console.log(socket.id + " left the server on " + new Date().toLocaleString());
    for (let i in playerList) {
      if (playerList[i].id == socket.id) {
        let player = playerList[i];
        PlayerModel.updateOne({ Username: player.username }, { $set: { LoggedIn: false } }).then((res) => {
          if (res) {
            console.log(`logged ${player.username} out`);
          }
          if (!res) {
            console.log("could not log player out");
          }
        });
        playerList.splice(i, 1);
      }
    }

    for (let i in socketList) {
      if (socketList[i].socketId == socket.id) {
        let id = socketList[i].id;
        socket.broadcast.emit("someone disconnected", id);
        socketList.splice(i, 1);
      }
    }
  });
});

setInterval(() => {
  if (matchIsStarting == true) {
    io.emit("Match starting");
  }
  if (betweenMatches == false) {
    io.emit("current time", {
      minutes: current_minutes,
      seconds: current_seconds,
    });
  }
  if (betweenMatches == true) {
    io.emit("current time2", {
      minutes: current_minutes2,
      seconds: current_seconds2,
    });
  }
  if (matchIsEnding == true) {
    io.emit("Match finished");
    io.emit("leaderboard scores", scoreArray);
    matchIsEnding = false;
    betweenMatches = true;
    for (let i in scoreArray) {
      let arr = scoreArray[i];
      if (i != 0) {
        PlayerModel.updateMany({ Verified: true, LoggedIn: true, Username: arr.username }, { $inc: { Losses: 1 } }).then((res) => {});
      }
    }
    PlayerModel.updateMany({ Verified: true, LoggedIn: true }, { $set: { Score: 0, HP: 100 } }).then((res) => {});
    if (scoreArray[0]) {
      PlayerModel.updateOne({ Verified: true, LoggedIn: true, Username: scoreArray[0].username }, { $inc: { Wins: 1 } }).then((res) => {});
      timeArray.push({ username: scoreArray[0].username, score: scoreArray[0].score, date: new Date() });
      for (let i in timeArray) {
        let arr = timeArray[i];
        ProgressModel.findOne({ Username: arr.username }, (err, res) => {
          if (res) {
            res.DatesWon.push(arr);
            ProgressModel.updateOne({ Username: arr.username }, { $set: { DatesWon: res.DatesWon } }).then((res) => {});
          }
          if (!res) {
            console.log("no progress document exists with this username");
          }
          if (err) {
            console.error(err);
          }
        });
      }
    }
  }
}, 10);
