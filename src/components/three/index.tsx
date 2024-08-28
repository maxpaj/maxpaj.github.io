"use client";

import { AsciiEffect } from "@/components/three/ascii";
import { useEffect, useRef } from "react";
import {
    BoxGeometry,
    Color,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    renderTarget: WebGLRenderTarget,
    orbitControls: OrbitControls,
    box: Mesh,
    effect: AsciiEffect,
    stopped = true,
    isDragging = false,
    lastRender = new Date().getTime();

export function ThreeBackground() {
    const refContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function init() {
            console.log("starting...");

            if (refContainer.current === null) {
                throw new Error("Ref empty");
            }

            camera = new PerspectiveCamera(
                70,
                window.innerWidth / window.innerHeight,
                1,
                1000
            );

            camera.position.y = 100;
            camera.position.z = 500;
            camera.position.x = 0;

            scene = new Scene();
            scene.background = new Color(0, 0, 0);

            const pointLight1 = new PointLight(0xffffff, 3, 0, 0);
            pointLight1.position.set(500, 500, 0);
            scene.add(pointLight1);

            const pointLight2 = new PointLight(0xffffff, 1, 0, 0);
            pointLight2.position.set(-500, 500, 500);
            scene.add(pointLight2);

            let shader = new MeshStandardMaterial({
                metalness: 1, // between 0 and 1
                roughness: 0.5, // between 0 and 1
            });

            box = new Mesh(new BoxGeometry(200, 200, 200), shader);
            scene.add(box);

            renderer = new WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Clear container
            refContainer.current.innerHTML = "";

            effect = new AsciiEffect(" .:-+*=%@#", {}, refContainer.current);

            effect.setWindowSize(window.innerWidth, window.innerHeight);

            // Append the canvas
            refContainer.current.appendChild(effect.domRenderElement);

            orbitControls = new OrbitControls(camera, refContainer.current);
            orbitControls.minDistance = 500;
            orbitControls.maxDistance = 500;
            orbitControls.enableDamping = true;
            orbitControls.addEventListener("start", () => {
                isDragging = true;
            });

            orbitControls.addEventListener("end", () => {
                isDragging = false;
            });

            window.addEventListener("resize", onWindowResize);

            stopped = false;

            renderer.setAnimationLoop(step);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            effect.setWindowSize(window.innerWidth, window.innerHeight);
        }

        function step(timeElapsed: number = 0) {
            if (stopped) {
                return;
            }

            render();
        }

        function stopAnimate() {
            console.log("stopped.");
            stopped = true;
        }

        function render() {
            const delta = new Date().getTime() - lastRender;
            lastRender = new Date().getTime();

            if (!isDragging) {
                box.rotation.x -= -delta * 0.0003;
                box.rotation.z += delta * 0.0002;
                box.rotation.y += delta * 0.0002;
            }

            renderer.render(scene, camera);
            effect.render(renderer);
        }

        if (renderer) {
            return;
        }

        console.log("init!");

        init();

        return () => {
            console.log("stop!");
        };
    }, []);

    return (
        <div
            className="absolute top-0 select-none w-full h-full d-flex justify-center overflow-hidden"
            ref={refContainer}
        />
    );
}
