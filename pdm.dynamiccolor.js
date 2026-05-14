/*
 * pdm.dynamiccolor.js
 * by Philip Meyer, 2025
*/

/**
 * DynamicColor class for Max and Max for Live
 * 
 * Simplifies working with dynamic theme colors within jsui, v8ui, and jspainter.
 * 
 * @example
 * // Define a color
 * var myColor = new DynamicColor('live_display_handle_one');
 * 
 * // Get the rgba values
 * var rgba = myColor.rgba;
 * post('myColor rgba', rgba,'\n')
 * mgraphics.set_source_rgba(rgba);
 * 
 * // Update the ID or alpha of the color, or convert to grayscale
 * myColor.id = 'live_display_scale_text'; // change the color
 * myColor.grayscale = 1; // make it grayscale
 * myColor.alpha = 0.5 // add transparency
 * 
 * // In the patcher, use a live.colors to notify when the theme has changed
 * // Then, call the `update` method of the DynamicColor to get the updated rgba values
 * function update_colors() {
 *  myColor.update();
 *  var rgba = myColor.rgba
 *  post('rgba values changed to', rgba','\n');
 * }
 * 
 */

class DynamicColor {
    constructor(id, alpha = 1.) {
        this._id = id;
        this._alpha = alpha;
        this._greyscale = false;    
        this._colorBuffer = new Float32Array(4);
        this._needsUpdate = true;

        // this._autoUpdate = 0;
    }

    get rgba() {
        // Only recalculate if color has changed
        if (this._needsUpdate) {
            var color = max.getcolor(this.id);
            
            // Copy to TypedArray and set alpha
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
            // if(this._autoUpdate > 0) {
                this._needsUpdate = false;
            // }
        }
        
        return this._colorBuffer;
    }

    get rgb() {
        return this.rgba.slice(0, 3);
    }

    set id(v) {
        if(DynamicColor.validateId(v)) {
            this._id = v;
            this._needsUpdate = true;
        }
    }

    get id() {
        return this._id;
    }

    set alpha(v) {
        const newAlpha = Math.max(0, Math.min(1, v));
        if (this._alpha !== newAlpha) {
            this._alpha = newAlpha;
            this._needsUpdate = true;
        }
    }
    
    get alpha() {
        return this._alpha;
    }

    set greyscale(v) {
        const newGreyscale = v != 0;
        if (this._greyscale !== newGreyscale) {
            this._greyscale = newGreyscale;
            this._needsUpdate = true;
        }
    }

    get greyscale() {
        return this._greyscale;
    }

    set grayscale(v) {
        this.greyscale = v;
    }

    get grayscale() {
        return this_greyscale;
    }

    get valid() {
        return DynamicColor.validateId(this._id)
    }

    // set autoUpdate(v) {
    //     this._autoUpdate = v != 0;
    // }
    
    // get autoUpdate() {
    //     return this._autoUpdate;
    // }

    // call when Max colors change
    update() {
        this._needsUpdate = true;
    }

    static getEligibleColors() {
        DynamicColor.ensureMaxColorsLoaded();
        return exports.DynamicColor.EligibleColors;
    }

    static ensureMaxColorsLoaded() {
        if (!exports.DynamicColor.EligibleColors) {
            exports.DynamicColor.EligibleColors = [];
            const MaxColors = DynamicColor.importMaxColors();
            const colorCount = MaxColors.colors.length;
            exports.DynamicColor.EligibleColors = new Array(colorCount);
            for (let i = 0; i < colorCount; i++) {
                exports.DynamicColor.EligibleColors[i] = MaxColors.colors[i].id;
            }
        }
    }

    static importMaxColors() {
        const d = new Dict();
        d.import_json('maxcolors.json')
        const colors = JSON.parse(d.stringify());
        d.freepeer();
        return colors;
    }

    static validateId(id) {
        DynamicColor.ensureMaxColorsLoaded();
    
        if (typeof id === 'string' && exports.DynamicColor.EligibleColors.includes(id)) {
            return true
        }
        error('Color ID is invalid.\n');
        return false;
    } 
}

exports.DynamicColor = DynamicColor;