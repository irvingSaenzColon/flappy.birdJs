import Game from "./game.js";
const canvas = document.getElementById('buffer');
//TODO: Hacer un GameObject genérico
//TODO: Hacer un ShaderHandler genérico
//TODO: Hacer una clase que ejecute toda la lógica del juego


let game = null;
let idReqAnim = -1;
try {
  //main();
  game = new Game(canvas);
  game.render();
  game.update();
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
  if(game && game instanceof Game) {
    game.destroy();
  }
  if(idReqAnim != -1) {
    window.cancelAnimationFrame(idReqAnim);
  }
}