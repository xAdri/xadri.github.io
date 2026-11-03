const stages = document.querySelectorAll('[data-lanyard-badge]');

const waitForFonts = () => Promise.race([
  document.fonts?.ready || Promise.resolve(),
  new Promise((resolve) => window.setTimeout(resolve, 700)),
]);

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const wrapCanvasText = (context, text, maxWidth) => {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (line && context.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  });

  if (line) lines.push(line);
  return lines;
};

const roundedRectangle = (context, x, y, width, height, radius) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
};

const loadBadgeImage = (source) => new Promise((resolve) => {
  const image = new Image();
  image.decoding = 'async';
  image.addEventListener('load', () => resolve(image), { once: true });
  image.addEventListener('error', () => resolve(null), { once: true });
  image.src = source;
});

const createBadgeCanvas = (stage, side, assets = {}) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = 768;
  const height = 1024;
  const radius = 58;
  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);
  roundedRectangle(context, 4, 4, width - 8, height - 8, radius);
  context.clip();

  if (side === 'front' && assets.frontImage) {
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(assets.frontImage, 0, 0, width, height);
  } else if (side === 'front') {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#151816');
    gradient.addColorStop(.18, '#243827');
    gradient.addColorStop(.34, '#74745c');
    gradient.addColorStop(.5, '#c17b68');
    gradient.addColorStop(.66, '#755569');
    gradient.addColorStop(.82, '#30293a');
    gradient.addColorStop(1, '#151816');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    if (assets.markIcon) {
      context.drawImage(assets.markIcon, width / 2 - 122, 233, 244, 244);
    } else {
      context.font = '500 248px Satoshi, Arial, sans-serif';
      context.fillText(stage.dataset.badgeMark || 'A', width / 2, 355);
    }

    context.font = '400 46px Satoshi, Arial, sans-serif';
    context.fillText(stage.dataset.badgeRole || '', width / 2, 555);

    context.font = '500 24px Satoshi, Arial, sans-serif';
    const code = (stage.dataset.badgeCode || '').toUpperCase();
    const codeWidth = context.measureText(code).width + 44;
    context.strokeStyle = 'rgba(255,255,255,.48)';
    context.lineWidth = 2;
    roundedRectangle(context, (width - codeWidth) / 2, 610, codeWidth, 50, 25);
    context.stroke();
    context.fillText(code, width / 2, 635);

    context.fillStyle = '#f7f7f3';
    context.fillRect(0, 830, width, height - 830);

    if (assets.footerIcon) {
      context.imageSmoothingEnabled = true;
      context.drawImage(assets.footerIcon, 31, 861, 112, 112);
    } else {
      context.fillStyle = '#171719';
      roundedRectangle(context, 48, 878, 78, 78, 10);
      context.fill();
      context.fillStyle = '#ffffff';
      context.font = '500 23px Satoshi, Arial, sans-serif';
      context.fillText(stage.dataset.badgeMonogram || '', 87, 918);
    }

    context.fillStyle = '#171719';
    context.textAlign = 'right';
    context.font = '500 34px Satoshi, Arial, sans-serif';
    context.fillText(stage.dataset.badgeName || '', width - 48, 920);
  } else {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#fafaf7');
    gradient.addColorStop(1, '#d9d9d3');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#171719';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.font = '500 24px Satoshi, Arial, sans-serif';
    context.fillText((stage.dataset.badgeBackLabel || '').toUpperCase(), 64, 72);

    context.font = '500 72px Satoshi, Arial, sans-serif';
    const titleLines = wrapCanvasText(context, stage.dataset.badgeBackTitle || '', width - 128);
    titleLines.slice(0, 4).forEach((line, index) => context.fillText(line, 64, 380 + index * 76));

    context.fillStyle = 'rgba(23,23,25,.62)';
    context.font = '400 32px Satoshi, Arial, sans-serif';
    const copyLines = wrapCanvasText(context, stage.dataset.badgeBackCopy || '', width - 128);
    copyLines.slice(0, 5).forEach((line, index) => context.fillText(line, 64, 720 + index * 40));

    context.fillStyle = '#171719';
    context.textAlign = 'right';
    context.font = '500 26px Satoshi, Arial, sans-serif';
    context.fillText(stage.dataset.badgeContact || '', width - 64, 946);
  }

  context.save();
  context.globalCompositeOperation = 'destination-out';
  roundedRectangle(context, width / 2 - 62, 58, 124, 34, 17);
  context.fill();
  context.restore();

  return canvas;
};

const createRoundedPlane = (Geometry, gl, width, height, radius, cornerSegments = 7) => {
  const boundary = [];
  const corners = [
    [width / 2 - radius, height / 2 - radius, 0],
    [-width / 2 + radius, height / 2 - radius, Math.PI / 2],
    [-width / 2 + radius, -height / 2 + radius, Math.PI],
    [width / 2 - radius, -height / 2 + radius, Math.PI * 1.5],
  ];

  corners.forEach(([centerX, centerY, startAngle]) => {
    for (let index = 0; index <= cornerSegments; index += 1) {
      const angle = startAngle + index / cornerSegments * Math.PI / 2;
      boundary.push([
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius,
      ]);
    }
  });

  const positions = [0, 0, 0];
  const normals = [0, 0, 1];
  const textureCoordinates = [.5, .5];
  const indices = [];

  boundary.forEach(([x, y]) => {
    positions.push(x, y, 0);
    normals.push(0, 0, 1);
    textureCoordinates.push(x / width + .5, y / height + .5);
  });

  boundary.forEach((_, index) => {
    indices.push(0, index + 1, (index + 1) % boundary.length + 1);
  });

  return {
    boundary,
    geometry: new Geometry(gl, {
      position: { size: 3, data: new Float32Array(positions) },
      normal: { size: 3, data: new Float32Array(normals) },
      uv: { size: 2, data: new Float32Array(textureCoordinates) },
      index: { data: new Uint16Array(indices) },
    }),
  };
};

const createCardEdge = (Geometry, gl, boundary, depth) => {
  const positions = [];
  const normals = [];
  const textureCoordinates = [];
  const indices = [];

  boundary.forEach(([x, y], index) => {
    const length = Math.hypot(x, y) || 1;
    positions.push(x, y, depth / 2, x, y, -depth / 2);
    normals.push(x / length, y / length, 0, x / length, y / length, 0);
    textureCoordinates.push(index / boundary.length, 0, index / boundary.length, 1);
  });

  boundary.forEach((_, index) => {
    const next = (index + 1) % boundary.length;
    const front = index * 2;
    const back = front + 1;
    const nextFront = next * 2;
    const nextBack = nextFront + 1;
    indices.push(front, back, nextFront, nextFront, back, nextBack);
  });

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    normal: { size: 3, data: new Float32Array(normals) },
    uv: { size: 2, data: new Float32Array(textureCoordinates) },
    index: { data: new Uint16Array(indices) },
  });
};

const createArcTube = (Geometry, gl, radius, tube, startAngle, endAngle, arcSegments = 28, tubeSegments = 8) => {
  const positions = [];
  const normals = [];
  const textureCoordinates = [];
  const indices = [];

  for (let arcIndex = 0; arcIndex <= arcSegments; arcIndex += 1) {
    const progress = arcIndex / arcSegments;
    const angle = startAngle + (endAngle - startAngle) * progress;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    for (let tubeIndex = 0; tubeIndex <= tubeSegments; tubeIndex += 1) {
      const tubeAngle = tubeIndex / tubeSegments * Math.PI * 2;
      const radial = Math.cos(tubeAngle);
      const depth = Math.sin(tubeAngle);
      positions.push(
        cosine * (radius + tube * radial),
        sine * (radius + tube * radial),
        tube * depth,
      );
      normals.push(cosine * radial, sine * radial, depth);
      textureCoordinates.push(progress, tubeIndex / tubeSegments);
    }
  }

  const row = tubeSegments + 1;
  for (let arcIndex = 0; arcIndex < arcSegments; arcIndex += 1) {
    for (let tubeIndex = 0; tubeIndex < tubeSegments; tubeIndex += 1) {
      const first = arcIndex * row + tubeIndex;
      const second = first + row;
      indices.push(first, second, first + 1, second, second + 1, first + 1);
    }
  }

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    normal: { size: 3, data: new Float32Array(normals) },
    uv: { size: 2, data: new Float32Array(textureCoordinates) },
    index: { data: new Uint16Array(indices) },
  });
};

const initializeStage = async (stage) => {
  await waitForFonts();

  const [markIcon, footerIcon, frontImage] = await Promise.all([
    loadBadgeImage(new URL(stage.dataset.badgeMarkIcon || './favicon.svg', import.meta.url).href),
    loadBadgeImage(new URL(stage.dataset.badgeFooterIcon || './icons/github.png', import.meta.url).href),
    stage.dataset.badgeFrontImage
      ? loadBadgeImage(new URL(stage.dataset.badgeFrontImage, import.meta.url).href)
      : Promise.resolve(null),
  ]);

  const {
    Box,
    Camera,
    Geometry,
    Mesh,
    Program,
    Renderer,
    Texture,
    Torus,
    Transform,
  } = await import('./assets/vendor/ogl.mjs');

  const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 1.5) });
  const { gl } = renderer;
  const canvas = gl.canvas;
  const interactionSurface = document.createElement('div');
  const scene = new Transform();
  const camera = new Camera(gl);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cardWidth = 3;
  const cardHeight = 4;
  const cardDepth = .05;
  const lanyardWidth = .54;
  const cardState = {
    dragX: 0,
    dragY: 0,
    pointerVelocityX: 0,
    pointerVelocityY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastPointerTime: 0,
    flip: 0,
    flipVelocity: 0,
    flipTarget: 0,
    dragging: false,
    moved: false,
    pointerId: null,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
  };
  let physicsAwake = false;
  let calmDuration = 0;
  let returningToRest = false;
  let restReturnDuration = 0;
  let releasedDuration = 0;

  canvas.setAttribute('aria-hidden', 'true');
  interactionSurface.className = 'lanyard-interaction';
  interactionSurface.setAttribute('role', 'button');
  interactionSurface.setAttribute('tabindex', '0');
  interactionSurface.setAttribute('aria-label', 'Adrián Pérez 3D badge. Drag it or press to flip it.');
  interactionSurface.setAttribute('aria-pressed', 'false');
  stage.prepend(canvas);
  stage.append(interactionSurface);
  stage.classList.add('has-webgl');
  gl.clearColor(0, 0, 0, 0);

  const texturedVertex = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = mat3(modelMatrix) * normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const texturedFragment = `
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vec4 texel = texture2D(uTexture, vUv);
      if (texel.a < 0.05) discard;
      vec3 normal = normalize(vNormal);
      vec3 lightDirection = normalize(vec3(-0.45, 0.72, 1.0));
      vec3 viewDirection = vec3(0.0, 0.0, 1.0);
      vec3 halfDirection = normalize(lightDirection + viewDirection);
      float diffuse = max(dot(normal, lightDirection), 0.0);
      float satin = pow(max(dot(normal, halfDirection), 0.0), 24.0);
      float grazing = pow(1.0 - abs(normal.z), 3.0);
      vec3 color = texel.rgb * (0.80 + diffuse * 0.20);
      color += vec3(satin * 0.075 + grazing * 0.018);
      gl_FragColor = vec4(color, texel.a);
    }
  `;
  const materialVertex = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vNormal = mat3(modelMatrix) * normal;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const materialFragment = `
    precision highp float;
    uniform vec3 uColor;
    uniform float uMetallic;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vec3 normal = normalize(vNormal);
      if (normal.z < 0.0) normal *= -1.0;
      vec3 lightDirection = normalize(vec3(-0.45, 0.78, 1.0));
      vec3 viewDirection = vec3(0.0, 0.0, 1.0);
      vec3 halfDirection = normalize(lightDirection + viewDirection);
      float diffuse = max(dot(normal, lightDirection), 0.0);
      float broadHighlight = pow(max(dot(normal, halfDirection), 0.0), 7.0);
      float fineHighlight = pow(max(dot(normal, halfDirection), 0.0), 34.0);
      float edge = pow(1.0 - abs(normal.z), 2.5);
      float fabric = 1.0 - step(0.5, fract(vUv.x * 58.0)) * 0.028;
      vec3 color = uColor * (0.52 + diffuse * 0.48) * mix(fabric, 1.0, uMetallic);
      color += vec3(broadHighlight * mix(0.018, 0.055, uMetallic));
      color += vec3(fineHighlight * mix(0.025, 0.16, uMetallic));
      color += vec3(edge * uMetallic * 0.045);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const createTexture = (source) => {
    const texture = new Texture(gl, {
      minFilter: gl.LINEAR_MIPMAP_LINEAR,
      magFilter: gl.LINEAR,
      generateMipmaps: true,
    });
    texture.image = source;
    texture.needsUpdate = true;
    return texture;
  };

  const badgeAssets = { markIcon, footerIcon, frontImage };
  const frontTexture = createTexture(createBadgeCanvas(stage, 'front', badgeAssets));
  const backTexture = createTexture(createBadgeCanvas(stage, 'back', badgeAssets));
  const frontProgram = new Program(gl, {
    vertex: texturedVertex,
    fragment: texturedFragment,
    uniforms: { uTexture: { value: frontTexture } },
    transparent: true,
  });
  const backProgram = new Program(gl, {
    vertex: texturedVertex,
    fragment: texturedFragment,
    uniforms: { uTexture: { value: backTexture } },
    transparent: true,
  });
  const yellowAccentProgram = new Program(gl, {
    vertex: materialVertex,
    fragment: materialFragment,
    uniforms: { uColor: { value: [1, .76, 0] }, uMetallic: { value: 0 } },
  });
  const cardEdgeProgram = new Program(gl, {
    vertex: materialVertex,
    fragment: materialFragment,
    uniforms: { uColor: { value: [1, 1, 1] }, uMetallic: { value: 0 } },
  });
  const metalProgram = new Program(gl, {
    vertex: materialVertex,
    fragment: materialFragment,
    uniforms: { uColor: { value: [.48, .5, .54] }, uMetallic: { value: 1 } },
  });
  const darkProgram = new Program(gl, {
    vertex: materialVertex,
    fragment: materialFragment,
    uniforms: { uColor: { value: [.035, .035, .04] }, uMetallic: { value: 0 } },
    cullFace: null,
  });
  const ribbonProgram = new Program(gl, {
    vertex: materialVertex,
    fragment: materialFragment,
    uniforms: { uColor: { value: [.08235, .09412, .11765] }, uMetallic: { value: 0 } },
    cullFace: null,
  });

  const card = new Transform();
  card.setParent(scene);
  const { boundary, geometry: faceGeometry } = createRoundedPlane(Geometry, gl, cardWidth, cardHeight, .16);
  const front = new Mesh(gl, { geometry: faceGeometry, program: frontProgram });
  front.position.z = cardDepth / 2 + .004;
  front.setParent(card);
  const back = new Mesh(gl, { geometry: faceGeometry, program: backProgram });
  back.position.z = -cardDepth / 2 - .004;
  back.rotation.y = Math.PI;
  back.setParent(card);
  const edge = new Mesh(gl, { geometry: createCardEdge(Geometry, gl, boundary, cardDepth), program: cardEdgeProgram });
  edge.visible = false;
  edge.setParent(card);
  const { boundary: slotBoundary } = createRoundedPlane(Geometry, gl, .49, .135, .06, 6);
  const slotWall = new Mesh(gl, {
    geometry: createCardEdge(Geometry, gl, slotBoundary, cardDepth * 1.08),
    program: darkProgram,
  });
  slotWall.position.y = cardHeight / 2 - .293;
  slotWall.setParent(card);

  const clip = new Transform();
  clip.setParent(scene);

  const foldedLoop = new Mesh(gl, {
    geometry: new Box(gl, { width: lanyardWidth * .92, height: .32, depth: .12 }),
    program: ribbonProgram,
  });
  foldedLoop.position.y = .12;
  foldedLoop.setParent(clip);

  const keeper = new Mesh(gl, {
    geometry: new Box(gl, { width: lanyardWidth * 1.08, height: .18, depth: .15 }),
    program: yellowAccentProgram,
  });
  keeper.position.y = .2;
  keeper.setParent(clip);

  const dRing = new Mesh(gl, {
    geometry: new Torus(gl, { radius: .22, tube: .042, radialSegments: 10, tubularSegments: 32 }),
    program: metalProgram,
  });
  dRing.position.y = -.08;
  dRing.setParent(clip);

  const ringHinge = new Transform();
  ringHinge.setParent(scene);
  const cardConnector = new Transform();
  cardConnector.setParent(scene);

  const swivelHead = new Mesh(gl, {
    geometry: new Box(gl, { width: .25, height: .16, depth: .16 }),
    program: metalProgram,
  });
  swivelHead.position.y = .2;
  swivelHead.setParent(ringHinge);

  const claspBody = new Mesh(gl, {
    geometry: new Box(gl, { width: .3, height: .44, depth: .18 }),
    program: metalProgram,
  });
  claspBody.setParent(cardConnector);

  const pointCount = 24;
  const ribbonWidth = lanyardWidth;
  const ribbonPositions = new Float32Array(pointCount * 2 * 3);
  const ribbonUvs = new Float32Array(pointCount * 2 * 2);
  const ribbonNormals = new Float32Array(pointCount * 2 * 3);
  const ribbonIndices = [];
  const ropePoints = [];
  const anchor = { x: 0, y: 4, z: 0 };
  const desktopRopeLength = 1.82;
  const compactRopeLength = 1.55;
  const mobileRopeLength = .72;
  let ropeLength = desktopRopeLength;
  let ropeSegmentLength = ropeLength / (pointCount - 1);
  const initialRopeAngle = 0;
  const initialCardAngle = 0;

  const createParticle = (x, y, z, inverseMass) => ({
    x,
    y,
    z,
    previousX: x,
    previousY: y,
    previousZ: z,
    inverseMass,
    restingInverseMass: inverseMass,
  });

  for (let index = 0; index < pointCount; index += 1) {
    const progress = index / (pointCount - 1);
    const x = anchor.x + Math.sin(initialRopeAngle) * ropeLength * progress;
    const y = anchor.y - Math.cos(initialRopeAngle) * ropeLength * progress;
    const point = createParticle(x, y, 0, index === 0 ? 0 : 1);
    point.previousX = x;
    ropePoints.push(point);
    ribbonUvs.set([0, progress, 1, progress], index * 4);
    ribbonNormals.set([0, 0, 1, 0, 0, 1], index * 6);
    if (index < pointCount - 1) {
      const offset = index * 2;
      ribbonIndices.push(offset, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3);
    }
  }

  const attachmentParticle = ropePoints[ropePoints.length - 1];
  let physicsScale = 1;
  const metalHingeLength = () => .55 * physicsScale;
  const ringHingeLength = () => .39 * physicsScale;
  const cardPivotLength = () => (cardHeight / 2 - .293) * physicsScale;
  const assemblyReach = () => metalHingeLength() + ringHingeLength() + cardPivotLength();
  const cardArmLength = () => cardWidth * .38 * physicsScale;
  const cardDepthLever = () => .52 * physicsScale;
  const initialRight = { x: Math.cos(initialCardAngle), y: Math.sin(initialCardAngle), z: 0 };
  const initialUp = { x: -Math.sin(initialCardAngle), y: Math.cos(initialCardAngle), z: 0 };
  const metalBottom = createParticle(
    attachmentParticle.x - initialUp.x * metalHingeLength(),
    attachmentParticle.y - initialUp.y * metalHingeLength(),
    0,
    .56,
  );
  const cardTop = createParticle(
    metalBottom.x - initialUp.x * ringHingeLength(),
    metalBottom.y - initialUp.y * ringHingeLength(),
    0,
    .34,
  );
  const cardCenter = createParticle(
    cardTop.x - initialUp.x * cardPivotLength(),
    cardTop.y - initialUp.y * cardPivotLength(),
    0,
    .22,
  );
  const cardRight = createParticle(
    cardCenter.x + initialRight.x * cardArmLength(),
    cardCenter.y + initialRight.y * cardArmLength(),
    cardCenter.z,
    .3,
  );
  const cardFront = createParticle(cardCenter.x, cardCenter.y, cardDepthLever(), .3);
  const cardParticles = [cardCenter, cardTop, cardRight, cardFront];
  cardParticles.forEach((particle) => {
    particle.previousX = particle.x;
  });
  metalBottom.previousX = metalBottom.x;
  const rigidPairs = [];
  const rebuildRigidPairs = () => {
    rigidPairs.length = 0;
    for (let first = 0; first < cardParticles.length - 1; first += 1) {
      for (let second = first + 1; second < cardParticles.length; second += 1) {
        const a = cardParticles[first];
        const b = cardParticles[second];
        rigidPairs.push({
          first: a,
          second: b,
          length: Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z),
        });
      }
    }
  };
  rebuildRigidPairs();

  const ribbonGeometry = new Geometry(gl, {
    position: { size: 3, data: ribbonPositions },
    uv: { size: 2, data: ribbonUvs },
    normal: { size: 3, data: ribbonNormals },
    index: { data: new Uint16Array(ribbonIndices) },
  });
  const ribbon = new Mesh(gl, { geometry: ribbonGeometry, program: ribbonProgram });
  ribbon.frustumCulled = false;
  ribbon.position.z = 0;
  ribbon.setParent(scene);

  let viewWidth = 6.4;
  let viewHeight = 6.4;
  let hasSized = false;

  const normalizeVector = (vector, fallback = { x: 1, y: 0, z: 0 }) => {
    const length = Math.hypot(vector.x, vector.y, vector.z);
    if (length < .00001) return { ...fallback };
    return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
  };
  const dotVector = (first, second) => first.x * second.x + first.y * second.y + first.z * second.z;
  const crossVector = (first, second) => ({
    x: first.y * second.z - first.z * second.y,
    y: first.z * second.x - first.x * second.z,
    z: first.x * second.y - first.y * second.x,
  });
  const subtractVector = (first, second) => ({
    x: first.x - second.x,
    y: first.y - second.y,
    z: first.z - second.z,
  });
  const scaleVector = (vector, scale) => ({ x: vector.x * scale, y: vector.y * scale, z: vector.z * scale });
  const projectOnPlane = (vector, normal) => subtractVector(vector, scaleVector(normal, dotVector(vector, normal)));
  const rotateAroundAxis = (vector, axis, angle) => {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const cross = crossVector(axis, vector);
    const projection = dotVector(axis, vector) * (1 - cosine);
    return {
      x: vector.x * cosine + cross.x * sine + axis.x * projection,
      y: vector.y * cosine + cross.y * sine + axis.y * projection,
      z: vector.z * cosine + cross.z * sine + axis.z * projection,
    };
  };
  const getCardBasis = () => {
    const up = normalizeVector(subtractVector(cardTop, cardCenter), { x: 0, y: 1, z: 0 });
    const rightSeed = projectOnPlane(subtractVector(cardRight, cardCenter), up);
    let right = normalizeVector(rightSeed, { x: 1, y: 0, z: 0 });
    let front = normalizeVector(crossVector(right, up), { x: 0, y: 0, z: 1 });
    if (dotVector(front, subtractVector(cardFront, cardCenter)) < 0) {
      right = scaleVector(right, -1);
      front = scaleVector(front, -1);
    }
    return { right, up, front };
  };
  const setParticlePosition = (particle, x, y, z) => {
    particle.x = x;
    particle.y = y;
    particle.z = z;
    particle.previousX = x;
    particle.previousY = y;
    particle.previousZ = z;
  };
  const rebuildCardFrame = (scale, recenter = false) => {
    const basis = recenter ? { right: initialRight, up: initialUp, front: { x: 0, y: 0, z: 1 } } : getCardBasis();
    const ringDirection = recenter
      ? basis.up
      : normalizeVector(subtractVector(metalBottom, cardTop), basis.up);
    physicsScale = scale;
    const center = recenter
      ? {
        x: attachmentParticle.x - basis.up.x * assemblyReach(),
        y: attachmentParticle.y - basis.up.y * assemblyReach(),
        z: attachmentParticle.z - basis.up.z * assemblyReach(),
      }
      : { x: cardCenter.x, y: cardCenter.y, z: cardCenter.z };
    setParticlePosition(cardCenter, center.x, center.y, center.z);
    setParticlePosition(
      cardTop,
      center.x + basis.up.x * cardPivotLength(),
      center.y + basis.up.y * cardPivotLength(),
      center.z + basis.up.z * cardPivotLength(),
    );
    setParticlePosition(
      metalBottom,
      cardTop.x + ringDirection.x * ringHingeLength(),
      cardTop.y + ringDirection.y * ringHingeLength(),
      cardTop.z + ringDirection.z * ringHingeLength(),
    );
    setParticlePosition(
      cardRight,
      center.x + basis.right.x * cardArmLength(),
      center.y + basis.right.y * cardArmLength(),
      center.z + basis.right.z * cardArmLength(),
    );
    setParticlePosition(
      cardFront,
      center.x + basis.front.x * cardDepthLever(),
      center.y + basis.front.y * cardDepthLever(),
      center.z + basis.front.z * cardDepthLever(),
    );
    rebuildRigidPairs();
  };

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height));
    const isMobile = bounds.width < 520;
    const isCompact = bounds.width < 769;
    viewHeight = isMobile ? 4.71 : 6.4;
    viewWidth = viewHeight * bounds.width / Math.max(bounds.height, 1);
    const nextRopeLength = isMobile
      ? mobileRopeLength
      : isCompact ? compactRopeLength : desktopRopeLength;
    const ropeLengthChanged = Math.abs(ropeLength - nextRopeLength) > .0001;
    ropeLength = nextRopeLength;
    ropeSegmentLength = ropeLength / (pointCount - 1);
    const nextAnchorX = window.matchMedia('(min-width: 769px)').matches ? viewWidth * 0.22 : 0;
    const anchorOffsetX = nextAnchorX - anchor.x;
    if (Math.abs(anchorOffsetX) > .0001) {
      ropePoints.forEach((point) => {
        point.x += anchorOffsetX;
        point.previousX += anchorOffsetX;
      });
      [metalBottom, ...cardParticles].forEach((particle) => {
        particle.x += anchorOffsetX;
        particle.previousX += anchorOffsetX;
      });
      anchor.x = nextAnchorX;
    }
    const nextAnchorY = isMobile ? viewHeight / 2 : 4;
    const anchorOffsetY = nextAnchorY - anchor.y;
    if (Math.abs(anchorOffsetY) > .0001) {
      ropePoints.forEach((point) => {
        point.y += anchorOffsetY;
        point.previousY += anchorOffsetY;
      });
      [metalBottom, ...cardParticles].forEach((particle) => {
        particle.y += anchorOffsetY;
        particle.previousY += anchorOffsetY;
      });
      anchor.y = nextAnchorY;
    }
    camera.orthographic({
      left: -viewWidth / 2,
      right: viewWidth / 2,
      bottom: -viewHeight / 2,
      top: viewHeight / 2,
      near: .1,
      far: 100,
    });
    camera.position.z = 10;
    const scale = isMobile ? .78 : 1;
    card.scale.set(scale, scale, scale);
    clip.scale.set(scale, scale, scale);
    ringHinge.scale.set(scale, scale, scale);
    cardConnector.scale.set(scale, scale, scale);

    if (!hasSized) {
      physicsScale = scale;
    } else if (!ropeLengthChanged && Math.abs(physicsScale - scale) > .001) {
      rebuildCardFrame(scale);
    }

    if ((!hasSized && isCompact) || ropeLengthChanged) {
      ropePoints.forEach((point, index) => {
        const progress = index / (ropePoints.length - 1);
        point.x = anchor.x;
        point.y = anchor.y - ropeLength * progress;
        point.z = anchor.z;
        point.previousX = point.x;
        point.previousY = point.y;
        point.previousZ = point.z;
      });
      rebuildCardFrame(scale, true);
    }
    hasSized = true;
  };

  const pointerToWorld = (event) => {
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width - .5) * viewWidth,
      y: (.5 - (event.clientY - bounds.top) / bounds.height) * viewHeight,
    };
  };

  const flipCard = () => {
    cardState.flipTarget = cardState.flipTarget ? 0 : Math.PI;
    interactionSurface.setAttribute('aria-pressed', String(Boolean(cardState.flipTarget)));
  };

  const isCardHit = (point) => {
    const scale = card.scale.x;
    return Math.abs(point.x - cardCenter.x) <= cardWidth * scale * .7
      && Math.abs(point.y - cardCenter.y) <= cardHeight * scale * .66;
  };

  interactionSurface.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const point = pointerToWorld(event);
    if (!isCardHit(point)) return;
    physicsAwake = true;
    calmDuration = 0;
    returningToRest = false;
    restReturnDuration = 0;
    releasedDuration = 0;
    cardState.dragging = true;
    cardState.moved = false;
    cardState.pointerId = event.pointerId;
    cardState.pointerStartX = event.clientX;
    cardState.pointerStartY = event.clientY;
    cardState.pointerOffsetX = cardCenter.x - point.x;
    cardState.pointerOffsetY = cardCenter.y - point.y;
    cardState.dragX = cardCenter.x;
    cardState.dragY = cardCenter.y;
    cardState.pointerVelocityX = 0;
    cardState.pointerVelocityY = 0;
    cardState.lastPointerX = point.x;
    cardState.lastPointerY = point.y;
    cardState.lastPointerTime = event.timeStamp;
    interactionSurface.setPointerCapture(event.pointerId);
  });

  interactionSurface.addEventListener('pointermove', (event) => {
    if (!cardState.dragging || event.pointerId !== cardState.pointerId) return;
    const point = pointerToWorld(event);
    const nextX = point.x + cardState.pointerOffsetX;
    const nextY = point.y + cardState.pointerOffsetY;
    const maxRadius = ropeLength + assemblyReach() * .99;
    const anchorDeltaX = nextX - anchor.x;
    const anchorDeltaY = nextY - anchor.y;
    const distance = Math.hypot(anchorDeltaX, anchorDeltaY);
    const radiusScale = distance > maxRadius ? maxRadius / distance : 1;
    const elapsed = Math.max(8, event.timeStamp - cardState.lastPointerTime) / 1000;

    cardState.dragX = clamp(anchor.x + anchorDeltaX * radiusScale, -viewWidth / 2 - .8, viewWidth / 2 + .8);
    cardState.dragY = clamp(anchor.y + anchorDeltaY * radiusScale, -3, 1.1);
    const sampleVelocityX = (point.x - cardState.lastPointerX) / elapsed;
    const sampleVelocityY = (point.y - cardState.lastPointerY) / elapsed;
    cardState.pointerVelocityX = cardState.pointerVelocityX * .35 + sampleVelocityX * .65;
    cardState.pointerVelocityY = cardState.pointerVelocityY * .35 + sampleVelocityY * .65;
    cardState.lastPointerX = point.x;
    cardState.lastPointerY = point.y;
    cardState.lastPointerTime = event.timeStamp;
    cardState.moved ||= Math.hypot(event.clientX - cardState.pointerStartX, event.clientY - cardState.pointerStartY) > 7;
  });

  const finishPointer = (event) => {
    if (!cardState.dragging || event.pointerId !== cardState.pointerId) return;
    cardState.dragging = false;
    if (interactionSurface.hasPointerCapture(event.pointerId)) interactionSurface.releasePointerCapture(event.pointerId);
    if (!cardState.moved) {
      flipCard();
    } else {
      const velocityScale = 1 / 120;
      const releaseX = clamp(cardState.pointerVelocityX, -18, 18);
      const releaseY = clamp(cardState.pointerVelocityY, -18, 18);
      cardParticles.forEach((particle) => {
        const existingX = (particle.x - particle.previousX) / velocityScale;
        const existingY = (particle.y - particle.previousY) / velocityScale;
        particle.previousX = particle.x - (existingX * .35 + releaseX * .78) * velocityScale;
        particle.previousY = particle.y - (existingY * .35 + releaseY * .78) * velocityScale;
      });
      const yawKick = releaseX * .065;
      cardRight.previousZ = cardRight.z - yawKick * velocityScale;
      cardFront.previousX = cardFront.x + yawKick * .7 * velocityScale;
    }
  };

  interactionSurface.addEventListener('pointerup', finishPointer);
  interactionSurface.addEventListener('pointercancel', (event) => {
    cardState.moved = true;
    finishPointer(event);
  });
  interactionSurface.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    flipCard();
  });

  const fixedTimeStep = 1 / 120;
  const smoothPointsA = ropePoints.map(() => ({ x: 0, y: 0, z: 0 }));
  const smoothPointsB = ropePoints.map(() => ({ x: 0, y: 0, z: 0 }));

  const integrateParticle = (particle, timeStep, damping = .9965) => {
    if (!particle.inverseMass) return;
    const velocityX = (particle.x - particle.previousX) * damping;
    const velocityY = (particle.y - particle.previousY) * damping;
    const velocityZ = (particle.z - particle.previousZ) * damping;
    particle.previousX = particle.x;
    particle.previousY = particle.y;
    particle.previousZ = particle.z;
    particle.x += velocityX;
    particle.y += velocityY - 15.5 * timeStep * timeStep;
    particle.z += velocityZ;
  };

  const solveDistance = (first, second, targetDistance, stiffness = 1) => {
    const deltaX = second.x - first.x;
    const deltaY = second.y - first.y;
    const deltaZ = second.z - first.z;
    const distance = Math.hypot(deltaX, deltaY, deltaZ) || .0001;
    const inverseMass = first.inverseMass + second.inverseMass;
    if (!inverseMass) return;
    const correction = (distance - targetDistance) / distance * stiffness;
    const firstShare = first.inverseMass / inverseMass;
    const secondShare = second.inverseMass / inverseMass;
    first.x += deltaX * correction * firstShare;
    first.y += deltaY * correction * firstShare;
    first.z += deltaZ * correction * firstShare;
    second.x -= deltaX * correction * secondShare;
    second.y -= deltaY * correction * secondShare;
    second.z -= deltaZ * correction * secondShare;
  };

  const stabilizeCardFacing = (timeStep) => {
    if (cardState.dragging) return;
    const basis = getCardBasis();
    const worldFront = { x: 0, y: 0, z: 1 };
    const targetFront = normalizeVector(projectOnPlane(worldFront, basis.up), basis.front);
    const targetRight = normalizeVector(crossVector(basis.up, targetFront), basis.right);
    const linearSpeed = Math.hypot(
      cardCenter.x - cardCenter.previousX,
      cardCenter.y - cardCenter.previousY,
      cardCenter.z - cardCenter.previousZ,
    ) / timeStep;
    const movingFast = clamp(linearSpeed / 9, 0, 1);
    const settleStrength = .022 - movingFast * .017;
    const relativeDamping = .972 + movingFast * .018;
    const blendedRight = normalizeVector(projectOnPlane({
      x: basis.right.x * (1 - settleStrength) + targetRight.x * settleStrength,
      y: basis.right.y * (1 - settleStrength) + targetRight.y * settleStrength,
      z: basis.right.z * (1 - settleStrength) + targetRight.z * settleStrength,
    }, basis.up), targetRight);
    const blendedFront = normalizeVector(crossVector(blendedRight, basis.up), targetFront);
    const centerVelocity = {
      x: cardCenter.x - cardCenter.previousX,
      y: cardCenter.y - cardCenter.previousY,
      z: cardCenter.z - cardCenter.previousZ,
    };
    const settleParticle = (particle, direction, distance) => {
      const velocity = {
        x: particle.x - particle.previousX,
        y: particle.y - particle.previousY,
        z: particle.z - particle.previousZ,
      };
      const relativeVelocity = subtractVector(velocity, centerVelocity);
      particle.x = cardCenter.x + direction.x * distance;
      particle.y = cardCenter.y + direction.y * distance;
      particle.z = cardCenter.z + direction.z * distance;
      particle.previousX = particle.x - centerVelocity.x - relativeVelocity.x * relativeDamping;
      particle.previousY = particle.y - centerVelocity.y - relativeVelocity.y * relativeDamping;
      particle.previousZ = particle.z - centerVelocity.z - relativeVelocity.z * relativeDamping;
    };
    settleParticle(cardRight, blendedRight, cardArmLength());
    settleParticle(cardFront, blendedFront, cardDepthLever());
  };

  const settleRestPose = (timeStep) => {
    if (cardState.dragging) return;
    releasedDuration += timeStep;
    const ropeEndY = anchor.y - ropeLength;
    const metalBottomY = ropeEndY - metalHingeLength();
    const cardTopY = metalBottomY - ringHingeLength();
    const cardCenterY = cardTopY - cardPivotLength();
    const speed = Math.hypot(
      cardCenter.x - cardCenter.previousX,
      cardCenter.y - cardCenter.previousY,
      cardCenter.z - cardCenter.previousZ,
    ) / timeStep;
    if (!returningToRest) {
      calmDuration = speed < .4 ? calmDuration + timeStep : 0;
      if (calmDuration > .28 || releasedDuration > 1.15) {
        const restingBasis = getCardBasis();
        const renderedFrontZ = restingBasis.right.z * Math.sin(cardState.flip)
          + restingBasis.front.z * Math.cos(cardState.flip);
        cardState.flipTarget = renderedFrontZ < 0 ? Math.PI : 0;
        interactionSurface.setAttribute('aria-pressed', String(cardState.flipTarget === Math.PI));
        returningToRest = true;
        restReturnDuration = 0;
      }
    }
    if (returningToRest) restReturnDuration += timeStep;
    const restWeight = clamp(1 - speed / .7, 0, 1);
    if (restWeight < .001 && !returningToRest) return;
    const centerOffset = Math.hypot(
      cardCenter.x - anchor.x,
      cardCenter.y - cardCenterY,
      cardCenter.z - anchor.z,
    );
    const tiltOffset = Math.hypot(
      cardTop.x - cardCenter.x,
      cardTop.y - cardCenter.y - cardPivotLength(),
      cardTop.z - cardCenter.z,
    );
    const canSleep = returningToRest
      && restReturnDuration > 3.2
      && centerOffset < .018
      && tiltOffset < .018;
    const returnProgress = clamp(restReturnDuration / .45, 0, 1);
    const returnWeight = returnProgress * returnProgress * (3 - 2 * returnProgress);
    const restSway = returningToRest
      ? Math.sin(restReturnDuration * Math.PI * 2 * .85)
        * .065
        * Math.exp(-.8 * restReturnDuration)
        * returnWeight
      : 0;
    const blend = returningToRest
      ? (1 - Math.exp(-10 * timeStep)) * returnWeight
      : restWeight * .022;
    const velocityRetention = returningToRest
      ? Math.exp(-13 * timeStep * returnWeight)
      : 1 - restWeight * .04;
    const settleParticle = (particle, targetX, targetY, targetZ) => {
      const offsetX = (targetX - particle.x) * blend;
      const offsetY = (targetY - particle.y) * blend;
      const offsetZ = (targetZ - particle.z) * blend;
      particle.x += offsetX;
      particle.y += offsetY;
      particle.z += offsetZ;
      particle.previousX += offsetX;
      particle.previousY += offsetY;
      particle.previousZ += offsetZ;
      particle.previousX = particle.x - (particle.x - particle.previousX) * velocityRetention;
      particle.previousY = particle.y - (particle.y - particle.previousY) * velocityRetention;
      particle.previousZ = particle.z - (particle.z - particle.previousZ) * velocityRetention;
    };

    ropePoints.slice(1).forEach((point, index) => {
      const progress = (index + 1) / (ropePoints.length - 1);
      settleParticle(point, anchor.x + restSway * progress, anchor.y - ropeSegmentLength * (index + 1), anchor.z);
    });
    settleParticle(metalBottom, anchor.x + restSway, metalBottomY, anchor.z);
    settleParticle(cardTop, anchor.x + restSway, cardTopY, anchor.z);
    settleParticle(cardCenter, anchor.x + restSway, cardCenterY, anchor.z);
    settleParticle(cardRight, anchor.x + restSway + cardArmLength(), cardCenterY, anchor.z);
    settleParticle(cardFront, anchor.x + restSway, cardCenterY, anchor.z + cardDepthLever());
    if (canSleep) {
      physicsAwake = false;
      calmDuration = 0;
      returningToRest = false;
      restReturnDuration = 0;
      releasedDuration = 0;
    }
  };

  const setExactRestPose = () => {
    ropePoints.forEach((point, index) => {
      setParticlePosition(point, anchor.x, anchor.y - ropeSegmentLength * index, anchor.z);
    });
    const ropeEndY = anchor.y - ropeLength;
    const metalBottomY = ropeEndY - metalHingeLength();
    const cardTopY = metalBottomY - ringHingeLength();
    const cardCenterY = cardTopY - cardPivotLength();
    setParticlePosition(metalBottom, anchor.x, metalBottomY, anchor.z);
    setParticlePosition(cardTop, anchor.x, cardTopY, anchor.z);
    setParticlePosition(cardCenter, anchor.x, cardCenterY, anchor.z);
    setParticlePosition(cardRight, anchor.x + cardArmLength(), cardCenterY, anchor.z);
    setParticlePosition(cardFront, anchor.x, cardCenterY, anchor.z + cardDepthLever());
  };

  const simulatePhysics = (timeStep) => {
    if (reducedMotion.matches) {
      ropePoints.forEach((point, index) => {
        const progress = index / (ropePoints.length - 1);
        point.x = anchor.x;
        point.y = anchor.y - ropeLength * progress;
        point.z = anchor.z;
        point.previousX = point.x;
        point.previousY = point.y;
        point.previousZ = point.z;
      });
      rebuildCardFrame(physicsScale, true);
      cardState.flip = cardState.flipTarget;
      cardState.flipVelocity = 0;
      return;
    }

    if (!physicsAwake && !cardState.dragging) {
      setExactRestPose();
      cardState.flipVelocity += (cardState.flipTarget - cardState.flip) * 48 * timeStep;
      cardState.flipVelocity *= Math.exp(-9 * timeStep);
      cardState.flip += cardState.flipVelocity * timeStep;
      return;
    }

    for (let index = 1; index < ropePoints.length; index += 1) {
      integrateParticle(ropePoints[index], timeStep);
    }
    metalBottom.inverseMass = metalBottom.restingInverseMass;
    integrateParticle(metalBottom, timeStep, .993);

    cardParticles.forEach((particle) => {
      particle.inverseMass = particle.restingInverseMass;
      integrateParticle(particle, timeStep, .994);
    });

    if (cardState.dragging) {
      cardCenter.inverseMass = 0;
      cardCenter.x = cardState.dragX;
      cardCenter.y = cardState.dragY;
      cardCenter.previousX = cardCenter.x;
      cardCenter.previousY = cardCenter.y;
    }

    for (let iteration = 0; iteration < 14; iteration += 1) {
      ropePoints[0].x = anchor.x;
      ropePoints[0].y = anchor.y;
      ropePoints[0].z = anchor.z;

      for (let index = 0; index < ropePoints.length - 1; index += 1) {
        solveDistance(ropePoints[index], ropePoints[index + 1], ropeSegmentLength);
      }

      rigidPairs.forEach((pair) => solveDistance(pair.first, pair.second, pair.length));
      solveDistance(attachmentParticle, metalBottom, metalHingeLength());
      solveDistance(metalBottom, cardTop, ringHingeLength());
      solveDistance(
        metalBottom,
        cardCenter,
        ringHingeLength() + cardPivotLength(),
        .08,
      );
      solveDistance(attachmentParticle, cardCenter, assemblyReach(), .025);

      if (cardState.dragging) {
        cardCenter.x = cardState.dragX;
        cardCenter.y = cardState.dragY;
      }
    }

    stabilizeCardFacing(timeStep);
    settleRestPose(timeStep);

    cardState.flipVelocity += (cardState.flipTarget - cardState.flip) * 48 * timeStep;
    cardState.flipVelocity *= Math.exp(-9 * timeStep);
    cardState.flip += cardState.flipVelocity * timeStep;
  };

  const renderRibbon = (clipBasis) => {
    ropePoints.forEach((point, index) => {
      smoothPointsA[index].x = point.x;
      smoothPointsA[index].y = point.y;
      smoothPointsA[index].z = point.z;
    });

    for (let pass = 0; pass < 2; pass += 1) {
      const source = pass % 2 ? smoothPointsB : smoothPointsA;
      const target = pass % 2 ? smoothPointsA : smoothPointsB;
      source.forEach((point, index) => {
        if (index === 0 || index === source.length - 1) {
          target[index].x = point.x;
          target[index].y = point.y;
          target[index].z = point.z;
          return;
        }
        target[index].x = source[index - 1].x * .2 + point.x * .6 + source[index + 1].x * .2;
        target[index].y = source[index - 1].y * .2 + point.y * .6 + source[index + 1].y * .2;
        target[index].z = source[index - 1].z * .2 + point.z * .6 + source[index + 1].z * .2;
      });
    }

    const endIndex = smoothPointsA.length - 1;
    const keeperCenterOffset = keeper.position.y * physicsScale;
    const keeperCenter = {
      x: clip.position.x + clipBasis.up.x * keeperCenterOffset,
      y: clip.position.y + clipBasis.up.y * keeperCenterOffset,
      z: clip.position.z + clipBasis.up.z * keeperCenterOffset,
    };
    const keeperLeadLength = .14 * physicsScale;
    smoothPointsA[endIndex].x = keeperCenter.x;
    smoothPointsA[endIndex].y = keeperCenter.y;
    smoothPointsA[endIndex].z = keeperCenter.z;
    smoothPointsA[endIndex - 1].x = keeperCenter.x + clipBasis.up.x * keeperLeadLength;
    smoothPointsA[endIndex - 1].y = keeperCenter.y + clipBasis.up.y * keeperLeadLength;
    smoothPointsA[endIndex - 1].z = keeperCenter.z + clipBasis.up.z * keeperLeadLength;

    const tangents = smoothPointsA.map((point, index) => {
      const previous = smoothPointsA[Math.max(0, index - 1)];
      const next = smoothPointsA[Math.min(smoothPointsA.length - 1, index + 1)];
      return normalizeVector(subtractVector(next, previous), { x: 0, y: -1, z: 0 });
    });
    const transportedSides = [];
    let side = normalizeVector(projectOnPlane({ x: 1, y: 0, z: 0 }, tangents[0]), { x: 0, y: 0, z: 1 });
    tangents.forEach((tangent, index) => {
      if (index) side = normalizeVector(projectOnPlane(side, tangent), transportedSides[index - 1]);
      transportedSides.push(side);
    });
    const endTangent = tangents[tangents.length - 1];
    const desiredEndSide = normalizeVector(projectOnPlane(clipBasis.right, endTangent), transportedSides.at(-1));
    const endSide = transportedSides.at(-1);
    const twistAngle = Math.atan2(
      dotVector(crossVector(endSide, desiredEndSide), endTangent),
      clamp(dotVector(endSide, desiredEndSide), -1, 1),
    );

    smoothPointsA.forEach((point, index) => {
      const progress = index / (smoothPointsA.length - 1);
      const easedProgress = progress * progress * (3 - 2 * progress);
      const ribbonSide = rotateAroundAxis(transportedSides[index], tangents[index], twistAngle * easedProgress);
      const halfSide = scaleVector(ribbonSide, ribbonWidth * physicsScale / 2);
      const normal = normalizeVector(crossVector(tangents[index], ribbonSide), { x: 0, y: 0, z: 1 });
      const offset = index * 6;
      ribbonPositions.set([
        point.x + halfSide.x, point.y + halfSide.y, point.z + halfSide.z,
        point.x - halfSide.x, point.y - halfSide.y, point.z - halfSide.z,
      ], offset);
      ribbonNormals.set([normal.x, normal.y, normal.z, normal.x, normal.y, normal.z], offset);
    });
    ribbonGeometry.attributes.position.needsUpdate = true;
    ribbonGeometry.attributes.normal.needsUpdate = true;
  };

  let active = true;
  let frame = 0;
  let lastTime = performance.now();
  let accumulatedTime = 0;

  const quaternionFromBasis = (right, up, front) => {
    const m00 = right.x; const m01 = up.x; const m02 = front.x;
    const m10 = right.y; const m11 = up.y; const m12 = front.y;
    const m20 = right.z; const m21 = up.z; const m22 = front.z;
    const trace = m00 + m11 + m22;
    let x; let y; let z; let w;
    if (trace > 0) {
      const scale = Math.sqrt(trace + 1) * 2;
      w = .25 * scale;
      x = (m21 - m12) / scale;
      y = (m02 - m20) / scale;
      z = (m10 - m01) / scale;
    } else if (m00 > m11 && m00 > m22) {
      const scale = Math.sqrt(1 + m00 - m11 - m22) * 2;
      w = (m21 - m12) / scale;
      x = .25 * scale;
      y = (m01 + m10) / scale;
      z = (m02 + m20) / scale;
    } else if (m11 > m22) {
      const scale = Math.sqrt(1 + m11 - m00 - m22) * 2;
      w = (m02 - m20) / scale;
      x = (m01 + m10) / scale;
      y = .25 * scale;
      z = (m12 + m21) / scale;
    } else {
      const scale = Math.sqrt(1 + m22 - m00 - m11) * 2;
      w = (m10 - m01) / scale;
      x = (m02 + m20) / scale;
      y = (m12 + m21) / scale;
      z = .25 * scale;
    }
    return { x, y, z, w };
  };

  const getLinkBasis = (bottom, top, preferredFront) => {
    const up = normalizeVector(subtractVector(top, bottom), { x: 0, y: 1, z: 0 });
    const front = normalizeVector(projectOnPlane(preferredFront, up), { x: 0, y: 0, z: 1 });
    const right = normalizeVector(crossVector(up, front), { x: 1, y: 0, z: 0 });
    return { right, up, front: normalizeVector(crossVector(right, up), front) };
  };

  const placeHingePart = (transform, bottom, top, preferredFront) => {
    const basis = getLinkBasis(bottom, top, preferredFront);
    const quaternion = quaternionFromBasis(basis.right, basis.up, basis.front);
    transform.position.set(
      (bottom.x + top.x) / 2,
      (bottom.y + top.y) / 2,
      (bottom.z + top.z) / 2,
    );
    transform.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    return basis;
  };

  const updateScene = () => {
    const basis = getCardBasis();
    const cosine = Math.cos(cardState.flip);
    const sine = Math.sin(cardState.flip);
    const renderedRight = {
      x: basis.right.x * cosine - basis.front.x * sine,
      y: basis.right.y * cosine - basis.front.y * sine,
      z: basis.right.z * cosine - basis.front.z * sine,
    };
    const renderedFront = {
      x: basis.right.x * sine + basis.front.x * cosine,
      y: basis.right.y * sine + basis.front.y * cosine,
      z: basis.right.z * sine + basis.front.z * cosine,
    };
    const quaternion = quaternionFromBasis(renderedRight, basis.up, renderedFront);
    card.position.set(cardCenter.x, cardCenter.y, cardCenter.z);
    card.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    placeHingePart(ringHinge, cardTop, metalBottom, renderedFront);
    ringHinge.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    const connectorOffset = .17 * physicsScale;
    cardConnector.position.set(
      cardTop.x + basis.up.x * connectorOffset,
      cardTop.y + basis.up.y * connectorOffset,
      cardTop.z + basis.up.z * connectorOffset,
    );
    cardConnector.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    const clipBasis = placeHingePart(clip, metalBottom, attachmentParticle, renderedFront);
    renderRibbon(clipBasis);
  };

  const update = (time = performance.now()) => {
    if (!active) return;
    const elapsed = Math.min((time - lastTime) / 1000, .05);
    lastTime = time;
    accumulatedTime += Math.max(0, elapsed);

    while (accumulatedTime >= fixedTimeStep) {
      simulatePhysics(fixedTimeStep);
      accumulatedTime -= fixedTimeStep;
    }

    updateScene(time);
    renderer.render({ scene, camera });
    frame = requestAnimationFrame(update);
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    cancelAnimationFrame(frame);
    if (active) {
      lastTime = performance.now();
      accumulatedTime = 0;
      update(lastTime);
    }
  }, { rootMargin: '180px' });

  resize();
  simulatePhysics(fixedTimeStep);
  updateScene(performance.now());
  renderer.render({ scene, camera });
  visibilityObserver.observe(stage);
  const stageResizeObserver = new ResizeObserver(resize);
  stageResizeObserver.observe(stage);
  window.addEventListener('resize', resize, { passive: true });
};

const loadObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    initializeStage(entry.target).catch(() => entry.target.classList.add('webgl-failed'));
  });
}, { rootMargin: '300px' });

stages.forEach((stage) => loadObserver.observe(stage));
