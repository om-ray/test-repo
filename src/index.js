import moment from "moment";
import Bullet from "./Bullet";
import Viewport from "./Viewport";
import { actionLogic, checkCollision, createPlayer, roundRect, sortArrayByDate, sortArray, removeDupes } from "./MainLogic";
let canvas = document.getElementById("canvas");
let timeCanvas = document.getElementById("timeCanvas");
let ctx = canvas.getContext("2d");
let timeCtx = timeCanvas.getContext("2d");
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
let loader = document.getElementById("loader");
let submitText = document.getElementById("submitText");
let respawnBtn = document.getElementById("respawnBtn");
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
let devW = window.innerWidth;
let devH = window.innerHeight;
let resW = 1920;
let resH = 1080;
console.log(document.documentElement.clientWidth, document.documentElement.clientHeight);
let firstTime = true;
let prevMapCoords = { x: 0, y: 0 };
let usernameAndScoreArray = [];
let allowPvp = true;
let submitting = false;
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
    submitting = true;
    if (submitting == true) {
      loader.style.display = "block";
      submitText.style.display = "none";
    }
    socket.emit("Log in attempt", { username: username, password: password });
  } else if (SignUp && usernameInput.value != "" && passwordInput.value != "" && emailInput.value != "") {
    updateLogInInfo();
    submitting = true;
    if (submitting == true) {
      loader.style.display = "block";
      submitText.style.display = "none";
    }
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
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("A player with this username already exists!");
});

socket.on("Player with this email already exists", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("A player with this email already exists!");
});

socket.on("Sign up successful", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
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
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("Your verification was successful! Please Log in");
  modalBackdrop.style.display = "none";
  verificationModalContainer.style.display = "none";
  emailInput.style.display = "none";
  LogInOrSignUp.innerText = "LOG IN";
  signUpOrLogInButtonText.innerText = "Don't have an account?";
  signUpOrLogInButton.innerText = "Sign Up";
});

socket.on("Wrong verification code", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("Your verification code is incorrect! Please try again");
  verificationCodeInput.innerText = "";
  verificationCodeInput.focus();
});

socket.on("Wrong password", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("Wrong password! Please try again");
  passwordInput.value = "";
  passwordInput.focus();
});

socket.on("No player exists with that username", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("There is no user with that username! Try signing up");
  signUpOrLogInButton.focus();
});

socket.on("Account needs verification", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("Please verify your account!");
  modalBackdrop.style.display = "block";
  verificationModalContainer.style.display = "flex";
});

socket.on("Log in successful", function () {
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
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
  submitting = false;
  if (submitting == false) {
    loader.style.display = "none";
    submitText.style.display = "block";
  }
  window.alert("You are already logged in! Please close ALL other instances of the game");
});

function resizeCanvas() {
  let f = Math.max(window.innerWidth / resW, window.innerHeight / resH);
  canvas.width = Math.floor(devW / f);
  canvas.height = Math.floor(devH / f);
  canvas.style.width = "100%";
  // canvas.style.height = "100%";
  canvas.width = resW;
  canvas.height = resH;
  timeCanvas.width = Math.floor(devW / f);
  timeCanvas.height = Math.floor(devH / f);
  timeCanvas.style.width = "100%";
  // timeCanvas.style.height = "100%";
  timeCanvas.width = resW;
  timeCanvas.height = resH;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();
socket.emit("send past winners");
let newPlayer = createPlayer("main");
PlayerList.push(newPlayer);
socket.emit("I wish to exist", PlayerList[0]);
let mainPlayer = PlayerList[0];

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    mainPlayer.afk = false;
  } else {
    mainPlayer.afk = true;
  }
});

respawnBtn.onclick = function () {
  mainPlayer.respawn();
};

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
      player.prevX = playerData.prevX;
      player.prevY = playerData.prevY;
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
      player.afk = playerData.afk;
      player.lastDirection = playerData.lastDirection;
      while (
        player.bulletList.length <= playerData.bulletList &&
        // playerData.ammoLeft > 0 &&
        // playerData.reloading == false &&
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
    prevX: mainPlayer.prevX,
    prevY: mainPlayer.prevY,
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
    afk: mainPlayer.afk,
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
        if (checkCollision(PlayerList[i].bulletList[u], mainPlayer) && allowPvp) {
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
    // socket.emit("send past winners");
    mainPlayer.score = 0;
    mainPlayer.health = 100;
    mainPlayer.bulletList = [];
    mainPlayer.ammoleft = 500;
    PlayerList.forEach((player) => {
      player.score = 0;
      player.health = 100;
      player.bulletList = [];
      player.ammoleft = 500;
    });
    sendPlayerInfo();
    allowPvp = true;
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
    // socket.emit("send past winners");
    mainPlayer.score = 0;
    mainPlayer.health = 100;
    mainPlayer.bulletList = [];
    mainPlayer.ammoleft = 500;
    PlayerList.forEach((player) => {
      player.score = 0;
      player.health = 100;
      player.bulletList = [];
      player.ammoleft = 500;
    });
    sendPlayerInfo();
    allowPvp = false;
  }
});

let tileset = new Image();
let viewport = new Viewport(0, 0, canvas.width, canvas.height);
tileset.src = "../images/tileset-pokemon_dawn.png";
let mapJson;
let startX = 0;
let startY = 0;
let clippingWidth;
let clippingHeight;
let placeX = 0;
let placeY = 0;
let tileScale = 5;
let mapWidth = mapJson?.layers[0]?.width;
let mapHeight = mapJson?.layers[0]?.height;
let tileSize = 16 * tileScale;
let canvasWidthInTiles = Math.floor(canvas.width / tileSize);
let canvasHeightInTiles = Math.floor(canvas.height / tileSize);
let totalNumberOfNecessaryTiles = Math.floor(canvasHeightInTiles * canvasWidthInTiles) * mapWidth;
let mainPlayerIndexX = Math.floor((mainPlayer.x + mainPlayer.width / 2) / tileSize);
let mainPlayerIndexY = Math.floor((mainPlayer.y + mainPlayer.height) / tileSize);
let mainPlayerIndex = mainPlayerIndexX + mainPlayerIndexY * mapWidth;
let leftMostIndex = Math.floor((viewport.x / tileSize) * (viewport.y / tileSize));
let waterTiles = [2742, 2838, 2650, 2651, 2744, 2745, 2647, 2648, 2649, 2741, 2742, 2743, 2835, 2836, 2837];
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    mapJson = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "/warmap", true);
xmlhttp.send();

let in_viewport = function (x, y) {
  if (x >= viewport.x - tileSize && x <= viewport.x + viewport.w && y >= viewport.y - tileSize && y <= viewport.y + viewport.h) {
    return true;
  } else {
    return false;
  }
};

let updateMap = function () {
  for (let i = 0; i < mapJson.layers.length; i++) {
    for (let u = totalNumberOfNecessaryTiles; u >= leftMostIndex; u--) {
      let dataValues = mapJson.layers[i].data[u] - 1;
      startX = Math.ceil(((dataValues % 94) * 16) / 16) * 16;
      startY = Math.ceil((Math.floor(dataValues / 94) * 16) / 16) * 16;
      clippingWidth = 16;
      clippingHeight = 16;
      placeX = (u % mapWidth) * 16 * tileScale;
      placeY = Math.floor(u / mapHeight) * 16 * tileScale;

      if (in_viewport(placeX, placeY)) {
        // console.log(startX, startY);
        ctx.drawImage(tileset, startX, startY, clippingWidth, clippingHeight, Math.floor(placeX), Math.floor(placeY), tileSize, tileSize);
        // }
        // ctx.fillText(u, placeX, placeY + 8 * tileScale);
        // ctx.strokeStyle = "black";
        // ctx.strokeRect(
        //   (mainPlayerIndex % mapWidth * 16 * tileScale,
        //   Math.floor(mainPlayerIndex / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(
        //   ((mainPlayerIndex + 1) % mapWidth * 16 * tileScale,
        //   Math.floor((mainPlayerIndex + 1) / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
        // ctx.strokeRect(
        //   ((mainPlayerIndex - mapWidth + 1) % mapWidth * 16 * tileScale,
        //   Math.floor((mainPlayerIndex - mapWidth + 1) / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
        // ctx.strokeRect(
        //   ((mainPlayerIndex - mapWidth) % mapWidth * 16 * tileScale,
        //   Math.floor((mainPlayerIndex - mapWidth) / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
        // ctx.strokeRect(
        //   ((mainPlayerIndex - 1) % mapWidth * 16 * tileScale,
        //   Math.floor((mainPlayerIndex - 1) / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
        // ctx.strokeRect(
        //   ((mainPlayerIndex - mapWidth - 1) % mapWidth * 16 * tileScale,
        //   Math.floor((mainPlayerIndex - mapWidth - 1) / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
        // ctx.strokeRect(
        //   ((mainPlayerIndex + mapWidth) % mapWidth * 16 * tileScale,
        //   Math.floor((mainPlayerIndex + mapWidth) / mapHeight) * 16 * tileScale,
        //   clippingWidth * tileScale,
        //   clippingHeight * tileScale
        // );
      }
    }
  }
  if (waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex] - 1) || waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex] - 1)) {
    if (
      (mainPlayer.direction.right || mainPlayer.lastDirection == "right") &&
      (waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex + 1] - 1) ||
        waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex - mapWidth + 1] - 1) ||
        waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex + 1] - 1) ||
        waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex - mapWidth + 1] - 1))
    ) {
      mainPlayer.collisionDirection.right = true;
    } else {
      mainPlayer.collisionDirection.right = false;
    }
    if (
      (mainPlayer.direction.up || mainPlayer.lastDirection == "up") &&
      (waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex - mapWidth] - 1) ||
        waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex - mapWidth] - 1))
    ) {
      mainPlayer.collisionDirection.up = true;
    } else {
      mainPlayer.collisionDirection.up = false;
    }
    if (
      (mainPlayer.direction.left || mainPlayer.lastDirection == "left") &&
      (waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex - 1] - 1) ||
        waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex - mapWidth - 1] - 1) ||
        waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex - 1] - 1) ||
        waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex - mapWidth - 1] - 1))
    ) {
      mainPlayer.collisionDirection.left = true;
    } else {
      mainPlayer.collisionDirection.left = false;
    }
    if (
      (mainPlayer.direction.down || mainPlayer.lastDirection == "down") &&
      (waterTiles.includes(mapJson.layers[1]?.data[mainPlayerIndex + mapWidth] - 1) ||
        waterTiles.includes(mapJson.layers[0].data[mainPlayerIndex + mapWidth] - 1))
    ) {
      mainPlayer.collisionDirection.down = true;
    } else {
      mainPlayer.collisionDirection.down = false;
    }
    if (mainPlayer.justRespawned == true || firstTime) {
      mainPlayer.justRespawned = false;
      mainPlayer.respawn();
    }
  } else {
    mainPlayer.collisionDirection.right = false;
    mainPlayer.collisionDirection.up = false;
    mainPlayer.collisionDirection.left = false;
    mainPlayer.collisionDirection.down = false;
  }
};

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
    if (player.id == disconnector) {
      leaderboardTable.childNodes.forEach((row) => {
        if (row.childNodes[1].innerText == player.username) {
          player.loggedIn = false;
          PlayerList.splice(PlayerList.indexOf(player.id));
          row.remove();
        }
      });
    }
  });
});

socket.on("Past winners", function (winners) {
  console.log("past winners");
  pastWinnersArray.push(removeDupes(winners));
  pastWinnersLogic();
});

socket.on("new winner", function (winner) {
  pastWinnersArray.push(winner);
  pastWinnersLogic();
});

let pastWinnersLogic = function () {
  pastWinnersArrayFlattened = [];
  pastWinnersTableBody.innerHTML = "";
  pastWinnersArrayFlattened = pastWinnersArray.flat();
  let pastWinnersArrayFlattenedAndFiltered = removeDupes(pastWinnersArrayFlattened);
  if (byScore) {
    sortArray(pastWinnersArrayFlattenedAndFiltered);
  } else if (byDate) {
    sortArrayByDate(pastWinnersArrayFlattenedAndFiltered);
  }
  for (let i in removeDupes(pastWinnersArrayFlattenedAndFiltered)) {
    let arr = removeDupes(pastWinnersArrayFlattenedAndFiltered)[i];
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
  roundRect(timeCtx, 0, 0, 300, 45, { tl: 0, tr: 0, br: 20, bl: 0 }, true, true, "rgba(35, 172, 251, 0.8)", "black");
  timeCtx.fillStyle = "black";
  timeCtx.textAlign = "left";
  timeCtx.font = "1.2rem Courier";
  timeCtx.fillText(parsedTime, 10, 30);
};

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  getLeaderboardValues();
  actionLogic(mainPlayer);
  ctx.save();
  viewport.w = canvas.width;
  viewport.h = canvas.height;
  viewport.scroll(Math.floor(mainPlayer.x - canvas.width / 2), Math.floor(mainPlayer.y - canvas.height / 2));
  ctx.translate(Math.floor(-1 * viewport.x), Math.floor(-1 * viewport.y));
  // ctx.rect(viewport.x, viewport.y, viewport.w, viewport.h);
  // ctx.clip();
  // ctx.strokeStyle = "red";
  // ctx.lineWidth = "3px";
  // ctx.stroke();
  mapWidth = mapJson?.layers[0]?.width;
  mapHeight = mapJson?.layers[0]?.height;
  leftMostIndex = Math.floor((viewport.x / tileSize) * (viewport.y / tileSize));
  mainPlayerIndexX = Math.floor((mainPlayer.x + mainPlayer.width / 2) / tileSize);
  mainPlayerIndexY = Math.floor((mainPlayer.y + mainPlayer.height) / tileSize);
  mainPlayerIndex = mainPlayerIndexX + mainPlayerIndexY * mapWidth;
  totalNumberOfNecessaryTiles = Math.floor((canvas.width / tileSize) * (canvas.height / tileSize)) * mapWidth;
  updateMap();
  drawTime();
  PlayerList.forEach((player) => {
    player.draw();
  });
  ctx.restore();
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
    if (firstTime) {
      firstTime = false;
    }
  }
}, 1000 / 60);
