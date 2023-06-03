document.addEventListener("DOMContentLoaded", function () {
    let el = document.getElementsByTagName("img");

    Object.values(el).forEach(function (el) {
        var img = new Image();
        img.onload = function () {
            el.style.opacity = 1;
        };
        img.src = el.src;
    });
});

function generateSquares() {
    for (let i = 0; i < 20; i++) {
        generateSquare(
            "square-first",
            ".squares-first",
            50 + 250 * Math.random()
        );
    }

    for (let i = 0; i < 10; i++) {
        generateSquare(
            "square-second",
            ".squares-second",
            50 + 250 * Math.random() * i
        );
    }

    // generateSquare("square-first", "footer");
}

function generateSquare(
    className = "square square-first",
    parent = ".squares",
    size = 50 + 500 * Math.random()
) {
    const newEl = document.createElement("div");
    newEl.classList.add("square");
    newEl.classList.add(className);

    newEl.style.width = `${size}px`;
    newEl.style.height = `${size}px`;

    const cssLeft = `calc(${Math.random() * 100}vw - ${Math.random() * size}px`;
    const cssTop = `calc(${Math.random() * 100}vh - ${Math.random() * size}px`;

    newEl.style.left = cssLeft;
    newEl.style.top = cssTop;

    const parentEl = document.querySelector(parent);
    if (!parentEl) return;

    parentEl.appendChild(newEl);
}
