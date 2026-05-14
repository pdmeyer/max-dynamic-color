# max-dynamic-color

Small helper for using Live / Max **dynamic theme colors** in **jsui**, **v8ui**, and **jspainter** scripts. It wraps `max.getcolor` with a `DynamicColor` class and validates color IDs against the same catalog Max uses (`maxcolors.json`).

Runtime is **Max’s JavaScript** (V8), not Node.js.

## Requirements

This package is aimed at **TypeScript-first** workflows where you compile to CommonJS and ship the emitted `.js` into a device or patch. That usually means a repo built around **Node + `tsc` + a devcontainer** (or equivalent), not hand-editing a single `.js` file in the Max editor.

A good starting point is Zack Steinkamp’s Max for Live TypeScript template ([m4l-typescript-base](https://github.com/zsteinkamp/m4l-typescript-base)) or [my fork](https://github.com/pdmeyer/m4l-typescript-base). Those layouts match how this library is developed and consumed (install dependency, build, copy or resolve the built file alongside your patch).

That workflow is **not** the usual way people build **jsui** / **v8ui** scripts, which are often plain JavaScript written directly in Max. You can still use the compiled output from this repo in a plain-js project by copying `dist/dynamicColor.js` and wiring `require` yourself; the requirement is really “a build step and a place for `node_modules` or copied artifacts,” not the template itself.

## Install

From Git (builds `dist/` on install via `prepare`):

```bash
npm install github:pdmeyer/max-dynamic-color
```

## Build (contributors)

```bash
yarn install
yarn build
```

Compiled output is **CommonJS** in `dist/` (`dynamicColor.js` plus `dynamicColor.d.ts`). Patch `package.json` `main` / `types` if you change layout.

## `maxcolors.json`

`DynamicColor` loads the color catalog with `Dict#import_json("maxcolors.json")`. That file must be reachable from your patch the same way other relative assets are (typically **next to your device / patch** or otherwise on Max’s search path).

Obtain a copy that matches your target Max or Live version from your installation or project template. This repository does **not** ship `maxcolors.json`; you are responsible for placing it where your patch can resolve it.

## Usage

If you installed from npm and Max resolves `node_modules` (for example via **node.script**):

```javascript
var DynamicColor = require("max-dynamic-color").DynamicColor;
var fg = new DynamicColor("live_control_fg");
var rgba = fg.rgba; // Float32Array r,g,b,a in 0..1
```

If you copy **`dist/dynamicColor.js`** into your device folder, point `require` at that path instead of the package name.

Call `update()` on instances when the theme may have changed so `rgba` refreshes on next read.

Valid IDs are checked against the loaded catalog; invalid IDs trigger Max’s `error()` and fail validation.

## TypeScript

If you author TypeScript that runs inside Max, add **`@types/maxmsp`** in your project so globals such as `max`, `Dict`, and `error` are typed. This package exposes declarations via the `types` field pointing at the emitted `dist/dynamicColor.d.ts`.

## License

MIT. See [LICENSE.md](LICENSE.md).
