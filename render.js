/**
 * Created by
 */
let modelMat = mat4.create();
let canvas, paramGroup, orthoProjMat, persProjMat;
let posAttr, colAttr, modelUnif;
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
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.cullFace(gl.BACK);

    /* the vertex shader defines TWO attribute vars and ONE uniform var */
    posAttr = gl.getAttribLocation (prog, "vertexPos");
    colAttr = gl.getAttribLocation (prog, "vertexCol");
    modelUnif = gl.getUniformLocation (prog, "modelCF");
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);

    /* calculate viewport */
    resizeWindow();

    /* initiate the render loop */
    render();
  });
}

function drawScene() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  if (obj) {
    obj.draw(posAttr, colAttr, modelUnif, modelMat);
  }
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

function createObject() {
  obj = null;
  mat4.identity(modelMat);
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
    
  let w = 0.98 * window.innerWidth;
  let h = 0.6 * window.innerHeight;
  let size = Math.min(0.98 * window.innerWidth, 0.65 * window.innerHeight);
  /* keep a square viewport */
  canvas.width = size;
  canvas.height = size;
  gl.viewport(0, 0, size, size);
}