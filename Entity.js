class Entity extends GameObject {

  hp = 100;
  maxHp = 100;
  attack = 0;
  atkRange = null;
  moveRange = 0;
  defence = 0;

  moveTarget = null;
  atkTarget = null;

  atkRange = new MinMax(30, 30);
  atkAge = 0;

  constructor() {
    super();
    this.addTags('entity');
    
    new HPBar(this);

    this.size = new Vector2(60, 60);

    this.addComponent(new RectRenderer(this));
    this.components.RectRenderer.size = this.size;

    this.addComponent(new RectCollider(this));
    this.components.RectCollider.size = this.size;

    this.addComponent(new Rigidbody(this));
    this.components.Rigidbody.collisionableTags = ['ground'];
  }

  update() {
    super.update();
    this.atkAge--;
  }

  damage(damage) {
    this.hp = Math.max(this.hp - damage, 0);
    if (this.hp == 0) {
      this.destroy();
    }
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
    super.update();

    this.components.Rigidbody.vel.x = G.directionInput.x * 200;

    if ((G.pressedKeys.Space || G.touchCount >= 2) && this.components.Rigidbody.isCollision) this.components.Rigidbody.addForce(0, -1000);

    if (this.atkAge <= 0) {
      let attakableEnemys = this.components.atkRange.overColliders(['enemy']);
      if (attakableEnemys.length > 0) {
        let atk = new Attack(this);
        atk.attackTags = ['enemy'];
        atk.pos = attakableEnemys[0].gameObject.pos;
        this.atkAge = this.atkRange.random();
      }
    }
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
    this.size = new Vector2(200, 30);
    
    this.addComponent(new RectRenderer(this), 'bg');
    this.addComponent(new RectRenderer(this), 'fill');
    
    this.components.bg.size = this.size;
    this.components.fill.size = this.size;
    this.components.bg.fill = '#8006';
    this.components.fill.fill = '#0806';
    this.components.bg.stroke = 'transparent';
    this.components.fill.stroke = 'transparent';
  }
  
  draw() {
    // this.pos = Vector2.add(this.ownerGameObject.pos, new Vector2(0, -this.ownerGameObject.size.y/2- 50));
    this.pos = this.ownerGameObject.pos.clone();
    this.pos.y -= 150;
    
    this.components.fill.size.x = this.components.bg.size.x * this.hp / this.maxHp;
    this.components.fill.pos.x = -(this.components.bg.size.x - this.components.fill.size.x) / 2;
    
    super.draw();
  }
}