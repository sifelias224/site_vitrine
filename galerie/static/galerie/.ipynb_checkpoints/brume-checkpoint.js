import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene, camera, renderer, uniforms;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.Camera();
  camera.position.z = 1;

  const geometry = new THREE.PlaneGeometry(2, 2);

  uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() }
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: `
  precision mediump float;
  uniform float time;
  uniform vec2 resolution;

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
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.x *= resolution.x / resolution.y;

    float n = 0.0;
    float scale = 2.0;
    for (int i = 0; i < 5; i++) {
      n += noise(st * scale + time * 0.05) / scale;
      scale *= 2.0;
    }

    // Onirique : tons toujours lumineux et pastels
    vec3 base = vec3(0.85, 0.9, 0.95); // base claire bleutée

    vec3 color = base + vec3(
      0.1 * sin(n * 2.0 + time * 0.2), // variation douce rouge
      0.1 * cos(n * 1.5 + time * 0.1), // variation douce verte
      0.1 * sin(n * 3.0 - time * 0.15) // variation douce bleue
    );

    gl_FragColor = vec4(color, 1.0);
  }
`
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;
}

function animate() {
  requestAnimationFrame(animate);
  uniforms.time.value += 0.01;
  renderer.render(scene, camera);
}