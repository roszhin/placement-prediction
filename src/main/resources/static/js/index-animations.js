document.addEventListener("DOMContentLoaded", () => {
    initIndexAnimations();
});

let threeScene = null;
let shapeGridInstance = null;

function initIndexAnimations() {
    setupLenis();
    initShapeGrid();
    
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    ScrollTrigger.create({
        start: 'top -50', end: 99999,
        toggleClass: {className: 'nav-scrolled', targets: '#navbar'}
    });

    mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
        threeScene = initProceduralAICore();
        createCinematicStoryTimeline();
    });
}

function initShapeGrid() {
    const canvas = document.getElementById('shapegrid-canvas');
    if (canvas && window.ShapeGrid) {
        shapeGridInstance = new ShapeGrid(canvas, {
            direction: 'diagonal',
            speed: 0.5,
            squareSize: 40,
            borderColor: 'rgba(15, 23, 42, 0.06)',
            hoverFillColor: 'rgba(6, 182, 212, 0.16)', // Brand cyan glow on hover
            shape: 'square',
            hoverTrailAmount: 5,
            mouseTarget: '#viewport',
            vignetteColor: 'rgba(248, 250, 252, 0.45)'
        });
    }
}

function setupLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
        if (threeScene && threeScene.render) threeScene.render(time);
    });
    gsap.ticker.lagSmoothing(0);
}

// ----------------------------------------------------
// 3D AI CORE (Retained from previous implementation)
// ----------------------------------------------------
function initProceduralAICore() {
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const sphereGeo = new THREE.IcosahedronGeometry(2, 8);
    const sphereMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x0F172A, emissive: 0x0F172A, emissiveIntensity: 0.1,
        roughness: 0.1, metalness: 0.5, transmission: 0.6, thickness: 1.0, clearcoat: 1.0
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(sphere);

    const rings = [];
    const ringColors = [0xF59E0B, 0x06B6D4, 0x06B6D4, 0xF59E0B, 0x06B6D4];
    for(let i = 0; i < 5; i++) {
        const ringGeo = new THREE.RingGeometry(2.5 + (i * 0.5), 2.52 + (i * 0.5), 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[i], side: THREE.DoubleSide, transparent: true, opacity: 0.15 + (i * 0.05) });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        rings.push({ mesh: ring, baseSpeedX: (Math.random() - 0.5) * 0.01, baseSpeedY: (Math.random() - 0.5) * 0.01 });
        coreGroup.add(ring);
    }

    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = window.innerWidth > 768 ? 200 : 50;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 10;
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.04, color: 0xF59E0B, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    coreGroup.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const cyanLight = new THREE.PointLight(0x06B6D4, 2, 20); cyanLight.position.set(-3, 3, 3); scene.add(cyanLight);
    const orangeLight = new THREE.PointLight(0xF59E0B, 1.5, 20); orangeLight.position.set(3, -3, 2); scene.add(orangeLight);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const state = { rotationSpeed: 0, particleSpeed: 0, glowIntensity: 0.1, coreScale: 1 };
    const render = () => {
        coreGroup.rotation.y += state.rotationSpeed; coreGroup.rotation.x += state.rotationSpeed * 0.5;
        coreGroup.scale.set(state.coreScale, state.coreScale, state.coreScale);
        sphereMat.emissiveIntensity = state.glowIntensity;
        rings.forEach(r => { r.mesh.rotation.x += r.baseSpeedX + (state.rotationSpeed*0.5); r.mesh.rotation.y += r.baseSpeedY + (state.rotationSpeed*0.5); });
        particles.rotation.y -= state.particleSpeed; particles.rotation.z += state.particleSpeed * 0.5;
        renderer.render(scene, camera);
    };

    return { render, state };
}

// ----------------------------------------------------
// THE MASSIVE 2000VH CINEMATIC STORY TIMELINE
// ----------------------------------------------------
function createCinematicStoryTimeline() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#master-scroll-track',
            start: 'top top+=80', // Begin pinning immediately, respecting the 80px header
            end: 'bottom bottom',
            scrub: 1.5,
            pin: '#viewport' 
        }
    });

    // Helper proxy to animate numbers cleanly
    const numProxy = { cs1: 0, cs2: 0, cs3: 0, cs4: 0, final: 0 };
    const updateNum = (id, key) => { const el = document.getElementById(id); if (el) el.innerHTML = Math.round(numProxy[key]) + '%'; };

    // ==========================================
    // PHASE 1: HERO
    // 0 - 5%
    // ==========================================
    tl.to('#hero-left', { x: -100, opacity: 0, duration: 4 }, 0)
      .to('#act-profile', { y: -100, opacity: 0, duration: 4 }, 0)
      .to('#act-job', { y: 100, opacity: 0, duration: 4 }, 0)
      .to('#fake-ai', { scale: 0, opacity: 0, duration: 3 }, 0)
      .to('#webgl-container', { opacity: 1, duration: 5 }, 0)
      .to('#shapegrid-wrapper', { opacity: 0.35, duration: 5 }, 0)
      .to(threeScene.state, { rotationSpeed: 0.002, duration: 5 }, 0);

    // ==========================================
    // PHASE 2: RESUME ENTERS
    // 5 - 10%
    // ==========================================
    tl.to('#act-resume', { top: '50%', left: '50%', xPercent: -50, yPercent: -50, scale: 1.1, duration: 5 }, 5)
      .to('#st-main', { innerHTML: 'STAGE 1', duration: 1 }, 5)
      .to('#st-sub', { innerHTML: 'DOCUMENT INGESTION', duration: 1 }, 5)
      .to('.stage-title', { opacity: 1, duration: 2 }, 5);

    // ==========================================
    // PHASE 3: RESUME SCANNING
    // 10 - 20%
    // ==========================================
    tl.to('#act-scan', { opacity: 1, duration: 1 }, 10)
      .to('#act-scan', { top: '100%', duration: 8, ease: 'none' }, 11)
      .to('#act-scan', { opacity: 0, duration: 1 }, 19)
      
      .to('#res-edu', { backgroundColor: 'rgba(6,182,212,0.1)', duration: 1 }, 12)
      .to('#res-skl', { backgroundColor: 'rgba(6,182,212,0.1)', duration: 1 }, 14)
      .to('#res-prj', { backgroundColor: 'rgba(6,182,212,0.1)', duration: 1 }, 16)
      .to('#res-cert', { backgroundColor: 'rgba(6,182,212,0.1)', duration: 1 }, 18);

    // ==========================================
    // PHASE 4: DATA EXTRACTION (SEQUENTIAL)
    // 20 - 30%
    // ==========================================
    tl.to('#st-sub', { innerHTML: 'DATA EXTRACTION', duration: 1 }, 20);
    // Extracted particles sequentially fire from Resume center to AI
    const ext = [
        { id: '#dp-1', time: 21 },
        { id: '#dp-2', time: 22 },
        { id: '#dp-3', time: 24 },
        { id: '#dp-4', time: 25 },
        { id: '#dp-5', time: 27 },
        { id: '#dp-6', time: 28 }
    ];
    ext.forEach(e => {
        tl.set(e.id, { top: '50%', left: '50%', xPercent: -50, yPercent: -50, scale: 0.5 })
          .to(e.id, { opacity: 1, scale: 1, duration: 0.5 }, e.time)
          .to(e.id, { y: -150, opacity: 0, scale: 1.5, duration: 1.5, ease: 'power2.in' }, e.time + 0.5);
    });

    // ==========================================
    // PHASE 5: AI PROCESSING
    // 30 - 40%
    // ==========================================
    tl.to('#act-resume', { xPercent: -150, scale: 0.7, opacity: 0.2, duration: 5 }, 30) // Move resume aside
      .to(threeScene.state, { rotationSpeed: 0.05, particleSpeed: 0.1, glowIntensity: 0.8, duration: 10 }, 30)
      .to('#bg-txt', { opacity: 0.3, innerHTML: 'ANALYZING', duration: 2 }, 30)
      .to('#st-sub', { innerHTML: 'SEMANTIC PROCESSING', duration: 1 }, 30)
      
      // Background text sequence
      .to('#bg-txt', { opacity: 0, duration: 1 }, 33)
      .to('#bg-txt', { opacity: 0.3, innerHTML: 'UNDERSTANDING', duration: 1 }, 34)
      .to('#bg-txt', { opacity: 0, duration: 1 }, 37)
      .to('#bg-txt', { opacity: 0.3, innerHTML: 'PROCESSING', duration: 1 }, 38);

    // ==========================================
    // PHASE 6: SKILL ANALYSIS
    // 40 - 50%
    // ==========================================
    tl.to('#st-sub', { innerHTML: 'SKILL CLASSIFICATION', duration: 1 }, 40)
      .to('#bg-txt', { opacity: 0, duration: 2 }, 40);
    // The DP particles return as organized data nodes around the core
    const skills = [
        { id: '#dp-1', time: 41, x: -180, y: -180 },
        { id: '#dp-2', time: 42, x: 180, y: -180 },
        { id: '#dp-3', time: 43, x: -180, y: 180 },
        { id: '#dp-4', time: 44, x: 180, y: 180 }
    ];
    skills.forEach(s => {
        tl.fromTo(s.id, { x: 0, y: 0, scale: 0, opacity: 0 }, { x: s.x, y: s.y, scale: 1, opacity: 1, duration: 3, ease: 'back.out(1.5)' }, s.time);
    });

    // ==========================================
    // PHASE 7: JOB REQUIREMENTS ENTER
    // 50 - 60%
    // ==========================================
    tl.to('#st-sub', { innerHTML: 'INGESTING JOB VECTOR', duration: 1 }, 50)
      .to('#act-job-reqs', { right: '10%', opacity: 1, duration: 5, ease: 'power2.out' }, 52); // Enters from right

    // ==========================================
    // PHASE 8: CANDIDATE VS JOB
    // 60 - 70%
    // ==========================================
    tl.to('#st-sub', { innerHTML: 'CROSS-DIMENSIONAL COMPARISON', duration: 1 }, 60)
      .to('#dp-1, #dp-2, #dp-3, #dp-4', { scale: 0, opacity: 0, duration: 2 }, 60) // Hide orbit skills
      .to('#act-resume, #act-job-reqs', { opacity: 0, duration: 3 }, 60) // Hide cards to focus purely on comparison
      
      // Comparison lists slide out
      .to('#comp-cand', { opacity: 1, left: '20%', duration: 4, ease: 'power2.out' }, 62)
      .to('#comp-job', { opacity: 1, right: '20%', duration: 4, ease: 'power2.out' }, 62)
      
      // Sequentially highlight checks
      .to('.cc-i, .cj-i', { backgroundColor: 'rgba(6,182,212,0.1)', duration: 4, stagger: 0.5 }, 64);

    // ==========================================
    // PHASE 9: MATCH CALCULATION
    // 70 - 80%
    // ==========================================
    tl.to('#comp-cand, #comp-job', { opacity: 0.2, scale: 0.8, duration: 3 }, 70)
      .to('#st-sub', { innerHTML: 'SCORING ALGORITHM', duration: 1 }, 70)
      .to('#calc-stats', { opacity: 1, duration: 2 }, 70)
      
      // Sequentially count up stats
      .to('#cs-1', { opacity: 1, y: 0, duration: 2 }, 71)
      .to(numProxy, { cs1: 82, duration: 2, onUpdate: () => updateNum('csv-1', 'cs1') }, 71)
      
      .to('#cs-2', { opacity: 1, y: 0, duration: 2 }, 73)
      .to(numProxy, { cs2: 94, duration: 2, onUpdate: () => updateNum('csv-2', 'cs2') }, 73)
      
      .to('#cs-3', { opacity: 1, y: 0, duration: 2 }, 75)
      .to(numProxy, { cs3: 90, duration: 2, onUpdate: () => updateNum('csv-3', 'cs3') }, 75)
      
      .to('#cs-4', { opacity: 1, y: 0, duration: 2 }, 77)
      .to(numProxy, { cs4: 76, duration: 2, onUpdate: () => updateNum('csv-4', 'cs4') }, 77)
      
      // Final Score Boom
      .to(threeScene.state, { coreScale: 1.2, glowIntensity: 1.5, duration: 2 }, 78)
      .to('#cs-final', { opacity: 1, y: 0, scale: 1.2, duration: 2, ease:'back.out(1.5)' }, 79)
      .to(numProxy, { final: 87, duration: 2, onUpdate: () => updateNum('csv-final', 'final') }, 79);

    // ==========================================
    // PHASE 10: SKILL GAP
    // 80 - 85%
    // ==========================================
    tl.to('#calc-stats, #comp-cand', { opacity: 0, duration: 2 }, 80)
      .to('#comp-job', { opacity: 1, scale: 1, right: '50%', xPercent: 50, duration: 2 }, 80) // Job card centers
      .to('.cj-aws', { backgroundColor: 'rgba(239, 68, 68, 0.2)', scale: 1.1, duration: 1 }, 81) // Highlight missing AWS
      .to('#st-sub', { innerHTML: 'IDENTIFYING GROWTH VECTORS', duration: 1 }, 80)
      
      .to('#comp-job', { opacity: 0, duration: 1 }, 82)
      .to('#skill-gap', { opacity: 1, duration: 2 }, 83); // Show AWS Gap Alert

    // ==========================================
    // PHASE 11: PLACEMENT PREDICTION
    // 85 - 92%
    // ==========================================
    tl.to('#skill-gap', { opacity: 0, duration: 2 }, 85)
      .to('#st-sub', { innerHTML: 'PLACEMENT PREDICTION', duration: 1 }, 85)
      .to(threeScene.state, { rotationSpeed: 0.001, particleSpeed: 0, coreScale: 1, glowIntensity: 0.1, duration: 3 }, 85)
      
      .to('#pred-analytics', { opacity: 1, duration: 2 }, 86)
      .to('.pa-card', { opacity: 1, y: 0, duration: 3, stagger: 0.5, ease:'power2.out' }, 86);

    // ==========================================
    // PHASE 12: FINAL RESULT
    // 92 - 100%
    // ==========================================
    tl.to('#pred-analytics', { opacity: 0, scale: 0.9, duration: 2 }, 92)
      .to('.stage-title', { opacity: 0, duration: 2 }, 92)
      .to('#webgl-container', { opacity: 0.1, duration: 4 }, 92) // 3D completely settles to bg
      .to('#shapegrid-wrapper', { opacity: 1, duration: 4 }, 92) // returns to clear view
      
      .to('#final-result', { opacity: 1, scale: 1, duration: 4, ease:'power3.out' }, 94);
}
