/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Bullet.js":
/*!***********************!*\
  !*** ./src/Bullet.js ***!
  \***********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet bulletSpeed = 5;\n\nlet Bullet = function (props) {\n  let p = props;\n  this.x = p.x;\n  this.y = p.y;\n  this.width = p.width;\n  this.height = p.height;\n  this.speed = bulletSpeed;\n  this.direction = p.direction;\n  this.shooter = p.shooter;\n  this.collisionBox = {\n    x: this.x,\n    y: this.y,\n    xMax: this.x + this.width,\n    yMax: this.y + this.height,\n  };\n\n  this.draw = function () {\n    ctx.fillStyle = \"red\";\n    ctx.fillRect(this.x, this.y, this.width, this.height);\n  };\n\n  this.move = function () {\n    if (this.direction === \"up\") {\n      this.y -= this.speed;\n    }\n    if (this.direction === \"left\") {\n      this.x -= this.speed;\n    }\n    if (this.direction === \"down\") {\n      this.y += this.speed;\n    }\n    if (this.direction === \"right\") {\n      this.x += this.speed;\n    }\n    this.update();\n  };\n\n  this.update = function () {\n    this.collisionBox = {\n      x: this.x,\n      y: this.y,\n      xMax: this.x + this.width,\n      yMax: this.y + this.height,\n    };\n  };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bullet);\n\n\n//# sourceURL=webpack://war_project_v4/./src/Bullet.js?");

/***/ }),

/***/ "./src/MainLogic.js":
/*!**************************!*\
  !*** ./src/MainLogic.js ***!
  \**************************/
/*! namespace exports */
/*! export actionLogic [provided] [no usage info] [missing usage info prevents renaming] */
/*! export checkCollision [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createPlayer [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createPlayer\": () => /* binding */ createPlayer,\n/* harmony export */   \"actionLogic\": () => /* binding */ actionLogic,\n/* harmony export */   \"checkCollision\": () => /* binding */ checkCollision\n/* harmony export */ });\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ \"./src/Player.js\");\n\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet newPlayer;\nlet w = window.innerWidth;\nlet h = window.innerHeight;\n\nlet createPlayer = function (type) {\n  type == \"main\"\n    ? (newPlayer = new _Player__WEBPACK_IMPORTED_MODULE_0__.default({\n        username: \"null\",\n        email: \"null\",\n        x: w / 2,\n        y: h / 2,\n        type: type,\n        health: 100,\n        keys: [\"w\", \"a\", \"s\", \"d\", \" \"],\n      }))\n    : type == \"other\"\n    ? (newPlayer = new _Player__WEBPACK_IMPORTED_MODULE_0__.default({\n        username: \"null\",\n        email: \"null\",\n        x: w / 2,\n        y: h / 2,\n        health: 100,\n        type: type,\n        keys: [\"w\", \"a\", \"s\", \"d\", \" \"],\n      }))\n    : null;\n  newPlayer.draw();\n  return newPlayer;\n};\n\nlet actionLogic = function (Player) {\n  document.onkeydown = (e) => {\n    if (e.key === Player.keys[0]) {\n      Player.direction.up = true;\n      Player.lastDirection = \"up\";\n    }\n    if (e.key === Player.keys[1]) {\n      Player.direction.left = true;\n      Player.lastDirection = \"left\";\n    }\n    if (e.key === Player.keys[2]) {\n      Player.direction.down = true;\n      Player.lastDirection = \"down\";\n    }\n    if (e.key === Player.keys[3]) {\n      Player.direction.right = true;\n      Player.lastDirection = \"right\";\n    }\n    if (e.key === Player.keys[4]) {\n      Player.attacking = true;\n    }\n  };\n\n  document.onkeyup = (e) => {\n    if (e.key === Player.keys[0]) {\n      Player.direction.up = false;\n      Player.sx = 0;\n    }\n    if (e.key === Player.keys[1]) {\n      Player.direction.left = false;\n      Player.sx = 0;\n    }\n    if (e.key === Player.keys[2]) {\n      Player.direction.down = false;\n      Player.sx = 0;\n    }\n    if (e.key === Player.keys[3]) {\n      Player.direction.right = false;\n      Player.sx = 0;\n    }\n    if (e.key === Player.keys[4]) {\n      Player.attacking = false;\n    }\n  };\n\n  Player.action();\n};\n\nlet checkCollision = function (object1, object2) {\n  let x1 = object1.collisionBox.x;\n  let y1 = object1.collisionBox.y;\n  let xMax1 = object1.collisionBox.xMax;\n  let yMax1 = object1.collisionBox.yMax;\n  let x2 = object2.collisionBox.x;\n  let y2 = object2.collisionBox.y;\n  let xMax2 = object2.collisionBox.xMax;\n  let yMax2 = object2.collisionBox.yMax;\n\n  // ctx.strokeStyle = \"red\";\n  // ctx.strokeRect(x1, y1, xMax1 - x1, yMax1 - y1);\n  // ctx.strokeRect(x2, y2, xMax2 - x2, yMax2 - y2);\n  if (object1.shooter && object2.id) {\n    if (object1.shooter !== object2.id) {\n      if (x1 <= xMax2 && xMax1 >= x2 && y1 <= yMax2 && yMax1 >= y2) {\n        return true;\n      }\n    }\n  }\n};\n\n\n//# sourceURL=webpack://war_project_v4/./src/MainLogic.js?");

/***/ }),

/***/ "./src/Player.js":
/*!***********************!*\
  !*** ./src/Player.js ***!
  \***********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bullet */ \"./src/Bullet.js\");\n\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet playerSpeed = 2;\nlet playerDamage = 1;\nlet Img = {};\n\nlet Male1 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Male1.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet Male2 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Male2.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet Female1 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Female1.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet Female2 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Female2.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nMath.radians = function (degrees) {\n  return (degrees * Math.PI) / 180;\n};\n\nlet sprites = [Male1, Male2, Female1, Female2];\n\nlet Player = function (props) {\n  let p = props;\n  this.id = Math.floor(Math.random() * 1000000);\n  this.sprite = sprites[0]();\n  this.username = p.username;\n  this.email = p.email;\n  this.x = p.x;\n  this.y = p.y;\n  this.width = 32;\n  this.height = 48;\n  this.speed = playerSpeed;\n  this.health = p.health;\n  this.damage = playerDamage;\n  this.keys = p.keys;\n  this.healthMax = 100;\n  this.score = 0;\n  this.sx = 0;\n  this.sy = 0;\n  this.type = p.type;\n  this.bulletList = [];\n  this.collisionBox = {\n    x: this.x,\n    y: this.y,\n    xMax: this.x + this.width,\n    yMax: this.y + this.height,\n  };\n  this.direction = {\n    up: false,\n    down: false,\n    left: false,\n    right: false,\n  };\n  this.lastDirection = \"down\";\n  this.attacking = false;\n\n  this.draw = () => {\n    ctx.drawImage(Img.player, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);\n    for (let i in this.bulletList) {\n      this.bulletList[i].move();\n      this.bulletList[i].draw();\n    }\n  };\n\n  this.delete = () => {\n    ctx.clearRect(this.x, this.y, this.width, this.height);\n  };\n\n  this.resetSx = function () {\n    if (this.sx >= 96) {\n      this.sx = 0;\n    }\n  };\n\n  if (this.type == \"main\") {\n    this.resetBulletlist = function () {\n      if (this.bulletList.length >= 100) {\n        this.bulletList.splice(0, 1);\n      }\n    };\n\n    this.drawAccesories = function () {\n      let healthBar = new HealthBar({\n        x: this.x - 15,\n        y: this.y + 5,\n        width: 15,\n        value: this.health,\n        thickness: 2,\n      });\n\n      let score = new Score({\n        x: this.x,\n        y: this.y + 35,\n        value: this.score,\n      });\n\n      let usernameLabel = new UsernameLabel({\n        x: this.x + 5,\n        y: this.y,\n        value: this.username,\n      });\n\n      healthBar.draw();\n      score.draw();\n      usernameLabel.draw();\n    };\n\n    this.action = () => {\n      if (this.direction.up) {\n        this.sy = 144;\n        this.sx += this.width;\n        this.y -= this.speed;\n      }\n      if (this.direction.left) {\n        this.sy = 48;\n        this.sx += this.width;\n        this.x -= this.speed;\n      }\n      if (this.direction.down) {\n        this.sy = 0;\n        this.sx += this.width;\n        this.y += this.speed;\n      }\n      if (this.direction.right) {\n        this.sy = 96;\n        this.sx += this.width;\n        this.x += this.speed;\n      }\n      if (this.attacking) {\n        let newBullet = new _Bullet__WEBPACK_IMPORTED_MODULE_0__.default({\n          x: this.x + this.width / 2,\n          y: this.y + this.height / 2,\n          width: 2,\n          height: 2,\n          direction: this.lastDirection,\n          shooter: this.id,\n        });\n\n        this.bulletList.push(newBullet);\n        newBullet.draw();\n      }\n      this.resetSx();\n      this.drawAccesories();\n      this.resetBulletlist();\n      this.update();\n    };\n  }\n\n  this.update = function () {\n    this.collisionBox = {\n      x: this.x,\n      y: this.y,\n      xMax: this.x + this.width,\n      yMax: this.y + this.height,\n    };\n    if (this.health <= 0) {\n      this.health = this.healthMax;\n      this.x = Math.floor(Math.random() * canvas.width);\n      this.y = Math.floor(Math.random() * canvas.height);\n    }\n  };\n};\n\nlet HealthBar = function (props) {\n  let p = props;\n  this.x = p.x;\n  this.y = p.y;\n  this.width = p.width;\n  this.radius = this.width;\n  this.value = p.value;\n  this.thickness = p.thickness;\n\n  this.draw = function () {\n    ctx.beginPath();\n    ctx.arc(this.x, this.y, this.radius, -Math.PI / 2, Math.radians(this.value * 3.6) - Math.PI / 2, false);\n    ctx.arc(this.x, this.y, this.radius - this.thickness, Math.radians(this.value * 3.6) - Math.PI / 2, -Math.PI / 2, true);\n    ctx.lineWidth = 1;\n    ctx.fillStyle = \"black\";\n    ctx.font = \"10px courier\";\n    ctx.textAlign = \"left\";\n    ctx.fillText(this.value, this.x - 9, this.y + 3);\n\n    if (this.value >= 75) {\n      ctx.fillStyle = \"green\";\n    } else if (this.value >= 50) {\n      ctx.fillStyle = \"gold\";\n    } else if (this.value >= 25) {\n      ctx.fillStyle = \"orange\";\n    } else {\n      ctx.fillStyle = \"red\";\n    }\n    ctx.closePath();\n    ctx.fill();\n  };\n};\n\nlet Score = function (props) {\n  let p = props;\n  this.x = p.x;\n  this.y = p.y;\n  this.value = p.value;\n\n  this.draw = function () {\n    ctx.fillStyle = \"black\";\n    ctx.textAlign = \"right\";\n    ctx.font = \"15px courier\";\n    ctx.fillText(this.value, this.x, this.y);\n  };\n};\n\nlet UsernameLabel = function (props) {\n  let p = props;\n  this.x = p.x;\n  this.y = p.y;\n  this.value = p.value;\n\n  this.draw = function () {\n    ctx.fillStyle = \"black\";\n    ctx.textAlign = \"left\";\n    ctx.font = \"15px courier\";\n    ctx.fillText(this.value, this.x, this.y);\n  };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\n\n\n//# sourceURL=webpack://war_project_v4/./src/Player.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _MainLogic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainLogic */ \"./src/MainLogic.js\");\n\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet socket = io({ reconnection: false });\nlet PlayerList = [];\n\nfunction resizeCanvas() {\n  let width = document.documentElement.clientWidth - 25;\n  let height = document.documentElement.clientHeight - 22;\n  canvas.width = width;\n  canvas.height = height;\n}\n\nresizeCanvas();\n\nlet newPlayer = (0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(\"main\");\nPlayerList.push(newPlayer);\nsocket.emit(\"I wish to exist\", PlayerList[0]);\n\nsocket.on(\"New connection\", function (data) {\n  let otherPlayer = (0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(\"other\");\n  otherPlayer.id = data.player.id;\n  PlayerList.push(otherPlayer);\n  socket.emit(\"me\", { me: PlayerList[0], connector: data.connector });\n});\n\nsocket.on(\"players updated info\", function (playerData) {\n  PlayerList.forEach((players) => {\n    if (players.id == playerData.id) {\n      players.x = playerData.x;\n      players.y = playerData.y;\n      players.sx = playerData.sx;\n      players.sy = playerData.sy;\n      for (let i in playerData.bulletList) {\n        if (players.bulletList[i] !== playerData.bulletList[i]) {\n          players.bulletList[i] = playerData.bulletList[i];\n        }\n      }\n    }\n  });\n});\n\nsocket.on(\"other player\", function (them) {\n  let otherPlayer = (0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(\"other\");\n  otherPlayer.id = them.id;\n  PlayerList.push(otherPlayer);\n  PlayerList.forEach((players) => {\n    if (players.id == them.id) {\n      players.x = them.x;\n      players.y = them.y;\n      players.sx = them.sx;\n      players.sy = them.sy;\n      for (let i in them.bulletList) {\n        if (players.bulletList[i] !== them.bulletList[i]) {\n          players.bulletList[i] = them.bulletList[i];\n        }\n      }\n    }\n  });\n});\n\nsocket.on(\"someone disconnected\", function (disconnector) {\n  PlayerList.forEach((players) => {\n    if (players.id == disconnector) {\n      PlayerList.splice(PlayerList.indexOf(disconnector));\n    }\n  });\n});\n\nsocket.on(\"persons sprite\", function (spriteAndPlayerId) {\n  console.log(spriteAndPlayerId);\n  PlayerList.forEach((players) => {\n    if (players.id == spriteAndPlayerId.player) {\n      console.log(\"changed sprite\");\n      players.image = spriteAndPlayerId.image;\n    }\n  });\n});\n\nlet drawingLoop = function () {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  (0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.actionLogic)(PlayerList[0]);\n  PlayerList.forEach((players) => {\n    players.draw();\n  });\n};\n\nlet Game_loop = function () {\n  drawingLoop();\n  socket.emit(\"updated player info\", PlayerList[0]);\n};\n\nsetInterval(() => {\n  Game_loop();\n}, 10);\n\n\n//# sourceURL=webpack://war_project_v4/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;