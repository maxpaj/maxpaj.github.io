// Copied from https://www.shadertoy.com/view/tdG3Rd, with some minor modifications

uniform float clock;
uniform vec2 resolution;

float grayscale(float x) {
    if (x < 20049.0 / 82979.0) {
        return 0.0;
    } else if (x < 327013.0 / 810990.0) {
        return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    } else if (x <= 1.0) {
        return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    } else {
        return 1.0;
    }
}

vec4 colormap(float x) {
    float opacity = 0.1;
    return vec4(grayscale(x) * opacity, grayscale(x) * opacity, grayscale(x) * opacity, 1.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), 
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);

    return res*res;
}

const mat2 mtx = mat2(0.80,  0.60, -0.60,  0.80);

float brownian(vec2 p)
{
    float f = 0.0;

    f += 0.500000*noise(p + clock * 0.25 ); 
    p = mtx*p*2.02;
    f += 0.031250*noise(p); 
    p = mtx*p*2.01;
    f += 0.250000*noise(p); 
    p = mtx*p*2.03;
    f += 0.125000*noise(p); 
    p = mtx*p*2.01;
    f += 0.062500*noise(p); 
    p = mtx*p*2.04;
    f += 0.015625*noise(p + sin(clock * 0.5));

    return f/0.96875;
}

float pattern(in vec2 p)
{
    return brownian(p + brownian(p + brownian(p)));
}

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.x;
    float shade = pattern(uv);
    gl_FragColor = vec4(colormap(shade).rgb, 1.0);
}