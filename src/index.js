import moment from "moment";
import Bullet from "./Bullet";
import { actionLogic, checkCollision, createPlayer, roundRect, sortArrayByDate, sortArray, removeDupes } from "./MainLogic";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let LogInOrSignUp = document.getElementById("LogInOrSignUp");
let usernameInput = document.getElementById("usernameInput");
let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let submitButton = document.getElementById("submitButton");
let signUpOrLogInButtonText = document.getElementById("signUpOrLogInButtonText");
let signUpOrLogInButton = document.getElementById("signUpOrLogInButton");
let gameContainer = document.getElementById("gameContainer");
let logInSignUpContainer = document.getElementById("logInSignUpContainer");
let modalBackdrop = document.getElementById("modalBackdrop");
let verificationModalContainer = document.getElementById("verificationModalContainer");
let closeVerificationModalBtn = document.getElementById("closeVerificationModalBtn");
let verificationCodeInput = document.getElementById("verificationCodeInput");
let submitVerificationCodeBtn = document.getElementById("submitVerificationCodeBtn");
let leaderboardBtn = document.getElementById("leaderboardBtn");
let leaderboardContainer = document.getElementById("leaderboardContainer");
let leaderboardTable = document.getElementById("leaderboardTableBody");
let pastWinnersBtn = document.getElementById("pastWinnersBtn");
let pastWinnersContainer = document.getElementById("pastWinnersContainer");
let pastWinnersTableBody = document.getElementById("pastWinnersTableBody");
let dateRowHeader = document.getElementById("dateRowHeaderBtn");
let scoreRowHeader = document.getElementById("scoreRowHeaderBtn");
let socket = io({ reconnection: false });
let PlayerList = [];
let LogIn = true;
let SignUp = false;
let loggedIn = false;
let byDate = false;
let byScore = true;
let username = usernameInput.value;
let email = emailInput.value;
let password = passwordInput.value;
let parsedTime;
let usernameAndScoreArray = [];
let filteredUsernameAndScoreArray1 = [];
let filteredUsernameAndScoreArray2 = [];
let pastWinnersArray = [];
let pastWinnersArrayFlattened = [];

let sendIp = function () {
  fetch("https://api.ipify.org?format=json")
    .then((results) => results.json())
    .then(function (data) {
      socket.emit("IP", {
        ip: data.ip,
        username: username,
      });
    });
};

function updateLogInInfo() {
  username = usernameInput.value;
  email = emailInput.value;
  password = passwordInput.value;
}

usernameInput.addEventListener("change", updateLogInInfo());
emailInput.addEventListener("change", updateLogInInfo());
passwordInput.addEventListener("change", updateLogInInfo());

submitButton.onclick = function () {
  if (LogIn && usernameInput.value != "" && passwordInput.value != "") {
    updateLogInInfo();
    socket.emit("Log in attempt", { username: username, password: password });
  } else if (SignUp && usernameInput.value != "" && passwordInput.value != "" && emailInput.value != "") {
    updateLogInInfo();
    socket.emit("Sign up attempt", { username: username, email: email, password: password });
  }
  if (LogIn) {
    if (usernameInput.value == "" || passwordInput.value == "") {
      window.alert("Please complete all the fields.");
    }
  } else if (SignUp) {
    if (usernameInput.value == "" || passwordInput.value == "" || emailInput.value == "") {
      window.alert("Please complete all the fields.");
    }
  }
};

signUpOrLogInButton.onclick = function () {
  if (LogIn) {
    LogIn = false;
    SignUp = true;
    emailInput.style.display = "block";
    LogInOrSignUp.innerText = "SIGN UP";
    signUpOrLogInButtonText.innerText = "Already have an account?";
    signUpOrLogInButton.innerText = "Log In";
  } else if (SignUp) {
    LogIn = true;
    SignUp = false;
    emailInput.style.display = "none";
    LogInOrSignUp.innerText = "LOG IN";
    signUpOrLogInButtonText.innerText = "Don't have an account?";
    signUpOrLogInButton.innerText = "Sign Up";
  }
};

closeVerificationModalBtn.onclick = function () {
  verificationModalContainer.style.display = "flex";
  modalBackdrop.style.display = "none";
};

submitVerificationCodeBtn.onclick = function () {
  if (verificationCodeInput.value != "") {
    socket.emit("Verification code", { code: verificationCodeInput.value, username: username });
  }
};

leaderboardBtn.onclick = function () {
  if (leaderboardContainer.style.display === "" || leaderboardContainer.style.display === "none") {
    leaderboardContainer.style.display = "block";
    leaderboardBtn.blur();
  } else if (leaderboardContainer.style.display === "block") {
    leaderboardContainer.style.display = "none";
    leaderboardBtn.blur();
  }
};

pastWinnersBtn.onclick = function () {
  if (pastWinnersContainer.style.display === "" || pastWinnersContainer.style.display === "none") {
    pastWinnersContainer.style.display = "block";
    pastWinnersBtn.blur();
  } else if (pastWinnersContainer.style.display === "block") {
    pastWinnersContainer.style.display = "none";
    pastWinnersBtn.blur();
  }
};

dateRowHeader.onclick = function () {
  byDate = true;
  byScore = false;
  pastWinnersLogic();
};

scoreRowHeader.onclick = function () {
  byDate = false;
  byScore = true;
  pastWinnersLogic();
};

socket.on("Player with this username already exists", function () {
  window.alert("A player with this username already exists!");
});

socket.on("Player with this email already exists", function () {
  window.alert("A player with this email already exists!");
});

socket.on("Sign up successful", function () {
  window.alert("Sign up successful! Please verify your account!");
  LogIn = true;
  SignUp = false;
  emailInput.style.display = "none";
  LogInOrSignUp.innerText = "LOG IN";
  signUpOrLogInButtonText.innerText = "Don't have an account?";
  signUpOrLogInButton.innerText = "Sign Up";
  modalBackdrop.style.display = "block";
  verificationModalContainer.style.display = "flex";
});

socket.on("You have been verified", function () {
  window.alert("Your verification was successful! Please Log in");
  modalBackdrop.style.display = "none";
  verificationModalContainer.style.display = "none";
  emailInput.style.display = "none";
  LogInOrSignUp.innerText = "LOG IN";
  signUpOrLogInButtonText.innerText = "Don't have an account?";
  signUpOrLogInButton.innerText = "Sign Up";
});

socket.on("Wrong verification code", function () {
  window.alert("Your verification code is incorrect! Please try again");
  verificationCodeInput.innerText = "";
  verificationCodeInput.focus();
});

socket.on("Wrong password", function () {
  window.alert("Wrong password! Please try again");
  passwordInput.value = "";
  passwordInput.focus();
});

socket.on("No player exists with that username", function () {
  window.alert("There is no user with that username! Try signing up");
  signUpOrLogInButton.focus();
});

socket.on("Account needs verification", function () {
  window.alert("Please verify your account!");
  modalBackdrop.style.display = "block";
  verificationModalContainer.style.display = "flex";
});

socket.on("Log in successful", function () {
  window.alert("Log in successful!");
  loggedIn = true;
  mainPlayer.loggedIn = true;
  gameContainer.style.display = "block";
  logInSignUpContainer.style.display = "none";
  mainPlayer.username = username;
  mainPlayer.email = email;
  sendIp();
});

socket.on("This player is already logged in", function () {
  window.alert("You are already logged in! Please close ALL other instances of the game");
});

function resizeCanvas() {
  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();
let newPlayer = createPlayer("main");
PlayerList.push(newPlayer);
socket.emit("I wish to exist", PlayerList[0]);
socket.emit("send past winners");
let mainPlayer = PlayerList[0];

let getLeaderboardValues = function () {
  socket.emit("can i have the leaderboard values");
};

socket.on("New connection", function (data) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = data.player.id;
  PlayerList.push(otherPlayer);
  socket.emit("me", { me: PlayerList[0], connector: data.connector });
});

socket.on("players updated info", function (playerData) {
  PlayerList.forEach((player) => {
    if (player.id == playerData.id) {
      player.x = playerData.x;
      player.y = playerData.y;
      player.health = playerData.health;
      player.sx = playerData.sx;
      player.sy = playerData.sy;
      player.score = playerData.score;
      player.ammoLeft = playerData.ammoLeft;
      player.reloading = playerData.reloading;
      player.timesReloaded = playerData.timesReloaded;
      player.needsToReload = playerData.needsToReload;
      player.username = playerData.username;
      player.email = playerData.email;
      player.loggedIn = playerData.loggedIn;
      player.lastDirection = playerData.lastDirection;
      while (
        player.bulletList.length <= playerData.bulletList &&
        playerData.ammoLeft > 0 &&
        playerData.reloading == false &&
        player.timesReloaded == playerData.timesReloaded &&
        playerData.needsToReload == false
      ) {
        player.bulletList.push(
          new Bullet({
            shooter: player.id,
          })
        );
      }
    }
  });
});

socket.on("bullets updated info", function (bulletInfo) {
  for (let i in PlayerList) {
    let player = PlayerList[i];
    if (player.id == bulletInfo.bulletShooter && player.bulletList.length > 0 && player.ammoLeft > 0) {
      player.bulletList[player.bulletList.length - 1].setValues(
        bulletInfo.bulletX,
        bulletInfo.bulletY,
        bulletInfo.bulletSubstitute,
        bulletInfo.id,
        bulletInfo.direction
      );
    }
  }
});

let sendPlayerInfo = function () {
  socket.emit("updated player info", {
    id: mainPlayer.id,
    x: mainPlayer.x,
    y: mainPlayer.y,
    health: mainPlayer.health,
    sx: mainPlayer.sx,
    sy: mainPlayer.sy,
    score: mainPlayer.score,
    ammoLeft: mainPlayer.ammoLeft,
    reloading: mainPlayer.reloading,
    timesReloaded: mainPlayer.timesReloaded,
    needsToReload: mainPlayer.needsToReload,
    bulletList: mainPlayer.bulletList.length,
    username: mainPlayer.username,
    email: mainPlayer.email,
    loggedIn: mainPlayer.loggedIn,
    lastDirection: mainPlayer.lastDirection,
  });
};

let sendBulletInfo = function () {
  if (mainPlayer.bulletList.length > 0) {
    socket.emit("updated bullet info", {
      bulletX: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].x,
      bulletY: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].y,
      bulletShooter: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].shooter,
      bulletSubstitute: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].substitute,
      id: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].id,
      direction: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].direction,
      timesReloaded: mainPlayer.timesReloaded,
    });
  }
};

socket.on("you already have them", function () {
  leaderboardLogic();
});

socket.on("updated player health", function (health, id) {
  PlayerList.forEach((player) => {
    if (player.id == id) {
      player.health = health;
    }
  });
});

socket.on("updated player score", function (username, score) {
  PlayerList.forEach((player) => {
    if (player.username == username) {
      player.score = score;
    }
  });
});

let pvpChecker = function () {
  socket.emit("player health", mainPlayer.health, mainPlayer.username, mainPlayer.id);
  for (let i in PlayerList) {
    if (PlayerList[i].bulletList.length > 0) {
      for (let u in PlayerList[i].bulletList) {
        if (checkCollision(PlayerList[i].bulletList[u], mainPlayer)) {
          if (PlayerList[i].id !== mainPlayer.id) {
            mainPlayer.health -= 1;
            if (mainPlayer.health <= 0) {
              socket.emit("score went up", PlayerList[i].score, PlayerList[i].username);
              mainPlayer.respawn();
            }
            PlayerList[i].bulletList[u].erase();
            PlayerList[i].bulletList.splice(u, 1);
            socket.emit("Player health", {
              id: mainPlayer.id,
              username: mainPlayer.username,
              health: mainPlayer.health,
            });
          }
        }
      }
    }
    for (let n in mainPlayer.bulletList) {
      let arr = mainPlayer.bulletList[n];
      if (checkCollision(arr, PlayerList[i])) {
        if (PlayerList[i].id !== mainPlayer.id) {
          arr.erase();
          mainPlayer.bulletList.splice(n, 1);
        }
      }
    }
  }
};

socket.on("other player", function (them) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = them.id;
  PlayerList.push(otherPlayer);
  PlayerList.forEach((player) => {
    if (player.id == them.id) {
      player.x = them.x;
      player.y = them.y;
      player.sx = them.sx;
      player.sy = them.sy;
    }
  });
});

socket.on("Match starting", function () {
  if (loggedIn) {
    window.alert("Match starting");
  }
});

socket.on("current time", function (time) {
  if (time.seconds < 10) {
    time.seconds = `0${time.seconds}`;
  }
  parsedTime = `Match ending in: ${time.minutes}:${time.seconds}`;
});

socket.on("current time2", function (time) {
  if (time.seconds < 10) {
    time.seconds = `0${time.seconds}`;
  }
  parsedTime = `Match starts in: ${time.minutes}:${time.seconds}`;
});

socket.on("Match finished", function () {
  if (loggedIn) {
    window.alert("Match finished");
  }
});

let addToLeaderboard = function (place, username, score) {
  let row = document.createElement("tr");
  let placedata = document.createElement("td");
  let placeText = document.createTextNode(place);
  let usernamedata = document.createElement("td");
  let usernameText = document.createTextNode(username);
  let scoredata = document.createElement("td");
  let scoreText = document.createTextNode(score);
  placedata.appendChild(placeText);
  usernamedata.appendChild(usernameText);
  scoredata.appendChild(scoreText);
  row.appendChild(placedata);
  row.appendChild(usernamedata);
  row.appendChild(scoredata);
  leaderboardTable.appendChild(row);
};

let addToPastWinners = function (date, username, score) {
  let row = document.createElement("tr");
  let datedata = document.createElement("td");
  let dateText = document.createTextNode(date);
  let usernamedata = document.createElement("td");
  let usernameText = document.createTextNode(username);
  let scoredata = document.createElement("td");
  let scoreText = document.createTextNode(score);
  datedata.appendChild(dateText);
  usernamedata.appendChild(usernameText);
  scoredata.appendChild(scoreText);
  row.appendChild(datedata);
  row.appendChild(usernamedata);
  row.appendChild(scoredata);
  pastWinnersTableBody.appendChild(row);
};

socket.on("leaderboard scores", function (scores) {
  removeDupes(scores);
  sortArray(scores);
  if (mainPlayer.username == scores[0]?.username && loggedIn == true && scores[0]) {
    window.alert("You won!!");
  } else if (mainPlayer.username !== scores[0]?.username && loggedIn == true && scores[0]) {
    window.alert(`You Lost! :( \nthe winner of this match was: ${scores[0]?.username}`);
  } else if (loggedIn == true) {
    window.alert("No one won!? Try harder!!!!");
  }
});

socket.on("someone disconnected", function (disconnector) {
  PlayerList.forEach((player) => {
    leaderboardTable.childNodes.forEach((row) => {
      if (player.id == disconnector) {
        if (row.childNodes[1].innerText == player.username) {
          player.loggedIn = false;
          row.remove();
        }
        PlayerList.splice(PlayerList.indexOf(player.id));
      }
    });
  });
});

socket.on("Past winners", function (winners) {
  pastWinnersArray.push(winners);
  pastWinnersLogic();
});

let pastWinnersLogic = function () {
  pastWinnersTableBody.innerHTML = "";
  pastWinnersArrayFlattened = pastWinnersArray.flat();
  if (byScore) {
    sortArray(pastWinnersArrayFlattened);
  } else if (byDate) {
    sortArrayByDate(pastWinnersArrayFlattened);
  }
  for (let i in pastWinnersArrayFlattened) {
    let arr = pastWinnersArrayFlattened[i];
    let today = moment(arr.date).format("L LT");
    addToPastWinners(today, arr.username, arr.score);
  }
};

let leaderboardLogic = async function () {
  usernameAndScoreArray = PlayerList;
  await sortArray(usernameAndScoreArray);
  for (let i = 0; i <= PlayerList.length - 1; i++) {
    let arr = usernameAndScoreArray[i];
    if (arr) {
      if (arr.loggedIn) {
        if (!leaderboardTable.childNodes[i] && arr.loggedIn) {
          if (leaderboardTable.childNodes[i - 1]?.childNodes[1].username !== arr.username) {
            addToLeaderboard((parseInt(i) + 1).toString(), arr.username, arr.score);
          }
        }
        if (leaderboardTable.childNodes[i] && arr.loggedIn) {
          leaderboardTable.childNodes[i].childNodes[0].innerText = i + 1;
          if (leaderboardTable.childNodes[i].childNodes[1].innerText !== arr.username) {
            leaderboardTable.childNodes[i].childNodes[1].innerText = arr.username;
          }
          leaderboardTable.childNodes[i].childNodes[2].innerText = arr.score;
        }
      }
      if (!arr.loggedIn) {
        leaderboardTable.childNodes[i]?.remove();
      }
    }
  }
};

let drawTime = function () {
  roundRect(ctx, 0, 0, 400, 45, { tl: 0, tr: 0, br: 10, bl: 0 }, true, true, "rgba(35, 172, 251, 0.8)", "black");
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.font = "30px Courier";
  ctx.fillText(parsedTime, 10, 30);
};

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTime();
  getLeaderboardValues();
  actionLogic(mainPlayer);
  PlayerList.forEach((player) => {
    player.draw();
  });
};

let Game_loop = function () {
  drawingLoop();
  sendPlayerInfo();
  sendBulletInfo();
  pvpChecker();
};

setInterval(() => {
  if (loggedIn) {
    Game_loop();
  }
}, 1000 / 60);
