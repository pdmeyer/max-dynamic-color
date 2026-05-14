/**
 * DynamicColor class for Max and Max for Live
 *
 * Simplifies working with dynamic theme colors within jsui, v8ui, and jspainter.
 */

interface MaxColorsJson {
  colors: Array<{ id: string }>;
}

export class DynamicColor {
  static EligibleColors: string[] | undefined;

  private _id: string;
  private _alpha: number;
  private _greyscale: boolean;
  private readonly _colorBuffer: Float32Array;
  private _needsUpdate: boolean;

  constructor(id: string, alpha: number = 1) {
    this._id = id;
    this._alpha = alpha;
    this._greyscale = false;
    this._colorBuffer = new Float32Array(4);
    this._needsUpdate = true;
  }

  get rgba(): Float32Array {
    if (this._needsUpdate) {
      const color = max.getcolor(this.id);

      this._colorBuffer[0] = color[0];
      this._colorBuffer[1] = color[1];
      this._colorBuffer[2] = color[2];
      this._colorBuffer[3] = this._alpha;

      if (this._greyscale) {
        const greyscaleFactor =
          0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
        this._colorBuffer[0] = greyscaleFactor;
        this._colorBuffer[1] = greyscaleFactor;
        this._colorBuffer[2] = greyscaleFactor;
      }
      this._needsUpdate = false;
    }

    return this._colorBuffer;
  }

  get rgb(): Float32Array {
    return this.rgba.subarray(0, 3);
  }

  set id(v: string) {
    if (DynamicColor.validateId(v)) {
      this._id = v;
      this._needsUpdate = true;
    }
  }

  get id(): string {
    return this._id;
  }

  set alpha(v: number) {
    const newAlpha = Math.max(0, Math.min(1, v));
    if (this._alpha !== newAlpha) {
      this._alpha = newAlpha;
      this._needsUpdate = true;
    }
  }

  get alpha(): number {
    return this._alpha;
  }

  set greyscale(v: boolean | number) {
    const newGreyscale = typeof v === "boolean" ? v : v !== 0;
    if (this._greyscale !== newGreyscale) {
      this._greyscale = newGreyscale;
      this._needsUpdate = true;
    }
  }

  get greyscale(): boolean {
    return this._greyscale;
  }

  set grayscale(v: boolean | number) {
    this.greyscale = v;
  }

  get grayscale(): boolean {
    return this._greyscale;
  }

  get valid(): boolean {
    return DynamicColor.validateId(this._id);
  }

  update(): void {
    this._needsUpdate = true;
  }

  static getEligibleColors(): string[] {
    DynamicColor.ensureMaxColorsLoaded();
    return DynamicColor.EligibleColors as string[];
  }

  static ensureMaxColorsLoaded(): void {
    if (!DynamicColor.EligibleColors) {
      const MaxColors = DynamicColor.importMaxColors();
      const colorCount = MaxColors.colors.length;
      DynamicColor.EligibleColors = new Array(colorCount);
      for (let i = 0; i < colorCount; i++) {
        DynamicColor.EligibleColors[i] = MaxColors.colors[i].id;
      }
    }
  }

  static importMaxColors(): MaxColorsJson {
    const d = new Dict();
    d.import_json("maxcolors.json");
    const colors = JSON.parse(d.stringify()) as MaxColorsJson;
    d.freepeer();
    return colors;
  }

  static validateId(id: string): boolean {
    DynamicColor.ensureMaxColorsLoaded();
    const eligible = DynamicColor.EligibleColors as string[];

    if (typeof id === "string" && eligible.indexOf(id) !== -1) {
      return true;
    }
    error("Color ID is invalid.\n");
    return false;
  }
}
