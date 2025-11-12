precision mediump float;

varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    // float pattern = vUv.x;

    // float pattern = vUv.y;

    // float pattern = 1.0 - vUv.y;

    // float pattern = step(0.8, mod(10.0 * vUv.y, 1.0));

    // float pattern = step(0.8, mod(10.0 * vUv.x, 1.0));

    // float pattern = step(0.8, mod(10.0 * vUv.x, 1.0)) + step(0.8, mod(10.0 * vUv.y, 1.0));

    // float pattern = step(0.8, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));

    // float pattern = step(0.2, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));

    // float pattern = step(0.5, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));
    // pattern += step(0.8, mod(10.0 * vUv.x, 1.0)) * step(0.5, mod(10.0 * vUv.y, 1.0));

    // // Pluses, offset
    // float horizontal = step(0.6, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));
    // horizontal += step(mod(10.0 * vUv.x, 1.0), 0.2) * step(0.8, mod(10.0 * vUv.y, 1.0));
    // float vertical = step(0.8, mod(10.0 * vUv.x, 1.0)) * step(0.6, mod(10.0 * vUv.y, 1.0));
    // vertical += step(0.8, mod(10.0 * vUv.x, 1.0)) * step(mod(10.0 * vUv.y, 1.0), 0.2);
    // float pattern = horizontal + vertical;

    // // // Pluses, proper
    // float horizontal = step(0.4, mod(10.0 * vUv.x, 1.0));
    // horizontal *= step(0.8, mod(10.0 * vUv.y + 0.2, 1.0));
    // float vertical = step(0.8, mod(10.0 * vUv.x + 0.2, 1.0));
    // vertical *= step(0.4, mod(10.0 * vUv.y, 1.0));
    // float pattern = horizontal + vertical;

    // // Question mark-ish, random find
    // float horizontal = step(0.6, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y + 0.2, 1.0));
    // horizontal += step(mod(10.0 * vUv.x + 0.2, 1.0), 0.2) * step(0.8, mod(10.0 * vUv.y, 1.0));
    // float vertical = step(0.8, mod(10.0 * vUv.x + 0.2, 1.0)) * step(0.6, mod(10.0 * vUv.y + 0.2, 1.0));
    // vertical += step(0.8, mod(10.0 * vUv.x + 0.2, 1.0)) * step(mod(10.0 * vUv.y, 1.0), 0.2);
    // float pattern = horizontal + vertical;

    // // Parting of the sea
    // float pattern = abs(0.5 - vUv.x);

    // // Blinding light
    // float pattern = abs(0.5 - vUv.y) / abs(0.5 - vUv.x);

    // // DNA
    // float pattern = abs(0.5 - abs(0.5 - vUv.x) / abs(0.5 - vUv.y));

    // // City Corner
    // float pattern = min(abs(0.5 - vUv.x), abs(0.5 - vUv.y));

    // // Corridor
    // float pattern = max(abs(0.5 - vUv.x), abs(0.5 - vUv.y));

    // // 1-bit Corridor
    // // float pattern = step(0.2, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
    // // 1-bit Corridor, large blank
    // // float pattern = step(0.4, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
    // // 1-bit Corridor, adjustable inner and outer edges
    // float pattern = 1.0 - step(0.4, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
    // pattern -= 1.0 - step(0.3, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));

    // // Swatch, horizontal
    // float pattern = floor(vUv.x * 10.0) / 10.0;

    // // Swatch, diagonal
    // float pattern = min(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);

    // // Swatch, both axes
    // float pattern = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    // Static
    float pattern = random(vUv);

    gl_FragColor = vec4(vec3(pattern), 1.0);
}
