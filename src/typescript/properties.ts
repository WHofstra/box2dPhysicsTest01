export enum BodyTypes {
    STATIC = 0,
    KINEMATIC = 1,
    DYNAMIC = 2,
}

export interface Transform {
    position: Vector;
    rotation: number;
    scale: Vector;
}

export interface Vector {
    x: number;
    y: number;
}

export interface LineStyle {
    width: number;
    alignment?: number | undefined;
    native?: boolean | undefined;
}

export class Color {
    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number;

    public get r(): number { return this._red; }
    public get g(): number { return this._green; }
    public get b(): number { return this._blue; }
    public get a(): number { return this._alpha; }

    public get hex(): string {
        const red = this.rgbToHex(this._red);
        const green = this.rgbToHex(this._green);
        const blue = this.rgbToHex(this._blue);
    
        return red + green + blue;
    }

    public get hexCode(): number {
        return Number.parseInt("0x" + this.hex);
    }

    constructor(
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 1
    ) {
        this._red = r;
        this._green = g;
        this._blue = b;
        this._alpha = a;
    }

    public static black(): Color {
        return new Color(0, 0, 0, 1);
    }

    public static white(): Color {
        return new Color(255, 255, 255, 1);
    }

    public static red(): Color {
        return new Color(255, 0, 0, 1);
    }

    public static green(): Color {
        return new Color(0, 255, 0, 1);
    }

    public static blue(): Color {
        return new Color(0, 0, 255, 1);
    }

    public static yellow(): Color {
        return new Color(255, 255, 0, 1);
    }

    public static magenta(): Color {
        return new Color(255, 0, 255, 1);
    }

    public static cyan(): Color {
        return new Color(0, 255, 255, 1);
    }

    private rgbToHex(rgb: number): string {
        let hex = Number(rgb).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}