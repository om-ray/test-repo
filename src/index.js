//Note: Global Variables here ------------------------------------------------------------------------------
//Warning: Start of Global Variables

import moment from "moment";
import Bullet from "./Bullet";
import Viewport from "./Viewport";
import {
  actionLogic,
  checkCollision,
  createPlayer,
  roundRect,
  sortArrayByDate,
  sortArray,
  removeDupes,
  runXMLHttpRequest,
  basename,
} from "./MainLogic";
import { BinTree, RBTree } from "bintrees";
import Player from "./Player";
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
let firstTime = true;
let usernameAndScoreArray = [];
let allowPvp = true;
let submitting = false;
let pastWinnersArray = [];
let pastWinnersArrayFlattened = [];
let tileset = new Image();
let viewport = new Viewport(0, 0, canvas.width, canvas.height);
tileset.src = "../images/tileset-pokemon_dawn.png";
let mapJson;
let objectJson;
let startX = 0;
let startY = 0;
let clippingWidth;
let clippingHeight;
let objectClippingWidth;
let objectClippingHeight;
let placeX = 0;
let placeY = 0;
let objectDrawX = 0;
let objectDrawY = 0;
let objectValues;
let tileScale = 5;
let mapWidth = mapJson?.layers[0]?.width;
let mapHeight = mapJson?.layers[0]?.height;
let tileSize = 16 * tileScale;
let canvasWidthInTiles = Math.floor(canvas.width / tileSize);
let canvasHeightInTiles = Math.floor(canvas.height / tileSize);
let totalNumberOfNecessaryTiles = Math.floor(canvasHeightInTiles * canvasWidthInTiles) * mapWidth;
let mainPlayerIndexX;
let mainPlayerIndexY;
let mainPlayerIndex;
let leftMostIndex;
let objectCollisionBox;
let collisionData;
let objectImage;
let waterTiles = [2742, 2838, 2650, 2651, 2744, 2745, 2647, 2648, 2649, 2741, 2742, 2743, 2835, 2836, 2837];
let getMapJson = new XMLHttpRequest();
let getObjectJson = new XMLHttpRequest();
let mainPlayer;
let objectBinaryTree;
let newPlayer;

//Warning: End of Global Variables

//Note: Global functions here
//Warning: Start of Global functions

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

let updateLogInInfo = function () {
  username = usernameInput.value;
  email = emailInput.value;
  password = passwordInput.value;
};

let resizeCanvas = function () {
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
};

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
    drawn: mainPlayer.drawn,
    lastDirection: mainPlayer.lastDirection,
    clipWidth: mainPlayer.width,
    clipHeight: mainPlayer.height,
    above: mainPlayer.above,
    below: mainPlayer.below,
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
      index: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].index,
      direction: mainPlayer.bulletList[mainPlayer.bulletList.length - 1].direction,
      timesReloaded: mainPlayer.timesReloaded,
    });
  }
};

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

let in_viewport = function (x, y) {
  if (
    x >= viewport.x - 200 &&
    x <= viewport.x + viewport.w &&
    y >= viewport.y - 200 &&
    y <= viewport.y + viewport.h
  ) {
    return true;
  } else {
    return false;
  }
};

let updateMap = function () {
  for (let i = 0; i < mapJson.layers.length; i++) {
    for (let u = totalNumberOfNecessaryTiles; u >= leftMostIndex; u--) {
      let dataValues;
      if (mapJson.layers[i].data) {
        dataValues = mapJson.layers[i].data[u] - 1;
      }
      startX = Math.ceil(((dataValues % 94) * 16) / 16) * 16;
      startY = Math.ceil((Math.floor(dataValues / 94) * 16) / 16) * 16;
      clippingWidth = 16;
      clippingHeight = 16;
      placeX = (u % mapWidth) * 16 * tileScale;
      placeY = Math.floor(u / mapHeight) * 16 * tileScale;
      if (in_viewport(placeX, placeY)) {
        ctx.drawImage(
          tileset,
          startX,
          startY,
          clippingWidth,
          clippingHeight,
          Math.floor(placeX),
          Math.floor(placeY),
          tileSize,
          tileSize
        );
      }
    }
    if (mapJson.layers[i].data) {
      if (waterTiles.includes(mapJson.layers[i].data[mainPlayerIndex] - 1)) {
        if (
          (mainPlayer.direction.right || mainPlayer.lastDirection == "right") &&
          (waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex + 1] - 1) ||
            waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - mapWidth + 1] - 1))
        ) {
          mainPlayer.collisionDirection.right = true;
          mainPlayer.x = mainPlayer.prevX;
          mainPlayer.y = mainPlayer.prevY;
        } else {
          mainPlayer.collisionDirection.right = false;
        }
        if (
          (mainPlayer.direction.up || mainPlayer.lastDirection == "up") &&
          waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - mapWidth] - 1)
        ) {
          mainPlayer.collisionDirection.up = true;
          mainPlayer.x = mainPlayer.prevX;
          mainPlayer.y = mainPlayer.prevY;
        } else {
          mainPlayer.collisionDirection.up = false;
        }
        if (
          (mainPlayer.direction.left || mainPlayer.lastDirection == "left") &&
          (waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - 1] - 1) ||
            waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - mapWidth - 1] - 1))
        ) {
          mainPlayer.collisionDirection.left = true;
          mainPlayer.x = mainPlayer.prevX;
          mainPlayer.y = mainPlayer.prevY;
        } else {
          mainPlayer.collisionDirection.left = false;
        }
        if (
          (mainPlayer.direction.down || mainPlayer.lastDirection == "down") &&
          waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex + mapWidth] - 1)
        ) {
          mainPlayer.collisionDirection.down = true;
          mainPlayer.x = mainPlayer.prevX;
          mainPlayer.y = mainPlayer.prevY;
        } else {
          mainPlayer.collisionDirection.down = false;
        }
        if (mainPlayer.justRespawned == true || firstTime) {
          mainPlayer.justRespawned = false;
          mainPlayer.respawn();
        }
        if (
          (waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex + 1] - 1) ||
            waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - mapWidth + 1] - 1)) &&
          waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - mapWidth] - 1) &&
          (waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - 1] - 1) ||
            waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex - mapWidth - 1] - 1)) &&
          waterTiles.includes(mapJson.layers[i]?.data[mainPlayerIndex + mapWidth] - 1)
        ) {
          mainPlayer.respawn();
        }
      } else {
        mainPlayer.collisionDirection.right = false;
        mainPlayer.collisionDirection.up = false;
        mainPlayer.collisionDirection.left = false;
        mainPlayer.collisionDirection.down = false;
      }
    }
  }
};

let updateObjectBinaryTree = function () {
  // PlayerList.forEach((player) => {
  //   objectBinaryTree.each((node) => {
  //     if (node.type == "player") {
  //       objectBinaryTree.remove({
  //         type: "player",
  //         y: node.y,
  //         id: player.id,
  //         draw: node.draw,
  //       });
  //     }
  //   });
  //   objectBinaryTree.insert({
  //     type: "player",
  //     y: player.y,
  //     id: player.id,
  //     draw: drawPlayers(player),
  //   });
  // });
};

let checkObjectCollision = function (currentObject, mainPlayer) {
  if (checkCollision(currentObject, mainPlayer)) {
    if (mainPlayer.direction.right || mainPlayer.lastDirection == "right") {
      mainPlayer.collisionDirection.right = true;
      mainPlayer.collisionDirection.left = false;
      mainPlayer.x = mainPlayer.prevX - 4 * PlayerList.length;
      mainPlayer.y = mainPlayer.prevY;
    } else {
      mainPlayer.collisionDirection.right = false;
    }
    if (mainPlayer.direction.up || mainPlayer.lastDirection == "up") {
      mainPlayer.collisionDirection.up = true;
      mainPlayer.collisionDirection.down = false;
      mainPlayer.x = mainPlayer.prevX;
      mainPlayer.y = mainPlayer.prevY + 4 * PlayerList.length;
    } else {
      mainPlayer.collisionDirection.up = false;
    }
    if (mainPlayer.direction.left || mainPlayer.lastDirection == "left") {
      mainPlayer.collisionDirection.left = true;
      mainPlayer.collisionDirection.right = false;
      mainPlayer.x = mainPlayer.prevX + 4 * PlayerList.length;
      mainPlayer.y = mainPlayer.prevY;
    } else {
      mainPlayer.collisionDirection.left = false;
    }
    if (mainPlayer.direction.down || mainPlayer.lastDirection == "down") {
      mainPlayer.collisionDirection.down = true;
      mainPlayer.collisionDirection.up = false;
      mainPlayer.x = mainPlayer.prevX;
      mainPlayer.y = mainPlayer.prevY - 4 * PlayerList.length;
    } else {
      mainPlayer.collisionDirection.down = false;
    }
  }
  for (let i in mainPlayer.bulletList) {
    let arr = mainPlayer.bulletList[i];
    if (checkCollision(currentObject, arr)) {
      mainPlayer.bulletList.splice(i, 1);
    }
  }
};

let updateObjects = function () {
  for (let i = 0; i < mapJson.layers.length; i++) {
    mapJson.layers[i].objects?.sort((a, b) => {
      if (a.y < b.y) {
        return -1;
      }
      if (a.y == b.y) {
        return 0;
      }
      if (a.y > b.y) {
        return 1;
      }
    });
    for (let n = 0; n < mapJson.layers[i].objects?.length; n++) {
      let object = function (box) {
        this.collisionBox = box;
      };
      objectValues = mapJson.layers[i].objects[n];
      for (let b in objectJson.tiles[objectValues.properties[0].value].objectgroup.objects) {
        let arr = objectJson.tiles[objectValues.properties[0].value].objectgroup.objects[b];
        objectImage = new Image();
        objectImage.src = `../images/${basename(objectJson.tiles[objectValues.properties[0].value].image)}`;
        collisionData = arr;
        objectClippingWidth = objectValues.width * tileScale;
        objectClippingHeight = objectValues.height * tileScale;
        objectDrawX = objectValues.x * tileScale;
        objectDrawY = objectValues.y * tileScale - objectClippingHeight;

        objectCollisionBox = {
          x: objectDrawX + collisionData?.x * tileScale,
          y: objectDrawY + collisionData?.y * tileScale,
          xMax: objectDrawX + collisionData?.x * tileScale + collisionData?.width * tileScale,
          yMax: objectDrawY + collisionData?.y * tileScale + collisionData?.height * tileScale,
        };
        let currentObject = new object(objectCollisionBox);
        if (in_viewport(objectDrawX, objectDrawY)) {
          checkObjectCollision(currentObject, mainPlayer);
        }
      }
      objectBinaryTree.insert({
        type: "object",
        y: objectDrawY,
        draw: drawObjects(objectImage, objectDrawX, objectDrawY, objectClippingWidth, objectClippingHeight),
      });
    }
  }
};

let drawObjects = function (image, objectDrawX, objectDrawY, objectClippingWidth, objectClippingHeight) {
  ctx.drawImage(image, objectDrawX, objectDrawY, objectClippingWidth, objectClippingHeight);
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

let initPlayer = function () {
  socket.emit("send past winners");
  newPlayer = createPlayer("main");

  objectBinaryTree = new BinTree(function (a, b) {
    if (a.y < b.y) {
      return 1;
    }
    if (a.y == b.y) {
      return 0;
    }
    if (a.y > b.y) {
      return -1;
    }
  });
  PlayerList.push(newPlayer);
  socket.emit("I wish to exist", PlayerList[0]);
  mainPlayer = PlayerList[0];
};

let getLeaderboardValues = function () {
  socket.emit("can i have the leaderboard values");
};

let drawTime = function () {
  roundRect(
    timeCtx,
    0,
    0,
    300,
    45,
    { tl: 0, tr: 0, br: 20, bl: 0 },
    true,
    true,
    "rgba(35, 172, 251, 0.8)",
    "black"
  );
  timeCtx.fillStyle = "black";
  timeCtx.textAlign = "left";
  timeCtx.font = "1.2rem Courier";
  timeCtx.fillText(parsedTime, 10, 30);
};

let drawingLoop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  PlayerList.forEach((player) => {
    player.drawn = false;
  });
  getLeaderboardValues();
  actionLogic(mainPlayer);
  ctx.save();
  viewport.w = canvas.width;
  viewport.h = canvas.height;
  viewport.scroll(Math.floor(mainPlayer.x - canvas.width / 2), Math.floor(mainPlayer.y - canvas.height / 2));
  ctx.translate(Math.floor(-1 * viewport.x), Math.floor(-1 * viewport.y));
  mapWidth = mapJson?.layers[0]?.width;
  mapHeight = mapJson?.layers[0]?.height;
  leftMostIndex = Math.floor((viewport.x / tileSize) * (viewport.y / tileSize));
  mainPlayerIndexX = Math.floor((mainPlayer.x + mainPlayer.width / 2) / tileSize);
  mainPlayerIndexY = Math.floor((mainPlayer.y + mainPlayer.height) / tileSize);
  mainPlayerIndex = mainPlayerIndexX + mainPlayerIndexY * mapWidth;
  totalNumberOfNecessaryTiles = Math.floor((canvas.width / tileSize) * (canvas.height / tileSize)) * mapWidth;
  updateMap();
  updateObjectBinaryTree();
  for (let i in PlayerList) {
    let player = PlayerList[i];
    // for (let n in PlayerList) {
    //   let otherPlayers = PlayerList[n];
    //   if (player.id !== otherPlayers.id) {
    //     if (player.y > otherPlayers.y) {
    //       otherPlayers.draw();
    //       player.draw();
    //     }
    //     if (player.y <= otherPlayers.y) {
    //       player.draw();
    //       otherPlayers.draw();
    //     }
    //   } else {
    //     player.draw();
    //   }
    // }
    if (player.id !== mainPlayer.id) {
      if (player.y > mainPlayer.y) {
        mainPlayer.draw();
        player.draw();
      } else if (player.y <= mainPlayer.y) {
        player.draw();
        mainPlayer.draw();
      }
    } else if (player.id == mainPlayer.id) {
      mainPlayer.draw();
    }
  }
  updateObjects();
  drawTime();
  let it = objectBinaryTree.findIter(objectBinaryTree.max());
  let item;
  while ((item = it.prev()) !== null) {
    item.draw;
  }
  ctx.restore();
};

let Game_loop = function () {
  drawingLoop();
  sendPlayerInfo();
  sendBulletInfo();
  pvpChecker();
};

//Warning: End of Global functions

//Note: Dom event handlers here
//Warning: Start of Dom event handlers

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

window.addEventListener("resize", () => {
  resizeCanvas();
});

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

//Warning: End of Dom event handlers

//Note: Socket.on's here
//Warning: Start of Socket.on's

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
      player.drawn = playerData.drawn;
      player.lastDirection = playerData.lastDirection;
      player.width = playerData.clipWidth;
      player.height = playerData.clipHeight;
      player.above = playerData.above;
      player.below = playerData.below;
      while (
        player.bulletList.length <= playerData.bulletList &&
        // playerData.ammoLeft > 0 &&
        // playerData.reloading == false &&
        playerData.needsToReload == false
      ) {
        player.bulletList.push(
          new Bullet({
            shooter: player.id,
            index: playerData.bulletList - 1,
          })
        );
      }
    }
  });
});

socket.on("bullets updated info", function (bulletInfo) {
  for (let i in PlayerList) {
    let player = PlayerList[i];
    if (
      player.id == bulletInfo.bulletShooter &&
      player.bulletList.length > 0 &&
      player.ammoLeft > 0 &&
      player.bulletList[player.bulletList.length - 1].index == bulletInfo.index
    ) {
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

//Warning: End of Socket.on's

//Explanation: Resizes canvas to match player's screen width and prevent cheating through zooming in or out
resizeCanvas();

//Explanation: Initializes mainPlayer
initPlayer();

//Explanation: Requests the server for the JSON to create the map
runXMLHttpRequest(
  getMapJson,
  (response) => {
    if (response.readyState == 4 && response.status == 200) {
      mapJson = JSON.parse(response.responseText);
    }
  },
  "GET",
  "/warmap"
);

//Explanation: Requests the server for the JSON to create the templates for all thendifferent objects
runXMLHttpRequest(
  getObjectJson,
  (response) => {
    if (response.readyState == 4 && response.status == 200) {
      objectJson = JSON.parse(response.responseText);
    }
  },
  "GET",
  "/objects"
);

//Explanation: Runs the whole game, drawing and all. VERY IMPORTANT!!!!
let run = () => {
  if (loggedIn) {
    Game_loop();
    if (firstTime) {
      firstTime = false;
    }
  }
  window.requestAnimationFrame(run);
};

window.requestAnimationFrame(run);
