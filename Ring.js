/**
 * Created by Charles Billingsley.
 * Based off of Cone.js by Hans Dulimarta
 */
class Ring {
    /**
     * Create a 3D ring with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl           the current WebGL context
     * @param {Number} outterRadius    radius of the ring top
     * @param {Number} innerRadius radius of the ring base
     * @param {Number} height       height of the ring
     * @param {Number} subDiv       number of radial subdivision of the ring
     * @param {Number} vertSubDiv   number of subdivisions between the base and the tip
     * @param {vec3}   col1         color #1 to use
     * @param {vec3}   col2         color #2 to use
     */
    constructor (gl, outterRadius, innerRadius, height, subDiv, vertSubDiv, col1, col2) {

        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let randColor = vec3.create();
        let vertices = [];
        let normal = [];
        this.vbuff = gl.createBuffer();

        // Outter Ring
        vertices.push(0,0,height); /* top of outter ring */
        vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
        vertices.push(randColor[0], randColor[1], randColor[2]);
        for (let k = 0; k < subDiv; k++) {
            let angle = k * 2 * Math.PI / subDiv;
            let x = outterRadius * Math.cos (angle);
            let y = outterRadius * Math.sin (angle);

            /* the first three floats are 3D (x,y,z) position */
            vertices.push (x, y, height); /* perimeter of base */
            vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
            /* the next three floats are RGB */
            vertices.push(randColor[0], randColor[1], randColor[2]);
        }
        vertices.push (0,0,0); /* bottom of outter ring */
        vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
        vertices.push(randColor[0], randColor[1], randColor[2]);
        for (let k = 0; k < subDiv; k++) {
            let angle = k * 2 * Math.PI / subDiv;
            let x = outterRadius * Math.cos (angle);
            let y = outterRadius * Math.sin (angle);

            /* the first three floats are 3D (x,y,z) position */
            vertices.push (x, y, 0); /* perimeter of base */
            vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
            /* the next three floats are RGB */
            vertices.push(randColor[0], randColor[1], randColor[2]);
        }

        // Inner Ring
        vertices.push(0,0,height); /* top of outter ring */
        vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
        vertices.push(randColor[0], randColor[1], randColor[2]);
        for (let k = 0; k < subDiv; k++) {
            let angle = k * 2 * Math.PI / subDiv;
            let x = innerRadius * Math.cos (angle);
            let y = innerRadius * Math.sin (angle);

            /* the first three floats are 3D (x,y,z) position */
            vertices.push (x, y, height); /* perimeter of base */
            vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
            /* the next three floats are RGB */
            vertices.push(randColor[0], randColor[1], randColor[2]);
        }
        vertices.push (0,0,0); /* bottom of outter ring */
        vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
        vertices.push(randColor[0], randColor[1], randColor[2]);
        for (let k = 0; k < subDiv; k++) {
            let angle = k * 2 * Math.PI / subDiv;
            let x = innerRadius * Math.cos (angle);
            let y = innerRadius * Math.sin (angle);

            /* the first three floats are 3D (x,y,z) position */
            vertices.push (x, y, 0); /* perimeter of base */
            vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
            /* the next three floats are RGB */
            vertices.push(randColor[0], randColor[1], randColor[2]);
        }

        /* copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);


        //Normal Vectors
        for (let k = 0; k < vertices.length; k ++){
            normal.push(vertices[k] * -1);
        }

        this.nbuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(normal), gl.STATIC_DRAW);

        // Generate index order for sides of the outter ring
        let outterIndex = [];
        let j = subDiv + 3;
        for (let k = 1; k <= subDiv + 1; k++) {
            if (k <= subDiv && j <= (subDiv * 2) + 1) {
                outterIndex.push(k);
                outterIndex.push(j);
                j++;
            }
            else if (k == subDiv) {
                outterIndex.push(k);
                outterIndex.push(subDiv + 2);
            }
            else if (k > subDiv) {
                outterIndex.push(outterIndex[0]);
                outterIndex.push(outterIndex[1]);
            }
        }
        this.outterIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.outterIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(outterIndex), gl.STATIC_DRAW);

        let innerIndex = [];
        let startVert = (subDiv * 3) + 4;
        let secondVert = (subDiv * 2) + 4;
        let nextVert = secondVert;
        let endVert = (subDiv * 4) + 3;

        for (startVert; startVert <= endVert; startVert++) {
            if (startVert < endVert) {
                innerIndex.push(startVert);
                innerIndex.push(nextVert);
                nextVert ++;
            }
            else if (startVert == endVert) {
                innerIndex.push(startVert);
                innerIndex.push(secondVert - 1);
                innerIndex.push(innerIndex[0]);
                innerIndex.push(innerIndex[1]);
            }
        }

        this.innerIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.innerIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(innerIndex), gl.STATIC_DRAW);

        // Generate index order for the top ring
        let topIndex = [];
        j = subDiv * 2 + 4;
        topIndex.push(subDiv * 2 + 3);
        for (let k = 1; k <= subDiv + 2; k++) {
            if (k < subDiv && j <= (subDiv * 4) + 2) {
                topIndex.push(k);
                topIndex.push(j);
                j++;
            }
            else if (k == subDiv) {
                topIndex.push(k);
                topIndex.push(subDiv * 2 + 3);
            }
            else if (k > subDiv) {
                topIndex.push(topIndex[1]);
            }
        }
        this.topIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.topIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(topIndex), gl.STATIC_DRAW);

        // Generate index order for the bottom ring
        let bottomIndex = [];
        startVert = subDiv + 2;
        endVert = (subDiv * 4) + 3;

        bottomIndex.push(startVert);
        startVert++;
        for (let secondVert = endVert - (subDiv - 1); secondVert <= endVert; secondVert++) {
            if (secondVert < endVert) {
                bottomIndex.push(secondVert);
                bottomIndex.push(startVert);
                startVert++;
            }
            if (secondVert == endVert) {
                bottomIndex.push(secondVert);
                bottomIndex.push(bottomIndex[0]);
                bottomIndex.push(bottomIndex[1]);
            }
        }
        this.bottomIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bottomIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(bottomIndex), gl.STATIC_DRAW);


        /* Put the indices as an array of objects. Each object has three attributes:
         primitive, buffer, and numPoints */
        this.indices = [
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.outterIdxBuff, "numPoints": outterIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.innerIdxBuff, "numPoints": innerIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.topIdxBuff, "numPoints": topIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.bottomIdxBuff, "numPoints": bottomIndex.length}
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
       // gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */
        gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, 0, 0);

        for (let k = 0; k < this.indices.length; k++) {
            let obj = this.indices[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_BYTE, 0);
        }
    }
}