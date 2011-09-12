/*
	Mostly scene and basic Three.js functionality in this file.
*/

// _The_ Global variable.
var Data = function () {
	this.mouse;
	this.size = {x: window.innerWidth, y: window.innerHeight};
	this.cam = {
		angle: 45,
		aspect: this.size.x / this.size.y,
		near: 1,
		far: 1000
	};
}

function init() {
	window.$C = new Data();
	$C.assets = new Assets(); 
	$C.assets.init();
	
	$C.container = document.createElement('div');
	$C.container.style.backgroundColor = "black";
	document.body.appendChild($C.container);
	
	$C.renderer = new THREE.CanvasRenderer();
	$C.camera = new THREE.Camera($C.cam.angle, $C.cam.aspect, $C.cam.near, $C.cam.far);
	$C.scene = new THREE.Scene();
	
	$C.camera.position.z = 300;
	
	$C.renderer.setSize($C.size.x, $C.size.y);
	
	$C.container.appendChild($C.renderer.domElement);
	
	// 'Static' update function.
	$C.update = function () {
		if ($C.assets.instances[0]) {
			$C.assets.instances[0].rotation.y = $C.mouse.position.x;
			$C.assets.instances[0].rotation.x = $C.mouse.position.y;
			$C.assets.instances[0].rotation.z = $C.mouse.position.z;
		}
		
		$C.renderer.render($C.scene, $C.camera);
	}
	
	// Events
	$C.mouse = new Mouse();
	$C.mouse.init();
	
	// Load Test
	$C.assets.load("smallCylinder");
	
	// Lighting
	$C.lighting = new Lighting();
	$C.lighting.create({x: 150, y: 150, z: 150}, 0xFFFFFF);
	$C.lighting.create({x: -150, y: -150, z: 150}, 0xFFFFFF);
	
	// Render
	animate();
}

function animate () {
	$C.update();
	
	if (window.requestAnimationFrame)
		window.requestAnimationFrame(animate);
	else if (window.webkitRequestAnimationFrame)
		window.webkitRequestAnimationFrame(animate);
}

var Mouse = function () {
	this.down = false;
	this.position = new THREE.Vector3( 1.0, .5, .5 );
	this.last = {x: 0, y: 0};
	
	this.init = function () {
		// Add events listeners to document.
		document.addEventListener( 'mousemove', $C.mouse.handler, false );
		document.addEventListener( 'mousedown', $C.mouse.handler, false );
		document.addEventListener( 'mouseup', $C.mouse.handler, false );
	}
	
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
	this.loader;
	
	this.list = {
		smallCylinder: "cylinder_small"
	};
	
	this.instances = [];
	
	this.init = function () {
		this.loader = new THREE.JSONLoader(true);
		document.body.appendChild(this.loader.statusDomElement);
	}
	
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
		
		mesh.overdraw = true;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 50.0;
		$C.scene.addChild(mesh);
		
		$C.assets.instances.push(mesh);
	}
}

var Lighting = function () {
	this.instances = [];
	
	this.create = function (pos, color) {
		var light = new THREE.PointLight (color);
		light.position.x = pos.x;
		light.position.y = pos.y;
		light.position.z = pos.z;
		$C.scene.addLight(light);
		$C.lighting.instances.push(light);
	}
}