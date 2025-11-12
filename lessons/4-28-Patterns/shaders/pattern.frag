precision mediump float;

varying vec2 vUv;

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

    // City Corner
    float pattern = min(abs(0.5 - vUv.x), abs(0.5 - vUv.y));

    gl_FragColor = vec4(vec3(pattern), 1.0);
}
