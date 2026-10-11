        /* =========================================
           THEME MANAGEMENT
        ========================================= */
        const body = document.body;
        const themeIcon = document.getElementById('theme-icon');
        const pageId = body.getAttribute('data-page-id') || 'index';
        
        let currentTheme = localStorage.getItem('theme') || 'dark';

        function updateThemeIcon(theme) {
            if(themeIcon) {
                themeIcon.className = theme === 'light' ? 'fa-solid fa-sun me-2' : 'fa-solid fa-moon me-2';
            }
        }

        // Three.js scene colors will be updated inside the 3D script logic via this function call
        let applyThemeTo3D = function(theme) {}; 

        function setTheme(theme) {
            if (theme === 'system') {
                const sysTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                body.setAttribute('data-theme', sysTheme);
                applyThemeTo3D(sysTheme);
                updateThemeIcon(sysTheme);
                localStorage.setItem('theme', 'system');
                currentTheme = sysTheme;
            } else {
                body.setAttribute('data-theme', theme);
                applyThemeTo3D(theme);
                updateThemeIcon(theme);
                localStorage.setItem('theme', theme);
                currentTheme = theme;
            }
        }

        // Initialize Theme
        if (currentTheme === 'system') {
            setTheme('system');
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
                if (localStorage.getItem('theme') === 'system') setTheme('system');
            });
        } else {
            setTheme(currentTheme);
        }

        /* =========================================
           THREE.JS CINEMATIC CRYSTAL ENVIRONMENT
        ========================================= */
        const canvas = document.getElementById('webgl-canvas');
        if (canvas) {
            const scene = new THREE.Scene();
            
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 20;

            const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.physicallyCorrectLights = true;

            // Determine crystal colors based on page ID for distinct looks
            const colorMap = {
                'index': { dark: 0xffffff, light: 0x222222 },
                'login': { dark: 0xaaddff, light: 0x113355 }, // Icy Blue
                'register': { dark: 0xddbbff, light: 0x442266 }, // Amethyst
                'dashboard': { dark: 0xbbffdd, light: 0x115533 }, // Emerald
                'profile': { dark: 0xffeebb, light: 0x554411 }, // Amber
                'predict': { dark: 0xffeebb, light: 0x554411 }
            };

            const pageColors = colorMap[pageId] || colorMap['index'];

            // Theme Configuration for 3D
            const themeConfig = {
                dark: {
                    background: 0x02040a,
                    fog: 0x02040a,
                    ambient: 0xffffff,
                    ambientIntensity: 0.5,
                    directional: 0xffffff,
                    directionalIntensity: 1.5,
                    crystalColor: pageColors.dark,
                    crystalEnvIntensity: 1.0
                },
                light: {
                    background: 0xf0f2f5,
                    fog: 0xf0f2f5,
                    ambient: 0xffffff,
                    ambientIntensity: 1.5,
                    directional: 0xffffff,
                    directionalIntensity: 2.0,
                    crystalColor: pageColors.light,
                    crystalEnvIntensity: 0.5
                }
            };

            scene.background = new THREE.Color(themeConfig[currentTheme].background);
            scene.fog = new THREE.Fog(themeConfig[currentTheme].fog, 10, 60);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, themeConfig[currentTheme].ambientIntensity);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, themeConfig[currentTheme].directionalIntensity);
            directionalLight.position.set(10, 20, 10);
            scene.add(directionalLight);

            // Moving light sweep
            const sweepLight = new THREE.PointLight(0xddffff, 2, 50);
            scene.add(sweepLight);

            // Crystal Generation
            const crystals = [];
            
            // Apply Theme Function
            applyThemeTo3D = function(theme) {
                const config = themeConfig[theme];
                scene.background.setHex(config.background);
                scene.fog.color.setHex(config.fog);
                ambientLight.intensity = config.ambientIntensity;
                directionalLight.intensity = config.directionalIntensity;
                
                // Update crystal materials
                crystals.forEach(c => {
                    c.material.envMapIntensity = config.crystalEnvIntensity;
                    c.material.color.setHex(config.crystalColor);
                    
                    if (theme === 'light') {
                        c.material.opacity = 0.8; 
                        c.material.metalness = 0.8;
                    } else {
                        c.material.opacity = 0.5; 
                        c.material.metalness = 0.1;
                    }
                    
                    c.material.needsUpdate = true;
                });
            };

            // Environment Map
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            const envScene = new THREE.Scene();
            envScene.background = new THREE.Color(0xffffff);
            const envLight = new THREE.AmbientLight(0xffffff, 5);
            envScene.add(envLight);
            const envMap = pmremGenerator.fromScene(envScene).texture;

            const numCrystals = 120; // Restored to 120 for better visuals, now running efficiently without heavy transmission
            
            // Geometries
            const geometries = [
                new THREE.OctahedronGeometry(1, 0),
                new THREE.IcosahedronGeometry(1, 0),
                new THREE.CylinderGeometry(0, 1, 3, 4, 1), 
                new THREE.DodecahedronGeometry(1, 0)
            ];

            // Optimized Glass Material (removed heavy transmission)
            const crystalMaterial = new THREE.MeshStandardMaterial({
                color: themeConfig[currentTheme].crystalColor,
                metalness: currentTheme === 'light' ? 0.8 : 0.1,
                roughness: 0.15,
                envMap: envMap,
                envMapIntensity: themeConfig[currentTheme].crystalEnvIntensity,
                transparent: true,
                opacity: currentTheme === 'light' ? 0.8 : 0.5,
                side: THREE.DoubleSide
            });

            const frostedMaterial = crystalMaterial.clone();
            frostedMaterial.roughness = 0.4;

            for (let i = 0; i < numCrystals; i++) {
                const geom = geometries[Math.floor(Math.random() * geometries.length)];
                const mat = Math.random() > 0.7 ? frostedMaterial : crystalMaterial;
                const mesh = new THREE.Mesh(geom, mat);
                
                // Random positioning
                mesh.position.x = (Math.random() - 0.5) * 60;
                mesh.position.y = (Math.random() - 0.5) * 60;
                mesh.position.z = (Math.random() - 0.5) * 40 - 10; 
                
                // Random scaling
                const scale = Math.random() * 1.5 + 0.2;
                mesh.scale.set(scale, scale, geom.type === 'CylinderGeometry' ? scale * 2 : scale);
                
                // Random initial rotation
                mesh.rotation.x = Math.random() * Math.PI;
                mesh.rotation.y = Math.random() * Math.PI;

                mesh.userData = {
                    originalPos: mesh.position.clone(),
                    rotSpeedX: (Math.random() - 0.5) * 0.01,
                    rotSpeedY: (Math.random() - 0.5) * 0.01,
                    floatSpeed: Math.random() * 0.005 + 0.001,
                    floatOffset: Math.random() * Math.PI * 2,
                    repelVelocity: new THREE.Vector3()
                };

                scene.add(mesh);
                crystals.push(mesh);
            }

            /* =========================================
               INTERACTION & PHYSICS
            ========================================= */
            let mouseX = 0;
            let mouseY = 0;
            const targetCameraPos = new THREE.Vector3(0, 0, 20);
            const raycaster = new THREE.Raycaster();
            const mouseVector = new THREE.Vector2();

            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
                
                mouseVector.x = mouseX;
                mouseVector.y = mouseY;

                targetCameraPos.x = mouseX * 2;
                targetCameraPos.y = mouseY * 2;
            });

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                targetCameraPos.z = 20 - (scrollY * 0.015);
            });

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                // Limit pixel ratio to 1.5 for performance
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            /* =========================================
               ANIMATION LOOP
            ========================================= */
            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
                const time = clock.getElapsedTime();

                camera.position.lerp(targetCameraPos, 0.05);
                camera.lookAt(0, 0, targetCameraPos.z - 20); 

                sweepLight.position.x = Math.sin(time * 0.5) * 20;
                sweepLight.position.z = Math.cos(time * 0.5) * 10;
                sweepLight.position.y = Math.sin(time * 0.3) * 10;

                raycaster.setFromCamera(mouseVector, camera);

                crystals.forEach(crystal => {
                    const data = crystal.userData;

                    crystal.rotation.x += data.rotSpeedX;
                    crystal.rotation.y += data.rotSpeedY;

                    const drift = Math.sin(time * data.floatSpeed + data.floatOffset) * 2;
                    
                    const distToRay = raycaster.ray.distanceToPoint(crystal.position);
                    
                    if (distToRay < 3) {
                        const pointOnRay = raycaster.ray.closestPointToPoint(crystal.position, new THREE.Vector3());
                        const repelDir = crystal.position.clone().sub(pointOnRay).normalize();
                        data.repelVelocity.add(repelDir.multiplyScalar(0.05));
                        
                        crystal.rotation.x += data.rotSpeedX * 5;
                        crystal.rotation.y += data.rotSpeedY * 5;
                    }

                    crystal.position.add(data.repelVelocity);
                    data.repelVelocity.multiplyScalar(0.9); 

                    const targetY = data.originalPos.y + drift;
                    crystal.position.x += (data.originalPos.x - crystal.position.x) * 0.01;
                    crystal.position.y += (targetY - crystal.position.y) * 0.01;
                    crystal.position.z += (data.originalPos.z - crystal.position.z) * 0.01;
                });

                renderer.render(scene, camera);
            }

            animate();
            
            // Trigger cinematic fade ins safely
            const triggerFadeIn = () => {
                setTimeout(() => {
                    const bootOverlay = document.getElementById('boot-overlay');
                    if(bootOverlay) {
                        bootOverlay.style.opacity = '0';
                        setTimeout(() => { bootOverlay.style.display = 'none'; bootOverlay.remove(); }, 3000);
                    }
                    const cv = document.getElementById('webgl-canvas');
                    if(cv) cv.style.opacity = '1';
                    const uiWrapper = document.getElementById('ui-wrapper');
                    if(uiWrapper) uiWrapper.style.opacity = '1';
                    
                    targetCameraPos.z = 20;
                    camera.position.z = 30; 
                }, 500);
            };

            if (document.readyState === 'complete') {
                triggerFadeIn();
            } else {
                window.addEventListener('load', triggerFadeIn);
                // Safety fallback in case window.onload never fires
                setTimeout(triggerFadeIn, 2000);
            }
        }
