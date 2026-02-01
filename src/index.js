import ResourceLoader from './core/resourceLoader.js';
import Game from "./core/game.js";
import Timer from "./core/Timer.js";

const canvas = document.getElementById('buffer');
const loadingScreen = document.getElementById('loading-screen');
let game = null;
let idReqAnim = -1;


async function main() {
  try {
    game = new Game(canvas);
    game.onInit();
    await game.onLoadResources();
    game.setup();
		loadingScreen.classList.add("loading-screen--out");
		loadingScreen.addEventListener("animationend", onFadeOutFinish);
		game.draw();
    window.requestAnimationFrame(loop);
    window.removeEventListener('beforeunload', destroy);
  } catch (e) {
    console.error(e);
  }
}


function loop(currTime) {
  Timer.setPrevTime(currTime)
  game.update();
  window.requestAnimationFrame(loop);
}


function destroy(e) {
  if (idReqAnim != -1) {
    window.cancelAnimationFrame(idReqAnim);
  }
  if (game && game instanceof Game) {
    game.destroy();
  }
}


document.addEventListener('DOMContentLoaded', main);
window.onblur = function() {
  if (game && game instanceof Game) {
    game.setState("PAUSE");
  }
}


window.onfocus = function() {
  if (game && game instanceof Game) {
    game.setState("PLAY");
  }
}


function onFadeOutFinish(e) {
	if (!loadingScreen) {
		return;
	}
	loadingScreen.removeEventListener("animationend", this);
	loadingScreen.remove();
}
