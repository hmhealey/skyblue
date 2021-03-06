function RigidBody(args) {
    args = args || {};

    Component.call(this, args);

    this.velocity = args['velocity'] || vec3.create();

    this.useGravity = 'useGravity' in args ? args['useGravity'] : true;
    this.gravity = args['gravity'] || null;
};

RigidBody.prototype = Object.create(Component.prototype);
RigidBody.prototype.constructor = RigidBody;

RigidBody.gravity = vec3.fromValues(0, -0.981, 0);

RigidBody.prototype.draw = function() { };

RigidBody.prototype.update = function(time) {
    if (this.useGravity) {
        var gravity = this.gravity || RigidBody.gravity;
        vec3.scaleAndAdd(this.velocity, this.velocity, gravity, 1 / TICK_RATE);
    }

    if (vec3.squaredLength(this.velocity) != 0) {
        // keep the velocity independent of the tick rate
        var velocity = vec3.scale(vec3.create(), this.velocity, 1 / TICK_RATE);

        var collider = this.entity.getComponent(Collider);

        if (collider) {
            // TODO figure out a better way to refer back to the base level
            var colliders = level.root.getComponentsInChildren(Collider);

            // TODO holy crap this is awful, but I guess it works thanks to our high tick rate
            for (var dir = 0; dir < 3; dir++) {
                if (velocity[dir] == 0) continue;

                var delta = [
                    dir == 0 ? velocity[0] : 0,
                    dir == 1 ? velocity[1] : 0,
                    dir == 2 ? velocity[2] : 0
                ];

                var collided = false;

                for (var i = 0; i < colliders.length; i++) {
                    var other = colliders[i];
                    if (collider != other && collider.collidesWith(other, delta)) {
                        collided = true;
                        break;
                    }
                }

                if (!collided) {
                    this.entity.transform.translate(delta);
                } else {
                    this.velocity[dir] = 0;
                }
            }
        } else {
            this.entity.transform.translate(this.velocity);
        }
    }
};
