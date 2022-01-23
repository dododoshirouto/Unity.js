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


    constructor() {
        super();

        this.addTags('player');

        this.components.RectRenderer.fill = "darkgreen";
        this.components.RectRenderer.stroke = "blue";
    }
}