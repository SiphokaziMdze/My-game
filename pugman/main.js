const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);

const circleArray = [0, 0, 0];
const theta = 0;
r = 0.25;

let x, y, z;
z = 0;

for(theta = 0; theta <= (2*Math.PI); alpha += Mathh.PI/20){
    x = r*Math.sin(alpha);
    y = r*Math.cos(theta);

    circleArray.push(x);
    circleArray.push(y);
    circleArray.push(z);
}

const pagmanArray = [0, 0, 0];
