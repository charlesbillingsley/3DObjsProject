/**
 * Created by Charles Billingsley
 */

class GreenScreen {
    constructor(gl){
        /** Colors */
        // Screen
        this.Color1 = vec3.fromValues(0, .8, .5);
        this.Color2 = vec3.fromValues(0, 0.7, .3);

        /** Objects */
        // Screen
        this.greenScreen = new Cube2(gl, 10, 4, this.Color1, this.Color2, this.Color2);

        /** Transformations */
        // Screen
        this.screenTransform = mat4.create();
        let stretchTop = vec3.fromValues(.01,.5,.25);
        mat4.scale(this.screenTransform, this.screenTransform, stretchTop);

        let moveScreenUp = vec3.fromValues(0, 0, .2);
        mat4.translate (this.screenTransform, this.screenTransform, moveScreenUp);

        this.blank = mat4.create();

    }

    draw (vertexAttr, colorAttr, normAttr, modelUniform, coordFrame) {
        // Screen
        mat4.mul(this.blank, coordFrame, this.screenTransform);
        this.greenScreen.draw(vertexAttr, colorAttr, normAttr, modelUniform, this.blank);
    }
}
