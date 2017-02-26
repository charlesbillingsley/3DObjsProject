/**
 * Created by christopherfracassi on 2/25/17.
 */

class Camera {
    constructor(gl){
        this.body = new Cube(gl, 0.4, 4);
        this.lens = new Ring(gl, 0.3, 0.2, 0.3, 30, 1);
        this.glass = new Sphere(gl, 0.2, 15);

        this.tmp = mat4.create();
    }

    draw (vertexAttr, colorAttr, modelUniform, coordFrame) {
        this.lens.draw(vertexAttr, colorAttr, modelUniform, this.tmp);
        this.glass.draw(vertexAttr, colorAttr, modelUniform, this.tmp);
        this.body.draw(vertexAttr, colorAttr, modelUniform, this.tmp);
    }
}