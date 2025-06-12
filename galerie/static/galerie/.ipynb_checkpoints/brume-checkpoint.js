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

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = uv * 3.0;

        float t = time * 0.05;

        float n = noise(p + vec2(t, t));
        float n2 = noise(p + vec2(-t, t * 1.5));
        float n3 = noise(p + vec2(t * 1.2, -t));

        vec3 color = vec3(
          0.9 + 0.1 * sin(n * 6.0 + time * 0.2),
          0.85 + 0.1 * cos(n2 * 6.0 + time * 0.15),
          0.95 + 0.1 * sin(n3 * 6.0 + time * 0.1)
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