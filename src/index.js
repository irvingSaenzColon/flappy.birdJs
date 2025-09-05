import ResourceLoader from './core/resourceLoader.js';
import Game from "./core/game.js";
import Timer from "./core/Timer.js";


const canvas = document.getElementById('buffer');
let game = null;
let idReqAnim = -1;


async function main() {
  try {
    game = new Game(canvas);
    game.onInit();
    await game.onLoadResources();
    game.setup();
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


document.addEventListener('DOMContentLoaded', (e) => {
  main();
})
