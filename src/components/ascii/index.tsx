"use client";

import { ThreeAsciiEffect } from "@/components/ascii/three-ascii-effect";
import { useCallback, useEffect, useRef } from "react";
import {
    AmbientLight,
    BoxGeometry,
    Color,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./index.css";

const DEBUG = false;

let camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    pointLight1: PointLight,
    pointLight2: PointLight,
    pointLight3: PointLight,
    orbitControls: OrbitControls,
    box: Mesh,
    effect: ThreeAsciiEffect,
    stopped = true,
    isDragging = false,
    lastRender = new Date().getTime();

interface AsciiEffectProps {
    width: number;
    height: number;
}

export function AsciiEffect({ width = 20, height = 20 }: AsciiEffectProps) {
    const refContainer = useRef<HTMLDivElement>(null);

    const step = useCallback(() => {
        if (stopped) {
            return;
        }

        render();
    }, []);

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

    useEffect(() => {
        if (!effect) {
            return;
        }

        effect.setEffectSize(width, height);
    }, [width, height]);

    useEffect(() => {
        function init() {
            console.debug("starting...");

            if (refContainer.current === null) {
                throw new Error("Ref empty");
            }

            camera = new PerspectiveCamera(50, 1, 1, 1000);

            camera.position.y = 0;
            camera.position.z = 300;
            camera.position.x = 300;

            scene = new Scene();
            scene.background = new Color(0, 0, 0);

            scene.add(new AmbientLight(0xff00ff, 1));

            pointLight1 = new PointLight(0xffffff, 3, 0, 0);
            pointLight1.position.set(500, 500, 0);
            scene.add(pointLight1);

            pointLight2 = new PointLight(0xffffff, 1, 0, 0);
            pointLight2.position.set(-500, 500, 500);
            scene.add(pointLight2);

            pointLight3 = new PointLight(0xffffff, 1, 0, 0);
            pointLight3.position.set(-500, 500, 500);
            scene.add(pointLight3);

            let material = new MeshStandardMaterial({
                metalness: 1, // between 0 and 1
                roughness: 0.5, // between 0 and 1
                emissive: "#ffffff",
                emissiveIntensity: 0.025,
            });

            box = new Mesh(new BoxGeometry(200, 200, 200), material);
            scene.add(box);

            renderer = new WebGLRenderer({ alpha: true });
            renderer.setSize(50, 50);

            // Clear container
            refContainer.current.innerHTML = "";

            effect = new ThreeAsciiEffect(
                { debug: DEBUG },
                refContainer.current
            );

            effect.setEffectSize(width, height);

            // Append the canvas
            refContainer.current.appendChild(effect.domRenderElement);

            orbitControls = new OrbitControls(camera, refContainer.current);
            orbitControls.addEventListener("start", () => {
                isDragging = true;
            });

            orbitControls.addEventListener("end", () => {
                isDragging = false;
            });

            stopped = false;

            renderer.setAnimationLoop(step);
        }

        if (renderer) {
            return;
        }

        console.debug("init!");

        init();

        return () => {
            console.debug("stop!");
        };
    }, [height, step, width]);

    return <div ref={refContainer} />;
}
