"use client";

import { useEffect, useRef } from "react";
import {
    Mesh,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Vector3,
    WebGLRenderer,
} from "three";
import fragshader from "./shader.glsl";

export function NoiseEffectBackground() {
    const refContainer = useRef<HTMLDivElement>(null);

    // Adding a shader effect background to the container
    useEffect(() => {
        if (!refContainer.current) return;

        const { current: container } = refContainer;

        const scene = new Scene();

        const aspect = window.innerWidth / window.innerHeight;
        const camera = new PerspectiveCamera(45, aspect, 0.1, 100);

        camera.position.z = 1;
        camera.lookAt(0, 0, 0);

        const renderer = new WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);

        // Add event listener for window resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onWindowResize, false);

        const fragmentShader = fragshader;

        const material = new ShaderMaterial({
            uniforms: {
                clock: { value: 0 },
                resolution: {
                    value: new Vector3(250, 250, 1),
                },
            },
            dithering: true,
            fragmentShader,
            transparent: true,
        });

        scene.add(new Mesh(new PlaneGeometry(50, 50), material));

        const animate = () => {
            material.uniforms.clock.value = (Date.now() / 1000) % 1000000;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Clean up on component unmount
        return () => {
            window.removeEventListener("resize", onWindowResize, false);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            className="z-[-1] w-full h-full fixed top-0 left-0"
            ref={refContainer}
        />
    );
}
