import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    turbopack: {
        rules: {
            "*.{glsl,vs,fs,vert,frag}": {
                loaders: ["raw-loader"],
                as: "*.js",
            },
        },
    },
};

export default nextConfig;
