class GObject {
  pos = Vector2.zero;
  size = Vector2.zero;
  index = 0;
  
  tags = [];

  constructor() {

  }

  update() {

  }

  draw() {

  }

  destroy() {

  }
  
  addTags(tags) {
    if (typeof tags == 'string') tags = [tags];
    this.tags = this.tags.concat(tags);
    this.tags = Array.from(new Set(this.tags));
  }
  containsTags(tags) {
    if (typeof tags == 'string') tags = [tags];
    tags = Array.from(new Set(tags));
    let res = this.tags.filter(v=>tags.indexOf(v)>-1);
    return res.length == tags.length;
  }
}

class GameObject extends GObject {
  static gameObjects = [];

  name = "Game Object";
  components = {};
  constructor() {
    super();
    GameObject.gameObjects.push(this);
  }

  addComponent(component, name=component.constructor.name) {
    component.gameObject = this;
    return this.components[name] = component;
  }

  update() {
    for (const key in this.components) {
      this.components[key].update();
    }
  }
  draw() {
    for (const key in this.components) {
      this.components[key].draw();
    }
  }

  destroy() {
    for (const key in this.components) {
      this.components[key].destroy();
    }
    GameObject.gameObjects = GameObject.gameObjects.filter(v=>v!=this);
  }
}

class Component extends GObject {
  gameObject = null;
  constructor(gameObject) {
    super();
    if (gameObject==null) console.error('gameObject が指定されていません');
    this.gameObject = gameObject;
  }

  destroy() {
    let name = '';
    for (const key in this.gameObject.components) {
      if (this.gameObject.components[key] == this) { name = key; break; }
    }
    delete this.gameObject.components.name;
  }
  
  containsTags(tags) {
    if (typeof tags == 'string') tags = [tags];
    tags = Array.from(new Set(tags));
    let res = this.tags.concat(this.gameObject.tags).filter(v=>tags.indexOf(v)>-1);
    return (res.length == tags.length);
  }
}

class Collider extends Component {
  static colliders = [];
  isTrigger = false;
  tags = [];
  constructor(gameObject) {
    super(gameObject);
    Collider.colliders.push(this);
}

  isCollision(other) { return false; }

  overColliders(maskTags) {
    let maskedCols = Collider.colliders.filter(v => v.containsTags(maskTags));
    return maskedCols.filter(v => this.isCollision(v)).sort((a,b)=>{return Vector2.distance(this.gameObject.pos + this.pos, b.gameObject.pos + b.pos) - Vector2.distance(this.gameObject.pos + this.pos, a.gameObject.pos + a.pos)});
  }

  moveOnCollision(other) {}

  destroy() {
    Collider.colliders = Collider.colliders.filter(v=>v!=this);
    super.destroy();
  }
}

class RectCollider extends Collider {
  constructor(gameObject) {
    super(gameObject);
  }

  isCollision(other) {
    let a = { pos: Vector2.add(this.gameObject.pos, this.pos), size: this.size };
    let b = { pos: Vector2.add(other.gameObject.pos, other.pos), size: other.size };
    if (Vector2.distance(a.pos, b.pos) >= (a.size.magnitude() + b.size.magnitude()) / 2) return false;
    // a up b
    if (a.pos.y + a.size.y / 2 < b.pos.y - b.size.y / 2) return false;
    // a left b
    if (a.pos.x + a.size.x / 2 < b.pos.x - b.size.x / 2) return false;
    // a right b
    if (a.pos.x - a.size.x / 2 > b.pos.x + b.size.x / 2) return false;
    // a down b
    if (a.pos.y - a.size.y / 2 > b.pos.y + b.size.y / 2) return false;

    return true;
  }

  moveOnCollision(other) {
    if (other == this) return;
    let a = this;
    let b = other;
    let isBRig = 'Rigidbody' in b.gameObject.components;
    let aa = { pos: Vector2.add(a.gameObject.pos, a.pos), size: a.size, vel: a.gameObject.components.Rigidbody.vel };
    let bb = { pos: Vector2.add(b.gameObject.pos, b.pos), size: b.size, vel: (isBRig ? b.gameObject.components.Rigidbody.vel : Vector2.zero) };

    let move = Vector2.zero;
    if (aa.vel.x - bb.vel.x > 0) { // move to Right
      move.x = (bb.pos.x - bb.size.x / 2) - (aa.pos.x + aa.size.x / 2);
    } else  { // move to Left
      move.x = (bb.pos.x + bb.size.x / 2) - (aa.pos.x - aa.size.x / 2);
    }
    if (aa.vel.y - bb.vel.y > 0) { // move to Down
      move.y = (bb.pos.y - bb.size.y / 2) - (aa.pos.y + aa.size.y / 2);
    } else { // move to Up
      move.y = (bb.pos.y + bb.size.y / 2) - (aa.pos.y - aa.size.y / 2);
    }

    if (Math.abs(move.x) < Math.abs(move.y)) {

      move.y = 0;
      if (isBRig) {
        a.gameObject.components.Rigidbody.vel.x = (aa.vel.x + bb.vel.x) / 2;
        b.gameObject.components.Rigidbody.vel.x = (aa.vel.x + bb.vel.x) / 2;
      } else {
        a.gameObject.components.Rigidbody.vel.x = 0;
      }

    } else {

      move.x = 0;
      if (isBRig) {
        a.gameObject.components.Rigidbody.vel.y = (aa.vel.y + bb.vel.y) / 2;
        b.gameObject.components.Rigidbody.vel.y = (aa.vel.y + bb.vel.y) / 2;
      } else {
        a.gameObject.components.Rigidbody.vel.y = 0;
      }

    }

    a.gameObject.pos.add(move);
  }
}

class RangeCollider extends Collider {
  range = 0;
  debugRenderer = null;
  constructor(gameObject, range = 0) {
    super(gameObject);
    this.range = range;
    this.debugRenderer = new RangeRenderer(this.gameObject);
    this.debugRenderer.range = this.range;
  }

  update() {

  }

  draw() {
    this.debugRenderer.range = this.range;
    this.size.set(this.range * 2 * Math.sin(Math.PI / 4), this.range * 2 * Math.sin(Math.PI / 4));
    this.debugRenderer.draw();
  }

  isCollision(other) {
    let a = { pos: Vector2.add(this.gameObject.pos, this.pos), size: this.size };
    let b = { pos: Vector2.add(other.gameObject.pos, other.pos), size: other.size };

    if (Vector2.distance(a.pos, b.pos) >= (a.size.magnitude() + b.size.magnitude()) / 2) return false;

    return true;
  }

  destroy() {
    this.debugRenderer.destroy();
    super.destroy();
  }
}

class Rigidbody extends Component {
  vel = Vector2.zero;
  useGravity = true;
  collisionableTags = [];

  onCollisionDrag = 0.65;
  inAirDrag = 0.96;

  isCollision = false;

  constructor(gameObject) {
    super(gameObject);
  }

  update() {
    if (this.useGravity) this.vel.add( Vector2.up.mul(G.gravityPower) );

    this.gameObject.pos.add( Vector2.mul(this.vel, 1/G.fps) );

    this.isCollision = false;
    let overColliders = ('RectCollider' in this.gameObject.components)? this.gameObject.components.RectCollider.overColliders(this.collisionableTags): null;
    if (overColliders && overColliders.length) {
      this.isCollision = true;
      overColliders.map(v => this.gameObject.components.RectCollider.moveOnCollision(v));
    }

    this.vel.mul(this.isCollision? this.onCollisionDrag: this.inAirDrag);
    if (Math.abs(this.vel.x) < 1) this.vel.x = 0;
    if (Math.abs(this.vel.y) < 1) this.vel.y = 0;
  }

  addForce(x, y) {
    if (typeof x == 'number') x = new Vector2(x, y);

    this.vel.add(x);
    // this.gameObject.pos.add(Vector2.mul(this.vel, 1 / G.fps));
  }
}

class Renderer extends Component {
  elem = null;
  fill = "#0F01";
  stroke = "#0F02";
  img = "";

  constructor(gameObject) {
    super(gameObject);
    this.elem = document.createElement('div');
    G.container.append(this.elem);
  }

  draw() {
    this.elem.style.left = Math.round((this.gameObject.pos.x+this.pos.x - this.size.x / 2) * G.sscale);
    this.elem.style.top = Math.round((this.gameObject.pos.y + this.pos.y - this.size.y / 2) * G.sscale);
    this.elem.style.width = Math.round((this.size.x) * G.sscale);
    this.elem.style.height = Math.round((this.size.y) * G.sscale);

    this.elem.style.backgroundColor = this.fill;
    this.elem.style.borderColor = this.stroke;
    this.elem.style.borderWidth = '1px';
    this.elem.style.zIndex = this.index + this.gameObject.index;
  }

  destroy() {
    this.elem.remove();
    super.destroy();
  }
}

class RectRenderer extends Renderer {

  constructor(gameObject) {
    super(gameObject);
  }
}

class RangeRenderer extends Renderer {
  range = 0;

  constructor(gameObject) {
    super(gameObject);
  }

  draw() {
    this.size.set(this.range * 2, this.range * 2)
    super.draw();
    this.elem.style.borderRadius = '100vmax';
  }
}

class Camera extends Component {
  constructor(gameObject) {
    super(gameObject);
  }
}