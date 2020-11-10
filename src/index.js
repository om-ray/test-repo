import moment from "moment";
import Bullet from "./Bullet";
import { actionLogic, checkCollision, createPlayer, roundRect } from "./MainLogic";
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
let EnemyList = [];
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
let filteredUsernameAndScoreArray = [];
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
  } else if (leaderboardContainer.style.display === "block") {
    leaderboardContainer.style.display = "none";
  }
};

pastWinnersBtn.onclick = function () {
  if (pastWinnersContainer.style.display === "" || pastWinnersContainer.style.display === "none") {
    pastWinnersContainer.style.display = "block";
  } else if (pastWinnersContainer.style.display === "block") {
    pastWinnersContainer.style.display = "none";
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

socket.on("New connection", function (data) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = data.player.id;
  EnemyList.push(otherPlayer);
  socket.emit("me", { me: PlayerList[0], connector: data.connector });
});

socket.on("players updated info", function (playerData) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == playerData.id) {
      enemy.x = playerData.x;
      enemy.y = playerData.y;
      enemy.health = playerData.health;
      enemy.sx = playerData.sx;
      enemy.sy = playerData.sy;
      enemy.score = playerData.score;
      enemy.username = playerData.username;
      enemy.email = playerData.email;
      enemy.loggedIn = playerData.loggedIn;
      usernameAndScoreArray.push({ username: enemy.username, score: enemy.score });
    }
  });
});

socket.on("bullets updated info", function (bulletInfo) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == bulletInfo.id) {
      while (enemy.bulletList.length <= bulletInfo.bulletList) {
        let bullet = new Bullet({
          x: bulletInfo.bulletX,
          y: bulletInfo.bulletY,
          width: bulletInfo.bulletWidth,
          height: bulletInfo.bulletHeight,
          direction: bulletInfo.bulletDirection,
          shooter: bulletInfo.bulletShooter,
          substitute: true,
        });
        enemy.bulletList.push(bullet);
      }
    }
  });
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
    bulletList: mainPlayer.bulletList.length,
    username: mainPlayer.username,
    email: mainPlayer.email,
    loggedIn: mainPlayer.loggedIn,
  });
  usernameAndScoreArray.push({ username: mainPlayer.username, score: mainPlayer.score });
};

let sendBulletInfo = function () {
  socket.emit("updated bullet info", {
    id: mainPlayer.id,
    bulletList: mainPlayer.bulletList.length,
    bulletX: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].x,
    bulletY: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].y,
    bulletWidth: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].width,
    bulletHeight: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].height,
    bulletDirection: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].direction,
    bulletShooter: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].shooter,
    bulletSubstitue: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].substitute,
  });
};

socket.on("updated player health", function (health, id) {
  PlayerList.forEach((player) => {
    if (player.id == id) {
      player.health = health;
    }
  });
});

socket.on("updated player score", function (score, id) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == id) {
      enemy.score = score;
    }
  });
});

let pvpChecker = function () {
  for (let i in EnemyList) {
    let enemy = EnemyList[i];
    for (let u in PlayerList[0].bulletList) {
      let currentBullet = PlayerList[0].bulletList[u];
      if (checkCollision(currentBullet, enemy)) {
        if (enemy.id != mainPlayer.id && currentBullet.shooter == mainPlayer.id && enemy.loggedIn == true) {
          enemy.health -= 1;
          socket.emit("player health", enemy.health, enemy.username, enemy.id);
          if (enemy.health == 0) {
            setTimeout(() => {
              mainPlayer.score += 1;
              enemy.respawn();
              socket.emit("player score", mainPlayer.score, mainPlayer.username, mainPlayer.id);
            }, 5);
          }
          PlayerList[0].bulletList.splice(u, 1);
        }
      }
    }
    for (let u in enemy.bulletList) {
      let currentBullet = enemy.bulletList[u];
      if (checkCollision(currentBullet, enemy)) {
        if (currentBullet.shooter == enemy.id) {
          enemy.bulletList.splice(u, 1);
        }
      }
    }
  }
};

socket.on("other player", function (them) {
  let otherPlayer = createPlayer("other");
  otherPlayer.id = them.id;
  EnemyList.push(otherPlayer);
  EnemyList.forEach((enemy) => {
    if (enemy.id == them.id) {
      enemy.x = them.x;
      enemy.y = them.y;
      enemy.sx = them.sx;
      enemy.sy = them.sy;
      usernameAndScoreArray.push({ username: enemy.username, score: enemy.score });
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

let removeDupes = function (arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
};

let sortArray = function (scoreArray) {
  scoreArray.sort((a, b) => b.score - a.score);
};

let sortArrayByDate = function (arr) {
  arr.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};

let addToLeaderboard = function (i, username, score) {
  usernameAndScoreArray = removeDupes(usernameAndScoreArray);
  let place = (parseInt(i) + 1).toString();
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
  leaderboardTable.innerHTML = "";
  if (mainPlayer.username == scores[0]?.username) {
    window.alert("You won!!");
  } else {
    window.alert("You Lost! :(");
  }
  for (let i in scores) {
    usernameAndScoreArray.push({ username: scores[i].username, score: scores[i].score });
  }
});

socket.on("someone disconnected", function (disconnector) {
  EnemyList.forEach((enemy) => {
    if (enemy.id == disconnector) {
      EnemyList.splice(EnemyList.indexOf(enemy.id));
    }
  });
});

socket.on("Past winners", function (winners) {
  pastWinnersArray.push(winners);
  pastWinnersLogic();
});

socket.on("Past winners clear", function (winners) {
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

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  leaderboardTable.innerHTML = "";
  filteredUsernameAndScoreArray = removeDupes(usernameAndScoreArray);
  roundRect(ctx, 0, 0, 400, 45, { tl: 0, tr: 0, br: 10, bl: 0 }, true, true, "rgba(35, 172, 251, 0.8)", "black");
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.font = "30px Courier";
  ctx.fillText(parsedTime, 10, 30);
  actionLogic(mainPlayer);
  sortArray(filteredUsernameAndScoreArray);
  for (let i in filteredUsernameAndScoreArray) {
    let arr = filteredUsernameAndScoreArray[i];
    addToLeaderboard(i, arr.username, arr.score);
  }
  usernameAndScoreArray = [];
  filteredUsernameAndScoreArray = [];
  PlayerList.forEach((player) => {
    player.draw();
  });
  EnemyList.forEach((enemy) => {
    enemy.draw();
  });
};

let Game_loop = function () {
  drawingLoop();
  sendPlayerInfo();
  if (mainPlayer.bulletList.length > 0) {
    sendBulletInfo();
    pvpChecker();
  }
  EnemyList.forEach((enemy) => {
    if (enemy.bulletList.length > 0) {
      pvpChecker();
    }
  });
};

setInterval(() => {
  if (loggedIn) {
    Game_loop();
  }
}, 10);
