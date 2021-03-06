import * as PIXI from 'pixi.js';
import * as box from 'box2d.ts';
import {
    BodyTypes,
    Transform,
    Vector,
    LineStyle,
    Color
} from './properties';

const BODY_SCALE = 10.5;

export class GameObject {

    private _transform: Transform;
    private _box: PIXI.Rectangle;

    private _sprite!: PIXI.Sprite;
    private _boxColliderShape!: PIXI.Graphics;
    private _body!: box.b2Body;

    public get sprite(): PIXI.Sprite {
        if (!this._sprite)
        throw new Error(`GameObject does not contain a sprite.`);
        return this._sprite;
    }

    public get boxColliderShape(): PIXI.Graphics {
        if (!this._boxColliderShape)
        throw new Error(`GameObject does not contain a visual collider shape.`);
        return this._boxColliderShape;
    }

    public get body(): box.b2Body {
        if (!this._body)
        throw new Error(`GameObject does not contain a b2Body.`);
        return this._body;
    }

    private get bodyTransform(): Transform {
        const position = this.toVector(this.body.GetPosition());
        position.x *= BODY_SCALE;
        position.y *= BODY_SCALE;

        return {
            position: position,
            rotation: box.b2RadToDeg(this.body.GetAngle()),
            scale: this._transform.scale
        };
    }

    constructor(
        container: PIXI.Container,
        world: box.b2World,
        {
            transform: {
                position = { x: 0, y: 0 } as Vector,
                rotation = 0,
                scale = { x: 1, y: 1 } as Vector
            },
            sprite: {
                src = PIXI.Texture.WHITE,
                pivot = { x: 0.5, y: 0.5 } as Vector
            },
            box: {
                width = 0,
                height = 0,
                color = Color.red(),
                lineStyle = {
                    width: 3,
                    alignment: 0,
                    native: undefined
                } as LineStyle
            },
            body: {
                bodyType = BodyTypes.STATIC,
                density = 0.0
            }
        }
    ) {
        this._transform = {
            position: position,
            rotation: rotation,
            scale: scale
        };

        this._box              = this.initBox(width, height, pivot);
        this._sprite           = this.initSprite(src, pivot);
        this._boxColliderShape = this.initBoxColliderShape(color, lineStyle);
        this._body             = this.initBody(world, bodyType, density);

        container.addChild(this.sprite);
        container.addChild(this.boxColliderShape);
    }

    public onUpdate(): void {
        this.setTransform(this.bodyTransform);
    }

    private initBox(
        width: number,
        height: number,
        pivot: Vector
    ): PIXI.Rectangle {
        return new PIXI.Rectangle(
            -width * pivot.x,
            -height * pivot.y,
            width,
            height
        );
    }

    private initSprite(
        src: PIXI.Texture,
        pivot: Vector
    ): PIXI.Sprite {
        const sprite = new PIXI.Sprite(src);
        sprite.anchor.set(pivot.x, pivot.y);

        return sprite;
    }

    private initBoxColliderShape(
        color: Color,
        lineStyle: LineStyle
    ): PIXI.Graphics {
        const shape = new PIXI.Graphics();
        shape.lineStyle(
            lineStyle.width,
            color.hexCode,
            color.a,
            lineStyle.alignment,
            lineStyle.native
        );
        shape.drawShape(this._box);

        return shape;
    }

    private initBody(
        world: box.b2World,
        bodyType: BodyTypes,
        density: number
    ): box.b2Body {
        const vertices = this.toXYArray(this._box, this._transform.scale);
        const position = this._transform.position;

        const shape = new box.b2PolygonShape();
        shape.SetAsArray(vertices);

        const bodyDef = new box.b2BodyDef();
        bodyDef.type = bodyType.valueOf();

        const body = world.CreateBody(bodyDef);
        body.CreateFixture(shape, density);
        body.SetTransformVec({
            x: position.x,
            y: position.y },
            this._transform.rotation
        );

        return body;
    }

    private toXYArray(
        colliderShape: PIXI.Rectangle,
        scale: Vector = { x: 1, y: 1 }
    ): Array<box.XY> {
        const vectorList = new Array<box.XY>();
        const objectScale = 1 / BODY_SCALE;

        vectorList.push({ 
            x: colliderShape.x * objectScale * scale.x,
            y: colliderShape.y * objectScale * scale.y
        });
        vectorList.push({ 
            x: colliderShape.width * objectScale * scale.x * 0.5,
            y: colliderShape.y * objectScale * scale.y
        });
        vectorList.push({ 
            x: colliderShape.width * objectScale * scale.x * 0.5,
            y: colliderShape.height * objectScale * scale.y * 0.5
        });
        vectorList.push({ 
            x: colliderShape.x * objectScale * scale.x,
            y: colliderShape.height * objectScale * scale.y * 0.5
        });

        return vectorList;
    }

    private toVector(vector: box.XY | box.b2Vec2): Vector {
        return {
            x: vector.x,
            y: vector.y
        };
    }

    private setTransform(transform: Transform): void {
        this._transform = transform;

        this.sprite.position.set(transform.position.x, transform.position.y);
        this.sprite.angle = transform.rotation;
        this.sprite.scale.set(transform.scale.x, transform.scale.y);

        this.boxColliderShape.position.set(transform.position.x, transform.position.y);
        this.boxColliderShape.angle = transform.rotation;
        this.boxColliderShape.scale.set(transform.scale.x, transform.scale.y);
    }
}