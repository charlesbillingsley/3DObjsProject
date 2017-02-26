/**
 * Created by christopherfracassi on 2/25/17.
 */

class Camera {
    constructor(gl){
        /** Create the colors */
        // Camera Body
        this.bodyColor1 = vec3.fromValues(219, 121, 22);
        this.bodyColor2 = vec3.fromValues(219, 148, 43);

        // Camera Lens
        this.lensColor1 = vec3.fromValues(219, 148, 43);
        this.lensColor2 = vec3.fromValues(219, 122, 38);

        // Glass on lens
        this.glassColor1 = vec3.fromValues(0, 174, 255);
        this.glassColor2 = vec3.fromValues(0, 0, 255);

        // Top of the tripod
        this.triTopColor1 = vec3.fromValues(0, 174, 255);
        this.triTopColor2 = vec3.fromValues(0, 0, 255);

        // Tripod Legs
        this.triLegsColor1 = vec3.fromValues(0, 174, 255);
        this.triLegsColor2 = vec3.fromValues(0, 0, 255);

        /** Create the objects */
        this.body = new Cube(gl, 0.3, 4, this.bodyColor1, this.bodyColor2);
        this.lens = new Ring(gl, 0.1, 0.05, 0.2, 30, 1, this.lensColor1, this.lensColor2);
        this.glass = new Sphere(gl, 0.1, 15, this.glassColor1, this.glassColor2);
        this.tripodTop = new Sphere(gl, .15, 15, this.triTopColor1, this.triTopColor2);
        this.tripodLeg1 = new Cylinder(gl, .04, .01, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);
        this.tripodLeg2 = new Cylinder(gl, .04, .01, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);
        this.tripodLeg3 = new Cylinder(gl, .04, .01, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);

        /** Create the transforms */
        // Camera Body
        this.bodyTransform = mat4.create();
        let stretchBody = vec3.fromValues(2,1,1);
        mat4.scale(this.bodyTransform, this.bodyTransform, stretchBody);

        // Top of the tripod
        let moveTriTopDown = vec3.fromValues (0, 0, -0.2);
        this.triTopTransform = mat4.create();
        mat4.translate (this.triTopTransform, this.triTopTransform, moveTriTopDown);

        this.tmp = mat4.create();
        this.blank = mat4.create();
    }

    draw (vertexAttr, colorAttr, modelUniform, coordFrame) {
        // Camera Body
        mat4.mul (this.tmp, coordFrame, this.bodyTransform);
        this.body.draw(vertexAttr, colorAttr, modelUniform, this.tmp);

        // Camera Lens
        this.lens.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Glass on lens
        this.glass.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Top of the tripod
        mat4.mul (this.tmp, coordFrame, this.triTopTransform);
        this.tripodTop.draw(vertexAttr, colorAttr, modelUniform, this.tmp);

        // Tripod Legs
        this.tripodLeg1.draw(vertexAttr, colorAttr, modelUniform, this.blank);
        this.tripodLeg2.draw(vertexAttr, colorAttr, modelUniform, this.blank);
        this.tripodLeg3.draw(vertexAttr, colorAttr, modelUniform, this.blank);
    }
}