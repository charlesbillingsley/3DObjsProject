/**
 * Created by Charles Billingsley.
 * Based off of Cone.js by Hans Dulimarta
 */
class Cube {
    /**
     * Create a 3D cube
     * @param {Object} gl           the current WebGL context
     * @param {Number} length       length of the cube
     * @param {Number} subDiv       number of subdivision of the cube
     * @param {vec3}   col1         color #1 to use
     * @param {vec3}   col2         color #2 to use
     */
    constructor (gl, length, subDiv, col1, col2) {

        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let randColor = vec3.create();
        let vertices = [];
        this.vbuff = gl.createBuffer();

        // Build the cube's verts
        // Down Face
        let y = -length / 2;
        for (let z = -length / 2; z <= length / 2; z += length / subDiv) {
            for (let x = -length / 2; x <= length / 2; x += length / subDiv) {
                vertices.push(x, y, z);
                vec3.lerp (randColor, col1, col2, Math.random());
                vertices.push(randColor[0], randColor[1], randColor[2]);
            }
        }

        // Top Face
        y += length;
        for (let z = length / 2; z >= -length / 2; z -= length / subDiv) {
            for (let x = -length / 2; x <= length / 2; x += length / subDiv) {
                vertices.push(x, y, z);
                vec3.lerp (randColor, col1, col2, Math.random());
                vertices.push(randColor[0], randColor[1], randColor[2]);
            }
        }

        // Left Face
        let x = -length / 2;
        for (let y = -length / 2; y <= length / 2; y += length / subDiv) {
            for (let z = -length / 2; z <= length / 2; z += length / subDiv) {
                vertices.push(x, y, z);
                vec3.lerp (randColor, col1, col2, Math.random());
                vertices.push(randColor[0], randColor[1], randColor[2]);
            }
        }

        // Right Face
        x += length;
        for (let y = length / 2; y >= -length / 2; y -= length / subDiv) {
            for (let z = -length / 2; z <= length / 2; z += length / subDiv) {
                vertices.push(x, y, z);
                vec3.lerp (randColor, col1, col2, Math.random());
                vertices.push(randColor[0], randColor[1], randColor[2]);
            }
        }

        // Back Face
        let z = -length / 2;
        for (let y = -length / 2; y <= length / 2; y += length / subDiv) {
            for (let x = length / 2; x >= -length / 2; x -= length / subDiv) {
                vertices.push(x, y, z);
                vec3.lerp (randColor, col1, col2, Math.random());
                vertices.push(randColor[0], randColor[1], randColor[2]);
            }
        }

        // Front face
        z += length;
        for (let y = -length / 2; y <= length / 2; y += length / subDiv) {
            for (let x = -length / 2; x <= length / 2; x += length / subDiv) {
                vertices.push(x, y, z);
                vec3.lerp (randColor, col1, col2, Math.random());
                vertices.push(randColor[0], randColor[1], randColor[2]);
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        // Generate index order for the down face of the cube
        let downIndex = [];
        let startingPoint = 0;
        let secondPoint = subDiv + 1;
        let lastPoint;
        for (let numberOfRows = 0; numberOfRows < subDiv; numberOfRows++) {
            for (let i = 0; i < (subDiv + 1); i++) {
                downIndex.push(startingPoint + i);
                downIndex.push(secondPoint + i);
                lastPoint = secondPoint + i;
            }
            if (numberOfRows != subDiv - 1) {
                downIndex.push(lastPoint);
                downIndex.push(secondPoint);
            }
            startingPoint = secondPoint;
            secondPoint = secondPoint + (subDiv + 1);
        }

        this.downIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.downIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(downIndex), gl.STATIC_DRAW);

        // Generate index order for the top of the cube
        let topIndex = [];
        startingPoint = (subDiv + 1) * (subDiv + 1);
        secondPoint = startingPoint + (subDiv + 1);
        for (let numberOfRows = 0; numberOfRows < subDiv; numberOfRows++) {
            for (let i = 0; i < (subDiv + 1); i++) {
                topIndex.push(startingPoint + i);
                topIndex.push(secondPoint + i);
                lastPoint = secondPoint + i;
            }
            if (numberOfRows != subDiv - 1) {
                topIndex.push(lastPoint);
                topIndex.push(secondPoint);
            }
            startingPoint = secondPoint;
            secondPoint = secondPoint + (subDiv + 1);
        }

        this.topIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.topIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(topIndex), gl.STATIC_DRAW);

        // Generate index order for the left of the cube
        let leftIndex = [];
        startingPoint = 2 * (subDiv + 1) * (subDiv + 1);
        secondPoint = startingPoint + (subDiv + 1);
        for (let numberOfRows = 0; numberOfRows < subDiv; numberOfRows++) {
            for (let i = 0; i < (subDiv + 1); i++) {
                leftIndex.push(startingPoint + i);
                leftIndex.push(secondPoint + i);
                lastPoint = secondPoint + i;
            }
            if (numberOfRows != subDiv - 1) {
                leftIndex.push(lastPoint);
                leftIndex.push(secondPoint);
            }
            startingPoint = secondPoint;
            secondPoint = secondPoint + (subDiv + 1);
        }

        this.leftIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.leftIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(leftIndex), gl.STATIC_DRAW);

        // Generate index order for the right of the cube
        let rightIndex = [];
        startingPoint = 3 * (subDiv + 1) * (subDiv + 1);
        secondPoint = startingPoint + (subDiv + 1);
        for (let numberOfRows = 0; numberOfRows < subDiv; numberOfRows++) {
            for (let i = 0; i < (subDiv + 1); i++) {
                rightIndex.push(startingPoint + i);
                rightIndex.push(secondPoint + i);
                lastPoint = secondPoint + i;
            }
            if (numberOfRows != subDiv - 1) {
                rightIndex.push(lastPoint);
                rightIndex.push(secondPoint);
            }
            startingPoint = secondPoint;
            secondPoint = secondPoint + (subDiv + 1);
        }

        this.rightIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rightIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(rightIndex), gl.STATIC_DRAW);

        // Generate index order for the back of the cube
        let backIndex = [];
        startingPoint = 4 * (subDiv + 1) * (subDiv + 1);
        secondPoint = startingPoint + (subDiv + 1);
        for (let numberOfRows = 0; numberOfRows < subDiv; numberOfRows++) {
            for (let i = 0; i < (subDiv + 1); i++) {
                backIndex.push(startingPoint + i);
                backIndex.push(secondPoint + i);
                lastPoint = secondPoint + i;
            }
            if (numberOfRows != subDiv - 1) {
                backIndex.push(lastPoint);
                backIndex.push(secondPoint);
            }
            startingPoint = secondPoint;
            secondPoint = secondPoint + (subDiv + 1);
        }

        this.backIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.backIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(backIndex), gl.STATIC_DRAW);

        // Generate index order for the front of the cube
        let frontIndex = [];
        startingPoint = 5 * (subDiv + 1) * (subDiv + 1);
        secondPoint = startingPoint + (subDiv + 1);
        for (let numberOfRows = 0; numberOfRows < subDiv; numberOfRows++) {
            for (let i = 0; i < (subDiv + 1); i++) {
                frontIndex.push(startingPoint + i);
                frontIndex.push(secondPoint + i);
                lastPoint = secondPoint + i;
            }
            if (numberOfRows != subDiv - 1) {
                frontIndex.push(lastPoint);
                frontIndex.push(secondPoint);
            }
            startingPoint = secondPoint;
            secondPoint = secondPoint + (subDiv + 1);
        }

        this.frontIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.frontIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(frontIndex), gl.STATIC_DRAW);


        /* Put the indices as an array of objects. Each object has three attributes:
         primitive, buffer, and numPoints */
        this.indices = [{"primitive": gl.TRIANGLE_STRIP, "buffer": this.downIdxBuff, "numPoints": downIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.topIdxBuff, "numPoints": topIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.leftIdxBuff, "numPoints": leftIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.rightIdxBuff, "numPoints": rightIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.backIdxBuff, "numPoints": backIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.frontIdxBuff, "numPoints": frontIndex.length}
            ];
    }

    /**
     * Draw the object
     * @param {Number} vertexAttr a handle to a vec3 attribute in the vertex shader for vertex xyz-position
     * @param {Number} colorAttr  a handle to a vec3 attribute in the vertex shader for vertex rgb-color
     * @param {Number} modelUniform a handle to a mat4 uniform in the shader for the coordinate frame of the model
     * @param {mat4} coordFrame a JS mat4 variable that holds the actual coordinate frame of the object
     */
    draw(vertexAttr, colorAttr, modelUniform, coordFrame) {
        /* copy the coordinate frame matrix to the uniform memory in shader */
        gl.uniformMatrix4fv(modelUniform, false, coordFrame);

        /* binder the (vertex+color) buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);

        /* with the "packed layout"  (x,y,z,r,g,b),
         the stride distance between one group to the next is 24 bytes */
        gl.vertexAttribPointer(vertexAttr, 3, gl.FLOAT, false, 24, 0); /* (x,y,z) begins at offset 0 */
        gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */

        for (let k = 0; k < this.indices.length; k++) {
            let obj = this.indices[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_BYTE, 0);
        }
    }
}