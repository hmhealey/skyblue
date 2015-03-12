"use strict";

var gl;
var ext;

var texture;

var paused = false;

var onLoad = function(e) {
    var canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (gl) {
        // attach other events
        attachEvent(window, "keypress", onKeyPress);
        attachEvent(window, "keydown", onKeyDown);
        attachEvent(window, "keyup", onKeyUp);

        // load required extensions
        ext = gl.getExtension("OES_element_index_uint");

        // perform opengl initialization
        initialize();

        // start rendering
        window.requestAnimationFrame(update);
    } else {
        window.alert("Your browser doesn't support WebGL :(");
    }
};

var initialize = function() {
    gl.clearColor(0.6, 0.6, 0.6, 1.0);

    texture = new Texture();
    texture.setImageFromPath("Ayreon_-_01011001.jpg");
};

var update = function(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, 500, 500);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    var shader = new Shader();
    shader.attachShader(gl.VERTEX_SHADER,
        "#version 100\n" +
        "\n" +
        "attribute vec3 position;\n" +
        "attribute vec3 normal;\n" +
        "attribute vec2 texCoord;\n" +
        "\n" +
        "varying vec3 fPosition;\n" +
        "varying vec3 fNormal;\n" +
        "varying vec2 fTexCoord;\n" +
        "\n" +
        "void main() {\n" +
        "    gl_Position = vec4(position, 1.0);\n" +
        "\n" +
        "    fPosition = position;\n" +
        "    fNormal = normal;\n" +
        "    fTexCoord = texCoord;\n" +
        "}\n");
    shader.attachShader(gl.FRAGMENT_SHADER,
        "#version 100\n" +
        "\n" +
        "precision mediump float;\n" +
        "\n" +
        "uniform vec4 materialAmbient;\n" +
        "uniform vec4 materialDiffuse;\n" +
        "uniform vec4 materialSpecular;\n" +
        "uniform float materialShininess;\n" +
        "//uniform texture2D texture;\n" +
        "\n" +
        "varying vec3 fPosition;\n" +
        "varying vec3 fNormal;\n" +
        "varying vec2 fTexCoord;\n" +
        "\n" +
        "void main() {\n" +
        "    gl_FragColor = vec4(fNormal, 1); // suppress warnings about fNormal not being read\n" +
        "    gl_FragColor = vec4(fTexCoord, 0, 1); // suppress warnings about fTexCoord not being read\n" +
        "\n" +
        "    // TODO set the light components as uniforms r something\n" +
        "    vec4 ambient = materialAmbient * vec4(0.1, 0.1, 0.1, 1.0);\n" +
        "    vec4 diffuse = materialDiffuse * vec4(0.8, 0.8, 0.8, 1.0);\n" +
        "    vec4 specular = materialSpecular * vec4(0.4, 0.4, 0.4, 1.0);\n" +
        "    float shininess = materialShininess;\n" +
        "\n" +
        "    // for simplicity, the light is just located at the eyepoint\n" +
        "    vec3 L = normalize(vec3(0, 0, 4) - fPosition);\n" +
        "    vec3 E = normalize(-fPosition);\n" +
        "    vec3 R = normalize(-reflect(L, fNormal));\n" +
        "\n" +
        "    // ambient lighting\n" +
        "    vec4 iAmbient = ambient;\n" +
        "\n" +
        "    // diffuse lighting\n" +
        "    vec3 surfaceToLight = normalize(L - fPosition);\n" +
        "\n" +
        "    vec4 iDiffuse = diffuse * max(dot(fNormal, L), 0.0);\n" +
        "    iDiffuse = clamp(iDiffuse, 0.0, 1.0);\n" +
        "\n" +
        "    // specular lighting\n" +
        "    vec4 iSpecular = specular * pow(max(dot(R, E), 0.0), 0.3 * shininess);\n" +
        "    iSpecular = clamp(iSpecular, 0.0, 1.0);\n" +
        "\n" +
        "    gl_FragColor = iAmbient + iDiffuse + iSpecular;\n" +
        "}\n");
    shader.link();

    var mesh = Mesh.makeUvSphere(1, 10, 10);

    gl.useProgram(shader.program);

    var material = new Material({
        diffuse: vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        specular: vec4.fromValues(1.0, 1.0, 1.0, 1.0),
        shininess: 10
    });
    material.applyTo(shader);

    mesh.draw(shader);

    mesh.cleanup();
    shader.cleanup();

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    if (!paused) {
        window.requestAnimationFrame(update);
    }
};

var cleanup = function() {
    texture.cleanup();
};

var onUnload = function(e) {
    if (gl) {
        cleanup();
    }
};

var onKeyPress = function(e) {
    paused = !paused;

    if (!paused) {
        // cancel any pending updates first so that we don't end up with duplicate callbacks on each frame
        window.cancelAnimationFrame(update);
        window.requestAnimationFrame(update);

        console.log("rendering has been unpaused");
    } else {
        console.log("rendering has been paused");
    }
};

var onKeyDown = function(e) { };

var onKeyUp = function(e) { };

attachEvent(window, "load", onLoad);
attachEvent(window, "unload", onUnload);
