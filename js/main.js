var size = {x: window.innerWidth, y: window.innerHeight};
var cam = {
	angle: 45,
	aspect: size.x / size.y,
	near: 1,
	far: 1000
};
var container;
var camera, scene, renderer;
var sphere;

var Data = function () {
	this.mouse;
}

function init() {
	window.$C = new Data();
	$C.assets = new Assets();
	
	container = document.createElement('div');
	container.style.backgroundColor = "black";
	document.body.appendChild(container);
	
	renderer = new THREE.CanvasRenderer();
	camera = new THREE.Camera(cam.angle, cam.aspect, cam.near, cam.far);
	scene = new THREE.Scene();
	
	camera.position.z = 300;
	
	renderer.setSize(size.x, size.y);
	
	container.appendChild(renderer.domElement);
	
	// Scene Geometry
	var radius = 50, segments = 16, rings = 16;
	
	var sphereMaterial = new THREE.MeshLambertMaterial({
		color: 0xCC0000,
		shading: THREE.FlatShading
	//	vertexColors: THREE.VertexColors
	});
	
	sphere = new THREE.Mesh(
	//	new THREE.SphereGeometry(radius, segments, rings), sphereMaterial
		new THREE.CubeGeometry(100, 100, 100), sphereMaterial
	);
	sphere.overdraw = true;
//	sphere.position = THREE.Vector3(0,0,0);
//	scene.addChild(sphere);
	
	// Lighting
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	
	pointLight.position.x = 150;
	pointLight.position.y = 150;
	pointLight.position.z = 150;
	
	scene.addLight(pointLight);
	
	// Events
	$C.mouse = new Mouse();
	
	document.addEventListener( 'mousemove', $C.mouse.handler, false );
	document.addEventListener( 'mousedown', $C.mouse.handler, false );
	document.addEventListener( 'mouseup', $C.mouse.handler, false );
	
	// CAD
	cad_test();
	
	// Load Test
	$C.assets.load("smallCylinder");
	
	
	// Render
	animate();
}

function animate () {
	render();
	
	if (window.requestAnimationFrame)
		window.requestAnimationFrame(animate);
	else if (window.webkitRequestAnimationFrame)
		window.webkitRequestAnimationFrame(animate);
}

function render () {
	if ($C.assets.instances[0]) {
		$C.assets.instances[0].rotation.y = $C.mouse.position.x;
		$C.assets.instances[0].rotation.x = $C.mouse.position.y;
		$C.assets.instances[0].rotation.z = $C.mouse.position.z;
	}
	
	renderer.render(scene, camera);
}

var Mouse = function () {
	this.down = false;
	this.position = new THREE.Vector3( 1.0, .5, .5 );
	this.last = {x: 0, y: 0};
	
	this.handler = function (evt) {
		evt.preventDefault();
		if (evt.type == "mousedown") {
			$C.mouse.down = true;
			$C.mouse.last.x = evt.clientX;
			$C.mouse.last.y = evt.clientY;
		}
		if (evt.type == "mouseup") {
			$C.mouse.down = false;
		}
		if (evt.type == "mousemove") { // TODO: Think this out a bit more. @CQ
			if ($C.mouse.down) {
				var yaw = (evt.clientX - $C.mouse.last.x) * 0.5;
				var pitch = (evt.clientY - $C.mouse.last.y) * 0.5;
				
				$C.mouse.position.x += yaw * 0.01; // * 2 - 1;
				$C.mouse.position.y += pitch * 0.01; // * 2 + 1;
				$C.mouse.position.z = .5;
				
				$C.mouse.last.x = evt.clientX;
				$C.mouse.last.y = evt.clientY;
			}
		}
	}
}

var Assets = function () {
	this.url = "art/js/";
	this.ext = ".js";
	
	this.list = {
		smallCylinder: "cylinder_small"
	};
	
	this.instances = [];
	
	this.loader = new THREE.JSONLoader(true);
	document.body.appendChild(this.loader.statusDomElement);
	
	this.load = function (req) {
		$C.assets.loader.load({model: this.url + this.list[req] + this.ext, callback: $C.assets.geometry});
	}
	
	this.geometry = function (geo) {
		var mesh = new THREE.Mesh(
			geo, new THREE.MeshLambertMaterial({
				color: 0x00CC00,
				shading: THREE.FlatShading
			})
		)
		
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 50.0;
		scene.addChild(mesh);
		
		$C.assets.instances.push(mesh);
	}
}
