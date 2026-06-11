"use strict";
/**
 * DynamicColor class for Max and Max for Live
 *
 * Simplifies working with dynamic theme colors within jsui, v8ui, and jspainter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicColor = void 0;
var DynamicColor = /** @class */ (function () {
    function DynamicColor(id, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this._id = id;
        this._alpha = alpha;
        this._greyscale = false;
        this._colorBuffer = new Float32Array(4);
        this._needsUpdate = true;
    }
    Object.defineProperty(DynamicColor.prototype, "rgba", {
        get: function () {
            if (this._needsUpdate) {
                var color = max.getcolor(this.id);
                this._colorBuffer[0] = color[0];
                this._colorBuffer[1] = color[1];
                this._colorBuffer[2] = color[2];
                this._colorBuffer[3] = this._alpha;
                if (this._greyscale) {
                    var greyscaleFactor = 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
                    this._colorBuffer[0] = greyscaleFactor;
                    this._colorBuffer[1] = greyscaleFactor;
                    this._colorBuffer[2] = greyscaleFactor;
                }
                this._needsUpdate = false;
            }
            return [this._colorBuffer[0], this._colorBuffer[1], this._colorBuffer[2], this._colorBuffer[3]];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicColor.prototype, "rgb", {
        get: function () {
            return [this.rgba[0], this.rgba[1], this.rgba[2]];
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(DynamicColor.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (v) {
            if (DynamicColor.validateId(v)) {
                this._id = v;
                this._needsUpdate = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicColor.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (v) {
            var newAlpha = Math.max(0, Math.min(1, v));
            if (this._alpha !== newAlpha) {
                this._alpha = newAlpha;
                this._needsUpdate = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicColor.prototype, "greyscale", {
        get: function () {
            return this._greyscale;
        },
        set: function (v) {
            var newGreyscale = typeof v === "boolean" ? v : v !== 0;
            if (this._greyscale !== newGreyscale) {
                this._greyscale = newGreyscale;
                this._needsUpdate = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicColor.prototype, "grayscale", {
        get: function () {
            return this._greyscale;
        },
        set: function (v) {
            this.greyscale = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicColor.prototype, "valid", {
        get: function () {
            return DynamicColor.validateId(this._id);
        },
        enumerable: false,
        configurable: true
    });
    DynamicColor.prototype.update = function () {
        this._needsUpdate = true;
    };
    DynamicColor.getEligibleColors = function () {
        DynamicColor.ensureMaxColorsLoaded();
        return DynamicColor.EligibleColors;
    };
    DynamicColor.ensureMaxColorsLoaded = function () {
        if (!DynamicColor.EligibleColors) {
            var MaxColors = DynamicColor.importMaxColors();
            var colorCount = MaxColors.colors.length;
            DynamicColor.EligibleColors = new Array(colorCount);
            for (var i = 0; i < colorCount; i++) {
                DynamicColor.EligibleColors[i] = MaxColors.colors[i].id;
            }
        }
    };
    DynamicColor.importMaxColors = function () {
        var d = new Dict();
        d.import_json("maxcolors.json");
        var colors = JSON.parse(d.stringify());
        d.freepeer();
        return colors;
    };
    DynamicColor.validateId = function (id) {
        DynamicColor.ensureMaxColorsLoaded();
        var eligible = DynamicColor.EligibleColors;
        if (typeof id === "string" && eligible.indexOf(id) !== -1) {
            return true;
        }
        error("Color ID is invalid.\n");
        return false;
    };
    return DynamicColor;
}());
exports.DynamicColor = DynamicColor;
