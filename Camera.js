/**
 * Created by christopherfracassi on 2/25/17.
 */

class Camera {
    constructor(gl){
        /** Create the colors */
        // TODO: Make the colors actually look good.
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
        this.triLegsColor1 = vec3.fromValues(116, 135, 165);
        this.triLegsColor2 = vec3.fromValues(114, 151, 211);

        /** Create the objects */
        this.body = new Cube(gl, 0.3, 4, this.bodyColor1, this.bodyColor2);
        this.lens = new Ring(gl, 0.1, 0.05, 0.2, 30, 1, this.lensColor1, this.lensColor2);
        this.glass = new Sphere(gl, 0.1, 15, this.glassColor1, this.glassColor2);
        this.tripodTop = new Sphere(gl, .15, 15, this.triTopColor1, this.triTopColor2);
        this.tripodLeg1 = new Cylinder(gl, .01, .04, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);
        this.tripodLeg2 = new Cylinder(gl, .01, .04, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);
        this.tripodLeg3 = new Cylinder(gl, .01, .04, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);

        /** Create the transforms */
        // Camera Body
        this.bodyTransform = mat4.create();
        let stretchBody = vec3.fromValues(2,1,1);
        mat4.scale(this.bodyTransform, this.bodyTransform, stretchBody);

        // Lens
        this.lensTransform = mat4.create();
        let lensAngle = -Math.PI/2;
        mat4.rotateX(this.lensTransform, this.lensTransform, lensAngle);

        // Glass on lens

        // Top of the tripod
        this.triTopTransform = mat4.create();
        let moveTriTopDown = vec3.fromValues (0, 0, -0.2);
        mat4.translate (this.triTopTransform, this.triTopTransform, moveTriTopDown);

        // Tripod legs
        this.triLeg1Transform = mat4.create();
        this.triLeg2Transform = mat4.create();
        this.triLeg3Transform = mat4.create();

        let moveTriLegDown = vec3.fromValues (0, 0, -.25);

        mat4.translate (this.triLeg1Transform, this.triLeg1Transform, moveTriLegDown);
        mat4.translate (this.triLeg2Transform, this.triLeg2Transform, moveTriLegDown);
        mat4.translate (this.triLeg3Transform, this.triLeg3Transform, moveTriLegDown);

        let triLeg1Angle = Math.acos(-Math.sqrt(3)/2);
        mat4.rotateX(this.triLeg1Transform, this.triLeg1Transform, triLeg1Angle);
        mat4.rotateY(this.triLeg2Transform, this.triLeg2Transform, triLeg1Angle);
        mat4.rotateY(this.triLeg3Transform, this.triLeg3Transform, -triLeg1Angle);
    }

    draw (vertexAttr, colorAttr, modelUniform, coordFrame) {
        this.blank = mat4.create();

        // Camera Body
        this.stretched = mat4.create();
        mat4.mul(this.stretched, coordFrame, this.bodyTransform);
        this.body.draw(vertexAttr, colorAttr, modelUniform, this.stretched);

        // Camera Lens
        this.rotatedLens = mat4.create();
        mat4.mul(this.rotatedLens, coordFrame, this.lensTransform);
        this.lens.draw(vertexAttr, colorAttr, modelUniform, this.rotatedLens);

        // Glass on lens
        this.glass.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Top of the tripod
        this.moved = mat4.create();
        mat4.mul(this.moved, coordFrame, this.triTopTransform);
        this.tripodTop.draw(vertexAttr, colorAttr, modelUniform, this.moved);

        // Tripod Legs
        this.movedTriLeg1 = mat4.create();
        mat4.mul(this.movedTriLeg1, coordFrame, this.triLeg1Transform);
        this.tripodLeg1.draw(vertexAttr, colorAttr, modelUniform, this.movedTriLeg1);

        this.movedTriLeg2 = mat4.create();
        mat4.mul(this.movedTriLeg2, coordFrame, this.triLeg2Transform);
        this.tripodLeg2.draw(vertexAttr, colorAttr, modelUniform, this.movedTriLeg2);

        this.movedTriLeg3 = mat4.create();
        mat4.mul(this.movedTriLeg3, coordFrame, this.triLeg3Transform);
        this.tripodLeg3.draw(vertexAttr, colorAttr, modelUniform, this.movedTriLeg3);
    }
}