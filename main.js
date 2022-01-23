G = {
  container : null,
  originalWidth : 1280,
  originalHeight : 720,
  width : -1,
  height : -1,
  sscale : 1,
  fps: 30,
  gameObjects: {},
  gravityPower: 0.98 * 100,
  directionInput: Vector2.zero,
  inputSlipRate: 0.8,
  pressedKeys: {},
  preventDefaultInput: false,
};

function init() {
  FastClick.attach(document.body);
  G.container = document.querySelector('#game');
  resize();

  setup();
  setInterval(main, 1000 / G.fps);
}
window.addEventListener('load', init);

function resize() {
  G.width = Math.min(window.innerWidth, window.innerHeight * G.originalWidth/G.originalHeight);
  G.height = G.width * G.originalHeight / G.originalWidth;
  G.container.style.width = G.width + 'px';
  G.container.style.height = G.height + 'px';
  G.container.style.left = (window.innerWidth - G.width)/2;
  G.sscale = G.width / G.originalWidth;
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);

function oninput(ev) {
  // console.log(ev);
  G.pressedKeys[ev.code] = ev.type != 'keyup';
  if (G.preventDefaultInput) ev.preventDefault();
}
function uninput(ev) {
  oninput(ev);
  if (G.preventDefaultInput) ev.preventDefault();
}
window.addEventListener('keydown', oninput, {passive:false});
window.addEventListener('keyup', uninput, {passive:false});
touchStart = null;
function ontouch(ev) {
  if (!touchStart) touchStart = new Vector2(ev.touches.screenX, ev.touches.screenY);
  let nowTouch = new Vector2(ev.touches.screenX, ev.touches.screenY);
  G.directionInput = Vector2.sub(nowTouch, touchStart);
  if (G.preventDefaultInput) ev.preventDefault();
}
function untouch(ev) {
  
  touchStart = null;
  if (G.preventDefaultInput) ev.preventDefault();
}
window.addEventListener('touchstart', ontouch, {passive:false});
window.addEventListener('touchend', untouch, {passive:false});
window.addEventListener('touchmove', ontouch, {passive:false});

function inputToDirection() {
  let input = Vector2.zero;
  if (G.pressedKeys.KeyW) input.y += 1;
  if (G.pressedKeys.KeyA) input.x -= 1;
  if (G.pressedKeys.KeyS) input.y -= 1;
  if (G.pressedKeys.KeyD) input.x += 1;
  if (G.pressedKeys.ArrowUp) input.y += 1;
  if (G.pressedKeys.ArrowLeft) input.x -= 1;
  if (G.pressedKeys.ArrowDown) input.y -= 1;
  if (G.pressedKeys.ArrowRight) input.x += 1;
  input = Vector2.min(input, Vector2.one);
  G.directionInput = Vector2.Lerp(G.directionInput, input, G.inputSlipRate);
}



function setup() {
  G.gameObjects.ground = new GameObject();
  G.gameObjects.ground.pos = new Vector2(1280/2, 720-25);
  G.gameObjects.ground.size = new Vector2(1280, 50);
  G.gameObjects.ground.addComponent(new RectRenderer());
  G.gameObjects.ground.components.RectRenderer.fill = "green";
  G.gameObjects.ground.components.RectRenderer.stroke = "darkgreen";
  G.gameObjects.ground.addComponent(new RectCollider());
  G.gameObjects.ground.components.RectCollider.size = new Vector2(1280, 50);;
  G.gameObjects.ground.addTags('ground');

  G.player = new Player();

  G.enemy = [];
  for(let i=0; i<3; i++) {
    G.enemy[i] = new Enemy();
  }
}

function main () {

  inputToDirection();

  GameObject.gameObjects.map(v=>v.update());
  GameObject.gameObjects.map(v=>v.draw());

  // console.log(G.player.components.Rigidbody.isCollision);
}