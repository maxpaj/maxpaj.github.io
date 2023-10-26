/**
 * Ascii generation is based on https://github.com/hassadee/jsascii/blob/master/jsascii.js
 */

const Y_SCALE = 2;
const X_SCALE = 1;

const EMPTY_CHAR = "&nbsp;"; // &nbsp;

class AsciiEffect {
    constructor(renderer, charSet = " .:-=+*#%@", options = {}, debug = false) {
        this.resolution = options["resolution"] || 0.15; // Higher for more details
        this.iScale = options["scale"] || 1;
        this.bAlpha = options["alpha"] || false; // Transparency
        this.bBlock = options["block"] || false; // blocked characters. like good O dos
        this.strResolution = options["strResolution"] || "low";

        this.domRenderElement = document.createElement("div");
        this.domRenderElement.className = "render";
        document.body.appendChild(this.domRenderElement);

        this.charList = charSet; //(charSet || " .,:;i1tfLCG08@").split("");
        this.setAsciiRenderTargetStyle();

        this.canvas = document.createElement("canvas");
        if (debug) {
            document.body.appendChild(this.canvas);
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    getLetterSpacing() {
        if (this.strResolution == "low") {
            switch (this.iScale) {
                case 1:
                    return -1;
                case 2:
                case 3:
                    return -2.1;
                case 4:
                    return -3.1;
                case 5:
                    return -4.15;
            }
        }

        return -1;
    }

    setAsciiRenderTargetStyle() {
        this.domRenderElement.style.whiteSpace = "pre";
        this.domRenderElement.style.margin = "0px";
        this.domRenderElement.style.padding = "0px";

        let fLetterSpacing = this.getLetterSpacing();
        this.domRenderElement.style.letterSpacing = fLetterSpacing + "px";

        const fFontSize = (2 / this.resolution) * this.iScale;
        this.domRenderElement.style.fontSize = fFontSize + "px";

        const fLineHeight = (2 / this.resolution) * this.iScale;
        this.domRenderElement.style.lineHeight = fLineHeight + "px";

        const strFont = "courier new, monospace";
        this.domRenderElement.style.fontFamily = strFont;
        this.domRenderElement.style.textAlign = "left";
        this.domRenderElement.style.textDecoration = "none";
    }

    getPixelBrightness(pixelArray, x, y) {
        const iOffset = (y * this.width + x) * 4;
        return {
            red: pixelArray[iOffset],
            green: pixelArray[iOffset + 1],
            blue: pixelArray[iOffset + 2],
            alpha: pixelArray[iOffset + 3],
        };
    }

    getPixelCharacter(brightness) {
        const charIndex = Math.floor(brightness * this.charList.length);
        const pixelChar = this.charList[charIndex];
        if (pixelChar === undefined || pixelChar == " ") return EMPTY_CHAR;
        return pixelChar;
    }

    // Render ASCII based on image pixel data
    renderAscii(pixelArray, width, height) {
        let strChars = "";

        const yInc = Math.floor(Y_SCALE * 1);
        const xInc = Math.floor(X_SCALE * 1);

        for (let y = 0; y < height; y += yInc) {
            for (let x = 0; x < width; x += xInc) {
                const { red, green, blue, alpha } = this.getPixelBrightness(
                    pixelArray,
                    x,
                    y
                );

                const pixelCharacter = this.getPixelCharacter(
                    (0.3 * red + 0.59 * green + 0.11 * blue) / 255
                );

                strChars += pixelCharacter;
            }

            // Next row
            strChars += "<br/>";
        }

        return strChars;
    }

    setSize(width, height) {
        this.width = Math.floor(width * this.resolution);
        this.height = Math.floor(height * this.resolution);

        this.domRenderElement.style.width = width;
        this.domRenderElement.style.height = height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    getImagePixelArray(renderer) {
        const renderTarget = renderer.domElement;

        const canvasContext = this.canvas.getContext("2d");
        canvasContext.clearRect(0, 0, this.width, this.height);
        canvasContext.drawImage(renderTarget, 0, 0, this.width, this.height);

        const imageData = canvasContext.getImageData(
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

    getImagePixelArrayRenderTarget(renderer) {
        const renderTarget = renderer.getRenderTarget();
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

    updateDOM(ascii) {
        this.domRenderElement.innerHTML = ascii;
    }

    render(renderer) {
        // Get rendered pixels from render target'
        const { buffer, height, width } = this.getImagePixelArray(renderer);

        const renderedAscii = this.renderAscii(buffer, width, height);
        this.updateDOM(renderedAscii, width, height);
    }
}

export { AsciiEffect };
