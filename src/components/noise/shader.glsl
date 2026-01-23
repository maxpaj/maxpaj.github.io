// Inspired by https://iquilezles.org/articles/warp/
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

const float d = 64.0;

const float ditheringMatrix[64] = float[64](
    0.0/d,  48.0/d, 12.0/d, 60.0/d, 3.0/d,  51.0/d, 15.0/d, 63.0/d,
    32.0/d, 16.0/d, 44.0/d, 28.0/d, 35.0/d, 19.0/d, 47.0/d, 31.0/d,
    8.0/d,  56.0/d, 4.0/d,  52.0/d, 11.0/d, 59.0/d, 7.0/d,  55.0/d,
    40.0/d, 24.0/d, 36.0/d, 20.0/d, 43.0/d, 27.0/d, 39.0/d, 23.0/d,
    2.0/d,  50.0/d, 14.0/d, 62.0/d, 1.0/d,  49.0/d, 13.0/d, 61.0/d,
    34.0/d, 18.0/d, 46.0/d, 30.0/d, 33.0/d, 17.0/d, 45.0/d, 29.0/d,
    10.0/d, 58.0/d, 6.0/d,  54.0/d, 9.0/d,  57.0/d, 5.0/d,  53.0/d,
    42.0/d, 26.0/d, 38.0/d, 22.0/d, 41.0/d, 25.0/d, 37.0/d, 21.0/d
);

const float colorNum = 2.0;

vec3 dither(vec2 uv, vec3 color) {
  int x = int(uv.x * resolution.x) % 8;
  int y = int(uv.y * resolution.y) % 8;
  float threshold = ditheringMatrix[y * 8 + x] - 0.25;

  color.rgb += threshold;
  color.r = floor(color.r * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  color.g = floor(color.g * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  color.b = floor(color.b * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);

  return color;
}

const float opacity = 0.125;

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution/3.0;
    float shade = pattern(uv);

    vec4 color = vec4(255.0, 255.0, 255.0, shade * opacity);

    color.xyz = dither(uv, vec3(shade));

    gl_FragColor = color;
}
