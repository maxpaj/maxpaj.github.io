/**
 * Ascii generation is based on https://github.com/hassadee/jsascii/blob/master/jsascii.js
 */

import { WebGLRenderer } from "three";

const Y_SCALE = 2;
const X_SCALE = 1;

const CELL_SIZE_WIDTH = 16;
const CELL_SIZE_HEIGHT = 21;

const DEFAULT_BUFFER_WIDTH = 500;
const DEFAULT_BUFFER_HEIGHT = 500;

type AsciiEffectOptions = {
    debug?: boolean;
    enabled?: boolean;
};

class AsciiEffect {
    /**
     * Enable/disable debug mode
     */
    debug: boolean;

    /**
     * Enable/disable rendering
     */
    enabled: boolean;

    /**
     * List of characters to use for ASCII rendering
     */
    charList: string[];

    domRenderElement: HTMLElement;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D | null;

    windowWidth: number = 0;
    windowHeight: number = 0;

    tableHeight: number = 0;
    tableWidth: number = 0;

    constructor(
        charSet = " .:-=+*#%@",
        { debug, enabled }: AsciiEffectOptions = {},
        attachElement: HTMLElement = document.body
    ) {
        this.debug = debug || true; // TODO: set to false
        this.charList = charSet.split("");
        this.enabled = enabled !== false;

        this.domRenderElement = document.createElement("table");
        this.domRenderElement.className = "ascii";
        this.setAsciiRenderTargetStyle(this.domRenderElement);
        attachElement.appendChild(this.domRenderElement);

        this.canvas = document.createElement("canvas");
        this.canvas.width = DEFAULT_BUFFER_WIDTH;
        this.canvas.height = DEFAULT_BUFFER_HEIGHT;

        if (debug) {
            this.canvas.style.position = "fixed";
            this.canvas.style.bottom = "0";
            this.canvas.style.border = "1px solid red";
            attachElement.appendChild(this.canvas);
        }

        this.canvasContext = this.canvas.getContext("2d");
    }

    setAsciiRenderTargetStyle(asciiRenderElement: HTMLElement) {
        asciiRenderElement.style.whiteSpace = "pre";
        asciiRenderElement.style.margin = "0px";
        asciiRenderElement.style.padding = "0px";
        asciiRenderElement.style.maxHeight = "100vh";
        asciiRenderElement.style.overflow = "hidden";
        asciiRenderElement.style.width = "100%";
        asciiRenderElement.style.height = "100%";
        asciiRenderElement.style.tableLayout = "fixed";

        let letterSpacing = 5;
        asciiRenderElement.style.letterSpacing = letterSpacing + "px";

        const fontSize = CELL_SIZE_WIDTH;
        asciiRenderElement.style.fontSize = fontSize + "px";

        const lineHeight = CELL_SIZE_HEIGHT;
        asciiRenderElement.style.lineHeight = lineHeight + "px";
    }

    setWindowSize(windowWidth: number, windowHeight: number) {
        this.domRenderElement.style.width = `${windowWidth.toString()}px`;
        this.domRenderElement.style.height = `${windowHeight.toString()}px`;

        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        this.tableHeight = Math.floor(windowHeight / CELL_SIZE_HEIGHT);
        this.tableWidth = Math.floor(windowWidth / CELL_SIZE_WIDTH);

        // Construct the tree of rows and cols
        this.domRenderElement.innerHTML = new Array(this.tableHeight)
            .fill(0)
            .map(
                (_) =>
                    "<tr>" +
                    new Array(this.tableWidth)
                        .fill(0)
                        .map(
                            (_) =>
                                `<td style="overflow: hidden; width: ${CELL_SIZE_WIDTH}px; height: ${CELL_SIZE_HEIGHT}px">0</td>`
                        )
                        .join("") +
                    "</tr>"
            )
            .join("");
    }

    getImagePixelArray(renderer: WebGLRenderer) {
        const renderTarget = renderer.domElement;

        if (this.canvasContext == null) {
            throw new Error("Canvas context does not exist");
        }

        this.canvasContext.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.canvasContext.drawImage(
            renderTarget,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        const imageData = this.canvasContext.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ).data;

        return {
            buffer: imageData,
            bufferWidth: this.canvas.width,
            bufferHeight: this.canvas.height,
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

    getPixelColors(pixelArray: Uint8ClampedArray, x: number, y: number) {
        const iOffset = (y * this.canvas.width + x) * 4;

        return {
            red: pixelArray[iOffset],
            green: pixelArray[iOffset + 1],
            blue: pixelArray[iOffset + 2],
            alpha: pixelArray[iOffset + 3],
        };
    }

    getPixelCharacter(brightness: number) {
        const charIndex = Math.floor(brightness * this.charList.length - 1);
        return this.charList[charIndex] || " ";
    }

    // Render ASCII based on image pixel data
    renderAscii(
        pixelArray: Uint8ClampedArray,
        bufferWidth: number,
        bufferHeight: number,
        renderCell: (col: number, row: number, char: string) => void,
        renderRow: (row: number) => void
    ) {
        const xInc = Math.floor(bufferWidth / this.tableWidth);
        const yInc = Math.floor(bufferHeight / this.tableHeight);

        // Skip over pixels depending on the resolution of the ASCII rendered
        for (let bufferRow = 0; bufferRow < bufferHeight; bufferRow += yInc) {
            for (
                let bufferCol = 0;
                bufferCol < bufferWidth;
                bufferCol += xInc
            ) {
                const { red, green, blue, alpha } = this.getPixelColors(
                    pixelArray,
                    bufferCol,
                    bufferRow
                );

                const pixelGrayScale =
                    (0.3 * red + 0.59 * green + 0.11 * blue) / 255;

                const pixelCharacter = this.getPixelCharacter(pixelGrayScale);

                // Render out the ASCII
                renderCell(
                    Math.floor(bufferCol / xInc),
                    Math.floor(bufferRow / yInc),
                    pixelCharacter
                );
            }

            renderRow(Math.floor(bufferRow / yInc));
        }
    }

    render(renderer: WebGLRenderer) {
        // Get rendered pixels from render target
        if (!this.enabled) {
            return;
        }

        const {
            buffer: pixelArray,
            bufferWidth,
            bufferHeight,
        } = this.getImagePixelArray(renderer);

        const tableRows = this.domRenderElement.firstChild!.childNodes;

        const updateTableCell = (col: number, row: number, char: string) => {
            const tableRow = tableRows.item(row);
            if (!tableRow) {
                return;
            }

            const tableColumn = tableRow.childNodes.item(col);
            if (!tableColumn) {
                return;
            }

            tableColumn.firstChild!.textContent = char;
        };

        let renderedHtml = "";

        const renderTableCell = (col: number, row: number, char: string) => {
            renderedHtml += char;
        };

        const renderTableRow = (row: number) => {
            renderedHtml += "<br />";
        };

        this.renderAscii(
            pixelArray,
            bufferWidth,
            bufferHeight,
            renderTableCell,
            renderTableRow
        );

        this.domRenderElement.innerHTML = renderedHtml;
    }
}

export { AsciiEffect };
