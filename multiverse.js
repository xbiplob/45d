// Multiverse Explorer Module

// DOM Elements
const multiverseViewer = document.getElementById('multiverse-viewer');
const theoryButtons = document.querySelectorAll('.theory-btn');

// Multiverse variables
let scene, camera, renderer;
let universes = [];
let wormholes = [];
let timeTravelEffects = [];
let clock = new THREE.Clock();
let currentTheory = 'wormholes';

// Theory data
const theoryData = {
    wormholes: {
        name: "Wormholes",
        description: "Theoretical shortcuts through spacetime",
        color: 0x00bfff
    },
    parallel: {
        name: "Parallel Universes",
        description: "Multiple coexisting realities",
        color: 0xff33cc
    },
    bubble: {
        name: "Bubble Universes",
        description: "Inflationary multiverse theory",
        color: 0x33ff33
    },
    time: {
        name: "Time Travel",
        description: "Paradoxes and temporal mechanics",
        color: 0xff9900
    }
};

// Initialize multiverse explorer
function initMultiverseExplorer() {
    if (!multiverseViewer) return;
    
    // Set up Three.js scene
    setupMultiverseScene();
    
    // Create initial visualization
    createMultiverseVisualization();
    
    // Set up controls
    setupMultiverseControls();
    
    // Start animation
    animateMultiverse();
}

// Set up Three.js scene for multiverse explorer
function setupMultiverseScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a);
    scene.fog = new THREE.Fog(0x0a0a2a, 50, 300);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        multiverseViewer.clientWidth / multiverseViewer.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 0, 100);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(multiverseViewer.clientWidth, multiverseViewer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    multiverseViewer.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-50, -50, -50);
    scene.add(backLight);
    
    // Add starfield background
    createMultiverseStarfield();
}

// Create starfield for multiverse explorer
function createMultiverseStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute(
        'position', 
        new THREE.Float32BufferAttribute(starVertices, 3)
    );
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

// Create multiverse visualization based on current theory
function createMultiverseVisualization() {
    // Clear existing objects
    clearMultiverseObjects();
    
    // Create visualization based on current theory
    switch (currentTheory) {
        case 'wormholes':
            createWormholeVisualization();
            break;
        case 'parallel':
            createParallelUniverseVisualization();
            break;
        case 'bubble':
            createBubbleUniverseVisualization();
            break;
        case 'time':
            createTimeTravelVisualization();
            break;
    }
}

// Clear multiverse objects
function clearMultiverseObjects() {
    // Remove universes
    universes.forEach(universe => scene.remove(universe));
    universes = [];
    
    // Remove wormholes
    wormholes.forEach(wormhole => scene.remove(wormhole));
    wormholes = [];
    
    // Remove time travel effects
    timeTravelEffects.forEach(effect => scene.remove(effect));
    timeTravelEffects = [];
}

// Create wormhole visualization
function createWormholeVisualization() {
    // Create multiple wormholes
    for (let i = 0; i < 5; i++) {
        createWormhole(
            new THREE.Vector3(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            ),
            new THREE.Vector3(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            )
        );
    }
    
    // Create central wormhole
    createWormhole(
        new THREE.Vector3(-30, 0, 0),
        new THREE.Vector3(30, 0, 0),
        true // central
    );
}

// Create a wormhole
function createWormhole(startPoint, endPoint, isCentral = false) {
    // Create the wormhole tube
    const curve = new THREE.CatmullRomCurve3([
        startPoint,
        new THREE.Vector3(
            (startPoint.x + endPoint.x) / 2 + (Math.random() - 0.5) * 20,
            (startPoint.y + endPoint.y) / 2 + (Math.random() - 0.5) * 20,
            (startPoint.z + endPoint.z) / 2 + (Math.random() - 0.5) * 20
        ),
        endPoint
    ]);
    
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, isCentral ? 3 : 1.5, 8, false);
    const tubeMaterial = new THREE.MeshPhongMaterial({
        color: isCentral ? 0x00bfff : 0x0088cc,
        transparent: true,
        opacity: 0.7,
        emissive: isCentral ? 0x004466 : 0x003344,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });
    
    const wormholeTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(wormholeTube);
    wormholes.push(wormholeTube);
    
    // Create entry/exit points
    const entryGeometry = new THREE.SphereGeometry(isCentral ? 5 : 3, 32, 32);
    const entryMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        emissive: 0x004444,
        emissiveIntensity: 0.5
    });
    
    const entryPoint = new THREE.Mesh(entryGeometry, entryMaterial);
    entryPoint.position.copy(startPoint);
    scene.add(entryPoint);
    wormholes.push(entryPoint);
    
    const exitPoint = new THREE.Mesh(entryGeometry, entryMaterial);
    exitPoint.position.copy(endPoint);
    scene.add(exitPoint);
    wormholes.push(exitPoint);
    
    // Add animation data
    wormholeTube.userData = {
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.01 - 0.005,
            Math.random() * 0.01 - 0.005,
            Math.random() * 0.01 - 0.005
        ),
        pulseSpeed: Math.random() * 0.02 + 0.01
    };
}

// Create parallel universe visualization
function createParallelUniverseVisualization() {
    // Create multiple parallel universes
    const universeCount = 7;
    
    for (let i = 0; i < universeCount; i++) {
        const offset = (i - (universeCount - 1) / 2) * 20;
        createUniverse(offset, i);
    }
}

// Create a universe
function createUniverse(offset, index) {
    // Create universe sphere
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${index * 50}, 70%, 60%)`),
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color(`hsl(${index * 50}, 70%, 30%)`),
        emissiveIntensity: 0.3
    });
    
    const universe = new THREE.Mesh(geometry, material);
    universe.position.x = offset;
    scene.add(universe);
    universes.push(universe);
    
    // Add animation data
    universe.userData = {
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.005 - 0.0025,
            Math.random() * 0.005 - 0.0025,
            Math.random() * 0.005 - 0.0025
        ),
        pulseSpeed: Math.random() * 0.02 + 0.01,
        baseScale: 1
    };
    
    // Add internal structure
    addUniverseStructure(universe, index);
}

// Add structure to a universe
function addUniverseStructure(universe, index) {
    // Add some internal elements
    const structureCount = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < structureCount; i++) {
        const size = Math.random() * 3 + 1;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${index * 50 + 20}, 80%, 70%)`),
            transparent: true,
            opacity: 0.6
        });
        
        const structure = new THREE.Mesh(geometry, material);
        
        // Position within the universe
        structure.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        universe.add(structure);
    }
}

// Create bubble universe visualization
function createBubbleUniverseVisualization() {
    // Create cosmic foam of bubble universes
    const bubbleCount = 20;
    
    for (let i = 0; i < bubbleCount; i++) {
        createBubbleUniverse(i);
    }
}

// Create a bubble universe
function createBubbleUniverse(index) {
    const geometry = new THREE.SphereGeometry(8, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${index * 18}, 80%, 60%)`),
        transparent: true,
        opacity: 0.7,
        emissive: new THREE.Color(`hsl(${index * 18}, 80%, 30%)`),
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
    });
    
    const bubble = new THREE.Mesh(geometry, material);
    
    // Position in 3D space
    bubble.position.set(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150
    );
    
    scene.add(bubble);
    universes.push(bubble);
    
    // Add animation data
    bubble.userData = {
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.005 - 0.0025,
            Math.random() * 0.005 - 0.0025,
            Math.random() * 0.005 - 0.0025
        ),
        pulseSpeed: Math.random() * 0.03 + 0.01,
        baseScale: 1
    };
}

// Create time travel visualization
function createTimeTravelVisualization() {
    // Create a timeline
    createTimeline();
    
    // Create time travel effects
    createTimeTravelEffects();
}

// Create timeline for time travel visualization
function createTimeline() {
    // Create timeline axis
    const axisGeometry = new THREE.CylinderGeometry(0.5, 0.5, 100, 32);
    const axisMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    
    const timelineAxis = new THREE.Mesh(axisGeometry, axisMaterial);
    timelineAxis.rotation.z = Math.PI / 2;
    scene.add(timelineAxis);
    timeTravelEffects.push(timelineAxis);
    
    // Create time markers
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue; // Skip present
        
        const markerGeometry = new THREE.SphereGeometry(1, 16, 16);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: i < 0 ? 0xff3333 : 0x33ff33,
            emissive: i < 0 ? 0x440000 : 0x004400
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.x = i * 10;
        scene.add(marker);
        timeTravelEffects.push(marker);
        
        // Add label
        marker.userData = {
            time: i,
            color: i < 0 ? 0xff3333 : 0x33ff33
        };
    }
    
    // Create present marker
    const presentGeometry = new THREE.SphereGeometry(2, 32, 32);
    const presentMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0x444400
    });
    
    const presentMarker = new THREE.Mesh(presentGeometry, presentMaterial);
    scene.add(presentMarker);
    timeTravelEffects.push(presentMarker);
}

// Create time travel effects
function createTimeTravelEffects() {
    // Create time vortex
    const vortexGeometry = new THREE.CylinderGeometry(0, 10, 30, 32);
    const vortexMaterial = new THREE.MeshPhongMaterial({
        color: 0x9933ff,
        transparent: true,
        opacity: 0.6,
        emissive: 0x330066,
        side: THREE.DoubleSide
    });
    
    const vortex = new THREE.Mesh(vortexGeometry, vortexMaterial);
    vortex.position.y = 20;
    scene.add(vortex);
    timeTravelEffects.push(vortex);
    
    // Add animation data
    vortex.userData = {
        rotationSpeed: 0.02
    };
    
    // Create time particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position particles in a spiral
        const angle = (i / particleCount) * Math.PI * 10;
        const radius = (i / particleCount) * 15;
        const y = (i / particleCount) * 30 - 15;
        
        particlePositions[i3] = Math.cos(angle) * radius;
        particlePositions[i3 + 1] = y;
        particlePositions[i3 + 2] = Math.sin(angle) * radius;
        
        // Color particles
        particleColors[i3] = 0.6 + Math.random() * 0.4; // R
        particleColors[i3 + 1] = 0.2 + Math.random() * 0.4; // G
        particleColors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlePositions, 3)
    );
    
    particleGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(particleColors, 3)
    );
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.y = 20;
    scene.add(particles);
    timeTravelEffects.push(particles);
    
    // Add animation data
    particles.userData = {
        rotationSpeed: 0.01,
        verticalSpeed: 0.05
    };
}

// Set up multiverse controls
function setupMultiverseControls() {
    // Theory selector buttons
    theoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Update active button
            theoryButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update current theory
            currentTheory = e.target.dataset.theory;
            
            // Recreate visualization
            createMultiverseVisualization();
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', onMultiverseResize);
}

// Handle window resize for multiverse explorer
function onMultiverseResize() {
    if (!multiverseViewer) return;
    
    camera.aspect = multiverseViewer.clientWidth / multiverseViewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(multiverseViewer.clientWidth, multiverseViewer.clientHeight);
}

// Multiverse animation loop
function animateMultiverse() {
    requestAnimationFrame(animateMultiverse);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    // Update multiverse visualization
    updateMultiverse(delta, time);
    
    // Render scene
    renderer.render(scene, camera);
}

// Update multiverse visualization
function updateMultiverse(delta, time) {
    // Rotate wormholes
    wormholes.forEach(wormhole => {
        if (wormhole.userData.rotationSpeed) {
            wormhole.rotation.x += wormhole.userData.rotationSpeed.x;
            wormhole.rotation.y += wormhole.userData.rotationSpeed.y;
            wormhole.rotation.z += wormhole.userData.rotationSpeed.z;
        }
        
        if (wormhole.userData.pulseSpeed) {
            const scale = 1 + Math.sin(time * wormhole.userData.pulseSpeed) * 0.1;
            wormhole.scale.set(scale, scale, scale);
        }
    });
    
    // Rotate universes
    universes.forEach(universe => {
        if (universe.userData.rotationSpeed) {
            universe.rotation.x += universe.userData.rotationSpeed.x;
            universe.rotation.y += universe.userData.rotationSpeed.y;
            universe.rotation.z += universe.userData.rotationSpeed.z;
        }
        
        if (universe.userData.pulseSpeed) {
            const scale = universe.userData.baseScale + 
                         Math.sin(time * universe.userData.pulseSpeed) * 0.05;
            universe.scale.set(scale, scale, scale);
        }
    });
    
    // Update time travel effects
    timeTravelEffects.forEach(effect => {
        if (effect.userData && effect.userData.rotationSpeed) {
            effect.rotation.y += effect.userData.rotationSpeed;
        }
        
        if (effect.userData && effect.userData.verticalSpeed) {
            effect.position.y += Math.sin(time * 2) * effect.userData.verticalSpeed;
        }
    });
    
    // Move camera in a slow circle around the scene
    camera.position.x = Math.sin(time * 0.1) * 100;
    camera.position.z = Math.cos(time * 0.1) * 100;
    camera.lookAt(0, 0, 0);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the multiverse section to be visible
    const multiverseSection = document.getElementById('multiverse');
    if (multiverseSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initMultiverseExplorer();
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(multiverseSection);
    }
});

// Export for use in other modules
window.MultiverseExplorer = {
    init: initMultiverseExplorer
};
