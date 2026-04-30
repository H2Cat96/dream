import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { X } from 'lucide-react';
import { DEFAULT_DREAM_IMAGE_SRC, DEFAULT_PARTICLE_PARAMS } from './defaultDreamScene';

// --- Shaders ---

const snoiseChunk = `
  // Simplex 3D Noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
`;

const displacementChunk = `
    // Nebula Swirl Effect
    float time = localTime * uNoiseSpeed * 0.5;
    // Lower frequency for larger, cloudier swirls
    float noiseX = snoise(vec3(pos.x * 0.03, pos.y * 0.03, time));
    float noiseY = snoise(vec3(pos.x * 0.03 + 42.0, pos.y * 0.03 + 10.0, time));
    float noiseZ = snoise(vec3(pos.x * 0.03 - 42.0, pos.y * 0.03 - 10.0, time));
    
    // Apply multi-directional swirl (no downward bias)
    pos.x += noiseX * uNoiseStrength * 2.0;
    pos.y += noiseY * uNoiseStrength * 2.0; 
    pos.z += noiseZ * uNoiseStrength * 3.0 + brightness * uDisplacement;

    // Water Ripple Mouse Interaction
    float dist = distance(pos.xy, uMouse.xy);
    float maxDist = uMouseRadius;
    if (dist < maxDist) {
      vec2 dir = pos.xy - uMouse.xy;
      float len = length(dir);
      if (len > 0.0) {
          dir /= len;
      }
      
      // Smooth falloff towards the edge of the radius
      float falloff = smoothstep(maxDist, 0.0, dist);
      
      // Wave equation: sin(distance * frequency - time * speed)
      float waveFreq = 30.0;
      float waveSpeed = 10.0;
      float wave = sin(dist * waveFreq - localTime * waveSpeed) * falloff;
      
      // Apply wave to Z axis (up and down ripples)
      pos.z += wave * 5.0;
      
      // Apply slight tangential swirl (water displacement)
      vec2 tangent = vec2(-dir.y, dir.x);
      pos.xy += tangent * wave * 0.5;
    }
`;

const vertexShader = `
  uniform float uTime;
  uniform float uNodeTime;
  uniform float uDisplacement;
  uniform float uSize;
  uniform float uNoiseStrength;
  uniform float uNoiseSpeed;
  uniform float uMouseRadius;
  uniform vec3 uMouse;

  attribute vec3 color;
  attribute float brightness;
  attribute float random;
  attribute float isNode;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vRandom;
  varying float vIsNode;

  ${snoiseChunk}

  void main() {
    vColor = color;
    vRandom = random;
    vIsNode = isNode;
    vec3 pos = position;

    float localTime = isNode > 0.5 ? uNodeTime : uTime;

    ${displacementChunk}

    // Brightness variation (Twinkle & Nebula pulsing)
    float twinkleSpeed = 1.0 + random * 2.0;
    float twinkle = sin(localTime * twinkleSpeed + random * 100.0) * 0.5 + 0.5;
    
    // Add noise to alpha for cloud-like fading
    float cloudAlpha = smoothstep(-1.0, 1.0, noiseZ);
    vAlpha = 0.2 + twinkle * 0.4 + cloudAlpha * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size attenuation + random size variation + noise size variation
    float nodeScale = isNode > 0.5 ? 4.0 : 1.0;
    float pSize = uSize * (0.5 + random * 0.8 + cloudAlpha * 0.5) * nodeScale;
    gl_PointSize = pSize * (100.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vRandom;
  varying float vIsNode;

  void main() {
    float gridSize = 4.0;
    float cellIndex = floor(vRandom * 15.99);
    float col = mod(cellIndex, gridSize);
    float row = floor(cellIndex / gridSize);
    
    vec2 uv = gl_PointCoord;
    uv.x = (uv.x + col) / gridSize;
    uv.y = (uv.y + row) / gridSize;

    vec4 texColor = texture2D(uTexture, uv);
    
    // Discard transparent pixels to keep the particle shape
    if (texColor.a < 0.05) discard;

    // Apply texture alpha to maintain the soft glow
    float alpha = texColor.a * vAlpha;
    
    if (vIsNode > 0.5) {
      alpha = texColor.a * 0.9; // More opaque for clickable nodes
      gl_FragColor = vec4(vColor * 1.5, alpha); // Brighter
    } else {
      gl_FragColor = vec4(vColor, alpha);
    }
  }
`;

const lineVertexShader = `
  uniform float uTime;
  uniform float uNodeTime;
  uniform float uDisplacement;
  uniform float uNoiseStrength;
  uniform float uNoiseSpeed;
  uniform float uMouseRadius;
  uniform vec3 uMouse;

  attribute float brightness;

  ${snoiseChunk}

  void main() {
    vec3 pos = position;

    float localTime = uNodeTime;

    ${displacementChunk}

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const lineFragmentShader = `
  void main() {
    gl_FragColor = vec4(0.4, 0.8, 1.0, 0.25); // Faint cyan lines
  }
`;

// --- Helper Functions ---

const createCharacterTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const chars = "星光尘梦幻影灵魂虚无宇宙浩瀚渺茫";
  const gridSize = 4;
  const cellSize = 512 / gridSize;

  ctx.clearRect(0, 0, 512, 512);
  ctx.font = 'bold 80px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 15;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const x = (i % gridSize) * cellSize + cellSize / 2;
    const y = Math.floor(i / gridSize) * cellSize + cellSize / 2;
    ctx.fillText(char, x, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
};

const characterTexture = createCharacterTexture();

const getImageData = (imageSrc: string, density: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No 2d context');

      // Max dimension to prevent crashing
      const MAX_DIM = 800;
      let scaleFactor = 1;
      if (img.width > MAX_DIM || img.height > MAX_DIM) {
        scaleFactor = MAX_DIM / Math.max(img.width, img.height);
      }

      // Density controls sampling step (higher value = larger step = fewer particles)
      const step = Math.max(1, Math.floor(density));

      const width = Math.floor(img.width * scaleFactor);
      const height = Math.floor(img.height * scaleFactor);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height).data;

      const positions = [];
      const colors = [];
      const brightnesses = [];
      const randoms = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const r = imgData[index];
          const g = imgData[index + 1];
          const b = imgData[index + 2];
          const a = imgData[index + 3];

          // Check if pixel is close to white (background removal)
          const isWhite = r > 240 && g > 240 && b > 240;

          // Ignore highly transparent pixels AND white background pixels
          if (a > 10 && !isWhite) { 
            // Center the positions and scale them
            const posX = (x - width / 2) * 0.05;
            const posY = -(y - height / 2) * 0.05;
            const posZ = 0;

            positions.push(posX, posY, posZ);
            colors.push(r / 255, g / 255, b / 255);

            // Calculate perceived brightness
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            brightnesses.push(brightness);
            
            // Random value for each particle (used for twinkling and size variation)
            randoms.push(Math.random());
          }
        }
      }

      const numParticles = positions.length / 3;
      const isNodes = new Float32Array(numParticles);
      const nodeIndices: number[] = [];

      // Select ~12 random nodes that are bright enough
      let attempts = 0;
      while (nodeIndices.length < 12 && attempts < 1000) {
        const idx = Math.floor(Math.random() * numParticles);
        if (brightnesses[idx] > 0.3 && isNodes[idx] === 0) {
          isNodes[idx] = 1.0;
          nodeIndices.push(idx);
        }
        attempts++;
      }

      // Generate connections (connect each node to its 2 nearest neighbors)
      const linePositions = [];
      const lineBrightnesses = [];

      for (let i = 0; i < nodeIndices.length; i++) {
        const idxA = nodeIndices[i];
        const posA = new THREE.Vector3(positions[idxA*3], positions[idxA*3+1], positions[idxA*3+2]);

        const distances = [];
        for (let j = 0; j < nodeIndices.length; j++) {
          if (i === j) continue;
          const idxB = nodeIndices[j];
          const posB = new THREE.Vector3(positions[idxB*3], positions[idxB*3+1], positions[idxB*3+2]);
          distances.push({ idx: idxB, dist: posA.distanceTo(posB) });
        }
        distances.sort((a, b) => a.dist - b.dist);

        for (let k = 0; k < Math.min(2, distances.length); k++) {
          const idxB = distances[k].idx;
          linePositions.push(positions[idxA*3], positions[idxA*3+1], positions[idxA*3+2]);
          lineBrightnesses.push(brightnesses[idxA]);
          linePositions.push(positions[idxB*3], positions[idxB*3+1], positions[idxB*3+2]);
          lineBrightnesses.push(brightnesses[idxB]);
        }
      }

      resolve({
        positions: new Float32Array(positions),
        colors: new Float32Array(colors),
        brightnesses: new Float32Array(brightnesses),
        randoms: new Float32Array(randoms),
        isNodes: isNodes,
        linePositions: new Float32Array(linePositions),
        lineBrightnesses: new Float32Array(lineBrightnesses),
        width,
        height
      });
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

// --- Components ---

const Particles = ({ imageSrc, params, onParticleClick, isPaused }: { imageSrc: string, params: any, onParticleClick: (index: number, random: number) => void, isPaused: boolean }) => {
  const [geometryData, setGeometryData] = useState<any>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePos = useRef(new THREE.Vector3(-1000, -1000, 0));
  const targetMousePos = useRef(new THREE.Vector3(-1000, -1000, 0));
  const timeRef = useRef(0);
  const nodeTimeRef = useRef(0);
  const [debouncedDensity, setDebouncedDensity] = useState(params.density);
  const { raycaster } = useThree();

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    if (raycaster.params.Points) {
      // Significantly increase raycaster threshold to account for the 4x node scale in the vertex shader
      raycaster.params.Points.threshold = params.size * 4.0;
    }
  }, [raycaster, params.size]);

  useEffect(() => {
    document.body.style.cursor = hoveredNode !== null ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredNode]);

  // Debounce the density parameter to avoid freezing the main thread while dragging the slider
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDensity(params.density), 300);
    return () => clearTimeout(timer);
  }, [params.density]);

  useEffect(() => {
    if (imageSrc) {
      setGeometryData(null); // Clear previous geometry while loading
      getImageData(imageSrc, debouncedDensity).then(setGeometryData).catch(console.error);
    }
  }, [imageSrc, debouncedDensity]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (!isPaused) {
      nodeTimeRef.current += delta;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uNodeTime.value = nodeTimeRef.current;
      materialRef.current.uniforms.uSize.value = params.size;
      materialRef.current.uniforms.uDisplacement.value = params.displacement;
      materialRef.current.uniforms.uNoiseStrength.value = params.noiseStrength;
      materialRef.current.uniforms.uNoiseSpeed.value = params.noiseSpeed;
      materialRef.current.uniforms.uMouseRadius.value = params.mouseRadius;

      // Smoothly interpolate mouse position
      mousePos.current.lerp(targetMousePos.current, 0.1);
      materialRef.current.uniforms.uMouse.value.copy(mousePos.current);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.uTime.value = timeRef.current;
      lineMaterialRef.current.uniforms.uNodeTime.value = nodeTimeRef.current;
      lineMaterialRef.current.uniforms.uDisplacement.value = params.displacement;
      lineMaterialRef.current.uniforms.uNoiseStrength.value = params.noiseStrength;
      lineMaterialRef.current.uniforms.uNoiseSpeed.value = params.noiseSpeed;
      lineMaterialRef.current.uniforms.uMouseRadius.value = params.mouseRadius;
      lineMaterialRef.current.uniforms.uMouse.value.copy(mousePos.current);
    }
  });

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uNodeTime: { value: 0 },
      uSize: { value: params.size },
      uDisplacement: { value: params.displacement },
      uNoiseStrength: { value: params.noiseStrength },
      uNoiseSpeed: { value: params.noiseSpeed },
      uMouseRadius: { value: params.mouseRadius },
      uMouse: { value: new THREE.Vector3(-1000, -1000, 0) },
      uTexture: { value: characterTexture }
    }),
    []
  );

  const lineUniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uNodeTime: { value: 0 },
      uDisplacement: { value: params.displacement },
      uNoiseStrength: { value: params.noiseStrength },
      uNoiseSpeed: { value: params.noiseSpeed },
      uMouseRadius: { value: params.mouseRadius },
      uMouse: { value: new THREE.Vector3(-1000, -1000, 0) }
    }),
    []
  );

  if (!geometryData) return null;

  return (
    <group>
      <mesh 
        onPointerMove={(e) => targetMousePos.current.copy(e.point)}
        onPointerOut={() => targetMousePos.current.set(-1000, -1000, 0)}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <points
        onPointerMove={(e) => {
          const nodeIntersection = e.intersections.find(
            (intersect) => intersect.index !== undefined && geometryData.isNodes[intersect.index] > 0.5
          );
          if (nodeIntersection && nodeIntersection.index !== undefined) {
            e.stopPropagation();
            setHoveredNode(nodeIntersection.index);
          } else {
            setHoveredNode(null);
          }
        }}
        onPointerOut={() => setHoveredNode(null)}
        onClick={(e) => {
          const nodeIntersection = e.intersections.find(
            (intersect) => intersect.index !== undefined && geometryData.isNodes[intersect.index] > 0.5
          );
          if (nodeIntersection && nodeIntersection.index !== undefined) {
            e.stopPropagation();
            onParticleClick(nodeIntersection.index, geometryData.randoms[nodeIntersection.index]);
          }
        }}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometryData.positions.length / 3}
            array={geometryData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometryData.colors.length / 3}
            array={geometryData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-brightness"
            count={geometryData.brightnesses.length}
            array={geometryData.brightnesses}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-random"
            count={geometryData.randoms.length}
            array={geometryData.randoms}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-isNode"
            count={geometryData.isNodes.length}
            array={geometryData.isNodes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {geometryData.linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={geometryData.linePositions.length / 3}
              array={geometryData.linePositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-brightness"
              count={geometryData.lineBrightnesses.length}
              array={geometryData.lineBrightnesses}
              itemSize={1}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={lineMaterialRef}
            vertexShader={lineVertexShader}
            fragmentShader={lineFragmentShader}
            uniforms={lineUniforms}
            transparent={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}
    </group>
  );
};

const nebulaVertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;

  // Simplex 3D Noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 3; ++i) { // Reduced iterations for performance
      v += a * snoise(x);
      x = x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 pos = normalize(vPosition);
    float time = uTime * 0.02;
    
    float q = fbm(pos * 2.0 + time);
    float r = fbm(pos * 4.0 - time * 1.5 + q);
    float noiseVal = fbm(pos * 3.0 + r);

    // Deep, mysterious universe colors
    vec3 color1 = vec3(0.005, 0.01, 0.02); // Very dark, deep blue abyss
    vec3 color2 = vec3(0.02, 0.05, 0.12);  // Deep mysterious blue/teal
    vec3 color3 = vec3(0.06, 0.10, 0.20);  // Ethereal cyan/purple glow

    // Smooth, subtle blending for a vast, cloudy feel
    vec3 finalColor = mix(color1, color2, smoothstep(0.1, 0.8, noiseVal));
    finalColor = mix(finalColor, color3, smoothstep(0.4, 1.0, noiseVal));

    // Delicate stars
    float starNoise = snoise(pos * 200.0);
    float star = smoothstep(0.98, 1.0, starNoise) * 0.6;
    finalColor += vec3(star);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const NebulaBackground = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[200, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.BackSide}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
};

const ControlSlider = ({ label, value, min, max, step, onChange }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <label className="text-neutral-300">{label}</label>
      <span className="text-neutral-500 font-mono">{value.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
    />
  </div>
);

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(DEFAULT_DREAM_IMAGE_SRC);
  const [selectedDream, setSelectedDream] = useState<any>(null);
  const [params] = useState(DEFAULT_PARTICLE_PARAMS);

  const handleParticleClick = (index: number, random: number) => {
    const chars = "星光尘梦幻影灵魂虚无宇宙浩瀚渺茫";
    const charIndex = Math.floor(random * 15.99);
    const char = chars[charIndex];
    
    const dreamContents = [
      "我漂浮在无垠的暗物质中，感受着时间的停滞。这里没有声音，只有光线的呼吸。",
      "记忆像碎裂的玻璃，折射出无数个平行宇宙的可能。我试图抓住其中一片，却只触到了虚无。",
      "星辰在耳边低语，诉说着亿万年前的秘密。我仿佛是一粒尘埃，却又拥有整个宇宙的重量。",
      "梦境的边缘是模糊的，像被水晕开的墨迹。在那里，我看到了自己未曾经历过的人生。",
      "光影交错间，灵魂仿佛脱离了躯壳，在浩瀚的星海中自由穿梭，寻找着最初的归宿。"
    ];
    
    setSelectedDream({
      char,
      title: `梦境档案：${char}`,
      content: dreamContents[index % dreamContents.length],
      image: `https://picsum.photos/seed/${char}${index}/600/400`
    });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-neutral-950 font-sans text-white selection:bg-white/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,104,255,0.12),transparent_44%),radial-gradient(circle_at_bottom,rgba(64,186,255,0.08),transparent_40%)]" />

      <div className="relative h-full w-full touch-none bg-black">
        <Canvas camera={{ position: [0, 0, 40], fov: 45 }}>
          <color attach="background" args={['#000000']} />
          <NebulaBackground />
          <ambientLight intensity={0.5} />
          {imageSrc && <Particles imageSrc={imageSrc} params={params} onParticleClick={handleParticleClick} isPaused={!!selectedDream} />}
          <OrbitControls enableDamping={true} dampingFactor={0.05} />
        </Canvas>
      </div>

      {/* Dream Modal Overlay */}
      {selectedDream && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
          <div className="relative w-full max-w-[28rem] rounded-[28px] border border-neutral-700 bg-neutral-900/90 p-5 shadow-2xl animate-in fade-in zoom-in duration-300 sm:p-8">
            <button 
              onClick={() => setSelectedDream(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="mb-5 flex items-center gap-3 pr-8 text-white sm:mb-6">
              <span className="bg-gradient-to-br from-purple-400 to-blue-500 bg-clip-text text-4xl text-transparent sm:text-5xl">{selectedDream.char}</span>
              <span className="text-lg font-bold tracking-[0.18em] sm:text-2xl">{selectedDream.title}</span>
            </h2>
            <div className="relative rounded-lg overflow-hidden mb-6 group">
              <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay z-10"></div>
              <img 
                src={selectedDream.image} 
                alt="Dream" 
                className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-64"
              />
            </div>
            <p className="font-serif text-base leading-relaxed text-neutral-300 sm:text-lg">
              "{selectedDream.content}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
