class Entity extends GameObject {

  hp = 0;
  attack = 0;
  atkRange = null;
  moveRange = 0;
  defence = 0;

  moveTarget = null;
  atkTarget = null;

  constructor() {
    super();
    this.addTags('entity');

    this.size = new Vector2(60, 60);

    this.addComponent(new RectRenderer(this));
    this.components.RectRenderer.size = new Vector2(60, 60);

    this.addComponent(new RectCollider(this));
    this.components.RectCollider.size = new Vector2(60, 60);

    this.addComponent(new Rigidbody(this));
    this.components.Rigidbody.collisionableTags = ['ground'];
  }
}



class Enemy extends Entity {


  constructor() {
    super();
    if (!G.enemy) G.enemy = [];
    G.enemy.push(this);

    this.pos = new Vector2(Math.random() * 1000+280, Math.random() * 200);

    this.addTags('enemy');

    this.components.RectRenderer.fill = ['darkblue', 'darkgoldenrod', 'darkred', 'darkcyan', 'darkmagenta'][Math.floor(Math.random() * 5)];
    this.components.RectRenderer.stroke = "red";
  }

  destroy() {
    super.destroy();
    G.enemy = G.enemy.filter(v=>v!=this);
  }
}



class Player extends Entity {

  moveSpeedX = 300;
  jumpPower = 1000;

  isJumpping = false;

  constructor() {
    super();
    G.player = this;

    this.pos = new Vector2(Math.random() * 280, Math.random() * 200);

    this.addTags('player');

    this.components.RectRenderer.fill = "darkgreen";
    this.components.RectRenderer.stroke = "blue";
    this.index = 500;

    this.addComponent(new RangeCollider(this), 'atkRange');
    this.components.atkRange.range = 100;
  }

  update() {
    this.components.Rigidbody.vel.x = G.directionInput.x * 200;

    if ((G.pressedKeys.Space || G.touchCount >= 2) && this.components.Rigidbody.isCollision) this.components.Rigidbody.addForce(0, -1000);

    super.update();
  }

  destroy() {
    super.destroy();
    G.player = null;
  }
}



class Attack extends GameObject{
  ownerGameObject = null;

  attackedEnemysCount = 1;
  maxLifeFrame = 1;
  damage = new MinMax(1, 1);

  attackTags = [];

  constructor(ownerGameObject) {
    if (ownerGameObject == null) console.error('攻撃のオーナーが指定されていません');
    this.ownerGameObject = ownerGameObject;
  }


}