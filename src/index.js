import Game from "./core/game.js";


const canvas = document.getElementById('buffer');
let game = null;
let idReqAnim = -1;
try {
  //main();
  game = new Game(canvas);
  game.render();
  window.requestAnimationFrame(loop);
  window.removeEventListener('beforeunload', destroy);
} catch(e) {
  console.error(e);
}


function loop(dt) {
  game.update(dt);
  window.requestAnimationFrame(loop);
}


function destroy(e) {
  if(idReqAnim != -1) {
    window.cancelAnimationFrame(idReqAnim);
  }
  if(game && game instanceof Game) {
    game.destroy();
  }
}