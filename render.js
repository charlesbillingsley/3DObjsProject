/**
 * Created by
 */
let modelMat = mat4.create();
let canvas, paramGroup;
let orthoProjMat, persProjMat, viewMat, topViewMat, tmpMat, cameraCF;
let posAttr, colAttr;
let modelUnif, viewUnif, projUnif;
let gl;
let obj;

function main() {
  canvas = document.getElementById("gl-canvas");

  /* setup window resize listener */
  window.addEventListener('resize', resizeWindow);

  gl = WebGLUtils.create3DContext(canvas, null);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {

    orthoProjMat = mat4.create();
    persProjMat = mat4.create();

    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0, 0, 0, 1);
    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);

    posAttr = gl.getAttribLocation (prog, "vertexPos");
    colAttr = gl.getAttribLocation (prog, "vertexCol");
    projUnif = gl.getUniformLocation(prog, "projection");
    viewUnif = gl.getUniformLocation(prog, "view");
    modelUnif = gl.getUniformLocation (prog, "modelCF");
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);
    orthoProjMat = mat4.create();
    persProjMat = mat4.create();
    viewMat = mat4.create();
    topViewMat = mat4.create();
    cameraCF = mat4.create();
    tmpMat = mat4.create();

    mat4.lookAt(viewMat,
        vec3.fromValues(2, 2, 2), /* eye */
        vec3.fromValues(0, 0, 0), /* focal point */
        vec3.fromValues(0, 0, 1)
    ); /* up */
    mat4.lookAt(topViewMat,
        vec3.fromValues(0,0,2),
        vec3.fromValues(0,0,0),
        vec3.fromValues(0,1,0)
    );
    gl.uniformMatrix4fv(modelUnif, false, cameraCF);

    obj = new Camera(gl);

    /* calculate viewport */
    resizeWindow();

    /* initiate the render loop */
    render();
  });
}

function drawScene() {
    if (typeof obj !== 'undefined') {
        obj.draw(posAttr, colAttr, modelUnif, tmpMat);
    }
}

function draw3D() {
  /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, persProjMat);
    gl.uniformMatrix4fv(viewUnif, false, viewMat);
    gl.viewport(0, 0, canvas.width/2, canvas.height);
    drawScene();
}

function drawTopView() {
  /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, topViewMat);
    gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height);
    drawScene();
}


function render() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  draw3D();
  drawTopView(); /* looking at the XY plane, Z-axis points towards the viewer */
  requestAnimationFrame(render);
}

function resizeWindow() {
    canvas.width = window.innerWidth;
    canvas.height = 0.9 * window.innerHeight;
    if (canvas.width > canvas.height) { /* landscape */
        let ratio = 2 * canvas.height / canvas.width;
        console.log("Landscape mode, ratio is " + ratio);
        mat4.ortho(orthoProjMat, -3, 3, -3 * ratio, 3 * ratio, -5, 5);
        mat4.perspective(persProjMat,
            Math.PI/3,  /* 60 degrees vertical field of view */
            1/ratio,    /* must be width/height ratio */
            1,          /* near plane at Z=1 */
            20);        /* far plane at Z=20 */
    } else {
        alert ("Window is too narrow!");
    }
}