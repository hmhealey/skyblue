#version 100

uniform mat4 modelView;
uniform mat4 modelViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec3 normal;
attribute vec2 texCoord;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;

void main() {
    gl_Position = modelViewProjection * vec4(position + offset, 1.0);

    fPosition = vec3(modelView * vec4(position + offset, 1.0));
    fNormal = normalize(normalMatrix * normal);
    fTexCoord = texCoord;
}
