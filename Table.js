/**
 * Created by christopherfracassi on 3/12/17.
 */

class Table {
    constructor(gl){
        /** Colors */
        this.Color1 = vec3.fromValues(0.6, 0.5, 0.5);
        this.Color2 = vec3.fromValues(.5, 0.4, .4);

        /** Objects */
        //Table Top
        this.tableTop = new Cube2(gl, 1, 4, this.Color1, this.Color2, this.Color2);

        //Table legs
        this.tableLeg1 = new Cube2(gl, 1, 4, this.Color1, this.Color2, this.Color2);
        this.tableLeg2 = new Cube2(gl, 1, 4, this.Color1, this.Color2, this.Color2);
        this.tableLeg3 = new Cube2(gl, 1, 4, this.Color1, this.Color2, this.Color2);
        this.tableLeg4 = new Cube2(gl, 1, 4, this.Color1, this.Color2, this.Color2);



        /** Transformations */
        //Table Top
        this.topTransform = mat4.create();
        let stretchTop = vec3.fromValues(1,1,.1);
        mat4.scale(this.topTransform, this.topTransform, stretchTop);

        //Table Legs
        this.legTransform1 = mat4.create();
        this.legTransform2 = mat4.create();
        this.legTransform3 = mat4.create();
        this.legTransform4 = mat4.create();

        //Scale Legs
        let stretchLeg = vec3.fromValues(.1, .1, 1);
        mat4.scale(this.legTransform1, this.legTransform1, stretchLeg);
        mat4.scale(this.legTransform2, this.legTransform2, stretchLeg);
        mat4.scale(this.legTransform3, this.legTransform3, stretchLeg);
        mat4.scale(this.legTransform4, this.legTransform4, stretchLeg);

        //Move Legs
        let moveLeg1 = vec3.fromValues(-3, 3, -.5);
        mat4.translate(this.legTransform1, this.legTransform1, moveLeg1);

        let moveLeg2 = vec3.fromValues(3, 3, -.5);
        mat4.translate(this.legTransform2, this.legTransform2, moveLeg2);

        let moveLeg3 = vec3.fromValues(-3, -3, -.5);
        mat4.translate(this.legTransform3, this.legTransform3, moveLeg3);

        let moveLeg4 = vec3.fromValues(3, -3, -.5);
        mat4.translate(this.legTransform4, this.legTransform4, moveLeg4);


        this.blank = mat4.create();

    }

    draw (vertexAttr, normAttr, modelUniform, coordFrame) {
        //Table Top
        mat4.mul(this.blank, coordFrame, this.topTransform);
        this.tableTop.draw(vertexAttr, normAttr, modelUniform, this.blank);

        mat4.mul(this.blank, coordFrame, this.legTransform1);
        this.tableLeg1.draw(vertexAttr, normAttr, modelUniform, this.blank);

        mat4.mul(this.blank, coordFrame, this.legTransform2);
        this.tableLeg2.draw(vertexAttr,  normAttr,modelUniform, this.blank);

        mat4.mul(this.blank, coordFrame, this.legTransform3);
        this.tableLeg3.draw(vertexAttr, normAttr, modelUniform, this.blank);

        mat4.mul(this.blank, coordFrame, this.legTransform4);
        this.tableLeg4.draw(vertexAttr, normAttr, modelUniform, this.blank);


    }
}
