// Copied from https://www.shadertoy.com/view/tdG3Rd, with some minor modifications

uniform float clock;
uniform vec2 resolution;

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(13.0, 4.015))) * 142500.0);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), 
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);

    return res * res;
}

const mat2 mat = mat2(0.80,  0.60, -0.60,  0.80);

float brownian(vec2 p)
{
    float f = 0.0;

    f += 0.5 * noise(p + clock * 0.25); 
    p = mat * p * 2.05;
    f += 0.315 * noise(p); 
    p = mat * p * 2.0;
    f += 0.250 * noise(p); 
    p = mat * p * 2.05;
    f += 0.125 * noise(p); 
    p = mat * p * 2.0;
    f += 0.0625 * noise(p); 
    p = mat * p * 2.05;
    f += 0.015 * noise(p);

    return f/0.975;
}

float pattern(in vec2 p)
{
    return brownian(p + brownian(p + brownian(p)));
}

const float opacity = 0.125;

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution;
    float shade = pattern(uv);
    
    gl_FragColor = vec4(255.0, 255.0, 255.0, shade * opacity);
}
