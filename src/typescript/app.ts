import * as PIXI from 'pixi.js';
import * as box from 'box2d.ts';
import { GameObject } from './game_object';

export class Application {

    private _pixiApp: PIXI.Application;
    private _b2world: box.b2World;
    private _objects: Map<string, GameObject>;
    
    constructor({
        gravity = {
            x: 0,
            y: 1
        }
    }) {
        this._pixiApp = new PIXI.Application({
            width: window.screen.width,
            height: window.screen.height
        });
        document.body.appendChild(this._pixiApp.view);

        this._b2world = new box.b2World(
            new box.b2Vec2(gravity.x, gravity.y)
        );

        this._objects = this.setObjects();
    }

    public onUpdate(): void {
        this.step();
        this._objects.forEach((obj) => {
            obj.onUpdate();
        });
    }

    private setObjects(): Map<string, GameObject> {
        const objArray = new Map();

        objArray.set("DynamicObject", new GameObject(this._pixiApp.stage, this._b2world, {
            transform: {}, sprite: {}, box: {}, body: {}
        }));
        
        objArray.set("Platform", new GameObject(this._pixiApp.stage, this._b2world, {
            transform: {}, sprite: {}, box: {}, body: {}
        }));

        return objArray;
    }

    private step(): void {
        this._b2world.ClearForces();
        this._b2world.Step(1/60, 2, 6);
    }
}