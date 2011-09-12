var Voxel = function (type, pos) {
	this.size = {x: 1, y: 1, z: 1};
	
	if (type)
		this.type = type;
	
	if (pos)
		this.pos = pos;
	else
		this.pos = {x: 0, y: 0, z: 0};
		
	this.assetIndex = 0;
	
	this.type;
	
	this.chemistry;		// Aww yeauh
	this.physics;		// Physics FTW yo
	
	this.make = function () {
		if (this.type && this.pos) {
			$C.assets.instantiate(this.type, this.pos);
		}
		else
			console.log("Voxel make error.");
	}
}

var Assembly = function () {
	this.rootPos = {x: 0, y: 0, z: 0};
	this.elements = [];
}

var Grid = function () {
	this.elements = [];
}

function testVoxel () {
	/*var v = new Voxel("smallCylinder", {x: 0, y: 0, z: 0});
	v.make();
	var v2 = new Voxel("smallCylinder", {x: 100, y: 0, z: 0});
	v2.make();*/
	
	for (var i = 0; i < 100; i++) {
		var v = new Voxel("smallCylinder", {x: i * 50, y: 0, z: 0});
		v.make();
	}
	
	console.log(v);
}
