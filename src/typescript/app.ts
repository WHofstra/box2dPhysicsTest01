import * as PIXI from 'pixi.js';
import * as box from 'box2d.ts';
import { GameObject } from './game_object';
import { BodyTypes } from './properties';

export class Application {

    private _pixiApp: PIXI.Application;
    private _b2world: box.b2World;
    private _loader: PIXI.Loader;

    private _objects!: Map<string, GameObject>;
    private _isLoaded: boolean;

    private get loader(): PIXI.Loader {
        if (!this._loader)
        throw new Error(`Application does not contain a loader.`);
        return this._loader;
    }
    
    constructor({
        gravity = {
            x: 0,
            y: 50
        }
    }) {
        this._isLoaded = false;

        this._pixiApp = new PIXI.Application({
            width: window.screen.width,
            height: window.screen.height
        });
        document.body.appendChild(this._pixiApp.view);

        this._b2world = new box.b2World(
            new box.b2Vec2(gravity.x, gravity.y)
        );

        this._loader = this.setLoader();
        this.onLoadItems();
    }

    public onUpdate(): void {
        this.step();
        this._objects?.forEach((obj) => {
            obj.onUpdate();
        });
    }

    private setLoader(): PIXI.Loader {
        let loader: PIXI.Loader;

        if (!this._isLoaded) {
            loader = PIXI.Loader.shared;
            this._isLoaded = true;
        }
        else {
            loader = this.loader;
        }

        return loader;
    }

    private onLoadItems(){
        this.loader.add("player", "assets/images/player.png");
        this.loader.add("button", "assets/images/start-button.png");
        this.loader.load();
        this.loader.onComplete.add(() => {this._objects = this.setObjects()});
    }

    private getResource(index: string): PIXI.Texture<PIXI.CanvasResource> {
        const texture = this.loader.resources[index].texture;

        if (texture) {return texture as PIXI.Texture<PIXI.CanvasResource>;}
        return PIXI.Texture.WHITE;
    }

    private setObjects(): Map<string, GameObject> {
        const objArray = new Map();

        objArray.set("DynamicObject", new GameObject(this._pixiApp.stage, this._b2world, {
            transform: {
                position: { x: 50, y: 20 },
                scale:    { x: 0.4, y: 0.4 }
            },
            sprite: {
                src: this.getResource("player")
            },
            box: {
                width: 362,
                height: 166
            },
            body: {
                bodyType: BodyTypes.DYNAMIC,
                density: 5.0
            }
        }));
        
        objArray.set("Platform", new GameObject(this._pixiApp.stage, this._b2world, {
            transform: {
                position: { x: 40, y: 50 },
                scale:    { x: 0.4, y: 0.2 }
            },
            sprite: {
                src: this.getResource("button")
            },
            box: {
                width: 436,
                height: 149
            },
            body: {
                bodyType: BodyTypes.STATIC,
                density: 0.0
            }
        }));

        return objArray;
    }

    private step(): void {
        this._b2world.ClearForces();
        this._b2world.Step(1/60, 2, 6);
    }
}