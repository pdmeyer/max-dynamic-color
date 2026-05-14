/**
 * DynamicColor class for Max and Max for Live
 *
 * Simplifies working with dynamic theme colors within jsui, v8ui, and jspainter.
 */
interface MaxColorsJson {
    colors: Array<{
        id: string;
    }>;
}
export declare class DynamicColor {
    static EligibleColors: string[] | undefined;
    private _id;
    private _alpha;
    private _greyscale;
    private readonly _colorBuffer;
    private _needsUpdate;
    constructor(id: string, alpha?: number);
    get rgba(): Float32Array;
    get rgb(): Float32Array;
    set id(v: string);
    get id(): string;
    set alpha(v: number);
    get alpha(): number;
    set greyscale(v: boolean | number);
    get greyscale(): boolean;
    set grayscale(v: boolean | number);
    get grayscale(): boolean;
    get valid(): boolean;
    update(): void;
    static getEligibleColors(): string[];
    static ensureMaxColorsLoaded(): void;
    static importMaxColors(): MaxColorsJson;
    static validateId(id: string): boolean;
}
export {};
