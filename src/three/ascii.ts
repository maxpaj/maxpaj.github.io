/**
 * Ascii generation is based on https://github.com/hassadee/jsascii/blob/master/jsascii.js
 */

import { WebGLRenderer } from "three";

const Y_SCALE = 2;
const X_SCALE = 1;

const EMPTY_CHAR = "&nbsp;"; // &nbsp;

type AsciiEffectOptions = {
    resolution?: number;
    scale?: number;
    invert?: boolean;
    alpha?: boolean;
};

class AsciiEffect {
    resolution: number;
    scale: number;
    charList: string[];

    currentRender: Uint8Array;

    domRenderElement: HTMLElement;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D | null;

    width: number = 0;
    height: number = 0;

    constructor(
        charSet = " .:-=+*#%@",
        options: AsciiEffectOptions = {},
        attachElement: HTMLElement = document.body,
        debug = true
    ) {
        this.resolution = options.resolution || 0.15;
        this.scale = options.scale || 1;

        this.domRenderElement = document.createElement("div");
        this.domRenderElement.className = "render";
        attachElement.appendChild(this.domRenderElement);

        this.charList = charSet.split("");
        this.setAsciiRenderTargetStyle();

        this.canvas = document.createElement("canvas");
        if (debug) {
            attachElement.appendChild(this.canvas);
        }

        this.canvasContext = this.canvas.getContext("2d", {
            willReadFrequently: true,
        });

        this.currentRender = new Uint8Array(0);
    }

    setAsciiRenderTargetStyle() {
        this.domRenderElement.style.whiteSpace = "pre";
        this.domRenderElement.style.margin = "0px";
        this.domRenderElement.style.padding = "0px";

        let letterSpacing = -1;
        this.domRenderElement.style.letterSpacing = letterSpacing + "px";

        const fontSize = (2 / this.resolution) * this.scale;
        this.domRenderElement.style.fontSize = fontSize + "px";

        const lineHeight = (2 / this.resolution) * this.scale;
        this.domRenderElement.style.lineHeight = lineHeight + "px";
    }

    getPixelColors(pixelArray: Uint8ClampedArray, x: number, y: number) {
        const iOffset = (y * this.width + x) * 4;

        return {
            red: pixelArray[iOffset],
            green: pixelArray[iOffset + 1],
            blue: pixelArray[iOffset + 2],
            alpha: pixelArray[iOffset + 3],
        };
    }

    getPixelCharacter(brightness: number) {
        const charIndex = Math.floor(brightness * this.charList.length);
        const pixelChar = this.charList[charIndex];
        if (pixelChar === undefined || pixelChar == " ") return EMPTY_CHAR;
        return pixelChar;
    }

    // Render ASCII based on image pixel data
    renderAscii(
        pixelArray: Uint8ClampedArray,
        width: number,
        height: number,
        renderFunction: (x: number, y: number, char: string) => void
    ) {
        const yInc = Math.floor(Y_SCALE * 1);
        const xInc = Math.floor(X_SCALE * 1);

        // Skip over pixels depending on the resolution of the ASCII rendered
        for (let y = 0; y < height; y += yInc) {
            for (let x = 0; x < width; x += xInc) {
                const { red, green, blue, alpha } = this.getPixelColors(
                    pixelArray,
                    x,
                    y
                );

                const pixelCharacter = this.getPixelCharacter(
                    (0.3 * red + 0.59 * green + 0.11 * blue) / 255
                );

                if (pixelCharacter === EMPTY_CHAR) {
                    renderFunction(
                        Math.floor(x / xInc),
                        Math.floor(y / yInc),
                        " "
                    );
                    continue;
                }

                // Render out the ASCII
                renderFunction(
                    Math.floor(x / xInc),
                    Math.floor(y / yInc),
                    pixelCharacter
                );
            }
        }
    }

    setSize(width: number, height: number) {
        this.currentRender = new Uint8Array(width * height);

        this.width = Math.floor(width * this.resolution);
        this.height = Math.floor(height * this.resolution);

        this.domRenderElement.style.width = width.toString();
        this.domRenderElement.style.height = height.toString();

        // Construct the tree of rows and cols
        this.domRenderElement.innerHTML = new Array(this.height)
            .fill(0)
            .map(
                (_) =>
                    "<div>" +
                    new Array(this.width)
                        .fill(0)
                        .map((_) => "<i></i>")
                        .join("") +
                    "</div>"
            )
            .join("");

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    getImagePixelArray(renderer: WebGLRenderer) {
        const renderTarget = renderer.domElement;

        if (this.canvasContext == null) {
            throw new Error("Canvas context does not exist");
        }

        this.canvasContext.clearRect(0, 0, this.width, this.height);
        this.canvasContext.drawImage(
            renderTarget,
            0,
            0,
            this.width,
            this.height
        );

        const imageData = this.canvasContext.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        return {
            buffer: imageData,
            width: this.width,
            height: this.height,
        };
    }

    getImagePixelArrayRenderTarget(renderer: WebGLRenderer) {
        const renderTarget = renderer.getRenderTarget();
        if (renderTarget == null) {
            throw new Error("No render target available");
        }

        const buffer = new Uint8Array(
            renderTarget.width * renderTarget.height * 4
        );

        // Read rendered pixels from render
        renderer.readRenderTargetPixels(
            renderTarget,
            0,
            0,
            renderTarget.width,
            renderTarget.height,
            buffer
        );

        return {
            buffer,
            height: renderTarget.height,
            width: renderTarget.width,
        };
    }

    render(renderer: WebGLRenderer) {
        // Get rendered pixels from render target
        const { buffer, height, width } = this.getImagePixelArray(renderer);
        const children = this.domRenderElement.childNodes;

        this.renderAscii(buffer, width, height, (x, y, char) => {
            const child = children.item(y).childNodes.item(x);
            if (!child) {
                return;
            }

            if (child.textContent === char) {
                return;
            }

            child.textContent = char;
        });
    }
}

export { AsciiEffect };
