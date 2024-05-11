let canvas = document.querySelector(`canvas`);
let webgl =   canvas.getContext(`webgl`);


let circleArray = [0,0,0]
var alpha = 0;

r=0.25;

let x,y,z;
z=0;

for(alpha = 0; alpha <= (2*Math.PI); alpha+=Math.PI/20){

 x=r*Math.sin(alpha);
 y=r*Math.cos(alpha);

circleArray.push(x)
circleArray.push(y)
circleArray.push(z)

}

let PagmanArray = [0,0,0]
var alphap = Math.PI/32;

rp=0.75;

let xp,yp,zp;
zp=0;

for(alphap = Math.PI/30; alphap <= (2*Math.PI-Math.PI/18); alphap+=Math.PI/32){

 xp=rp*Math.sin(alphap);
 yp=rp*Math.cos(alphap);

 PagmanArray.push(xp)
 PagmanArray.push(yp)
 PagmanArray.push(zp)

}


var vertices = new Float32Array([...circleArray,...PagmanArray]);

var bufferCircle = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER,bufferCircle);
webgl.bufferData(webgl.ARRAY_BUFFER,vertices,webgl.STATIC_DRAW);

var bufferPagman = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER,bufferPagman);
webgl.bufferData(webgl.ARRAY_BUFFER,vertices,webgl.STATIC_DRAW);


function indentityM(){

    return new Float32Array([
   
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
   
    ]);
   
    }
   

   function rotationZ(angz){

    c = Math.cos(angz);
    s = Math.sin(angz);
   
       return new Float32Array([
   
        c,-s,0,0,
        s,c,0,0,
        0,0,1,0,
        0,0,0,1,
       ]);
       
   }


   function translate (tx,ty,tz){

    return new Float32Array([
   
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    tx,ty,tz,1,
   
    ]);
   
    }

   function multiply (model,mdl,tr){

    model[0] = mdl[0]*tr[0]+mdl[1]*tr[4]+mdl[2]*tr[8]+mdl[3]*tr[12];
    model[1] = mdl[0]*tr[1]+mdl[1]*tr[5]+mdl[2]*tr[9]+mdl[3]*tr[13];
    model[2] = mdl[0]*tr[2]+mdl[1]*tr[6]+mdl[2]*tr[10]+mdl[3]*tr[14];
    model[3] = mdl[0]*tr[3]+mdl[1]*tr[7]+mdl[2]*tr[11]+mdl[3]*tr[15];

    model[4] = mdl[4]*tr[0]+mdl[5]*tr[4]+mdl[6]*tr[8]+mdl[7]*tr[12];
    model[5] = mdl[4]*tr[1]+mdl[5]*tr[5]+mdl[6]*tr[9]+mdl[7]*tr[13];
    model[6] = mdl[4]*tr[2]+mdl[5]*tr[6]+mdl[6]*tr[10]+mdl[7]*tr[14];
    model[7] = mdl[4]*tr[3]+mdl[5]*tr[7]+mdl[6]*tr[11]+mdl[7]*tr[15];

    model[8] = mdl[8]*tr[0]+mdl[9]*tr[4]+mdl[10]*tr[8]+mdl[11]*tr[12];
    model[9] = mdl[8]*tr[1]+mdl[9]*tr[5]+mdl[10]*tr[9]+mdl[11]*tr[13];
    model[10]= mdl[8]*tr[2]+mdl[9]*tr[6]+mdl[10]*tr[10]+mdl[11]*tr[14];
    model[11]= mdl[8]*tr[3]+mdl[9]*tr[7]+mdl[10]*tr[11]+mdl[11]*tr[15];

    model[12] = mdl[12]*tr[0]+mdl[13]*tr[4]+mdl[14]*tr[8]+mdl[15]*tr[12];
    model[13] = mdl[12]*tr[1]+mdl[13]*tr[5]+mdl[14]*tr[9]+mdl[15]*tr[13];
    model[14] = mdl[12]*tr[2]+mdl[13]*tr[6]+mdl[14]*tr[10]+mdl[15]*tr[14];
    model[15] = mdl[12]*tr[3]+mdl[13]*tr[7]+mdl[14]*tr[11]+mdl[15]*tr[15];

  return model;  
}

let model = indentityM();
let model2 = indentityM();
// var bufferVec1 = webgl.createBuffer();
 //webgl.bindBuffer(webgl.ARRAY_BUFFER,bufferVec1);
 //webgl.bufferData(webgl.ARRAY_BUFFER,vertices1,webgl.STATIC_DRAW);

var cCode=`
attribute vec3 pos;
uniform mat4 rotationX;
uniform mat4 rotationY;
uniform mat4 rotationZ;
uniform mat4 model;
uniform mat4 model2;

float shiftX = -0.9;
model*rotationZ*
void main(){

    gl_Position =model2*model*vec4(pos.x*0.25,pos.y*0.25,pos.z*0.25,1);
}`;

var fColor =`
void main(){
    gl_FragColor=vec4(1,0,0,1);
}`;

//let model = indentityM();

var vecShader = webgl.createShader(webgl.VERTEX_SHADER);
var fragShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(vecShader,cCode);
    webgl.shaderSource(fragShader,fColor);
    webgl.compileShader(vecShader);
    webgl.compileShader(fragShader);

   
   

var program = webgl.createProgram();
    webgl.attachShader(program,vecShader);
    webgl.attachShader(program,fragShader);
    webgl.linkProgram(program);


    webgl.bindBuffer(webgl.ARRAY_BUFFER,bufferCircle);
    var locPosition = webgl.getAttribLocation(program,`pos`);
    webgl.enableVertexAttribArray(locPosition);
    webgl.vertexAttribPointer(locPosition,3,webgl.FLOAT,false,0,0);



    let tx =-0.8;
    let ty =0.8;

   
    let tx1 =-0.4;
    let ty1 =0.8;

    let tx2 =0;
    let ty2 =0.4;


   
    let tx3 =-0.4;
    let ty3 =0.4;


    let tx4 =-0.2;
    let ty4 =-0.2;

    let tx5 = -0.6;
    let ty5 =0.1;

    let tx6 = 0.7;
    let ty6 =0;
    let angc =0;
    let angP =0;

 
         document.onkeydown = function(event){

         switch(event.key){

          case'ArrowUp':
          ty6 +=0.05;
          angP = 0;

          break;


          case'ArrowDown':

          ty6 -=0.05;
        angP -= Math.PI/180;

          break;


          case'ArrowRight':

          tx6 +=0.05;

          break;
         



          case'ArrowLeft':

          tx6 -=0.05;

          break;
         

         }


         }





    webgl.useProgram(program);

   draw();


     function   draw(){

        webgl.clearColor(0,0.5,1,1);
        webgl.clear(webgl.COLOR_BUFFER_BIT)
        webgl.clear(webgl.COLOR_BUFFER_BIT);

          tx +=0.0003;
          ty -=0.0008;

         

       
   model = multiply(model,indentityM(),translate(tx,ty,ty))
   model2 = multiply(model2,indentityM(),rotationZ(angc))
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)  
   webgl.drawArrays(webgl.TRIANGLE_FAN,0,circleArray.length/3);

   model = multiply(model,indentityM(),translate(tx1,ty1,ty1))
   model2 = multiply(model2,indentityM(),rotationZ(angc))
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)    
   webgl.drawArrays(webgl.TRIANGLE_FAN,0,circleArray.length/3);

   model = multiply(model,indentityM(),translate(tx2,ty2,ty1))
   model2 = multiply(model2,indentityM(),rotationZ(angc))
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)  
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)  
   webgl.drawArrays(webgl.TRIANGLE_FAN,0,circleArray.length/3);


   model = multiply(model,indentityM(),translate(tx3,ty3,ty1))
   model2 = multiply(model2,indentityM(),rotationZ(angc))
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)      
   webgl.drawArrays(webgl.TRIANGLE_FAN,0,circleArray.length/3);


 
   model = multiply(model,indentityM(),translate(tx4,ty4,ty4))
   model2 = multiply(model2,indentityM(),rotationZ(angc))
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)    
   webgl.drawArrays(webgl.TRIANGLE_FAN,0,circleArray.length/3);


   
   model = multiply(model,indentityM(),translate(tx5,ty5,ty5))
   model2 = multiply(model2,indentityM(),rotationZ(angc))
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)  
   webgl.drawArrays(webgl.TRIANGLE_FAN,0,circleArray.length/3);


   model = multiply(model,indentityM(),translate(tx6,ty6,ty6))
   model2 = multiply(model2,indentityM(),rotationZ(angP))
   
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model`),false,model)
   webgl.uniformMatrix4fv(webgl.getUniformLocation(program,`model2`),false,model2)  
   webgl.drawArrays(webgl.TRIANGLE_FAN,circleArray.length/3,PagmanArray.length/3);

  window.requestAnimationFrame(draw)

    }
       
    // if(Math.sqrt(Math.pow(tx-tx6,2)+Math.pow(ty-ty6,2))>=0.27){
    //     tx=1;
    //     ty1 =1;
     



       
      //}

       draw();