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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet bulletSpeed = 5;\n\nlet Bullet = function (props) {\n  let p = props;\n  this.x = p.x;\n  this.y = p.y;\n  this.width = p.width;\n  this.height = p.height;\n  this.speed = bulletSpeed;\n  this.direction = p.direction;\n  this.collisionBox = {\n    x: this.x,\n    y: this.y,\n    xMax: this.x + this.width,\n    yMax: this.y + this.height,\n  };\n\n  this.draw = function () {\n    ctx.fillRect(this.x, this.y, this.width, this.height);\n  };\n\n  this.move = function () {\n    if (this.direction === \"up\") {\n      this.y -= this.speed;\n    }\n    if (this.direction === \"left\") {\n      this.x -= this.speed;\n    }\n    if (this.direction === \"down\") {\n      this.y += this.speed;\n    }\n    if (this.direction === \"right\") {\n      this.x += this.speed;\n    }\n  };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bullet);\n\n\n//# sourceURL=webpack://war_project_v4/./src/Bullet.js?");

/***/ }),

/***/ "./src/MainLogic.js":
/*!**************************!*\
  !*** ./src/MainLogic.js ***!
  \**************************/
/*! namespace exports */
/*! export actionLogic [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createPlayer [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createPlayer\": () => /* binding */ createPlayer,\n/* harmony export */   \"actionLogic\": () => /* binding */ actionLogic\n/* harmony export */ });\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ \"./src/Player.js\");\n\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet newPlayer;\n\nlet createPlayer = function () {\n  newPlayer = new _Player__WEBPACK_IMPORTED_MODULE_0__.default({\n    username: \"null\",\n    email: \"null\",\n    x: 0,\n    y: 0,\n    health: 100,\n    keys: [\"w\", \"a\", \"s\", \"d\", \" \"],\n  });\n\n  newPlayer.draw();\n\n  return newPlayer;\n};\n\nlet actionLogic = function () {\n  document.onkeydown = (e) => {\n    if (e.key === newPlayer.keys[0]) {\n      newPlayer.direction.up = true;\n      newPlayer.lastDirection = \"up\";\n    }\n    if (e.key === newPlayer.keys[1]) {\n      newPlayer.direction.left = true;\n      newPlayer.lastDirection = \"left\";\n    }\n    if (e.key === newPlayer.keys[2]) {\n      newPlayer.direction.down = true;\n      newPlayer.lastDirection = \"down\";\n    }\n    if (e.key === newPlayer.keys[3]) {\n      newPlayer.direction.right = true;\n      newPlayer.lastDirection = \"right\";\n    }\n    if (e.key === newPlayer.keys[4]) {\n      newPlayer.attacking = true;\n    }\n  };\n\n  document.onkeyup = (e) => {\n    if (e.key === newPlayer.keys[0]) {\n      newPlayer.direction.up = false;\n    }\n    if (e.key === newPlayer.keys[1]) {\n      newPlayer.direction.left = false;\n    }\n    if (e.key === newPlayer.keys[2]) {\n      newPlayer.direction.down = false;\n    }\n    if (e.key === newPlayer.keys[3]) {\n      newPlayer.direction.right = false;\n    }\n    if (e.key === newPlayer.keys[4]) {\n      newPlayer.attacking = false;\n    }\n  };\n\n  newPlayer.action();\n};\n\n\n//# sourceURL=webpack://war_project_v4/./src/MainLogic.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bullet */ \"./src/Bullet.js\");\n\n\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\nlet playerSpeed = 2;\nlet playerDamage = 5;\nlet Img = {};\n\nlet Male1 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Male1.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet Male2 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Male2.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet Female1 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Female1.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet Female2 = function () {\n  Img.player = new Image();\n  Img.player.src = \"../images/Female2.png\";\n  Img.player.onload = () => {\n    return Img.player;\n  };\n};\n\nlet sprites = [Male1, Male2, Female1, Female2];\n\nlet Player = function (props) {\n  let p = props;\n  this.id = Math.floor(Math.random() * 1000000);\n  this.sprite = sprites[Math.floor(Math.random() * sprites.length)]();\n  this.username = p.username;\n  this.email = p.email;\n  this.x = p.x;\n  this.y = p.y;\n  this.width = 32;\n  this.height = 48;\n  this.speed = playerSpeed;\n  this.health = p.health;\n  this.damage = playerDamage;\n  this.keys = p.keys;\n  this.healthMax = 100;\n  this.score = 0;\n  this.sx = 0;\n  this.sy = 0;\n  this.bulletList = [];\n  this.collisionBox = {\n    x: this.x,\n    y: this.y,\n    xMax: this.x + this.width,\n    yMax: this.y + this.height,\n  };\n  this.direction = {\n    up: false,\n    down: false,\n    left: false,\n    right: false,\n  };\n  this.lastDirection = \"down\";\n  this.attacking = false;\n\n  this.resetSx = function () {\n    if (this.sx >= 96) {\n      this.sx = 0;\n    }\n  };\n\n  this.resetBulletlist = function () {\n    if (this.bulletList.length >= 100) {\n      this.bulletList.shift();\n    }\n  };\n\n  this.draw = () => {\n    ctx.drawImage(Img.player, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);\n    for (let i in this.bulletList) {\n      this.bulletList[i].move();\n      this.bulletList[i].draw();\n    }\n  };\n\n  this.action = () => {\n    if (this.direction.up) {\n      this.sy = 144;\n      this.sx += this.width;\n      this.y -= this.speed;\n    }\n    if (this.direction.left) {\n      this.sy = 48;\n      this.sx += this.width;\n      this.x -= this.speed;\n    }\n    if (this.direction.down) {\n      this.sy = 0;\n      this.sx += this.width;\n      this.y += this.speed;\n    }\n    if (this.direction.right) {\n      this.sy = 96;\n      this.sx += this.width;\n      this.x += this.speed;\n    }\n    if (this.attacking) {\n      let newBullet = new _Bullet__WEBPACK_IMPORTED_MODULE_0__.default({\n        x: this.x + this.width / 2,\n        y: this.y + this.height / 2,\n        width: 5,\n        height: 5,\n        direction: this.lastDirection,\n      });\n\n      this.bulletList.push(newBullet);\n      newBullet.draw();\n    }\n    this.resetSx();\n  };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\n\n\n//# sourceURL=webpack://war_project_v4/./src/Player.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _MainLogic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainLogic */ \"./src/MainLogic.js\");\n\nlet canvas = document.getElementById(\"canvas\");\nlet ctx = canvas.getContext(\"2d\");\n\nfunction resizeCanvas() {\n  let width = document.documentElement.clientWidth - 25;\n  let height = document.documentElement.clientHeight - 22;\n  canvas.width = width;\n  canvas.height = height;\n}\n\nresizeCanvas();\n(0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.createPlayer)();\nlet newPlayer = (0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.createPlayer)();\n\nlet drawingLoop = function () {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  (0,_MainLogic__WEBPACK_IMPORTED_MODULE_0__.actionLogic)();\n  newPlayer.draw();\n};\n\nsetInterval(() => {\n  drawingLoop();\n}, 10);\n\n\n//# sourceURL=webpack://war_project_v4/./src/index.js?");

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