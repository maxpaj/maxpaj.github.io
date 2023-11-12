"use client";

import { useEffect, useRef } from "react";

import {
    Scene,
    Mesh,
    PointLight,
    Color,
    PerspectiveCamera,
    MeshStandardMaterial,
    TorusGeometry,
    SphereGeometry,
    BoxGeometry,
    WebGLRenderer,
    WebGLRenderTarget,
} from "three";

import { AsciiEffect } from "@/three/ascii";

let camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    renderTarget: WebGLRenderTarget,
    torus: Mesh,
    sphere: Mesh,
    box: Mesh,
    effect: AsciiEffect,
    stopped = true;

export function ThreeBackground() {
    const refContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function init() {
            console.log("starting...");
            stopped = false;
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
            // new MeshPhongMaterial({ flatShading: true });

            torus = new Mesh(new TorusGeometry(200, 30, 10, 10), shader);
            torus.position.x = -40;
            // scene.add(torus);

            sphere = new Mesh(new SphereGeometry(200, 20, 10), shader);
            // scene.add(sphere);

            box = new Mesh(new BoxGeometry(200, 200, 200), shader);
            scene.add(box);

            renderer = new WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            // document.body.appendChild(renderer.domElement);
            // renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
            effect = new AsciiEffect(renderer, " .:-+*=%@#", {
                invert: true,
                alpha: true,
            });

            effect.setSize(window.innerWidth, window.innerHeight);

            if (refContainer.current === null) {
                throw new Error("Ref empty");
            }

            // Clear container
            refContainer.current.innerHTML = "";

            // Append the canvas
            refContainer.current.appendChild(effect.domRenderElement);

            window.addEventListener("resize", onWindowResize);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            effect.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            if (stopped) {
                return;
            }

            requestAnimationFrame(() => animate());
            render();
        }

        function stopAnimate() {
            console.log("stopped.");
            stopped = true;
        }

        function render() {
            const timer = new Date().getTime();
            box.rotation.x = -timer * 0.0003;
            box.rotation.z = timer * 0.0002;
            box.rotation.y = timer * 0.0002;

            sphere.rotation.x = timer * 0.0003;
            sphere.rotation.z = timer * 0.0002;

            renderer.render(scene, camera);
            effect.render(renderer);
        }

        console.log("init!");

        init();
        animate();

        return () => {
            console.log("stop!");
            stopAnimate();
        };
    }, []);

    return <div ref={refContainer}></div>;
}
