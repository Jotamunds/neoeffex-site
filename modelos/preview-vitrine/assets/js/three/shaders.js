/**
 * Particle Shaders for Neoeffex 3D Logo
 */

export const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform float uPixelRatio;

attribute vec3 aStartPosition;
attribute vec3 aRandomness;
attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
    // 1. Interpolate from start to target (the N shape)
    vec3 targetPos = position;
    vec3 currentPos = mix(aStartPosition, targetPos, uProgress);

    // 2. Idle movement (only visible when mostly formed)
    float idleAmp = 0.02 * uProgress;
    currentPos.x += sin(uTime * 0.5 + aRandomness.x * 10.0) * idleAmp;
    currentPos.y += cos(uTime * 0.6 + aRandomness.y * 10.0) * idleAmp;
    currentPos.z += sin(uTime * 0.4 + aRandomness.z * 10.0) * idleAmp;

    // 3. Mouse interaction (subtle repel/tilt effect on individual particles)
    // We already rotate the entire group in scene.js, but we can add a tiny local repel
    // (Optional: if we just want global rotation, we don't strictly need this local offset, 
    // but a slight local parallax depth based on mouse feels premium)
    currentPos.x -= (uMouse.x * aRandomness.z * 0.15) * uProgress;
    currentPos.y -= (uMouse.y * aRandomness.z * 0.15) * uProgress;

    vec4 modelPosition = modelMatrix * vec4(currentPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Point size calculation (perspective + base size)
    // The closer to camera, the bigger it is.
    float pointSize = aSize * uPixelRatio * 1.5;
    
    // Scale by depth (attenuation)
    gl_PointSize = pointSize * (10.0 / -viewPosition.z);
    
    // Pass color to fragment
    vColor = aColor;
}
`;

export const fragmentShader = `
varying vec3 vColor;
uniform float uProgress;

void main() {
    // Create a smooth circular particle
    // gl_PointCoord is [0,1] from top-left to bottom-right of the point
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    // Smooth circle (alpha drops near the edge)
    // smoothstep(inner_edge, outer_edge, value)
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
    
    // Optional glow core: 
    // We make the center slightly brighter if needed, but smooth circle is usually enough
    
    // Fade out particles when uProgress is 0 (dispersed)
    // We can just keep them slightly transparent when forming
    float globalAlpha = mix(0.1, 0.9, uProgress);
    
    gl_FragColor = vec4(vColor, alpha * globalAlpha);
}
`;
