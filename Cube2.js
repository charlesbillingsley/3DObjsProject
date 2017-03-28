/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class Cube2 {
    /**
     * Create a cube
     * @param {Object} gl      the current WebGL context
     * @param {Number} size  size of the cube
     * @param {Number} subDiv number of subdivisions
     * @param {vec3}   [col1]    color #1 to use
     * @param {vec3}   [col2]    color #2 to use
     */
    constructor (gl, size, subDiv, col1, col2, col3) {

        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col3 === "undefined") col3 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let randColor = vec3.create();

        this.vex = [
            vec3.fromValues(-size / 2, -size / 2, +size / 2),  // 0
            vec3.fromValues(+size / 2, -size / 2, +size / 2),  // 1
            vec3.fromValues(+size / 2, +size / 2, +size / 2),  // 2
            vec3.fromValues(-size / 2, +size / 2, +size / 2),  // 3
            vec3.fromValues(-size / 2, -size / 2, -size / 2),  // 4
            vec3.fromValues(+size / 2, -size / 2, -size / 2),  // 5
            vec3.fromValues(+size / 2, +size / 2, -size / 2),  // 6
            vec3.fromValues(-size / 2, +size / 2, -size / 2)   // 7
        ];

        //Normal vectors
        let normal = [];
        let sidePoints = Math.pow((subDiv + 1), 2);
        //Top
        for(let k = 0; k < sidePoints; k ++){
            let norm = vec3.fromValues(0, size, 0);
            normal.push(norm);
        }

        // Front
        for(let k = 0; k < sidePoints; k ++){
            let norm = vec3.fromValues(0, 0, size);
            normal.push(norm);
        }

         // Bottom
         for(let k = 0; k < sidePoints; k ++){
            let norm = vec3.fromValues(0, -size, 0);
            normal.push(norm);
         }

        // Back
         for(let k = 0; k < sidePoints; k ++){
             let norm = vec3.fromValues(0, 0, -size);
             normal.push(norm);
        }

        // Right
        for(let k = 0; k < sidePoints; k ++) {
            let norm = vec3.fromValues(size, 0, 0);
            normal.push(norm);
        }

        // Left
         for(let k = 0; k < sidePoints; k ++){
              let norm = vec3.fromValues(-size, 0, 0);
              normal.push(norm);
         }



        //Normal buffer
        this.nbuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(normal), gl.STATIC_DRAW);

        let topNorm = vec3.fromValues(0, 0, 1);
        let topNormLine = vec3.fromValues(0, 0, 2);

        let frontNorm = vec3.fromValues(0, -1, 0);
        let frontNormLine = vec3.fromValues(0, -2, 0);

        let bottomNorm = vec3.fromValues(0, 0, -1);
        let bottomNormLine = vec3.fromValues(0, 0, -2);

        let backNorm = vec3.fromValues(0, 1, 0);
        let backNormLine = vec3.fromValues(0, 2, 0);

        let rightNorm = vec3.fromValues(1, 0, 0);
        let rightNormLine = vec3.fromValues(2, 0, 0);

        let leftNorm = vec3.fromValues(-1, 0, 0);
        let leftNormLine = vec3.fromValues(-2, 0, 0);


        //this.color = [col1, col2, col3, col1, col2, col3, col1, col2];
        this.color = vec3.fromValues(1,1,1);

        this.norm = [topNorm, rightNorm, backNorm, frontNorm, leftNorm, rightNorm, backNorm, leftNorm];
        this.index = [];
        this.normalLines = [topNorm, this.color, topNormLine, this.color, frontNorm, this.color,frontNormLine, this.color,
            bottomNorm, this.color, bottomNormLine, this.color,
            backNorm, this.color, backNormLine, this.color,rightNorm, this.color, rightNormLine, this.color, leftNorm,
            leftNormLine, this.color,topNorm, this.color,topNormLine,
            frontNorm,this.color, frontNormLine, this.color,];





        this.split (subDiv, 0, 1, 2, 3, topNorm, topNormLine); /* top: Z+ */
        this.split (subDiv, 0, 4, 5, 1, frontNorm, frontNormLine); /* front: Y- */
        this.split (subDiv, 4, 7, 6, 5, bottomNorm, bottomNormLine); /* bottom: Z- */
        this.split (subDiv, 2, 6, 7, 3, backNorm, backNormLine); /* back: Y+ */
        this.split (subDiv, 1, 5, 6, 2, rightNorm, rightNormLine); /* right: X+ */
        this.split (subDiv, 0, 3, 7, 4, leftNorm, leftNormLine); /* left: X- */
        let vertices = [];

        for (let k = 0; k < this.vex.length; k++)
        {
            vertices.push(this.vex[k][0], this.vex[k][1], this.vex[k][2]);
            //vertices.push(this.color[k][0], this.color[k][1], this.color[k][2]);
            //vec3.cross();
            vertices.push(this.norm[k][0], this.norm[k][1], this.norm[k][3]);
        }


        this.vbuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        this.nbuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(this.normalLines), gl.STATIC_DRAW);

        let ibuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(this.index), gl.STATIC_DRAW);
        this.indices = [{primitive: gl.TRIANGLES, buffer: ibuff, numPoints: this.index.length}];
    }

    split (N, a, b, c, d, normal, normalLine) {
        if (N > 0) {
            let mid_ab = vec3.lerp(vec3.create(), this.vex[a], this.vex[b], 0.5);
            this.vex.push(mid_ab);
            //vec3.cross (this.norm, mid_ab, this.vex );
            //this.color.push(col);
            this.norm.push(normal);
            this.normalLines.push(normal);
            this.normalLines.push(this.color);
            this.normalLines.push(normalLine);
            this.normalLines.push(this.color);

            let n_ab = this.vex.length - 1;

            let mid_bc = vec3.lerp(vec3.create(), this.vex[b], this.vex[c], 0.5);
            this.vex.push(mid_bc);
            this.norm.push(normal);
            this.normalLines.push(normal);
            this.normalLines.push(this.color);
            this.normalLines.push(normalLine);
            this.normalLines.push(this.color);

            let n_bc = this.vex.length - 1;

            let mid_cd = vec3.lerp(vec3.create(), this.vex[c], this.vex[d], 0.5);
            this.vex.push(mid_cd);
            this.norm.push(normal);
            this.normalLines.push(normal);
            this.normalLines.push(this.color);
            this.normalLines.push(normalLine);
            this.normalLines.push(this.color);

            let n_cd = this.vex.length - 1;

            let mid_da = vec3.lerp(vec3.create(), this.vex[d], this.vex[a], 0.5);
            this.vex.push(mid_da);
            this.norm.push(normal);
            this.normalLines.push(normal);
            this.normalLines.push(this.color);

            this.normalLines.push(normalLine);
            this.normalLines.push(this.color);

            let n_da = this.vex.length - 1;

            let ctr = vec3.lerp(vec3.create(), this.vex[n_ab], this.vex[n_cd], 0.5);
            this.vex.push(ctr);
            this.norm.push(normal);
            this.normalLines.push(normal);
            this.normalLines.push(this.color);

            this.normalLines.push(normalLine);
            this.normalLines.push(this.color);

            let n_ctr = this.vex.length - 1;

            this.split (N - 1, a, n_ab, n_ctr, n_da, normal, normalLine);
            this.split (N - 1, n_da, n_ctr, n_cd, d, normal, normalLine);
            this.split (N - 1, n_ab, b, n_bc, n_ctr, normal, normalLine);
            this.split (N - 1, n_ctr, n_bc, c, n_cd, normal, normalLine);
        } else {
            /* stop recursion */
            this.index.push(a, b, c);
            this.index.push(a, c, d);
        }
    }
    /**
     * Draw the object
     * @param {Number} vertexAttr a handle to a vec3 attribute in the vertex shader for vertex xyz-position
     * @param {Number} colorAttr  a handle to a vec3 attribute in the vertex shader for vertex rgb-color
     * @param {Number} modelUniform a handle to a mat4 uniform in the shader for the coordinate frame of the model
     * @param {mat4} coordFrame a JS mat4 variable that holds the actual coordinate frame of the object
     */
    draw(vertexAttr, normAttr, modelUniform, coordFrame) {
        /* copy the coordinate frame matrix to the uniform memory in shader */
        gl.uniformMatrix4fv(modelUniform, false, coordFrame);

        /* binder the (vertex+color) buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);

        /* with the "packed layout"  (x,y,z,r,g,b),
         the stride distance between one group to the next is 24 bytes */
        gl.vertexAttribPointer(vertexAttr, 3, gl.FLOAT, false, 24, 0); /* (x,y,z) begins at offset 0 */
        gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */

        //Normal AttribPointer
        //gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuff);
        //gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, 0, 0);


        for (let k = 0; k < this.indices.length; k++) {
            let obj = this.indices[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_SHORT, 0);
        }

        //gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuff);
        //gl.vertexAttribPointer(vertexAttr, 3, gl.FLOAT, false, 24, 0);
        //gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */
       //gl.drawArrays(gl.LINE_STRIP, 0, this.normalLines.length /2 -16);
    }
}