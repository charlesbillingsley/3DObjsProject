/**
 * Created by christopherfracassi on 2/25/17.
 */

class Camera {
    constructor(gl){
        this.body = new Cube(gl, 0.3, 4);
        this.bodyTransform = mat4.create();
        this.stretch = vec3.fromValues(2,1,1);
        mat4.scale(this.bodyTransform, this.bodyTransform, this.stretch);
        this.lens = new Ring(gl, 0.1, 0.05, 0.2, 30, 1);
        this.glass = new Sphere(gl, 0.1, 15);

        this.tmp = mat4.create();
    }

    draw (vertexAttr, colorAttr, modelUniform, coordFrame) {
        mat4.mul (this.tmp, coordFrame, this.bodyTransform);
        this.body.draw(vertexAttr, colorAttr, modelUniform, this.tmp);
        this.lens.draw(vertexAttr, colorAttr, modelUniform, this.tmp);
        this.glass.draw(vertexAttr, colorAttr, modelUniform, this.tmp);
    }
}