precision mediump float;

varying vec4 varColor;
varying vec3 vnormal;

uniform vec3 lightDirection;
uniform vec4 uColor;

void main() {
   if(gl_FrontFacing)
        gl_FragColor = varColor;
    else
        gl_FragColor = vec4(1,0,0,1);

   vec3 normal = normalize(vnormal);
   float light = dot(normal, lightDirection);

   gl_FragColor = uColor;

   gl_FragColor.rgb *= light;
}
