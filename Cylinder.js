/**
 * Created by Charles Billingsley.
 * Based off of Cone.js by Hans Dulimarta
 */
class Cylinder {
    /**
     * Create a 3D cylinder with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl           the current WebGL context
     * @param {Number} topRadius    radius of the cylinder top
     * @param {Number} bottomRadius radius of the cylinder base
     * @param {Number} height       height of the cylinder
     * @param {Number} subDiv       number of radial subdivision of the cylinder
     * @param {Number} vertSubDiv   number of subdivisions between the base and the tip
     * @param {vec3}   col1         color #1 to use
     * @param {vec3}   col2         color #2 to use
     */
    constructor (gl, topRadius, bottomRadius, height, subDiv, vertSubDiv, col1, col2) {

        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let randColor = vec3.create();
        let vertices = [];
        let normal = [];
        this.vbuff = gl.createBuffer();

        /* Instead of allocating two separate JS arrays (one for position and one for color),
         in the following loop we pack both position and color
         so each tuple (x,y,z,r,g,b) describes the properties of a vertex
         */
        vertices.push(0,0,height); /* top of cylinder */
        vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
        vertices.push(randColor[0], randColor[1], randColor[2]);
        for (let k = 0; k < subDiv; k++) {
            let angle = k * 2 * Math.PI / subDiv;
            let x = topRadius * Math.cos (angle);
            let y = topRadius * Math.sin (angle);

            /* the first three floats are 3D (x,y,z) position */
            vertices.push (x, y, height); /* perimeter of base */
            vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
            /* the next three floats are RGB */
            vertices.push(randColor[0], randColor[1], randColor[2]);
        }
        vertices.push (0,0,0); /* bottom of cylinder */
        vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
        vertices.push(randColor[0], randColor[1], randColor[2]);
        for (let k = 0; k < subDiv; k++) {
            let angle = k * 2 * Math.PI / subDiv;
            let x = bottomRadius * Math.cos (angle);
            let y = bottomRadius * Math.sin (angle);

            /* the first three floats are 3D (x,y,z) position */
            vertices.push (x, y, 0); /* perimeter of base */
            vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
            /* the next three floats are RGB */
            vertices.push(randColor[0], randColor[1], randColor[2]);
        }

        /* copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        //Normals
        for (let k = 0; k < vertices.length; k++){
            normal.push(vertices[k] * -1);
        }

        this.nbuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(normal), gl.STATIC_DRAW);


        // Generate index order for top of cylinder
        let topIndex = [];
        topIndex.push(0);
        for (let k = 1; k <= subDiv; k++)
            topIndex.push(k);
        topIndex.push(1);
        this.topIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.topIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(topIndex), gl.STATIC_DRAW);

        // Generate index order for bottom of cylinder
        let botIndex = [];
        botIndex.push(subDiv + 2);
        for (let k = (subDiv * 2) + 1; k >= subDiv + 2; k--)
            botIndex.push(k);
        botIndex.push(subDiv + 1);
        this.botIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.botIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(botIndex), gl.STATIC_DRAW);

        // Generate index order for sides of cylinder
        let midIndex = [];
        let j = subDiv + 3;
        for (let k = 1; k <= subDiv + 1; k++) {
            if (k <= subDiv && j <= (subDiv * 2) + 1) {
                midIndex.push(k);
                midIndex.push(j);
                j++;
            }
            else if (k == subDiv) {
                midIndex.push(k);
                midIndex.push(subDiv + 2);
            }
            else if (k > subDiv) {
                midIndex.push(midIndex[0]);
                midIndex.push(midIndex[1]);
            }
        }
        this.midIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.midIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(midIndex), gl.STATIC_DRAW);

        /* Put the indices as an array of objects. Each object has three attributes:
         primitive, buffer, and numPoints */
        this.indices = [
            {"primitive": gl.TRIANGLE_FAN, "buffer": this.topIdxBuff, "numPoints": topIndex.length},
            {"primitive": gl.TRIANGLE_FAN, "buffer": this.botIdxBuff, "numPoints": botIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.midIdxBuff, "numPoints": midIndex.length}
            ];
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
        //gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */

        gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, 0, 0);

        for (let k = 0; k < this.indices.length; k++) {
            let obj = this.indices[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_BYTE, 0);
        }
    }
}