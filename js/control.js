function PlayerController(args) {
    args = args || [];

    this.speed = args['speed'] || 0;
    this.rotationSpeed = args['rotationSpeed'] || 0;

    this.noclip = args['noclip'] || false;
};

PlayerController.prototype.update = function(entity) {
    // keyboard/mouse rotation
    var dpitch = 0;
    var dyaw = 0;

    if (Input.getKey(38) && !Input.getKey(40)) {
        dpitch = 1;
    } else if (Input.getKey(40) && !Input.getKey(38)) {
        dpitch = -1;
    }

    if (Input.getKey(37) && !Input.getKey(39)) {
        dyaw = 1;
    } else if (Input.getKey(39) && !Input.getKey(37)) {
        dyaw = -1;
    }

    if (Input.Mouse.isLocked()) {
        dpitch += Input.Mouse.deltaY * -0.06;
        dyaw += Input.Mouse.deltaX * -0.06;
    }

    if (dpitch != 0) {
        entity.transform.rotate('x', dpitch);
    }
    if (dyaw != 0) {
        entity.transform.rotate('y', dyaw, 'world');
    }

    // keyboard movement
    var rigidBody = entity.getComponent(RigidBody);

    var dz = 0;
    var dy = 0;
    var dx = 0;

    if (Input.getKey(87) && !Input.getKey(83)) {
        dz = -1;
    } else if (Input.getKey(83) && !Input.getKey(87)) {
        dz = 1;
    }
    
    if (Input.getKey(65) && !Input.getKey(68)) {
        dx = -1;
    } else if (Input.getKey(68) && !Input.getKey(65)) {
        dx = 1;
    }

    if (dx != 0 || dz != 0) {
        var velocity = vec3.fromValues(dx, 0, dz);
        vec3.transformQuat(velocity, velocity, entity.transform.rotation);

        if (rigidBody.useGravity) {
            velocity[1] = 0;
        }

        vec3.normalize(velocity, velocity);
        vec3.scale(velocity, velocity, this.speed);

        rigidBody.velocity[0] = velocity[0];
        rigidBody.velocity[2] = velocity[2];
    } else {
        rigidBody.velocity[0] = 0;
        rigidBody.velocity[2] = 0;
    }

    // jumping
    if (rigidBody.useGravity && rigidBody.velocity[1] == 0 && Input.getKey(32)) {
        rigidBody.velocity[1] = 2;
    }

    // interaction
    if (Input.Mouse.getButtonDown(0)) {
        var hit = new RaycastHit();

        var filter = function(collider) {
            return collider.entity != entity && collider.entity.name != "groundCollider";
        };

        if (level.raycast(entity.transform.getWorldPosition(), entity.transform.getForward(), hit, filter)) {
            console.log("bang! you hit " + hit.collider.entity.name);
            //hit.collider.entity.destroy();
        } else {
            console.log("bang! you missed");
        }
    }
};
