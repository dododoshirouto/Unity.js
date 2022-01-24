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
}

class GameObject extends GObject {
  static gameObjects = [];

  tags = [];

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

class Component extends GObject {
  gameObject = null;
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
    let a = this;
    let b = other;
    let isBRig = 'Rigidbody' in b.gameObject.components;
    let aa = { pos: a.gameObject.pos, size: a.size, vel: a.gameObject.components.Rigidbody.vel };
    let bb = { pos: b.gameObject.pos, size: b.size, vel: (isBRig ? b.gameObject.components.Rigidbody.vel : Vector2.zero) };

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

    aa.pos.add(move);
  }
}

class RangeCollider extends Collider {
  range = 0;
  debugRenderer = null;
  constructor(range = 0) {
    super();
    this.range = range;
    this.debugRenderer = new RangeRenderer();
    this.debugRenderer.gameObject = this.gameObject;
    this.debugRenderer.range = this.range;
  }

  update() {
    this.size.set(range*2, range*2);
  }
  
  draw() {
    this.debugRenderer.draw();
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

  drag = 0.94;

  isCollision = false;

  constructor() {
    super();
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

    this.vel.mul(this.drag);
    if (Math.abs(this.vel.x) < 1) this.vel.x = 0;
    if (Math.abs(this.vel.y) < 1) this.vel.y = 0;
  }

  addForce(x, y) {
    if (typeof x == 'number') x = new Vector2(x, y);

    this.vel.add(x);
    this.gameObject.pos.add(Vector2.mul(this.vel, 1 / G.fps));
  }
}

class Renderer extends Component {
  elem = null;
  fill = "#0F03";
  stroke = "#0F06";
  img = "";
  index = 0;

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
    this.elem.style.zIndex = this.index;
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