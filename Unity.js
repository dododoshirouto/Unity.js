class GObject {
  pos = Vector2.zero;
  size = Vector2.zero;

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
  static null = null;
  static gameObjects = [];

  tags = [];

  name = "Game Object";
  components = {};
  constructor() {
    super();
    GameObject.gameObjects.push(this);
  }

  addComponent(component) {
    component.gameObject = this;
    return this.components[component.constructor.name] = component;
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
}

class Component extends GObject {
  gameObject = GameObject.null;
  constructor() {
    super();
  }
}

class Collider extends Component {
  static colliders = [];
  isTrigger = false;
  constructor() {
    super();
    Collider.colliders.push(this);

    // this.size = this.gameObject.size;
  }

  isCollision(other) { return false; }

  overColliders(maskTags) {
    let maskedCols = Collider.colliders.filter(v => v.gameObject.containsTags(maskTags));
    return maskedCols.filter(v => this.isCollision(v));
  }

  moveOnCollision(other) {}
}

class RectCollider extends Collider {
  constructor() {
    super();
  }

  isCollision(other) {
    let a = { pos: this.gameObject.pos, size: this.size };
    let b = { pos: other.gameObject.pos, size: other.size };
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
    // let a = ('RigidBody' in this.gameObject.components ? this : other);
    // let b = (a == this ? other : this);
    let a = this;
    let b = other;
    let isBRig = 'Rigidbody' in b.gameObject.components;
    let aa = { pos: a.gameObject.pos, size: a.size, vel: a.gameObject.components.Rigidbody.vel };
    let bb = { pos: b.gameObject.pos, size: b.size, vel: (isBRig ? b.gameObject.components.Rigidbody.vel : Vector2.zero) };

    if (aa.vel.x - bb.vel.x > 0) { // move to Right
      aa.pos.x += (bb.pos.x - bb.size.x / 2) - (aa.pos.x + aa.size.x / 2);
    } else if (aa.vel.x - bb.vel.x < 0) { // move to Left
      aa.pos.x += (bb.pos.x + bb.size.x / 2) - (aa.pos.x - aa.size.x / 2);
    }
    if (aa.vel.y - bb.vel.y > 0) { // move to Down
      aa.pos.y += (bb.pos.y - bb.size.y / 2) - (aa.pos.y + aa.size.y / 2);
    } else if (aa.vel.y - bb.vel.y < 0) { // move to Up
      aa.pos.y += (bb.pos.y + bb.size.y / 2) - (aa.pos.y - aa.size.y / 2);
    }

    if (isBRig) {
      let averageVel = new Vector2( (aa.vel.x + bb.vel.x)/2, (aa.vel.y + bb.vel.y)/2 );
      aa.vel = averageVel;
      bb.vel = averageVel;
    } else {
      aa.vel = Vector2.zero;
      bb.vel = Vector2.zero;
    }
  }
}

class RangeCollider extends Collider {
  range = 0;
  constructor(range = 0) {
    super();
    this.range = range;
  }

  update() {
    this.size.set(range*2, range*2);
  }

  isCollision(other) {
    let a = { pos: this.gameObject.pos, size: this.size };
    let b = { pos: other.gameObject.pos, size: other.size };

    if (Vector2.distance(a.pos, b.pos) >= (a.size.magnitude() + b.size.magnitude()) / 2) return false;

    return true;
  }
}

class Rigidbody extends Component {
  vel = Vector2.zero;
  useGravity = true;
  collisionableTags = [];

  constructor() {
    super();
  }

  update() {
    if (this.useGravity) this.vel.add( Vector2.up.mul(G.gravityPower) );
    this.gameObject.pos.add( Vector2.mul(this.vel, 1/G.fps) );

    let overColliders = ('RectCollider' in this.gameObject.components)? this.gameObject.components.RectCollider.overColliders(this.collisionableTags): null;
    if (overColliders && overColliders.length) {
      overColliders.map(v => this.gameObject.components.RectCollider.moveOnCollision(v));
    }
  }
}

class Renderer extends Component {
  elem = null;
  fill = "#0000";
  stroke = "#0F06";
  img = "";

  constructor() {
    super();
    this.elem = document.createElement('div');
    G.container.append(this.elem);
  }

  draw() {
    this.elem.style.left = Math.round((this.gameObject.pos.x - this.gameObject.size.x / 2) * G.sscale);
    this.elem.style.top = Math.round((this.gameObject.pos.y - this.gameObject.size.y / 2) * G.sscale);
    this.elem.style.width = Math.round((this.gameObject.size.x) * G.sscale);
    this.elem.style.height = Math.round((this.gameObject.size.y) * G.sscale);

    this.elem.style.backgroundColor = this.fill;
    this.elem.style.borderColor = this.stroke;
    this.elem.style.borderWidth = '1px';
  }
}

class RectRenderer extends Renderer {

  constructor() {
    super();
  }
}

class RangeRenderer extends Renderer {
  range = 0;

  constructor() {
    super();
  }

  draw() {
    this.size = Vector2.one.mul(this.range);
    super.draw();
    this.elem.style.borderRadius = '100maxv';
  }
}

class Camera extends Component {
  constructor() {
    super();
  }
}