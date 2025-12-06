varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun
    float sunOrientation = dot(normal, uSunDirection);
    // color = vec3(sunOrientation);

    // Color maps
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    vec3 specularClouds = texture(uSpecularCloudsTexture, vUv).rgb;

    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    color = mix(nightColor, dayColor, dayMix);

    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;
    float cloudsMix = smoothstep(0.4, 1.0, specularCloudsColor.g);
    cloudsMix = min(cloudsMix, dayMix);
    color = mix(color, vec3(1.0), cloudsMix);

    // Fresnel
    float fresnel = 1.0 + dot(viewDirection, normal);
    fresnel = pow(fresnel, 4.0);
    // color = vec3(fresnel);

    // Atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    // Reflection
    vec3 reflection = reflect(- uSunDirection, normal);
    float specular = - dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);
    specular *= specularCloudsColor.r;

    vec3 specularColor = vec3(1.0);
    specularColor = mix(specularColor, atmosphereColor, fresnel);
    color += specular * specularColor;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}