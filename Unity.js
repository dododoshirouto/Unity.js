class GObject {
  pos = Vector2.zero;
  size = Vector2.zero;

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
  static null = new GameObject();
  static gameObjects = [];

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
    for (i in this.components) {
      this.components[i].update();
    }
  }
  draw() {
    for (i in this.components) {
      this.components[i].draw();
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
  isTrigger = false;
  constructor() {
    super();
  }
}

class RectCollider extends Collider {
  constructor() {
    super();
  }
}

class RangeCollider extends Collider {
  range = 0;
  constructor() {
    super();
  }
}

class Rigidbody extends Component {
  constructor() {
    super();
  }

  update() {

  }
}

class Renderer extends Component {
  elem = null;
  fill = "#0000";
  stroke = "#0F06";
  img = "";

  constructor(className) {
    super();
    this.elem = document.createElement('div');
    // this.elem.classList.add('g-'+className);
    G.container.append(this.elem);
  }

  draw() {
    this.elem.style.left = Math.round((this.gameObject.pos.x) * G.sscale);
    this.elem.style.top = Math.round((this.gameObject.pos.y) * G.sscale);
    this.elem.style.width = Math.round((this.gameObject.size.x) * G.sscale);
    this.elem.style.height = Math.round((this.gameObject.size.y) * G.sscale);
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