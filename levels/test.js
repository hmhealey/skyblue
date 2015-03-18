var textures = [];

var root = new Entity({name: "root"});

var blank = Texture.fromColour(vec4.fromValues(1.0, 1.0, 1.0, 1.0));

var notGrass = new Material({
    diffuse: vec4.fromValues(0.5, 0.1, 0.9, 1.0),
    shininess: 0,
    texture: blank
});

var notGround = new Entity({name: "notGround", mesh: Mesh.makeSquare(1), material: notGrass});
notGround.translate([0, 0, -10]);
notGround.rotate("x", -45);
notGround.scale([10, 10, 1]);
root.addChild(notGround);

var camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(0, 2, 1),
    rotation: vec3.fromValues(0, 0, 0)
});
root.addChild(camera);

return new Level({root: root, mainCamera: camera, textures: textures});
