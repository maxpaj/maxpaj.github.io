document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < 3; i++) {
        generateSquare("square-first", ".squares-first");
        generateSquare("square-second", ".squares-second");
    }
});

function generateSquare(
    className = "square square-first",
    parent = ".squares"
) {
    const newEl = document.createElement("div");
    newEl.classList.add("square");
    newEl.classList.add(className);

    const size = 500 * Math.random();
    newEl.style.width = `${size}px`;
    newEl.style.height = `${size}px`;

    const cssLeft = `calc(${Math.random() * 100}vw - ${Math.random() * size}px`;
    const cssTop = `calc(${Math.random() * 100}vh - ${Math.random() * size}px`;

    newEl.style.left = cssLeft;
    newEl.style.top = cssTop;

    document.querySelector(parent).appendChild(newEl);
}
