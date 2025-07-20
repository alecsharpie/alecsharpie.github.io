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

    // Enhanced Dusk/Night Lighting
    const ambientLight = new THREE.AmbientLight(0x404080, 0.5); // Increased ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xff8c42, 0.8); // Increased main light
    directionalLight.position.set(-10, 15, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Add some purple rim lighting
    const rimLight = new THREE.DirectionalLight(0x8a2be2, 0.4); // Increased rim light
    rimLight.position.set(10, 5, -5);
    scene.add(rimLight);

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

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x2d4a22,
        transparent: true,
        opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);

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
    
    // Add some fog for depth
    scene.fog = new THREE.Fog(0x1a1a2e, 15, 50); // Closer fog for forest feel
}); 