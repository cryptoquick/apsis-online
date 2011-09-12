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
	scene.addChild(sphere);
	
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
	
	// Render
	animate();
	
	// CAD
	cad_test();
}

function animate () {
	render();
	
	if (window.requestAnimationFrame)
		window.requestAnimationFrame(animate);
	else if (window.webkitRequestAnimationFrame)
		window.webkitRequestAnimationFrame(animate);
}

function render () {
	sphere.rotation.y = $C.mouse.position.x;
	sphere.rotation.x = $C.mouse.position.y;
	sphere.rotation.z = $C.mouse.position.z;
	
	renderer.render(scene, camera);
}

var Mouse = function () {
	this.down = false;
	this.position = new THREE.Vector3( 1.0, .5, .5 );
	this.handler = function (evt) {
		evt.preventDefault();
		if (evt.type == "mousedown") {
			$C.mouse.down = true;
		}
		if (evt.type == "mouseup") {
			$C.mouse.down = false;
		}
		if (evt.type == "mousemove") { // TODO: Think this out a bit more. @CQ
			if ($C.mouse.down) {
				$C.mouse.position.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
				$C.mouse.position.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
				$C.mouse.position.z = .5;
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
	
	this.loader = new THREE.JSONLoader;
	
	this.load = function (req) {
		$C.assets.loader.load({model: this.url + req + this.ext, callback: $C.assets.geometry});
	}
	
	this.geometry = function (geo) {
		
	}
}