// 3D Kuromi Character using Three.js
let scene, camera, renderer, kuromi;
const kuromiConfig = {
    scale: 2,
    animating: true,
    animations: {
        idle: 0,
        waving: 1,
        dancing: 2,
        reacting: 3
    },
    currentAnimation: 0
};

function initKuromi() {
    const container = document.getElementById('kuromiContainer');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 1000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create Kuromi
    createKuromi();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createKuromi() {
    const group = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.6,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.castShadow = true;
    head.receiveShadow = true;
    head.position.y = 1.5;
    group.add(head);

    // Ears
    createEar(group, -0.4, 1.8, 1);
    createEar(group, 0.4, 1.8, -1);

    // Eyes
    createEyes(group);

    // Horn
    createHorn(group);

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.6, 1.5, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.7,
        metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0;
    group.add(body);

    // Arms
    createArm(group, -0.7, 0.5, 1);
    createArm(group, 0.7, 0.5, -1);

    // Legs
    createLeg(group, -0.35, -1);
    createLeg(group, 0.35, -1);

    // Tail
    createTail(group);

    group.scale.set(kuromiConfig.scale, kuromiConfig.scale, kuromiConfig.scale);
    scene.add(group);
    kuromi = group;
}

function createEar(parent, x, y, side) {
    const earGeometry = new THREE.ConeGeometry(0.25, 0.8, 8);
    const earMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.6
    });
    const ear = new THREE.Mesh(earGeometry, earMaterial);
    ear.castShadow = true;
    ear.receiveShadow = true;
    ear.position.set(x * side, y, 0);
    ear.rotation.z = side * 0.3;
    parent.add(ear);

    // Inner ear
    const innerGeometry = new THREE.ConeGeometry(0.12, 0.4, 8);
    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff69b4,
        roughness: 0.5
    });
    const innerEar = new THREE.Mesh(innerGeometry, innerMaterial);
    innerEar.position.set(x * side, y - 0.15, 0.1);
    innerEar.scale.z = 0.5;
    parent.add(innerEar);
}

function createEyes(parent) {
    // Left eye
    const eyeGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.2
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.castShadow = true;
    leftEye.position.set(-0.3, 1.7, 0.8);
    leftEye.scale.set(0.4, 0.5, 0.3);
    parent.add(leftEye);

    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.castShadow = true;
    rightEye.position.set(0.3, 1.7, 0.8);
    rightEye.scale.set(0.4, 0.5, 0.3);
    parent.add(rightEye);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.3, 1.65, 0.95);
    parent.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.3, 1.65, 0.95);
    parent.add(rightPupil);

    // Eyebrows (angry look)
    const browGeometry = new THREE.BoxGeometry(0.35, 0.08, 0.05);
    const browMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    
    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.3, 1.95, 0.8);
    leftBrow.rotation.z = -0.3;
    parent.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.3, 1.95, 0.8);
    rightBrow.rotation.z = 0.3;
    parent.add(rightBrow);
}

function createHorn(parent) {
    const hornGeometry = new THREE.ConeGeometry(0.15, 0.6, 8);
    const hornMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.3
    });
    const horn = new THREE.Mesh(hornGeometry, hornMaterial);
    horn.castShadow = true;
    horn.position.set(0, 2.2, 0);
    horn.rotation.z = 0.2;
    parent.add(horn);
}

function createArm(parent, x, y, side) {
    const armGeometry = new THREE.CapsuleGeometry(0.2, 0.8, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.6
    });
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.castShadow = true;
    arm.receiveShadow = true;
    arm.position.set(x, y, 0);
    arm.rotation.z = side * 0.2;
    arm.name = side === 1 ? 'leftArm' : 'rightArm';
    parent.add(arm);

    // Hand
    const handGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const handMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.6
    });
    const hand = new THREE.Mesh(handGeometry, handMaterial);
    hand.castShadow = true;
    hand.position.set(x, y - 0.55, 0);
    parent.add(hand);
}

function createLeg(parent, x, y) {
    const legGeometry = new THREE.CapsuleGeometry(0.18, 0.7, 4, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.7
    });
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.castShadow = true;
    leg.receiveShadow = true;
    leg.position.set(x, y, 0);
    parent.add(leg);

    // Foot
    const footGeometry = new THREE.BoxGeometry(0.35, 0.2, 0.25);
    const footMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.8
    });
    const foot = new THREE.Mesh(footGeometry, footMaterial);
    foot.castShadow = true;
    foot.receiveShadow = true;
    foot.position.set(x, y - 0.5, 0);
    parent.add(foot);
}

function createTail(parent) {
    const tailGroup = new THREE.Group();
    const segments = 5;
    
    for (let i = 0; i < segments; i++) {
        const tailGeometry = new THREE.ConeGeometry(0.15 - i * 0.02, 0.4, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({
            color: 0xff69b4,
            roughness: 0.6
        });
        const tailSegment = new THREE.Mesh(tailGeometry, tailMaterial);
        tailSegment.castShadow = true;
        tailSegment.receiveShadow = true;
        tailSegment.position.y = -0.2 - i * 0.35;
        tailSegment.rotation.x = 0.3 + i * 0.15;
        tailGroup.add(tailSegment);
    }
    
    tailGroup.position.set(0, -0.7, -0.5);
    tailGroup.rotation.z = 0.4;
    tailGroup.name = 'tail';
    parent.add(tailGroup);
}

function animateKuromi() {
    const time = Date.now() * 0.001;

    if (kuromiConfig.currentAnimation === kuromiConfig.animations.idle) {
        // Idle - gentle sway
        kuromi.rotation.y = Math.sin(time * 0.5) * 0.1;
        kuromi.position.y = Math.sin(time * 0.8) * 0.1;
    } else if (kuromiConfig.currentAnimation === kuromiConfig.animations.waving) {
        // Waving animation
        const leftArm = kuromi.children.find(child => child.name === 'leftArm');
        if (leftArm) {
            leftArm.rotation.z = Math.sin(time * 3) * 0.8 - 0.5;
        }
    } else if (kuromiConfig.currentAnimation === kuromiConfig.animations.dancing) {
        // Dancing
        kuromi.rotation.y = Math.sin(time * 2) * 0.3;
        kuromi.position.x = Math.sin(time * 2) * 0.3;
        kuromi.position.y = Math.sin(time * 4) * 0.15;
    }

    // Tail sway
    const tail = kuromi.children.find(child => child.name === 'tail');
    if (tail) {
        tail.rotation.z = 0.4 + Math.sin(time * 1.5) * 0.3;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (kuromiConfig.animating) {
        animateKuromi();
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('kuromiContainer');
    if (!container) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function setKuromiAnimation(animationType) {
    kuromiConfig.currentAnimation = animationType;
}

function rotateKuromi(x, y, z) {
    if (kuromi) {
        kuromi.rotation.x += x;
        kuromi.rotation.y += y;
        kuromi.rotation.z += z;
    }
}
