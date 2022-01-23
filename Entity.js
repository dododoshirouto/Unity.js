class Entity extends GameObject {

    hp = 0;
    attack = 0;
    atkRange = 0;
    moveRange = 0;
    defence = 0;

    moveTarget = null;
    atkTarget = null;

    constructor() {
        super();
        this.addTags('entity');

        this.pos = new Vector2(Math.random()*1280, 0);
        this.size = new Vector2(100, 100);

        this.addComponent(new RectRenderer());

        this.addComponent(new RectCollider());
        this.components.RectCollider.size = new Vector2(100, 100);

        this.addComponent(new Rigidbody());
        this.components.Rigidbody.collisionableTags = ['ground'];
    }
}



class Enemy extends Entity {


    constructor() {
        super();

        this.addTags('enemy');

        this.components.RectRenderer.fill = ['darkblue', 'darkgoldenrod', 'darkred', 'darkcyan', 'darkmagenta'][Math.floor(Math.random()*5)];
        this.components.RectRenderer.stroke = "red";
    }
}



class Player extends Entity {

    moveSpeedX = 300;
    jumpPower = 1000;

    isJumpping = false;

    constructor() {
        super();

        this.addTags('player');

        this.components.RectRenderer.fill = "darkgreen";
        this.components.RectRenderer.stroke = "blue";
        this.components.RectRenderer.index = 500;
    }

    update() {
        this.components.Rigidbody.vel.x = G.directionInput.x * 300;

        if (G.pressedKeys.Space && this.components.Rigidbody.isCollision) this.components.Rigidbody.addForce(0, -1000);

        super.update();
    }
}