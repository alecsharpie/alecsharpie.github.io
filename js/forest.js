// 3D Forest Scene
document.addEventListener('DOMContentLoaded', function() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('forest-canvas'),
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    // Nighttime Moonlight Lighting
    const ambientLight = new THREE.AmbientLight(0x202040, 0.2); // Dark blue ambient for night
    scene.add(ambientLight);
    
    // Main moonlight - cool white light from above
    const moonLight = new THREE.DirectionalLight(0xc8d4e8, 0.7); // Cool white moonlight
    moonLight.position.set(5, 20, 3);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.1;
    moonLight.shadow.camera.far = 50;
    moonLight.shadow.camera.left = -30;
    moonLight.shadow.camera.right = 30;
    moonLight.shadow.camera.top = 30;
    moonLight.shadow.camera.bottom = -30;
    scene.add(moonLight);

    // Subtle secondary moonlight for softer shadows
    const secondaryMoonLight = new THREE.DirectionalLight(0xa8b8d0, 0.3); // Softer cool light
    secondaryMoonLight.position.set(-8, 15, -5);
    scene.add(secondaryMoonLight);

    // Create starfield
    function createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 800;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;     // x
            positions[i + 1] = Math.random() * 100 + 20;    // y (above ground)
            positions[i + 2] = (Math.random() - 0.5) * 200; // z
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        return stars;
    }

    const starfield = createStarfield();

    // Layered ground for more natural terrain
    function createGroundLayers() {
        // Main ground layer
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a2818, // Much darker green for night
            transparent: true,
            opacity: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3;
        ground.receiveShadow = true;
        scene.add(ground);

        // Additional ground patches for variation
        for (let i = 0; i < 8; i++) {
            const patchGeometry = new THREE.PlaneGeometry(20 + Math.random() * 30, 20 + Math.random() * 30);
            const patchMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.3, 0.08 + Math.random() * 0.05),
                transparent: true,
                opacity: 0.7
            });
            const patch = new THREE.Mesh(patchGeometry, patchMaterial);
            patch.rotation.x = -Math.PI / 2;
            patch.position.y = -2.95 + Math.random() * 0.1; // Slight height variation
            patch.position.x = (Math.random() - 0.5) * 80;
            patch.position.z = (Math.random() - 0.5) * 80;
            patch.receiveShadow = true;
            scene.add(patch);
        }
    }
    
    createGroundLayers();

    // Tree loading and forest creation
    const trees = [];
    const loader = new THREE.GLTFLoader();
    let treeModel = null;

    loader.load('assets/cabbage-tree.glb', function(gltf) {
        treeModel = gltf.scene;
        
        // Configure the base tree model
        treeModel.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        createForest();
    }, function(progress) {
        console.log('Loading tree: ', (progress.loaded / progress.total * 100) + '%');
    }, function(error) {
        console.error('Error loading tree:', error);
    });

    function createForest() {
        if (!treeModel) return;
        
        const treePositions = [
            // Very close foreground trees (huge and immersive)
            { x: -6, z: 6, scale: 1.8 },   // Close left
            { x: 10, z: 4, scale: 1.6 },   // Close right
            { x: -12, z: 9, scale: 2.0 },  // Left side
            { x: 15, z: 7, scale: 1.7 },   // Right side
            
            // Immediate vicinity trees (very large)
            { x: -4, z: 2, scale: 1.4 },   // Very close left
            { x: 6, z: 1, scale: 1.5 },    // Very close right
            { x: -18, z: 3, scale: 1.6 },  // Side trees
            { x: 20, z: 2, scale: 1.4 },
            { x: 2, z: -4, scale: 1.2 },   // Behind camera
            
            // Mid-ground trees (still large and close)
            { x: -10, z: -8, scale: 1.0 },
            { x: 12, z: -10, scale: 1.1 },
            { x: -22, z: -6, scale: 1.3 },
            { x: 25, z: -12, scale: 1.0 },
            { x: 4, z: -15, scale: 0.9 },
            { x: -6, z: -18, scale: 0.8 },
        ];

        treePositions.forEach((pos, index) => {
            const tree = treeModel.clone();
            
            // Random variations
            const scaleVariation = 0.8 + Math.random() * 0.4;
            const finalScale = pos.scale * scaleVariation;
            
            tree.scale.set(finalScale, finalScale, finalScale);
            tree.position.set(
                pos.x + (Math.random() - 0.5) * 3, // Small random offset
                -2.5,
                pos.z + (Math.random() - 0.5) * 3
            );
            
            // Random rotation
            tree.rotation.y = Math.random() * Math.PI * 2;
            
            scene.add(tree);
            trees.push(tree);
        });
    }

    // Camera setup - much lower, inside forest level
    camera.position.set(0, 2, 5); // Much lower starting position
    camera.lookAt(0, 0, 0);
    
    // Track scroll for camera movement
    let scrollY = 0;
    
    function updateCameraOnScroll() {
        scrollY = window.pageYOffset;
        const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        
        // Move camera down closer to ground level as user scrolls
        camera.position.y = 2 - (scrollProgress * 1.5); // Start at 2, go down to 0.5
        camera.position.z = 5 - (scrollProgress * 2);   // Move closer to trees
        
        // Look down more as scrolling
        const targetY = -scrollProgress * 1;
        camera.lookAt(0, targetY, 0);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        updateCameraOnScroll();
        
        // Gentle tree movement (wind effect)
        trees.forEach((tree, index) => {
            if (tree) {
                const time = Date.now() * 0.001;
                tree.rotation.z = Math.sin(time + index) * 0.02; // Gentle sway
            }
        });
        
        // Subtle star twinkling
        if (starfield) {
            const time = Date.now() * 0.001;
            starfield.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
        }
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Handle scroll
    window.addEventListener('scroll', updateCameraOnScroll);
    
    // Atmospheric fog for softer transitions
    scene.fog = new THREE.Fog(0x0f1020, 8, 35); // Darker, closer fog for night atmosphere
}); 