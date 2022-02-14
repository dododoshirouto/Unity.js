class Entity extends GameObject {

  hp = 100;
  maxHp = 100;
  hpbar = null;
  
  atkRange = null;
  moveRange = null;
  defence = 0;

  moveTarget = null;
  atkTarget = null;

  attackTags = [];
  atkRange = new MinMax(20, 20);
  atkAge = 0;

  constructor() {
    super();
    this.addTags('entity');

    this.hpbar = new HPBar(this);

    this.size = new Vector2(30, 30);

    this.addComponent(new RectRenderer(this));
    this.components.RectRenderer.size = this.size.clone();

    this.addComponent(new RectCollider(this));
    this.components.RectCollider.size = this.size.clone();
    this.components.RectCollider.addTags('bodyCol');


    this.addComponent(new Rigidbody(this));
    this.components.Rigidbody.collisionableTags = ['ground'];
    
    this.addComponent(new RangeCollider(this), 'atkRange');
    this.components.atkRange.range = 50;
    this.components.atkRange.addTags('atkRange');
    
    this.addComponent(new RangeCollider(this), 'moveRange');
    this.components.moveRange.range = 300;
    this.components.moveRange.addTags('moveRange');
  }

  update() {
    super.update();
    this.atkAge--;
    this.attack();
  }

  damage(damage) {
    this.hp = Math.max(this.hp - damage, 0);
    if (this.hp == 0) {
      this.destroy();
    }
  }
  
  attack() {
    if (this.atkAge <= 0) {
      let attakableEnemys = this.components.atkRange.overColliders(this.attackTags);
      if (attakableEnemys.length > 0) {
        let atk = new Attack(this);
        atk.attackTags = this.attackTags;
        atk.pos = attakableEnemys[0].gameObject.pos;
        this.atkAge = this.atkRange.random();
      }
    }
  }

  destroy() {
    this.hpbar.destroy();
    super.destroy();
  }
  
  automove() {
    
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
    
    this.attackTags = ['player','bodyCol'];
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
    
    this.attackTags = ['enemy', 'bodyCol'];
  }

  update() {
    super.update();

    this.components.Rigidbody.vel.x = G.directionInput.x * 200;
    if ((G.pressedKeys.Space || G.touchCount >= 2) && this.components.Rigidbody.isCollision) this.components.Rigidbody.addForce(0, -1000);
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
  damage = new MinMax(10, 10);

  lifeFrame = 0;
  attackCount = 0;

  attackTags = [];

  constructor(ownerGameObject) {
    super();
    if (ownerGameObject == null) console.error('攻撃のオーナーが指定されていません');
    this.ownerGameObject = ownerGameObject;

    this.addComponent(new RangeCollider(this));
    this.components.RangeCollider.range = 20;
    this.components.RangeCollider.debugRenderer.fill = '#f003';
    this.components.RangeCollider.debugRenderer.stroke = '#f001';

    this.index = 1000;
  }

  update() {
    let overColliders = this.components.RangeCollider.overColliders(this.attackTags);
    for (const col of overColliders) {
      if (!col.gameObject.damage) continue;
      col.gameObject.damage(this.damage.random());
      this.attackCount++;
      if (this.attackCount >= this,this.attackedEnemysCount) break;
    }
    this.lifeFrame++;
    if (this.lifeFrame >= this.maxLifeFrame) this.destroy();
  }
}





class HPBar extends GameObject{
  ownerGameObject = null;

  constructor(ownerGameObject) {
    super();
    this.ownerGameObject = ownerGameObject;
    this.addTags('hpbar');
    this.index = 10000;
    this.size = new Vector2(100, 10);

    this.addComponent(new RectRenderer(this), 'bg');
    this.addComponent(new RectRenderer(this), 'fill');

    this.components.bg.size = this.size.clone();
    this.components.fill.size = this.size.clone();
    this.components.bg.fill = '#8006';
    this.components.fill.fill = '#0806';
    this.components.bg.stroke = 'transparent';
    this.components.fill.stroke = 'transparent';
  }

  draw() {
    this.pos = Vector2.add(this.ownerGameObject.pos, new Vector2(0, -this.ownerGameObject.size.y/2- 20));
    // this.pos = this.ownerGameObject.pos.clone();

    this.components.fill.size.x = this.components.bg.size.x * this.ownerGameObject.hp / this.ownerGameObject.maxHp;
    this.components.fill.pos.x = -(this.components.bg.size.x - this.components.fill.size.x) / 2;

    super.draw();
  }
}