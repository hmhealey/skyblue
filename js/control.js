function PlayerController(args) {
    args = args || [];

    this.speed = args['speed'] || 0;
    this.rotationSpeed = args['rotationSpeed'] || 0;

    this.noclip = args['noclip'] || false;
};

PlayerController.prototype.update = function(entity) {
    var dpitch = 0;
    var dyaw = 0;

    if (Input.isKeyDown(38) && !Input.isKeyDown(40)) {
        dpitch = 1;
    } else if (Input.isKeyDown(40) && !Input.isKeyDown(38)) {
        dpitch = -1;
    }

    if (Input.isKeyDown(37) && !Input.isKeyDown(39)) {
        dyaw = 1;
    } else if (Input.isKeyDown(39) && !Input.isKeyDown(37)) {
        dyaw = -1;
    }

    if (dpitch != 0) {
        entity.rotate('x', dpitch);
    }
    if (dyaw != 0) {
        entity.rotate('y', dyaw);
    }

    var dz = 0;
    var dy = 0;
    var dx = 0;

    if (Input.isKeyDown(87) && !Input.isKeyDown(83)) {
        dz = -1;
    } else if (Input.isKeyDown(83) && !Input.isKeyDown(87)) {
        dz = 1;
    }
    
    if (Input.isKeyDown(65) && !Input.isKeyDown(68)) {
        dx = -1;
    } else if (Input.isKeyDown(68) && !Input.isKeyDown(65)) {
        dx = 1;
    }

    if (dx != 0 || dy != 0 || dz != 0) {
        var dir = vec3.fromValues(dx, dy, dz);
        vec3.normalize(dir, dir);
        vec3.scale(dir, dir, this.speed);

        entity.translate(dir);
    }
};