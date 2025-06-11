 console.log("brume.js chargé ✅");

// Canvas existant
const canvas = document.getElementById("background-canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.Camera();

const geometry = new THREE.PlaneGeometry(2, 2);

const uniforms = {
  u_time: { type: "f", value: 0.0 },
  u_resolution: {
    type: "v2",
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
};

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  fragmentShader: `
    precision mediump float;

    uniform float u_time;
    uniform vec2 u_resolution;

    // Perlin-like noise
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy * 2.0;

      float n = noise(st + vec2(u_time * 0.03, u_time * 0.015));
      float density = smoothstep(0.5, 1.0, n);

      // Teintes BLEUES - CYAN - LAVANDE
      float r = 0.3 + 0.2 * sin(u_time * 0.1 + n * 5.0);
      float g = 0.6 + 0.2 * sin(u_time * 0.12 + n * 7.0 + 2.0);
      float b = 0.9 + 0.2 * sin(u_time * 0.13 + n * 9.0 + 4.0);

      gl_FragColor = vec4(r, g, b, 0.7 * density);  // Plus dense et net
    }
  `,
  transparent: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animate
function animate(t) {
  requestAnimationFrame(animate);
  uniforms.u_time.value = t * 0.001;
  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  uniforms.u_resolution.value.set(width, height);
});