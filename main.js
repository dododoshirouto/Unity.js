G = {
  container : null,
  originalWidth : 1280,
  originalHeight : 720,
  width : -1,
  height : -1,
  sscale : 1,
  fps: 30,
  gameObjects: {},
  gravityPower: 0.98 * 20,
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



function setup() {
  G.gameObjects.ground = new GameObject();
  G.gameObjects.ground.pos = new Vector2(1280/2, 720-25);
  G.gameObjects.ground.size = new Vector2(1280, 50);
  G.gameObjects.ground.addComponent(new RectRenderer());
}

function main () {
  GameObject.gameObjects.map(v=>v.update());
  GameObject.gameObjects.map(v=>v.draw());
}