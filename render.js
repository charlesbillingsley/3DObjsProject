/**
 * Created by:
 * Charles Billingsley
 * Chris Fracassi
 *
 * Adapted from code given from Hans Dulimarta
 */
/**
 * TODO:
 * -Colors?
 * -Should we add a flash or anything else to our model?
 * -We need to figure out requirement 7 which is making a large number of our model in a loop.
 * (There is an example of this in his example gl-main.js file at line 134.)
 * -We need to make 4 camera angles (we already have 2) and map them to keyboard keys
 * -We need to use a drop down to select each object and then change it's position and
 * orientation using the keyboard/mouse. (Each object needs a separate coordinate frame)
 *
 */
let modelMat = mat4.create();
let canvas, paramGroup;
let orthoProjMat, persProjMat, viewMat, topViewMat, frontViewMat, rightViewMat, tmpMat, cameraCF;
let currentCameraView;
let posAttr, colAttr;
let modelUnif, viewUnif, projUnif;
let gl;
let obj;
let objArr = new Array();
let objFrames = new Array();

function main() {
  canvas = document.getElementById("gl-canvas");
  textOut = document.getElementById("msg");
  gl = WebGLUtils.setupWebGL(canvas, null);

  /* setup window resize listener */
  window.addEventListener('resize', resizeWindow);
  window.addEventListener("keypress", keyboardHandler, false);

  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {
    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

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
    frontViewMat = mat4.create();
    rightViewMat = mat4.create();
    cameraCF = mat4.create();
    tmpMat = mat4.create();

    mat4.lookAt(viewMat,
      vec3.fromValues(2, 2, 2), /* eye */
      vec3.fromValues(0, 0, 0), /* focal point */
      vec3.fromValues(0, 0, 1)  /* up */
    );

    mat4.lookAt(topViewMat,
      vec3.fromValues(0,0,2),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );

      mat4.lookAt(frontViewMat,
          vec3.fromValues(0,2,0),
          vec3.fromValues(0,0,0),
          vec3.fromValues(0,0,1)
      );

      mat4.lookAt(rightViewMat,
          vec3.fromValues(2,0,0),
          vec3.fromValues(0,0,0),
          vec3.fromValues(0,0,1)
      );

    gl.uniformMatrix4fv(modelUnif, false, cameraCF);

    let xPos = -.8;
    let yPos = -.8;
    for (let i = 0; i < 20; i++) {
        objArr[i] = new Camera(gl);
        objFrames[i] = mat4.create();
        mat4.fromTranslation(objFrames[i], vec3.fromValues(xPos, yPos, 0));
        mat4.multiply(objFrames[i], cameraCF, objFrames[i]);   // tmp = cameraCF * tmpMat
        var posOrNeg = Math.random() < 0.5 ? -1 : 1;
        xPos += Math.random();
        yPos += Math.random();

        xPos *= posOrNeg;
        yPos *= posOrNeg;
    }
    /* calculate viewport */
    resizeWindow();

    /* initiate the render loop */
    render();
  });
}

function drawScene() {
    for (let k = 0; k < objArr.length; k++) {

        objArr[k].draw(posAttr, colAttr, modelUnif, objFrames[k]);

    }
}

function draw3D() {
  /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, persProjMat);
    gl.uniformMatrix4fv(viewUnif, false, viewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawTopView() {
    /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, topViewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawFrontView() {
    /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, frontViewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawRightView() {
    /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, rightViewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}


function render() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  switch (currentCameraView) {
      case "3D":
          draw3D();
          break;
      case "Top":
          drawTopView();
          break;
      case "Front":
          drawFrontView();
          break;
      case "Right":
          drawRightView();
          break;
      default:
          draw3D();
          break;
  }
  requestAnimationFrame(render);
}

function resizeWindow() {
    canvas.width = window.innerWidth;
    canvas.height = 0.9 * window.innerHeight;
    if (canvas.width > canvas.height) { /* landscape */
        let ratio = canvas.height / canvas.width;
        console.log("Landscape mode, ratio is " + ratio);
        mat4.ortho(orthoProjMat, -3, 3, -3 * ratio, 3 * ratio, -5, 5);
        mat4.perspective(persProjMat,
            Math.PI/3,  /* 60 degrees vertical field of view */
            1/ratio,    /* must be width/height ratio */
            1,          /* near plane at Z=1 */
            20);        /* far plane at Z=20 */
    } else {
        alert("Window is too narrow!");
    }

}

function keyboardHandler(event) {
    switch (event.key) {
        case "1":
            currentCameraView = "3D";
            render();
            break;
        case "2":
            currentCameraView = "Top";
            render();
            break;
        case "3":
            currentCameraView = "Front";
            render();
            break;
        case "4":
            currentCameraView = "Right";
            render();
            break;
    }
}
