/**
 * Created by:
 * Charles Billingsley
 * Chris Fracassi
 */
class Camera {
    constructor(gl){
        /** Create the colors */
        // Camera Body
        this.bodyColor1 = vec3.fromValues(.34, .34, .54);
        this.bodyColor2 = vec3.fromValues(.35, .35, .55);
        this.bodyColor3 = vec3.fromValues(.33, .33, .53);

        // Flash
        this.flashColor1 = vec3.fromValues(.45, .45, .55);
        this.flashColor2 = vec3.fromValues(.50, .50, .60);
        this.flashColor3 = vec3.fromValues(.35, .35, .45);

        // Flash Glass
        this.flashGlassColor1 = vec3.fromValues(.8, .8, .8);
        this.flashGlassColor2 = vec3.fromValues(.9, .9, .9);
        this.flashGlassColor3 = vec3.fromValues(1, 1 , 1);

        // Camera Lens
        this.lensColor1 = vec3.fromValues(.4, .4, .7);
        this.lensColor2 = vec3.fromValues(.5, .5, .9);

        // Glass on lens
        this.glassColor1 = vec3.fromValues(0, 1, 1);
        this.glassColor2 = vec3.fromValues(0, 0.9, .9);

        // Top of the tripodS
        this.triTopColor1 = vec3.fromValues(.35, .35, .65);
        this.triTopColor2 = vec3.fromValues(.35, .35, .55);

        // Tripod Legs
        this.triLegsColor1 = vec3.fromValues(.35, .35, .35);
        this.triLegsColor2 = vec3.fromValues(.45, .45, .60);

        /** Create the objects */
        this.body = new Cube2(gl, 0.3, 4, this.bodyColor1, this.bodyColor2, this.bodyColor3);
        this.flash = new Cube2(gl, 0.1, 4, this.flashColor1, this.flashColor2, this.flashColor3);
        this.flashGlass = new Cube2(gl, 0.1, 4, this.flashGlassColor1, this.flashGlassColor2, this.flashGlassColor3);
        this.lens = new Ring(gl, 0.13, 0.08, 0.2, 30, 1, this.lensColor1, this.lensColor2);
        this.glass = new Sphere(gl, 0.1, 15, this.glassColor1, this.glassColor2);
        this.tripodTop = new Sphere(gl, 0.07, 15, this.triTopColor1, this.triTopColor2);
        this.tripodLeg1 = new Cylinder(gl, .01, .04, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);
        this.tripodLeg2 = new Cylinder(gl, .01, .04, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);
        this.tripodLeg3 = new Cylinder(gl, .01, .04, 1, 20, 1, this.triLegsColor1, this.triLegsColor2);

        /** Create the transforms */
        // Camera Body
        this.bodyTransform = mat4.create();
        let stretchBody = vec3.fromValues(2, 1, 1);
        mat4.scale(this.bodyTransform, this.bodyTransform, stretchBody);

        // Flash
        this.flashTransform = mat4.create();
        let stretchFlash = vec3.fromValues(2, 1, 1);
        mat4.scale(this.flashTransform, this.flashTransform, stretchFlash);

        let moveFlash = vec3.fromValues(.05, .05, .2);
        mat4.translate (this.flashTransform, this.flashTransform, moveFlash);

        // Flash Glass
        this.flashGlassTransform = mat4.create();

        let stretchFlashGlass = vec3.fromValues(1.8, .8, .8);
        mat4.scale(this.flashGlassTransform, this.flashGlassTransform, stretchFlashGlass);

        let moveFlashGlass = vec3.fromValues(.055, .08, .25);
        mat4.translate (this.flashGlassTransform, this.flashGlassTransform, moveFlashGlass);

        // Lens
        this.lensTransform = mat4.create();
        let lensAngle = -Math.PI/2;
        mat4.rotateX(this.lensTransform, this.lensTransform, lensAngle);

        // Glass on lens
        this.glassTransform = mat4.create();
        let moveGlass = vec3.fromValues(0, .15, 0);
        mat4.translate(this.glassTransform, this.glassTransform, moveGlass);

        // Top of the tripod
        this.triTopTransform = mat4.create();
        let moveTriTopDown = vec3.fromValues(0, 0, -.2);
        mat4.translate(this.triTopTransform, this.triTopTransform, moveTriTopDown);

        // Tripod legs
        this.triLeg1Transform = mat4.create();
        this.triLeg2Transform = mat4.create();
        this.triLeg3Transform = mat4.create();

        let moveTriLegDown = vec3.fromValues(0, 0, -.25);

        mat4.translate (this.triLeg1Transform, this.triLeg1Transform, moveTriLegDown);
        mat4.translate (this.triLeg2Transform, this.triLeg2Transform, moveTriLegDown);
        mat4.translate (this.triLeg3Transform, this.triLeg3Transform, moveTriLegDown);

        let triLeg1Angle = Math.acos(-Math.sqrt(3)/2);
        mat4.rotateX(this.triLeg1Transform, this.triLeg1Transform, triLeg1Angle);
        mat4.rotateY(this.triLeg2Transform, this.triLeg2Transform, triLeg1Angle);
        mat4.rotateY(this.triLeg3Transform, this.triLeg3Transform, -triLeg1Angle);

        this.blank = mat4.create();
    }

    draw (vertexAttr, colorAttr, modelUniform, coordFrame) {

        // Camera Lens
        mat4.mul(this.blank, coordFrame, this.lensTransform);
        this.lens.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Glass on lens
        mat4.mul(this.blank, coordFrame, this.glassTransform);
        this.glass.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Tripod Legs
        mat4.mul(this.blank, coordFrame, this.triLeg1Transform);
        this.tripodLeg1.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        mat4.mul(this.blank, coordFrame, this.triLeg2Transform);
        this.tripodLeg2.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        mat4.mul(this.blank, coordFrame, this.triLeg3Transform);
        this.tripodLeg3.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Top of the tripod
        mat4.mul(this.blank, coordFrame, this.triTopTransform);
        this.tripodTop.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Flash
        mat4.mul(this.blank, coordFrame, this.flashTransform);
        this.flash.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Flash Glass
        mat4.mul(this.blank, coordFrame, this.flashGlassTransform);
        this.flashGlass.draw(vertexAttr, colorAttr, modelUniform, this.blank);

        // Camera Body
        mat4.mul(this.blank, coordFrame, this.bodyTransform);
        this.body.draw(vertexAttr, colorAttr, modelUniform, this.blank);

    }
}