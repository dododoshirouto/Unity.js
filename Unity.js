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
}

class RectCollider extends Collider {
  constructor() {
    super();
  }

  overColliders(maskTags) {
    let maskedCols = Collider.colliders.filter(v => v.gameObject.containsTags(maskTags) );
    return maskedCols.filter(v => {
      let a = { pos: this.gameObject.pos, size: this.size };
      let b = { pos: v.gameObject.pos, size: v.size };
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
    });
    return maskTags;
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

  overColliders(maskTags) {
    let maskedCols = Collider.colliders.filter(v => v.gameObject.containsTags(maskTags));
    return maskedCols.filter(v => {
      let a = { pos: this.gameObject.pos, size: this.size };
      let b = { pos: v.gameObject.pos, size: v.size };

      if (Vector2.distance(a.pos, b.pos) >= (a.size.magnitude() + b.size.magnitude()) / 2) return false;

      return true;
    });
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